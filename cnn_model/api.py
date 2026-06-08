import io
import base64
import os
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from model import CustomCNN

app = FastAPI(title="MiniPhotoshop CNN API", description="API untuk inferensi model CNN kustom")

# Izinkan CORS agar frontend React bisa memanggil API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CIFAR-10 Class Names
CLASSES = ['Airplane', 'Automobile', 'Bird', 'Cat', 'Deer', 'Dog', 'Frog', 'Horse', 'Ship', 'Truck']

# Mapping CIFAR-10 classes ke categories di UI
CATEGORIES_MAPPING = {
    'Airplane': 'vehicle',
    'Automobile': 'vehicle',
    'Bird': 'animals',
    'Cat': 'animals',
    'Deer': 'animals',
    'Dog': 'animals',
    'Frog': 'animals',
    'Horse': 'animals',
    'Ship': 'vehicle',
    'Truck': 'vehicle'
}

# Preprocessing transforms (sama dengan waktu training)
transform = transforms.Compose([
    transforms.Resize((32, 32)),
    transforms.ToTensor(),
    transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010)),
])

# Initialize model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = CustomCNN(num_classes=10).to(device)
model_loaded = False

# Load weights jika file model.pth sudah ada
model_path = os.path.join(os.path.dirname(__file__), 'saved_model', 'model.pth')
if os.path.exists(model_path):
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.eval()
        model_loaded = True
        print(f"Model loaded successfully from {model_path}")
    except Exception as e:
        print(f"Error loading model weights: {e}")
else:
    print(f"Model weights not found at {model_path}. Harap jalankan training terlebih dahulu!")

class PredictRequest(BaseModel):
    image: str  # Base64 data URL

@app.post("/predict")
async def predict(request: PredictRequest):
    global model_loaded
    if not model_loaded:
        # Coba load kembali jika baru selesai training
        if os.path.exists(model_path):
            try:
                model.load_state_dict(torch.load(model_path, map_location=device))
                model.eval()
                model_loaded = True
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Model weights found but failed to load: {e}")
        else:
            raise HTTPException(status_code=400, detail="Model CNN belum dilatih. Jalankan train.py terlebih dahulu.")

    # 1. Decode base64 image
    try:
        # Format base64 dari canvas biasanya diawali dengan 'data:image/...;base64,'
        header, encoded = request.image.split(",", 1) if "," in request.image else ("", request.image)
        image_data = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        # Debug: simpan gambar yang diterima untuk verifikasi
        debug_path = os.path.join(os.path.dirname(__file__), 'last_received.png')
        image.save(debug_path)
        print(f"DEBUG: Saved received image to {debug_path} (size: {image.size})")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal melakukan decode gambar base64: {e}")

    orig_width, orig_height = image.size

    # 2. Preprocess image
    input_tensor = transform(image).unsqueeze(0).to(device) # Shape: (1, 3, 32, 32)
    input_tensor.requires_grad = True # Penting untuk saliency map

    # 3. Model inference
    outputs = model(input_tensor)
    probabilities = F.softmax(outputs, dim=1)
    
    # Ambil index dengan probabilitas tertinggi
    prob, predicted_idx = torch.max(probabilities, 1)
    predicted_idx = predicted_idx.item()
    confidence = prob.item() * 100
    predicted_class = CLASSES[predicted_idx]
    mapped_category = CATEGORIES_MAPPING.get(predicted_class, "others")

    # 4. Saliency Map untuk Object Localization (Bounding Box dari Nol)
    # Kita cari gradient output kelas terpilih terhadap input gambar
    score = outputs[0, predicted_idx]
    score.backward()
    
    # Saliency adalah max absolute value dari gradient di sepanjang channel warna
    saliency, _ = torch.max(input_tensor.grad.data.abs(), dim=1) # Shape: (1, 32, 32)
    saliency = saliency.squeeze(0).cpu() # Shape: (32, 32)
    
    # Cari bounding box pixel yang memiliki nilai saliency > 25% dari nilai maksimum
    threshold = saliency.max() * 0.25
    activated_pixels = (saliency > threshold).nonzero()

    if len(activated_pixels) > 0:
        # activated_pixels berisi koordinat [y, x] pada grid 32x32
        ys = activated_pixels[:, 0]
        xs = activated_pixels[:, 1]
        
        ymin, ymax = ys.min().item(), ys.max().item()
        xmin, xmax = xs.min().item(), xs.max().item()
        
        # Normalkan koordinat ke original image size
        box_x = (xmin / 32.0) * orig_width
        box_y = (ymin / 32.0) * orig_height
        box_w = ((xmax - xmin + 1) / 32.0) * orig_width
        box_h = ((ymax - ymin + 1) / 32.0) * orig_height
    else:
        # Fallback bounding box di tengah gambar jika tidak terdeteksi
        box_x = orig_width * 0.15
        box_y = orig_height * 0.15
        box_w = orig_width * 0.7
        box_h = orig_height * 0.7

    # 5. Top 3 Prediksi
    top_prob, top_idx = torch.topk(probabilities, 3, dim=1)
    top_predictions = [
        {"class": CLASSES[idx.item()], "confidence": float(p.item() * 100)}
        for p, idx in zip(top_prob[0], top_idx[0])
    ]

    return {
        "status": "success",
        "class": predicted_class,
        "category": mapped_category,
        "confidence": round(confidence, 2),
        "top_predictions": top_predictions,
        "box": {
            "x": int(box_x),
            "y": int(box_y),
            "w": int(box_w),
            "h": int(box_h)
        }
    }

@app.get("/status")
async def status():
    return {
        "model_loaded": model_loaded,
        "device": str(device),
        "classes": CLASSES
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
