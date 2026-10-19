# BRMP — Frontend & Backend

Paket aplikasi terintegrasi: website BRMP, API Node.js, SQLite persisten, panel admin, dan chatbot yang menggunakan konten terbit. Tidak memerlukan paket npm tambahan. **Jalankan melalui server, bukan dengan membuka index.html memakai file://.**

## Menjalankan lokal

Prasyarat: **Node.js 24 atau lebih baru**. Buka terminal di folder ini:

```sh
npm run setup
npm start
```

Setup membuat `.env` dengan password admin acak. Simpan password yang tampil di terminal; yang disimpan aplikasi hanya hash scrypt. Setup tidak menimpa `.env` yang sudah ada.

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin
- Username awal: `admin`
- Health check: http://localhost:3000/api/health

Gunakan alamat `localhost` tersebut, bukan IP yang berbeda, karena pemeriksaan Origin harus cocok dengan `PUBLIC_ORIGIN`. Database dibuat di `data/brmp.sqlite` pada penggunaan pertama; data awal tidak ditimpa saat restart.

## Yang sudah terintegrasi

- Direktori delapan layanan, filter, pencarian, pengurutan, favorit browser, ekspor CSV.
- Layanan, artikel, pengetahuan chatbot, profil, alamat, telepon, email, dan WhatsApp berasal dari database.
- Panel admin: buat/edit konten, draf → terbit → arsip, riwayat penyimpanan, kontrol versi untuk konflik editor.
- Artikel terbit mengisi halaman informasi dan sorotan kegiatan. Gambar dipilih dari file di `public/assets/`.
- Perubahan alamat memperbarui alamat di frontend, pencarian peta, rute Google Maps, dan fakta chatbot.
- Pengetahuan terbit ditampilkan di bagian Panduan & Pengetahuan dan digunakan chatbot.
- Impor/ekspor JSON untuk pertukaran konten. Impor menghasilkan draf baru, bukan menimpa data; pengaturan situs dilewati. Maksimum 100 entri atau 128 KB per permintaan. Periksa duplikasi sebelum menerbitkan.
- Konten berupa teks biasa. Script/HTML tidak dieksekusi. Tautan divalidasi dan teks yang dirender lewat template di-escape.

## Mengaktifkan AI

Isi pada **server**, di `.env` atau secret manager hosting:

```dotenv
OPENAI_API_KEY=isi_kunci_di_server
OPENAI_MODEL=isi_id_model_yang_mendukung_Responses_dan_Structured_Outputs
AI_DAILY_LIMIT=200
AI_TIMEOUT_MS=20000
```

Restart setelah mengubah konfigurasi. Pilih ID model yang tersedia di akun Anda dan mendukung Responses API dengan `text.format.type=json_schema`. Tidak ada model atau akun berbayar yang dipilih otomatis. Kunci tidak boleh masuk ke `public/`, Git, atau ZIP distribusi. `OPENAI_API_KEY` dan `OPENAI_MODEL` sama-sama diperlukan; jika belum diisi, chatbot tetap berjalan dalam mode jawaban terkurasi dan labelnya sesuai.

**Cara jawaban AI bekerja:** backend mengirim pertanyaan dan fakta terbit ke Responses API; AI mengklasifikasikan cakupan dan memilih ID fakta. Backend memeriksa ID, kemudian menampilkan teks fakta asli dan tautan rujukan. Model tidak diberi akses menulis database, browsing, menjalankan tool, atau mengeluarkan HTML. Teks bebas model tidak diteruskan ke pengguna. Ini adalah pemilihan bukti berbantuan AI, bukan percakapan generatif bebas.

Pertanyaan di luar cakupan ditolak sopan. Pertanyaan terkait BRMP tetapi tidak terjawab dari data diarahkan ke petugas. Jika API gagal, timeout, format/ID bukti tidak valid, atau batas penggunaan tercapai, frontend menampilkan pesan terkendali. Pemilihan fakta oleh model tetap dapat keliru: kurasi basis pengetahuan dan uji pertanyaan sebelum peluncuran.

Mode terkurasi memakai pencarian kata kunci dan lebih terbatas daripada mode AI. Pertanyaan diproses satu per satu, tanpa ingatan lintas pesan. Percakapan tidak disimpan oleh aplikasi; saat AI aktif, pertanyaan dan konten terbit dikirim ke OpenAI dengan `store:false`. Itu tidak berarti tanpa retensi oleh penyedia. Jangan masukkan data pribadi atau rahasia pada konten publik maupun pertanyaan.

Dokumentasi API yang menjadi acuan: https://developers.openai.com/api/docs/guides/structured-outputs

## Deployment VPS / container

Paket ini untuk **satu instance Node.js dengan volume persisten**, bukan hosting HTML statis, shared hosting PHP, atau filesystem serverless sementara. Jangan menjalankan beberapa replica yang menulis SQLite ini. Bila dibutuhkan banyak replica, migrasikan penyimpanan ke PostgreSQL dan shared session/rate limiter.

1. Jalankan setup lokal pada server, atau buat secret environment dari contoh `.env.example`.
2. Ubah `.env` untuk domain yang Anda kontrol:

```dotenv
NODE_ENV=production
PUBLIC_ORIGIN=https://domain-anda.go.id
TRUST_PROXY=1
```

3. Jalankan:

```sh
docker compose up -d --build
```

