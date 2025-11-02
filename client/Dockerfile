# Menggunakan image Node.js versi 20-alpine sebagai dasar.
# Versi ini sesuai dengan yang Anda tentukan di package.json.
FROM node:20-alpine

# Menetapkan direktori kerja di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json (jika ada)
# Ini memanfaatkan cache layer Docker, sehingga 'npm install' hanya berjalan
# jika ada perubahan pada file-file ini.
COPY package.json ./

# Menginstal semua dependensi proyek
RUN npm install

# Menyalin sisa kode sumber aplikasi ke dalam container
COPY . .

# Menjalankan skrip build untuk menghasilkan file statis di direktori /app/dist
RUN npm run build

# Vite preview server berjalan di port 4173 secara default.
EXPOSE 5173

# Perintah untuk menjalankan server pratinjau Vite.
# Opsi '--host' diperlukan agar server dapat diakses dari luar container.
CMD ["npm", "run", "preview", "--", "--host"]
