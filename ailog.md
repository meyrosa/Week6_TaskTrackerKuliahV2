# Deklarasi & Log Penggunaan AI

## Deklarasi
Dalam pengerjaan tugas Task Tracker Kuliah v2 (REST API) ini saya dibantu oleh AI, yaitu Claude.
Bagian yang dibantu adalah: penjelasan konsep (Mock API, async/await, cek res.ok, error handling), kode index.html, style.css, dan app.js (helper api(), GET dengan Promise.all, POST, PATCH/DELETE dengan event delegation, status loading/error/retry), mock-api.js. Untuk mock-api nya itu dibuat dengan bantuan AI.
Bagian yang saya kerjakan/modifikasi sendiri: mengetik ulang secara bertahap, menyesuaikan daftar mata kuliah, mengubah pesan error, styling. Saya juga menguji sendiri aplikasi pada mode normal, lambat, offline, tidak stabil, dan server 500, dan mencoba memahami alur async kode yang saya kumpulkan.

## Log Prompt

### Prompt 1
- Tanggal: 2026-10-11
- Tool: Claude
- Prompt: "aku punya tugas lanjutan materinya tentang Asynchronous JavaScript & Fetch API" (+ screenshot soal Task Tracker v2 REST API)
- Hasil: kode index.html, style.css, app.js (GET, POST, PATCH/DELETE, error handling) dan penjelasan konsep async
- Yang saya lakukan: membaca tiap bagian, mengetik ulang bertahap sambil commit

### Prompt 2
- Tanggal: 2026-10-11
- Tool: Claude
- Prompt: Bagaimana dengan mock api ini aku sudah mencarinya di materi Minggu 6 gak ada
- Hasil: penjelasan Mock API dan cara mencarinya lewat view source / Console
- Yang saya lakukan: mencari di halaman materi,tapi tetap gak ketemu

### Prompt 3
- Tanggal: 2026-10-11
- Tool: Claude
- Prompt: meminta mock-api.js untuk pengujian lokal karena Mock API dari slide tidak ketemu
- Hasil: mock-api.js dengan mode normal, lambat, offline, tidak stabil, server 500
- Yang saya lakukan: memasang di index.html sebelum app.js dan mengujinya