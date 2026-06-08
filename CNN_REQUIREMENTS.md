# CNN Model — Spesifikasi Implementasi dari Nol

> **Proyek:** MiniPhotoshop — Pengenalan Objek Berbasis CNN  
> **Konteks:** Fitur ke-11 dari aplikasi pengolahan citra digital  
> **Constraint Utama:** ⛔ **DILARANG menggunakan model pra-latih (pre-trained model)** seperti MobileNet, ResNet, VGG, YOLO, dll. CNN harus dibangun dan dilatih **dari nol (from scratch).**

---

## 1. Tujuan

Mengimplementasikan Convolutional Neural Network (CNN) yang dilatih dari awal menggunakan dataset publik untuk melakukan klasifikasi/pengenalan objek pada gambar yang diimpor pengguna di dalam aplikasi MiniPhotoshop.

---

## 2. Arsitektur CNN (From Scratch)

Model harus dirancang sendiri, contoh arsitektur minimal yang **diperbolehkan**:

```
Input Image (64×64 atau 128×128, RGB)
    ↓
Conv2D(32 filters, 3×3) → BatchNorm → ReLU
    ↓
MaxPooling2D(2×2)
    ↓
Conv2D(64 filters, 3×3) → BatchNorm → ReLU
    ↓
MaxPooling2D(2×2)
    ↓
Conv2D(128 filters, 3×3) → BatchNorm → ReLU
    ↓
GlobalAveragePooling2D / Flatten
    ↓
Dense(256) → ReLU → Dropout(0.5)
    ↓
Dense(N_classes) → Softmax
```

> Jumlah layer dan filter dapat disesuaikan, namun **tidak boleh memuat bobot dari model luar** (ImageNet weights, dll.).

---

## 3. Stack Teknologi yang Direkomendasikan

### Opsi A — Python Backend (Direkomendasikan)

| Komponen        | Library / Framework     | Keterangan                              |
|-----------------|-------------------------|-----------------------------------------|
| Deep Learning   | `TensorFlow` / `Keras`  | `model = Sequential([...])` dari nol   |
| Alternatif DL   | `PyTorch`               | `nn.Module` custom                      |
| Data Processing | `NumPy`, `Pillow`       | Preprocessing & augmentasi gambar      |
| API Server      | `FastAPI` atau `Flask`  | Endpoint `/predict` untuk frontend      |
| Export Model    | `model.save()` → `.h5` / `TorchScript` | Untuk deployment |

### Opsi B — Pure JavaScript (Browser-Side)

| Komponen      | Library      | Keterangan                                              |
|---------------|--------------|---------------------------------------------------------|
| Deep Learning | `TensorFlow.js` | `tf.sequential()` — **TANPA** `tf.loadLayersModel()` dari URL eksternal |
| Numerik       | Native JS    | Manual forward pass jika implementasi penuh dari nol   |

> ⚠️ Jika pakai `TensorFlow.js`, pastikan **tidak memanggil** `tf.loadLayersModel('https://tfhub.dev/...')` atau sejenisnya.

---

## 4. Dataset yang Diperbolehkan

Dataset harus **publik, bebas digunakan**, dan dilatih sendiri:

| Dataset        | Kelas Tersedia                      | Link                          |
|----------------|-------------------------------------|-------------------------------|
| CIFAR-10       | Mobil, Kapal, Anjing, Kucing, dll.  | https://www.cs.toronto.edu/~kriz/cifar.html |
| CIFAR-100      | 100 kelas objek umum                | (sama di atas)                |
| STL-10         | Airplane, Bird, Car, Cat, dll.      | https://cs.stanford.edu/~acoates/stl10/ |
| Caltech-101    | 101 kategori objek                  | http://www.vision.caltech.edu |
| Custom Dataset | Kumpulkan sendiri (min. 100 img/kelas) | Google Images + scraping    |

> Sesuaikan kelas dataset dengan 4 kategori target di UI: **Human, Animals, Vehicle, Others**.

---

## 5. Pipeline Pelatihan (Training Pipeline)

```
1. Kumpulkan & organisir dataset per kelas
        ↓
2. Preprocessing:
   - Resize ke 64×64 atau 128×128
   - Normalisasi pixel: pixel /= 255.0
   - One-Hot Encoding untuk label
        ↓
3. Augmentasi Data (opsional tapi sangat direkomendasikan):
   - RandomFlip, RandomRotation, RandomZoom
        ↓
4. Bangun model Sequential/Custom dari nol
        ↓
5. Compile:
   - optimizer: Adam(lr=0.001)
   - loss: categorical_crossentropy
   - metrics: accuracy
        ↓
6. Train:
   - epochs: 30–100
   - batch_size: 32 atau 64
   - validation_split: 0.2
        ↓
7. Evaluasi (Test Accuracy, Confusion Matrix)
        ↓
8. Export model → .h5 / .json + .bin (TF.js)
```

