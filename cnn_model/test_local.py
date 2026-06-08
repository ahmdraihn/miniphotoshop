import os
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image
from model import CustomCNN

CLASSES = ['Airplane', 'Automobile', 'Bird', 'Cat', 'Deer', 'Dog', 'Frog', 'Horse', 'Ship', 'Truck']

def test():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = CustomCNN(num_classes=10).to(device)
    
    model_path = os.path.join(os.path.dirname(__file__), 'saved_model', 'model.pth')
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    print("Model loaded successfully.")
    
    transform = transforms.Compose([
        transforms.Resize((32, 32)),
        transforms.ToTensor(),
        transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010)),
    ])
    
    # Test images
    # We copied cat_test.png into public/cat_test.png and the root directory
    for path in ['cat_test.png', 'public/cat_test.png']:
        if os.path.exists(path):
            image = Image.open(path).convert("RGB")
            input_tensor = transform(image).unsqueeze(0).to(device)
            
            with torch.no_grad():
                outputs = model(input_tensor)
                probs = F.softmax(outputs, dim=1)[0]
                
            print(f"\nPredictions for {path}:")
            for i, p in enumerate(probs):
                print(f"  {CLASSES[i]}: {p.item()*100:.2f}%")
            
            best_idx = torch.argmax(probs).item()
            print(f"Best prediction: {CLASSES[best_idx]} ({probs[best_idx]*100:.2f}%)")

if __name__ == '__main__':
    test()
