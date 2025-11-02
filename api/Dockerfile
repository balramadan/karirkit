# --- Tahap 1: Build & Install Dependencies ---
# Menggunakan image Node.js versi 20-alpine yang ringan.
FROM node:20-alpine AS base

# Menetapkan direktori kerja
WORKDIR /app

# Menyalin package.json dan package-lock.json (jika ada)
COPY package.json ./

# Menginstal dependensi produksi. Opsi --omit=dev memastikan devDependencies tidak diinstal.
RUN npm install --omit=dev

# --- Tahap 2: Production Image ---
# Membuat image final yang bersih dari image dasar yang sama.
FROM node:20-alpine

WORKDIR /app

# Menginstal pustaka sistem yang diperlukan oleh Puppeteer/Chromium di Alpine.
# Ini penting agar @sparticuz/chromium dapat berjalan dengan benar.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Menyalin dependensi yang sudah diinstal dan kode sumber dari tahap 'base'.
COPY --from=base /app/node_modules ./node_modules
COPY . .

# API Anda akan berjalan di port yang ditentukan oleh environment variable PORT (misal: 5000).
EXPOSE 5000

# Perintah untuk menjalankan aplikasi menggunakan skrip 'start' dari package.json.
CMD ["npm", "start"]
