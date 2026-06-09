# 🎤 Panduan Presentasi Santai tapi Bobot (Gaya Mahasiswa ke Dosen)

Panduan ini ditulis dengan gaya bahasa **manusia/mahasiswa normal** (bukan gaya robot/AI) biar dosen kamu langsung paham dan kamu kelihatan ngerti banget isinya.

---

## ⏱️ Rundown Presentasi (5-10 Menit)

1. **Pembuka & Demo PCD Konvensional (2 Menit)**
2. **Demo CNN & Penjelasan "Kenapa Bikin Sendiri" (3 Menit)**
3. **Penjelasan Bounding Box (Saliency Map) — *Ini poin nilai A+* (3 Menit)**
4. **Tanya Jawab & Penutup**

---

## 🔌 🚨 PERSIAPAN OFFLINE (Lakukan SEBELUM Masuk Ruang Ujian!)

Karena presentasi ini **offline (tatap muka langsung)**, pastikan laptop kamu sudah siap tempur agar tidak panik saat di depan dosen. 

### 1. Jalankan Kedua Server di Rumah / Sebelum Masuk Kelas
Pastikan terminal kamu sudah menjalankan dua command ini (jangan ditutup laptopnya biar tidak sleep/error):
*   **Terminal 1 (Frontend React):**
    ```powershell
    npm run dev
    ```
*   **Terminal 2 (Backend AI/CNN):**
    ```powershell
    py cnn_model\api.py
    ```
    *(Pastikan keluar tulisan `Model loaded successfully`)*

### 2. Matikan Wifi untuk Pembuktian (Opsional tapi Keren)
Karena backend berjalan di `localhost (127.0.0.1)`, program ini **100% tidak butuh koneksi internet**. Kamu bisa pamer ke dosen: *"Ini jalan lokal di laptop saya Pak, tanpa internet sama sekali."*

### 3. Siapkan Gambar Tes di Desktop/Folder yang Gampang Diakses
Siapkan file `cat_test.png` di folder Desktop agar saat disuruh demo impor gambar, kamu tidak perlu mencari-cari file terlalu lama.

---

## 💬 Script Presentasi (Bisa Kamu Modifikasi)

### 1. Pembuka (Biar Kelihatan Rapi)
> *"Selamat pagi/siang Pak/Bu. Di tugas UAS Citra Digital kali ini, saya membuat aplikasi **Mini Photoshop** kustom. Konsepnya adalah menggabungkan fungsi editing gambar konvensional dengan fitur kecerdasan buatan (CNN) untuk deteksi objek secara real-time."*

### 2. Demo PCD Konvensional (Tunjukin yang cepat-cepat saja)
*Sambil share screen dan klik menu-menu di sidebar:*
> *"Di bagian kiri, saya sudah mengimplementasikan standar pengolahan citra digital, seperti:*
> - *Enhancement (Brightness, Contrast, sama Histogram Equalization untuk meratakan pencahayaan).*
> - *Transformasi Geometris (Rotasi pakai **Bilinear Interpolation** biar tepinya halus, translasi, dan resize).*
> - *Ada juga segmentasi warna kayak K-Means clustering sama deteksi tepi Canny/Sobel.*
> 
> *Semua proses filter ini sengaja saya jalankan di **frontend (JavaScript Canvas)** agar prosesnya instan tanpa perlu upload gambar ke server terlebih dahulu."*

### 3. Bagian Utama: CNN & Object Recognition (Poin Krusial!)
*Buka tab ML Object Recognition, upload file `cat_test.png`, lalu klik Run.*
> *"Nah, ini fitur utamanya Pak. Untuk Object Recognition, saya menggunakan model **CNN (Convolutional Neural Network)** yang dibangun **dari nol (tanpa pre-trained model/ weights)** menggunakan PyTorch.*
> 
> *Kenapa tidak pakai model jadi? Karena syarat tugasnya harus melatih model sendiri. Model ini saya latih menggunakan dataset **CIFAR-10** (50.000 gambar) dengan arsitektur 3 layer Convolutional, Batch Normalization, dan Dropout.*
> 
> *Saat tombol diklik, gambar dikirim ke backend **FastAPI** untuk diprediksi. Hasilnya keluar: objek dideteksi sebagai **Cat** atau **Dog** dengan confidence score dan top-3 alternatifnya di sebelah kanan."*

### 4. Menjelaskan Bounding Box (Biar dosen terkesan)
*Dosen pasti bakal tanya: "Kamu pake YOLO ya buat bikin kotak biru itu?"*
> *"Untuk bounding box-nya, saya **tidak memakai YOLO atau OpenCV template matching**, Pak. Saya murni memakai matematika gradien dari model CNN-nya yang disebut **Saliency Map**.*
> 
> *Cara kerjanya: setelah model memprediksi objek, backend menghitung pixel mana yang paling mempengaruhi keputusan model (nilai gradien tertinggi). Pixel-pixel itulah yang kami ambil koordinatnya untuk digambar jadi kotak biru di Canvas.*
> 
> *Jadi kotaknya dinamis mengikuti bagian gambar yang dianggap paling penting oleh model CNN."*

### 5. Penutup
> *"Aplikasi ini membuktikan kalau CNN sederhana yang dilatih dari nol pun sudah cukup oke untuk klasifikasi objek dasar dan lokalisasi sederhana. Kurang lebih seperti itu presentasi dari saya, silakan jika ada pertanyaan dari Bapak/Ibu. Terima kasih."*

---

## 🧠 Contekan Jawaban Singkat Kalau Ditanya Aneh-Aneh

#### ❓ "Kenapa akurasinya cuma 70%? Kok gak 95%?"
> *"Karena modelnya dilatih dari nol dengan arsitektur CNN kustom yang ringan agar proses latihnya tidak memakan waktu berhari-hari di CPU laptop biasa. Selain itu, dataset CIFAR-10 ukurannya sangat kecil (32x32 piksel), jadi informasi detail gambar asli banyak yang hilang saat di-resize."*

#### ❓ "Itu slider Confidence Threshold buat apa?"
> *"Itu untuk menyaring hasil, Pak. Kalau hasil prediksi model di bawah nilai threshold (misal kita set 80% tapi hasil prediksi cuma 70%), maka kotak deteksi tidak akan digambar. Ini berguna untuk meminimalisir salah deteksi pada gambar yang tidak jelas."*

#### ❓ "Bedanya Nearest Neighbor sama Bilinear pas rotasi apa?"
> *"Nearest neighbor cuma ngambil piksel terdekat, jadi gambarnya cepat tapi pinggirannya patah-patah (efek tangga). Kalau bilinear menghitung rata-rata dari 4 piksel tetangga, jadinya rotasinya kelihatan jauh lebih halus."*
