# BIOZO AI

Website AI yang membaca foto makanan dan kasih saran gizi sesuai kondisi kesehatan (diabetes, hipertensi, umum).

## Cara deploy (tanpa install apa-apa di laptop)

### 1. Upload ke GitHub
1. Buka https://github.com/new dan buat repo baru (mis. `biozo-ai`), boleh Private atau Public.
2. Setelah repo dibuat, klik **"uploading an existing file"** (atau menu **Add file > Upload files**).
3. Buka folder project ini di komputer kamu, lalu **drag seluruh isi folder** (semua file & folder: `app`, `package.json`, `tailwind.config.js`, dst) ke halaman upload GitHub.
4. Scroll ke bawah, klik **Commit changes**.

### 2. Deploy ke Vercel
1. Buka https://vercel.com/new dan login pakai akun GitHub kamu.
2. Pilih repo `biozo-ai` yang baru diupload, klik **Import**.
3. Sebelum klik Deploy, buka bagian **Environment Variables**, tambahkan:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (API key dari https://console.anthropic.com/settings/keys)
4. Klik **Deploy**. Tunggu 1-2 menit sampai selesai build.
5. Website kamu akan online di alamat seperti `biozo-ai.vercel.app`.

## Kalau nanti mau update tampilan
Edit file `app/page.js` (isi teks & desain) atau `app/api/analyze/route.js` (logika AI-nya), lalu upload ulang file yang berubah ke GitHub — Vercel otomatis re-deploy setiap ada commit baru.

## Catatan keamanan
API key ANTHROPIC_API_KEY cuma dipakai di server (`app/api/analyze/route.js`), tidak pernah dikirim ke browser. Jangan taruh API key langsung di `app/page.js` atau file yang jalan di sisi client.
