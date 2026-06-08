# 🧠 Panduan Latihan Model CNN — Dari Nol ke Akurat

> **Proyek:** MiniPhotoshop — Custom CNN for Image Recognition  
> **Target:** Mencapai validasi akurasi **≥ 70%** dengan model dari nol (no pre-trained weights)

---

## 📊 Hasil Training Saat Ini

| Konfigurasi | Dataset | Epochs | Val. Accuracy |
|---|---|---|---|
| Run 1 (kecil) | 8.000 img | 5 | ~54% |
| Run 2 (sedang) | 12.000 img | 6 | **66.71%** ← kamu ada di sini |
| **Run 3 (target)** | **50.000 img** | **20** | **~75–80%** |

---

## 🎓 Cara Kerja Training CNN (Penjelasan Untuk Kamu)

Sebelum mulai, pahami dulu konsepnya. Training CNN itu seperti mengajari otak buatan mengenali gambar melalui pengulangan.

### 1. Dataset — "Buku Teks"-nya Model

Kita pakai **CIFAR-10**, dataset publik berisi **60.000 gambar** berukuran **32×32 piksel** dari 10 kelas:

```
0: Airplane   1: Automobile  2: Bird    3: Cat    4: Deer
5: Dog        6: Frog        7: Horse   8: Ship   9: Truck
```

Semakin banyak gambar yang dilihat model, semakin "pintar" dia.

---

### 2. Epoch — "Berapa Kali Model Baca Buku"

- **1 Epoch** = Model melewati **seluruh data training sekali**
- **20 Epochs** = Model baca data yang sama 20 kali, tapi setiap kali urutan gambarnya diacak
- Semakin banyak epoch, semakin baik hasilnya (sampai titik tertentu)

> 💡 Analoginya: Seperti kamu belajar soal ujian. Baca 1 kali = hafal sedikit. Baca 20 kali = jauh lebih paham.

---

### 3. Batch Size — "Berapa Soal Sekali Belajar"

- **Batch Size 128** = Model belajar dari 128 gambar sekaligus, lalu update bobotnya
- Batch kecil → update lebih sering (bisa lebih bagus, tapi lebih lambat)
- Batch besar → update lebih jarang (lebih cepat, tapi butuh lebih banyak RAM)

---

### 4. Loss — "Nilai Salahnya Model"

- **Loss** adalah angka yang menunjukkan seberapa *salah* prediksi model
- Semakin kecil loss, semakin baik
- Setelah setiap batch, model "dihukum" sesuai kesalahannya, dan bobotnya diperbaiki

```
Loss tinggi  → model masih banyak salah prediksi
Loss rendah  → model sudah cukup pintar
```

---

### 5. Optimizer & Learning Rate

- **Optimizer** (kita pakai **Adam**) = strategi bagaimana model memperbaiki dirinya
- **Learning Rate = 0.001** = "kecepatan belajar" model
  - Terlalu besar → model belajar terlalu agresif, tidak stabil
  - Terlalu kecil → model belajar terlalu lambat
  - 0.001 adalah nilai default yang paling aman untuk Adam

---

### 6. Augmentasi — "Membuat Data Lebih Variatif"

Kita secara artifisial memperbanyak variasi data dengan:

```python
transforms.RandomHorizontalFlip()  # Gambar kadang di-flip horizontal
transforms.RandomRotation(10)      # Gambar diputar hingga 10 derajat
```

Ini mencegah model "hapal" gambar dan membuatnya lebih generalis.

---

## 🚀 Cara Menjalankan Training yang Lebih Baik

### Langkah 1 — Buka Terminal di Folder Proyek