---

## 6. Integrasi ke Aplikasi (Frontend MiniPhotoshop)

### Alur Inferensi

```
Pengguna klik "Run Recognition"
    ↓
Frontend kirim gambar aktif (base64 / blob)
    ↓
[Jika Python Backend]
POST http://localhost:8000/predict
{ "image": "<base64>" }
    ↓
Server decode → preprocess → model.predict()
    ↓
Response: { "label": "Cat", "confidence": 0.91, "top3": [...] }
    ↓
Frontend tampilkan hasil di canvas + label overlay

[Jika TF.js Browser-Side]
tf.tidy(() => {
  const tensor = tf.browser.fromPixels(imgEl)
    .resizeBilinear([64, 64])
    .expandDims(0)
    .div(255.0);
  const pred = model.predict(tensor);
  const classId = pred.argMax(-1).dataSync()[0];
})
```

---

## 7. Output yang Diharapkan di UI

Saat inferensi selesai, aplikasi harus menampilkan:

- ✅ **Label kelas** yang terdeteksi (contoh: "Cat — 91.2%")
- ✅ **Confidence score** dalam persentase
- ✅ **Top-3 prediksi** (opsional, nilai tambah)
- ✅ **Bounding box** di canvas (opsional, nilai tambah — via object localization)
- ✅ **Status log** di panel kanan: "Model loaded. Inference complete."

---

## 8. Kriteria Keberhasilan (Acceptance Criteria)

| Kriteria                        | Target Minimum         |
|---------------------------------|------------------------|
| Akurasi Training                | ≥ 70%                 |
| Akurasi Validasi/Test           | ≥ 65%                 |
| Waktu Inferensi (per gambar)    | < 5 detik             |
| Tidak ada bobot pra-latih       | ✅ Wajib dipenuhi     |
| Dataset dilatih sendiri         | ✅ Wajib dipenuhi     |
| Model bisa di-load di app       | ✅ Wajib dipenuhi     |

---

## 9. Hal yang **DILARANG** (Hard Constraints)

```diff
- tf.loadLayersModel('https://tfhub.dev/...')       ← PRE-TRAINED ❌
- from torchvision.models import resnet50           ← PRE-TRAINED ❌
- keras.applications.MobileNetV2(weights='imagenet') ← PRE-TRAINED ❌
- import YOLO from 'ultralytics'                    ← PRE-TRAINED ❌
- from transformers import ViTModel                 ← PRE-TRAINED ❌
- Mengunduh bobot (.h5, .pt) dari internet saat runtime ← ❌
```

---

## 10. Contoh Struktur File Implementasi

```
miniphotoshop\
├── cnn_model\                        ← Folder terpisah untuk model
│   ├── train.py                      ← Script pelatihan CNN
│   ├── model.py                      ← Definisi arsitektur CNN
│   ├── dataset.py                    ← Data loader & augmentasi
│   ├── evaluate.py                   ← Evaluasi & confusion matrix
│   ├── export_tfjs.py                ← Konversi ke TF.js format
│   ├── api.py                        ← FastAPI server (opsional)
│   ├── saved_model\
│   │   └── model.h5                  ← Model hasil latih
│   └── tfjs_model\
│       ├── model.json
│       └── group1-shard1of1.bin
└── src\
    └── components\
        └── features\
            └── ObjectRecognitionML.tsx ← Sudah ada, perlu disambung ke model nyata
```

---

## 11. Referensi & Bacaan

- [TensorFlow — Convolutional Neural Networks Tutorial](https://www.tensorflow.org/tutorials/images/cnn)
- [TensorFlow.js — Training in the Browser](https://www.tensorflow.org/js/guide/train_models)
- [CIFAR-10 Benchmark](https://paperswithcode.com/dataset/cifar-10)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Keras — tf.keras.Sequential](https://keras.io/guides/sequential_model/)

---

> 📌 **Catatan Akhir:** Dokumen ini adalah spesifikasi teknis. Implementasi harus dilakukan sepenuhnya oleh tim proyek. Penggunaan model pra-latih dalam bentuk apapun — langsung maupun melalui fine-tuning — **tidak diperbolehkan** dan akan dianggap tidak memenuhi syarat.
