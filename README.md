# KarirKit - Job Application Tracker

**KarirKit** adalah aplikasi web yang dirancang untuk membantu para pencari kerja mengelola dan melacak semua lamaran pekerjaan mereka di satu tempat. Dengan antarmuka yang intuitif, Anda dapat dengan mudah memantau status setiap lamaran, mulai dari "Dilamar" hingga "Diterima".

## ✨ Fitur Utama

- **Manajemen Lamaran**: Tambah, lihat, edit, dan hapus lamaran pekerjaan Anda.
- **Pelacakan Status**: Kelola lamaran dalam berbagai status (misalnya, Dilamar, Wawancara, Penawaran) dengan mudah.
- **Pengelompokan Kustom**: Buat grup untuk mengorganisir lamaran, misalnya berdasarkan jenis pekerjaan, lokasi, atau prioritas.
- **Drag & Drop**: Atur ulang posisi dan status lamaran dengan antarmuka seret dan lepas (drag-and-drop).
- **Otentikasi Aman**: Sistem login yang aman menggunakan email/password (JWT) dan opsi login via Google (SSO dengan Auth0).
- **Desain Responsif**: Akses dan kelola lamaran Anda dari perangkat apa pun, baik desktop maupun mobile.

## 🛠️ Tumpukan Teknologi (Tech Stack)

Proyek ini dibangun menggunakan tumpukan teknologi modern yang andal dan skalabel.

### Backend

- **Node.js**: Lingkungan eksekusi JavaScript sisi server.
- **Express.js**: Kerangka kerja web untuk membangun API.
- **MongoDB**: Database NoSQL untuk menyimpan data lamaran dan pengguna.
- **Mongoose**: ODM (Object Data Modeling) untuk berinteraksi dengan MongoDB.
- **Passport.js (JWT, Local, Auth0)**: Middleware otentikasi untuk mengamankan endpoint API.

### Frontend

- **Vue.js**: Framework progresive javascript
- **TailwindCSS**: Framework utility-first css
- **Pinia**: State management
- **PrimeVue**: UI components

## 🚀 Memulai Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### Prasyarat

- [Node.js](https://nodejs.org/) (v18.x atau lebih baru direkomendasikan)
- [MongoDB](https://www.mongodb.com/try/download/community) (pastikan server MongoDB Anda berjalan)
- `npm` atau `yarn`

### Instalasi

1.  **Clone repositori ini:**

    ```bash
    git clone https://github.com/username/karirkit.git
    cd karirkit
    ```

2.  **Instal dependensi untuk Backend (API):**

    ```bash
    cd api
    npm install
    ```

3.  **Instal dependensi untuk Frontend (Client):**

    ```bash
    cd ../client
    npm install
    ```

4.  **Konfigurasi Environment Variables:**
    Buat file `.env` di dalam direktori `api/` dan isi dengan variabel yang diperlukan. Anda bisa menyalin dari `api/.env.example` jika ada.

    ```env
    # api/.env
    DATABASE_URL="mongodb://localhost:27017/karirkit"
    JWT_SECRET="rahasia-super-aman-yang-panjang"
    PORT=5000
    CLIENT_URL="http://localhost:5173" # Sesuaikan dengan port frontend Anda
    # Variabel untuk Auth0 (jika menggunakan SSO Google)
    AUTH0_DOMAIN="your-auth0-domain.auth0.com"
    AUTH0_CLIENT_ID="your-auth0-client-id"
    ```

### Menjalankan Aplikasi

1.  **Jalankan Server Backend:**
    Dari direktori `server/`, jalankan:

    ```bash
    npm run dev
    ```

    Server akan berjalan di `http://localhost:3000`.

2.  **Jalankan Client Frontend:**
    Dari direktori `client/`, jalankan:
    ```bash
    npm run dev
    # atau 'npm run host' untuk akses dari jaringan lokal
    ```
    Aplikasi akan dapat diakses di `http://localhost:5173` (atau port lain sesuai konfigurasi).

## API Endpoints

Berikut adalah ringkasan dari endpoint API utama yang tersedia di backend. Semua endpoint memerlukan otentikasi JWT.

### Autentikasi

| Metode | Endpoint               | Deskripsi                                          |
| :----- | :--------------------- | :------------------------------------------------- |
| `POST` | `/api/auth/signup`     | Mendaftarkan pengguna baru (mengirim OTP).         |
| `POST` | `/api/auth/verify-otp` | Memverifikasi OTP untuk menyelesaikan pendaftaran. |
| `POST` | `/api/auth/resend-otp` | Mengirim ulang kode OTP pendaftaran.               |
| `POST` | `/api/auth/signin`     | Login pengguna dengan email dan password.          |
| `GET`  | `/api/auth/google`     | Memulai proses login dengan Google (Auth0).        |
| `GET`  | `/api/auth/callback`   | Callback setelah login dengan Google berhasil.     |

### Lamaran (Applications)

| Metode   | Endpoint                    | Deskripsi                                                           |
| :------- | :-------------------------- | :------------------------------------------------------------------ |
| `GET`    | `/api/applications`         | Mendapatkan daftar lamaran dengan paginasi, filter, dan sorting.    |
| `POST`   | `/api/applications`         | Membuat lamaran baru.                                               |
| `GET`    | `/api/applications/:id`     | Mendapatkan detail satu lamaran.                                    |
| `PATCH`  | `/api/applications/:id`     | Memperbarui informasi satu lamaran.                                 |
| `DELETE` | `/api/applications/:id`     | Menghapus satu lamaran.                                             |
| `POST`   | `/api/applications/reorder` | Memperbarui status/posisi beberapa lamaran sekaligus (drag & drop). |

### Grup (Groups)

| Metode   | Endpoint          | Deskripsi                                         |
| :------- | :---------------- | :------------------------------------------------ |
| `GET`    | `/api/groups`     | Mendapatkan semua grup milik pengguna.            |
| `POST`   | `/api/groups`     | Membuat grup baru.                                |
| `PATCH`  | `/api/groups/:id` | Memperbarui nama grup.                            |
| `DELETE` | `/api/groups/:id` | Menghapus grup beserta semua lamaran di dalamnya. |

## 🤝 Kontribusi

Kontribusi sangat kami hargai! Jika Anda ingin berkontribusi, silakan fork repositori ini dan buat pull request. Untuk perubahan besar, silakan buka issue terlebih dahulu untuk mendiskusikan apa yang ingin Anda ubah.

## 📜 Lisensi

Proyek ini dilisensikan di bawah Lisensi GNU GPLv3. Lihat file `LICENSE` untuk detailnya.

---

Dibuat dengan ❤️ untuk para pejuang karir.
