# Wedding Planner (prototipe UI)

Prototipe aplikasi perencanaan pernikahan untuk pasangan di Indonesia, sesuai PRD. Nama brand masih nama kerja dan bisa diganti di `src/lib/brand.ts`.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000, lalu pilih **Lihat demo Ayu & Raka** atau **Mulai gratis** (onboarding).

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Landing page + harga |
| `/onboarding` | Isi mempelai, tanggal, adat, agama, tamu, anggaran |
| `/dashboard` | Hitung mundur, progres, tugas berikutnya, pembayaran, RSVP |
| `/checklist` | Tugas per fase (H-n), filter, PIC |
| `/anggaran` | Pos anggaran, vendor, DP/cicilan, pengeluaran kecil |
| `/tamu` | Daftar tamu, impor CSV, tautan personal, share WhatsApp |
| `/undangan` | Editor + pratinjau undangan, terbitkan (Premium) |
| `/u/[slug]?to=[tamu]` | Undangan publik + RSVP tamu tanpa akun |
| `/rundown` | Susunan acara per sesi, cetak/PDF |
| `/advisor` | AI Advisor (jawaban contoh) |
| `/pengaturan` | Profil pernikahan, kolaborator, paket, reset demo |

## Catatan prototipe

- Data disimpan di `localStorage` browser (`src/lib/store.ts`). RSVP dari tab undangan langsung tersinkron ke tab dashboard di browser yang sama.
- Pembayaran Premium dan AI Advisor masih simulasi (`src/components/premium-modal.tsx`, `src/lib/advisor.ts`).
- Template checklist, anggaran, dan rundown per adat/agama ada di `src/lib/templates.ts`.
