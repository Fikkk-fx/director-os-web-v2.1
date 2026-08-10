---
name: StoryboardSkill — The Visual Blueprint Engine
description: Bertugas mengonversi rancangan akhir prompt video (Director O.S.) menjadi sebuah prompt pembuatan gambar (Image Generation) yang berisi "10-Panel Storyboard Grid". 1 panel merepresentasikan 1 detik aksi kinetik. Digunakan agar pengguna bisa mencetak preview akurat sebelum merender video utuh.
---

# 📖 STORYBOARD-SKILL: THE VISUAL BLUEPRINT ENGINE
**Fungsi:** Mengonversi *Prompt Video* yang panjang menjadi format *Image Prompt* (untuk Midjourney / DALL-E) yang berbentuk komik/storyboard kisi (Grid). AI akan mendistribusikan durasi (misal 10 detik) ke dalam 10 kotak berurutan (*1 panel = 1 second*).

## 1. THE GRID EXTRACTION (Pemecahan 10 Detik)
Ketika skill ini dipanggil, Anda **WAJIB** membaca blok `[PROSE]` dari *prompt video* dan memecahnya secara mendetail menjadi 10 adegan berurutan.
*   Jika di *video prompt* terjadi `[RAPID PUSH-IN]` di detik ke-4, maka Panel 4 harus mendeskripsikan *Close-Up*.
*   Jika detik ke-8 karakter terlempar ke udara, maka Panel 8 harus mendeskripsikan karakter melayang dari sudut pandang kamera yang sesuai.

## 2. THE IMAGE PROMPT FORMAT (Keluaran Akhir)
Anda DILARANG KERAS mencetak skema tabel ASCII, bagan teks Bahasa Indonesia, atau diagram teks dingin! Berikan HANYA SATU BLOK PROMPT GAMBAR BAHASA INGGRIS MURNI yang siap ditempel ke Midjourney / Flux / DALL-E.

**Struktur Wajib Prompt Storyboard:**
1. **Awalan Wajib (The Aesthetic Base):** `A professional cinematic storyboard grid, sequential art, 10-panel grid layout on a single white page, 16:9 ratio per panel, strict chronological sequence, photorealistic cinematic film stills, shot on 35mm lens, high contrast, clean white borders separating the panels.`
2. **Karakter & Lokasi Inti:** Sebutkan ciri fisik absolut dan lokasi dari `[GLOBAL LOCK]` agar konsisten di semua panel.
3. **Distribusi 10 Panel:** 
    *   `Panel 1 (0s): [Deskripsi visual spesifik]`
    *   `Panel 2 (1s): [Deskripsi lanjutan aksi]`
    *   `...`
    *   `Panel 10 (10s): [Akhir adegan]`


## 3. THE SYNCHRONIZATION LAW (Hukum Penyelarasan)
*   **Dilarang Melenceng:** Tidak boleh ada satupun adegan di panel storyboard yang bertabrakan dengan cerita di *prompt video*.
*   **Pergerakan Menjadi Statis:** Mengingat panel komik itu statis, terjemahkan gerakan kamera (seperti *Whip Pan* atau *Orbit*) menjadi *Motion Lines* (garis kecepatan) atau efek *Motion Blur* pada gambar. (Contoh: `Panel 5: Character mid-air, drawn with aggressive motion blur lines indicating a rapid vertical whip-pan`).

## 4. OMNIPOTENT TRIGGER
*   Skill ini akan otomatis "standby". 
*   Apabila pengguna secara eksplisit meminta "buatkan film beserta storyboardnya", Anda WAJIB mencetak `Prompt Video V19.1` (Di dalam kotak kode text 1) dan `Prompt Storyboard 10-Panel` (Di dalam kotak kode text 2 yang terpisah).
*   Prompt storyboard **HANYA BERISI TEKS BAHASA INGGRIS PADAT**, jangan campur dengan bahasa Indonesia di dalam blok kodenya.

---
**CONTOH HASIL PROMPT STORYBOARD (Di dalam kotak kode):**
```
A professional cinematic storyboard, sequential art, 10-panel grid layout on a single white page, strict chronological sequence, photorealistic cinematic film stills, shot on 35mm lens, clean white borders. Main subject: A Japanese woman in a hyper-glossy yellow jacket. Location: White void above a blue matte floor. Panel 1 (0s): Helicopter view of the woman lying on the blue floor, smirking. Panel 2 (1s): Close-up from the floor level looking up at her face. Panel 3 (2s): Macro shot of her violently biting a red candy, eyes bulging. Panel 4 (3s): Low angle revealing four surreal entities dropping from a white sky... (dan seterusnya hingga Panel 10)
```

