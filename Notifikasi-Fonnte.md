# Notifikasi WhatsApp via Fonnte → n8n

Setiap ada pengunjung chat di landing page, workflow n8n otomatis kirim notif ke WA ente.
Alur: `When chat message received` → `AI Agent` → `HTTP Request (Fonnte)` (cabang paralel, jawaban ke pengunjung tetap jalan normal).

## 1. Daftar Fonnte (sekali saja)

1. Buka https://md.fonnte.com/new/register.php → daftar → login.
2. Masuk menu **Device** → **Add Device** → scan QR pakai **nomor WA cadangan** (JANGAN nomor bisnis utama — Fonnte jalan di atas WhatsApp Web, ada risiko blokir kalau dipakai spam).
3. Pastikan status device **Connected**.
4. Masuk menu **API / Token** → salin **token**-nya. Simpan baik-baik.

> Akun baru = masa trial gratis (kuota terbatas, cukup buat tes). Cek sisa kuota di dashboard Fonnte.

## 2. Tambah node di workflow n8n

Workflow yang dipakai: **My workflow** (Chat Trigger → AI Agent → Google Gemini).

1. Dari output node **AI Agent**, tarik kabel baru → tambah node **HTTP Request** → rename jadi `Notif WA Fonnte`.
2. Isi node-nya persis seperti ini:

| Field | Isi |
|---|---|
| Method | `POST` |
| URL | `https://api.fonnte.com/send` |
| Authentication | `None` (pakai header manual di bawah) |
| Send Headers | ON → `Authorization` = token Fonnte dari langkah 1 |
| Send Body | ON |
| Body Content Type | `JSON` |
| JSON Body | lihat template di bawah |

3. JSON Body (Copy-paste, tinggal ganti nomor target):

```json
{
  "target": "6285216758721",
  "message": "Chat baru RoboKomputer\nWaktu: {{ $now.setZone('Asia/Jakarta').toFormat('dd-MM-yyyy HH:mm') }}\nSesi: {{ $('When chat message received').first().json.sessionId }}\nPesan: {{ $('When chat message received').first().json.chatInput }}\nDijawab AI: {{ $('AI Agent').first().json.output }}"
}
```

> Catatan: nama node di expression (`When chat message received`, `AI Agent`) HARUS sama persis dengan nama node di workflow ente. Kalau beda, sesuaikan.

## 3. Tes (tanpa buang kuota berlebih)

1. Klik node `Notif WA Fonnte` → **Execute Step**. HP ente harusnya terima WA dalam 5–10 detik.
2. Kalau sukses → kirim 1 pesan lewat chatbot website → pastikan 2 hal terjadi: (a) chatbot jawab normal, (b) WA notif masuk.
3. **Publish ulang workflow** (wajib — kalau tidak, node baru tidak live di production).

## 4. Troubleshooting

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| Execute Step error 401 | Token salah / expired | Regenerate token di dashboard Fonnte, update header |
| Pesan tidak sampai, status device merah | Device disconnect (HP mati / WA Web logout) | Re-scan QR di dashboard Fonnte |
| Error quota / limit | Kuota trial habis | Top up paket, atau alihkan notif utama ke Telegram (gratis permanen) |
| JSON error di n8n | Nama node di expression beda | Samakan dengan nama node asli di canvas |
| Ganti ke form-urlencoded | Kadang API lebih cocok form | Ubah Body Content Type → `Form-Urlencoded`, field sama: `target`, `message` |

## 5. Anti-spam (opsional, kalau notif kerasa berisik)

Notif di atas nyala **per pesan masuk**. Kalau mau hemat kuota, selipkan node **Filter** antara AI Agent dan Fonnte, contoh aturan: hanya teruskan kalau `chatInput` mengandung kata `harga`, `pesan`, `servis`, atau `beli`. Atau: hanya teruskan pesan PERTAMA tiap sesi (butuh cek riwayat eksekusi — tanya ane kalau mau dibuatkan).

## 6. Batasan trial

- Trial Fonnte = kuota terbatas. Untuk pemakaian permanen perlu beli paket (cek halaman Harga di fonnte.com).
- Notifikasi utama jangka panjang yang gratis: **Telegram** (lihat panduan terpisah) — Fonnte cocok sebagai pendamping/percobaan.