4. Pasang reverse proxy HTTPS di depan `127.0.0.1:3000`. Contoh Caddy disediakan di `Caddyfile.example`; ubah domainnya. TLS harus aktif, karena cookie admin memakai Secure di produksi. Untuk Caddy yang berjalan sebagai service host, sertifikat dapat diperoleh setelah DNS benar dan port 80/443 dapat diakses.
5. `TRUST_PROXY=1` hanya untuk satu proxy tepercaya yang menimpa `X-Forwarded-For`, seperti contoh. Port aplikasi di compose hanya dipublikasikan ke loopback. Jika tanpa proxy, gunakan `TRUST_PROXY=0`.
6. Volume `brmp_data` menyimpan database; jangan menjalankan `docker compose down -v` bila ingin mempertahankan data.

Untuk menjalankan langsung tanpa Docker: pasang Node.js 24, buat service sistem yang menjalankan `npm start` dari folder proyek, atur restart otomatis, pasang HTTPS reverse proxy, dan gunakan lokasi database yang persisten.

**Docker belum diuji build/run pada lingkungan pengerjaan karena Docker daemon tidak berjalan.** Jalur Node langsung dan API diuji secara lokal. Tidak ada deployment online yang dilakukan sesuai pilihan paket siap deploy.

## Pengelolaan konten

1. Masuk `/admin` dengan akun hasil setup.
2. Pilih konten atau Tambah konten.
3. Isi fakta lengkap dan tautan yang benar; simpan sebagai draf untuk diperiksa.
4. Pilih Terbit agar tersedia di website dan chatbot. Arsip menyembunyikan konten tanpa menghapus database.
5. Muat ulang halaman publik setelah perubahan. Pengaturan situs harus tetap berstatus Terbit dan hanya ada satu record.

Logo, tata letak, FAQ statis, dan foto dikelola di berkas `public/`. Upload file melalui admin belum disediakan; salin foto yang telah disetujui ke `public/assets/`, kemudian masukkan path `/assets/nama-file.jpg` pada artikel. Portal mempertahankan tautan PEPSITP, Linktree, Google Drive, dan Google Sheets, tetapi **belum membaca isi database privat atau menyinkronkan spreadsheet**. Login yang pernah diberikan tidak dimasukkan ke paket. Konten eksternal dapat diimpor sebagai JSON setelah dikurasi oleh pengelola.

## Backup, pemulihan, dan password

```sh
npm run backup
# Jika menggunakan container:
docker compose exec web node scripts/backup.js
```

Backup memakai SQLite backup API agar konsisten saat aplikasi berjalan. File ada di `backups/` atau volume `brmp_backups`. Simpan salinan di lokasi lain secara terjadwal. JSON ekspor berisi konten, bukan cadangan sesi, audit, konfigurasi, atau seluruh database.

Pemulihan: hentikan aplikasi, simpan cadangan file database yang sedang digunakan, ganti database dengan backup yang valid, pastikan tidak memakai file WAL/SHM dari database lama, lalu jalankan kembali. Uji pemulihan terlebih dahulu pada lingkungan terpisah.

Rotasi password lokal:

```sh
node scripts/rotate-password.js
```

Restart aplikasi setelahnya. Semua sesi admin dibatalkan pada restart. Untuk container yang memakai `env_file`, jalankan rotasi pada host dan buat ulang container: `docker compose up -d --force-recreate`.

## API

| Endpoint | Kegunaan |
|---|---|
| GET `/api/health` | Kesiapan proses dan database |
| GET `/api/content` | Konten terbit dan mode chatbot |
| POST `/api/chat` | JSON `{ "message": "Alamat kantor?" }` |
| POST `/api/admin/login` | Login; cookie HttpOnly dan token CSRF |
| GET `/api/admin/session` | Pulihkan token CSRF untuk sesi aktif |
| POST `/api/admin/logout` | Cabut sesi |
| GET/POST `/api/admin/records` | Daftar/buat konten |
| PUT `/api/admin/records/:id` | Edit dengan nomor `version` saat ini |
| GET `/api/admin/export` | Ekspor konten |
| POST `/api/admin/import` | Impor draf dari `{ "records": [...] }` |

Semua POST/PUT membutuhkan header Origin yang sama dengan PUBLIC_ORIGIN. Mutasi admin selain login juga membutuhkan cookie sesi dan header X-CSRF-Token. Contoh pemanggilan chat saat lokal:

```js
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Alamat kantor?' })
}).then(r => r.json())
```

## Validasi dan batasan

Jalankan `npm test`. Pengujian mencakup autentikasi, CSRF/origin, CRUD status konten, persistensi SQLite, konflik versi, impor atomik, validasi URL, pembatasan permintaan, kontrol akses file, dan respons AI menggunakan mock. Tidak ada API key dalam paket; **panggilan AI berbayar sungguhan belum diuji**. Pemeriksaan visual browser pada revisi fullstack belum dilakukan karena kontrol browser dinonaktifkan di pengaturan Work.

Konfigurasi saat ini memakai satu akun admin, bukan role multi-pengguna/SSO/MFA. Rate limit chat 20 permintaan/menit/IP, login 8 percobaan/15 menit/IP, serta batas panggilan AI harian yang tersimpan di database. Batasi juga akses admin pada reverse proxy sesuai kebutuhan lembaga. Pengujian ini bukan audit penetrasi atau sertifikasi keamanan produksi.