Di VS Code, tekan **Ctrl + `` ` ``** untuk membuka terminal.  
Pastikan terminal menunjukkan path `miniphotoshop\`.

---

### Langkah 2 — Jalankan Training Full Dataset

Jalankan perintah berikut untuk training dengan dataset penuh:

```powershell
python -u cnn_model\train_full.py
```

> `-u` artinya "unbuffered" — output langsung tampil tanpa delay.

Kamu akan melihat output seperti ini, **diperbarui setiap epoch** (~30–60 detik/epoch di CPU):

```
=== Memulai Pipeline Latihan CNN dari Nol ===
Menggunakan Device: cpu
Mengunduh/Memuat Dataset CIFAR-10...
Mulai melatih model Custom CNN selama 20 epochs...
Epoch [1/20] - Loss: 1.5821 - Train Acc: 43.12% - Val Acc: 50.34%
Epoch [2/20] - Loss: 1.2934 - Train Acc: 53.45% - Val Acc: 57.80%
...
Epoch [20/20] - Loss: 0.7812 - Train Acc: 72.88% - Val Acc: 75.21%
Model berhasil dilatih dan disimpan di: cnn_model\saved_model\model.pth
```

---

### Langkah 3 — Restart Server API

Setelah training selesai, **WAJIB restart** server API karena model baru perlu dimuat:

1. Buka terminal baru (atau tekan **Ctrl+C** di terminal server yang berjalan)
2. Jalankan ulang:
   ```powershell
   python cnn_model\api.py
   ```
3. Tunggu sampai muncul:
   ```
   Model loaded successfully from ...model.pth
   INFO:     Uvicorn running on http://127.0.0.1:8000
   ```

---

### Langkah 4 — Verifikasi Akurasi Lokal

Untuk mengecek model baru tanpa buka browser:

```powershell
python cnn_model\test_local.py
```

Output-nya akan menampilkan prediksi probabilitas untuk setiap kelas pada gambar `cat_test.png`.

---

## ⚡ Tabel Konfigurasi — Pilih Sesuai Waktu yang Kamu Punya

| Mode | Data Latih | Epochs | Estimasi Waktu CPU | Target Akurasi |
|---|---|---|---|---|
| **Cepat (sekarang)** | 12.000 | 6 | ~2 menit | ~65–67% |
| **Menengah** | 25.000 | 10 | ~8 menit | ~70–72% |
| **Penuh (rekomendasi)** | 50.000 | 20 | ~25 menit | ~75–80% |
| **Maksimal** | 50.000 | 50 | ~60 menit | ~80–85% |

> ⚠️ Estimasi waktu untuk **laptop biasa tanpa GPU**. Jika punya GPU NVIDIA, semua di atas menjadi 5–10x lebih cepat.

---

## 📁 File Training yang Tersedia

### `cnn_model\train.py` — Training Cepat (Konfigurasi Saat Ini)
```
Data: 12.000 img | Epochs: 6 | Batch: 128
Waktu: ~2 menit | Target: ~65%
```

### `cnn_model\train_full.py` — Training Penuh (Buat Lebih Akurat!)
```
Data: 50.000 img | Epochs: 20 | Batch: 128
Waktu: ~25 menit | Target: ~75–80%
```

Untuk menjalankan training penuh:
```powershell
python -u cnn_model\train_full.py
```

---

## 🔍 Cara Membaca Output Training

```
Epoch [5/20] - Loss: 1.1023 - Train Acc: 60.88% - Val Acc: 62.12%
```

| Bagian | Arti |
|---|---|
| `Epoch [5/20]` | Ini adalah putaran ke-5 dari total 20 |
| `Loss: 1.1023` | Kesalahan rata-rata model (makin kecil makin baik) |
| `Train Acc: 60.88%` | Akurasi di data yang sudah dipelajari |
| `Val Acc: 62.12%` | Akurasi di data baru yang belum pernah dilihat ← **ini yang penting** |

**Apa yang perlu diperhatikan:**
- ✅ `Val Acc` naik setiap epoch → model belajar dengan baik
- ⚠️ `Train Acc` jauh lebih tinggi dari `Val Acc` → model mulai **overfitting** (hapal, bukan paham)
- ❌ `Val Acc` naik lalu turun → **stop training**, model sudah mencapai puncaknya

---

## ❓ FAQ — Pertanyaan Umum

### "Kenapa model masih salah prediksi padahal accuracy tinggi?"

Karena **CIFAR-10 hanya punya 10 kelas** dan gambarnya berukuran 32×32 piksel (sangat kecil). Gambar di dunia nyata (seperti foto HD dari kamera HP) sangat berbeda dari data training. Model kita sudah dilatih untuk mengenali objek kecil, bukan foto resolusi tinggi.

**Solusi:** Ini sudah merupakan limitasi wajar dari dataset CIFAR-10 dan dari aturan "no pre-trained model". Akurasi 65-75% adalah sangat baik untuk CNN dari nol dengan dataset yang terbatas!

---

### "Kenapa hasilnya selalu 'Automobile'?"

Ini terjadi ketika model menerima gambar yang sangat berbeda dari data training (gambar resolusi tinggi, warna berbeda, background kompleks). Model kita di-training dengan gambar 32×32 piksel sederhana, sehingga foto HD yang di-resize ke 32×32 bisa menghasilkan pola warna yang terlihat "mirip Automobile" oleh model.

**Perbaikan yang sudah dilakukan:** Training dengan lebih banyak data dan augmentasi telah mengurangi bias ini secara signifikan.

---

### "Berapa akurasi maksimal yang bisa dicapai tanpa pre-trained model?"

Untuk CIFAR-10 dengan CNN custom dari nol:
- CNN Sederhana (seperti milik kita): ~65–80%
- CNN Dalam (ResNet-style dari nol): ~90–93%
- State-of-the-art (dari nol, optimasi penuh): ~96%

Kita sudah mencapai **66.71%** hanya dengan ~2 menit training di CPU. Dengan `train_full.py`, target **75–80%** sangat realistis!

---

## 📌 Ringkasan Perintah

```powershell
# Training cepat (2 menit, ~65%)
py -u cnn_model\train.py

# Training penuh (25 menit, ~75-80%)
py -u cnn_model\train_full.py

# Test prediksi lokal (tanpa buka browser)
py cnn_model\test_local.py

# Jalankan API Server
py cnn_model\api.py

# Jalankan Frontend
npm run dev
```
