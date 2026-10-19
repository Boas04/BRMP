# Hasil verifikasi — 19 Oktober 2026

`npm test`: **16 lulus, 0 gagal** pada Node.js 24.19.0 / Windows.

- Password di-hash scrypt; password salah ditolak.
- API publik memuat delapan layanan, dua artikel, pengetahuan terbit, dan pengaturan situs.
- Admin tanpa sesi, origin palsu, dan token CSRF salah ditolak.
- Perubahan draf/terbit/arsip memengaruhi API dan pengetahuan chatbot.
- Versi konten yang sudah berubah menghasilkan HTTP 409.
- URL dengan protokol berbahaya ditolak; impor tidak valid tidak menulis sebagian data.
- Logout mencabut sesi.
- Pertanyaan kosong/terlalu panjang ditolak, permintaan di luar cakupan dijawab sopan.
- Rate limit chat aktif.
- Respons AI diuji dengan mock: ID bukti valid, ID palsu, API gagal, dan batas penggunaan harian.
- Database tetap tersimpan setelah restart tanpa penggandaan seed.
- File rahasia dan traversal path tidak dilayani.
- Pengaturan kontak dibaca oleh frontend API dan chatbot dari data yang sama.
- JSON ekspor dapat diimpor menjadi draf tanpa menduplikasi pengaturan situs.
- Setup menulis hash, bukan password asli; backup SQLite lolos `PRAGMA integrity_check`.
- Aset yang dirujuk tersedia dan seluruh JavaScript frontend lulus pemeriksaan sintaks.

Belum diverifikasi: panggilan API AI berbayar sungguhan, build/run image Docker (daemon tidak aktif), tampilan dan interaksi browser revisi fullstack (browser use dinonaktifkan), integrasi database privat PEPSITP atau Google Sheets, dan deployment/domain publik. Pengujian ini bukan audit penetrasi.
