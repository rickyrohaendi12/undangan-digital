# Undangan Digital Wedding (Next.js)

Proyek Next.js (App Router, TypeScript) berisi:

- `/` : halaman undangan, nama tamu dibaca dari `?to=Nama+Tamu`
- `/generator` : halaman untuk client membuat link per tamu + tombol kirim WhatsApp

## Menjalankan

```bash
npm install
npm run dev      # buka http://localhost:3000
```

Coba: `http://localhost:3000/?to=Budi+Santoso` dan `http://localhost:3000/generator`

## Mengubah isi undangan

Semua data (nama, orang tua, tanggal, acara, lokasi, nomor WhatsApp RSVP) ada di
`lib/config.ts`. Warna dan tampilan ada di `app/globals.css` (variabel di `:root`).

## Musik

Bawaan: musik piano lembut yang dibuat lewat Web Audio (tanpa file).
Untuk lagu sendiri: taruh `lagu.mp3` di folder `public/`, lalu di `lib/config.ts` ubah
`musicFile: "/lagu.mp3"`. Pastikan lagu bebas royalti atau Anda punya lisensinya.

## Preview WhatsApp

Taruh gambar `public/og.jpg` (1200x630), lalu aktifkan baris `images` di `app/layout.tsx`.

## Deploy ke Vercel

1. Push folder ini ke GitHub.
2. Di vercel.com pilih **Add New > Project**, import repo, klik **Deploy**.
3. Hubungkan domain custom di Settings > Domains (opsional).

## Catatan

- `/generator` bersifat publik. Jika perlu, ganti nama foldernya menjadi sesuatu yang
  sulit ditebak, atau tambahkan proteksi password lewat middleware.
- Daftar tamu tidak disimpan di server, jadi hilang saat halaman di-refresh.
