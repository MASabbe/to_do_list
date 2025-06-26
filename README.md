# Student Task Hub - PWA To-Do List

Student Task Hub adalah sebuah Progressive Web App (PWA) yang dirancang untuk membantu mahasiswa mengelola tugas-tugas akademik dan non-akademik secara efisien. Aplikasi ini dibangun dengan teknologi web modern, berfokus pada pengalaman pengguna, dan memiliki kemampuan offline penuh.

## ✨ Fitur Utama

- **Manajemen Tugas Lengkap**: Buat, edit, tandai selesai, dan hapus tugas dengan mudah.
- **Atribut Tugas Rinci**: Setiap tugas dapat memiliki judul, deskripsi, tanggal tenggat, prioritas (Tinggi, Sedang, Rendah), dan kategori.
- **Pengurutan Cerdas**: Urutkan tugas berdasarkan prioritas atau tanggal tenggat untuk fokus pada hal yang paling penting.
- **Penyimpanan Andal**: Menggunakan **IndexedDB** untuk penyimpanan data di sisi klien yang cepat, asinkron, dan mampu menampung banyak data.
- **Kemampuan Offline**: Berkat **Service Worker**, aplikasi dapat diakses dan berfungsi penuh bahkan tanpa koneksi internet.
- **Dapat Diinstal (PWA)**: Tambahkan aplikasi ke layar utama (Home Screen) di perangkat seluler atau desktop untuk akses cepat seperti aplikasi native.
- **Notifikasi Pengingat**: Dapatkan notifikasi satu hari sebelum tugas jatuh tempo (memerlukan izin dari pengguna).
- **Statistik Produktivitas**: Visualisasikan progres Anda dengan diagram lingkaran yang menunjukkan perbandingan tugas yang selesai dan yang masih aktif.
- **Tema Terang & Gelap**: Ganti tema antarmuka sesuai preferensi Anda.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PWA Core**: Service Workers, Web App Manifest
- **Penyimpanan**: IndexedDB API
- **Notifikasi**: Notifications API
- **Visualisasi Data**: Chart.js

## 🚀 Cara Menjalankan Secara Lokal

Untuk menjalankan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut:

1.  **Pastikan Python 3 Terinstal**
    Aplikasi ini memerlukan server web lokal untuk menjalankan Service Worker. Cara termudah adalah menggunakan modul `http.server` bawaan Python.

2.  **Navigasi ke Direktori Proyek**
    Buka terminal atau command prompt dan arahkan ke direktori tempat Anda menyimpan file proyek ini.
    ```bash
    cd /path/to/your/project/to do list
    ```

3.  **Jalankan Server Lokal**
    Jalankan perintah berikut di terminal:
    ```bash
    python3 -m http.server 8080
    ```
    Anda bisa menggunakan port lain jika port 8080 sudah terpakai.

4.  **Buka di Browser**
    Buka browser web Anda (disarankan Chrome atau Firefox) dan kunjungi alamat:
    [http://localhost:8080](http://localhost:8080)


## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
