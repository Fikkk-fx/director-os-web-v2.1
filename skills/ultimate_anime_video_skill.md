---
name: ultimate-anime-video-prompt
description: >-
  Kompilasi mutlak untuk generasi prompt Video Anime tingkat pro. Menggabungkan
  Sistem Prompt AI Video (Reference Gathering, DNA Character), The 12 Principles of
  Animation (Fisika & Fluiditas), dan Master Director Template — Anime Edition.
  Dirancang untuk Kling 3.0, Veo 3.1, Sora 2, Runway Gen-4.5, Luma, dan Pika.
---

# 🎌 ULTIMATE ANIME VIDEO PROMPT ENGINE v2.0
Gabungan dari **AI Image/Video Prompt Engine**, **AnimationSkill (Anime Edition)**, dan **JapanSkill**.

Engine ini memastikan pembuatan video anime AI yang **bebas dari animasi kaku (stiff)**, **konsisten dalam desain karakter (100% lock)**, mematuhi **fisika anime (12 Principles)**, dan memiliki **sinematografi serta ritme yang termotivasi (motivated cinematography)**.

---

## 🔍 STEP 0: REFERENCE GATHERING (MANDATORY)
Sebelum menulis prompt, LAKUKAN PENCARIAN VISUAL (Google, X, Instagram, YouTube) untuk mendapatkan data nyata mengenai gaya anime, referensi pencahayaan, dan komposisi.

**Ekstraksi Data Visual:**
- **🎨 Color & Art Style:** Cel-shaded, watercolor backgrounds, high-contrast shonen?
- **💡 Lighting:** Direction, color temp (e.g., sunset glow, harsh neon).
- **📐 Composition:** Tatami-shot, dynamic angles, depth of field?
- **📹 Motion & Timing:** Cepat (action) atau meditatif (slice-of-life)?

---

## 🧬 STEP 1: CHARACTER CONSISTENCY & DNA LOCK
Penyakit utama AI Video adalah *character drift* (wajah/baju berubah) dan animasi yang kaku (zombie/robotic) ketika mencoba menjaga konsistensi.

**1. CHARACTER DNA CARD (Anchor)**
Letakkan blok ini di awal setiap prompt karakter:
```markdown
[CHARACTER ANCHOR — DO NOT DEVIATE]
Character: [Nama & Peran]
Face: [Bentuk mata, gaya highlight, rambut, proporsi wajah anime]
Body: [Postur, tinggi, bentuk badan]
Costume: [Detail baju, warna dominan]
FORBIDDEN: [No western 3D, no realistic human skin, no robotic stiffness]
[END ANCHOR]
```

**2. THE ANIME PERFORMANCE LOCK (Anti-Stiffness)**
*Character design lock (100% design consistency)* HARUS diimbangi dengan *fluid performance*:
- **Wajib Ada:** Micro-expressions anime alami (perubahan pupil mata, kedipan, alis), *hair dynamics* (rambut bergerak mengikuti angin/gerakan), dan *cloth physics* (kain berayun).
- **Forbidden:** No frozen/stiff characters, no limited keyframe movement, no zombie stares.

---

## 🎬 STEP 2: ANIME PHYSICS & THE 12 PRINCIPLES OF ANIMATION
AI cenderung merender gerakan secara linier. Injeksi prinsip ini ke dalam **[PHYSICS VECTORS]**:

1. **Anticipation & Follow Through:** `0.3s pre-action wind-up`, `hair/appendage drag physics and momentum decay`.
2. **Slow In / Slow Out (S-Curve):** `organic acceleration ramping`, `damped inertia arrival`. Tidak boleh ada kecepatan linier.
3. **Squash & Stretch (Khusus Aksi/Komedi):** `kinetic compression on impact`, `elastic volume retention`.
4. **Secondary Action:** `subconscious micro-gestures`, `ambient eye highlights shifting`.

---

## ⛩️ STEP 3: STUDIO SIGNATURES & NIHON AESTHETICS (JAPAN-SKILL)
Tentukan genre dan demografi untuk mengunci estetika.

- **Shonen (Action/Epic):** `Bold dynamic linework, high-energy pacing, high-contrast shading, sweeping circular swing dynamics.`
- **Ghibli / Slice-of-Life:** `Painterly watercolor backgrounds, grounded natural movement, soft ambient lighting, Hayao Miyazaki aesthetic.`
- **Ozu / Cinematic Drama (Shomin-geki):** `Tatami-Shot (low eye-level), dead-center symmetry, Bressonian restraint, hidden emotions behind polite smiles.`
- **Cyberpunk / Sci-Fi Anime:** `Neon atmospheric lighting, hyper-detailed mechanical parts, claustrophobic urban decay.`

---

## 📝 STEP 4: THE MASTER DIRECTOR TEMPLATE (ANIME EDITION)
*(Gunakan kerangka di bawah ini untuk menghasilkan prompt final dengan memaksimalkan batas karakter absolut spesifik dari model yang dituju (misal: tepat maks 2.500 karakter untuk Kling 3.0 / Seedance 2.5, maks 1.500 untuk Runway. Untuk Hailuo/Minimax gunakan mode padat maks 350-450 karakter))*

```markdown
TITLE: [Judul]
DURATION: [Durasi, misal: 5s / 10s]
GENRE: [Misal: Shonen Action / Slice of Life]
STYLE: High-Quality Modern Anime Production, clean expressive linework, vibrant balanced color palette, smooth fluid animation with professional timing.

----------------------------------------
REFERENCE LOCK (STRICT)
----------------------------------------
IMAGE A (Main Character): Exact anime design match. 100% fluid anime performance, lively eye highlights, natural micro-expressions, hair/cloth physics responding to movement. No stiff/frozen acting.
IMAGE B (Environment): Exact geographical layout, continuous anime art style.

----------------------------------------
SPATIAL GEOGRAPHY & CONTINUITY
----------------------------------------
- Camera North established. All movement relative to this fixed north.
- Room layout and anchor objects are 100% identical. Object permanence is absolute.

----------------------------------------
BLOCKING & CAMERA PACKAGE
----------------------------------------
- Motivated anime camera movement (e.g., dynamic 3D orbital tracking or static Tatami-shot).
- S-curve easing on all camera moves.

----------------------------------------
ACTION & ANIMATION PHYSICS (TEMPORAL BLUEPRINT)
----------------------------------------
[0.0s-1.5s]: Anticipation - (e.g., Mata menyipit, angin meniup rambut ke belakang)
[1.5s-4.0s]: Primary Action - (e.g., Loncatan cepat dengan motion blur, cloth physics)
[4.0s-5.0s]: Follow Through - (e.g., Mendarat dengan berat, inersia rambut perlahan berhenti)

----------------------------------------
AUDIO (Untuk Veo 3.1 / Kling 3.0)
----------------------------------------
[Ambient layer] + [Action foley / SFX] + [Anime Score/Music]

----------------------------------------
NEGATIVE PROMPTS (MANDATORY)
----------------------------------------
No AI stiffness, no robotic movement, no 3D western CGI, no Disney/Pixar style, no hyper-real human skin, no frozen hair/clothes, no design drift, no unexplained geography changes, no watermark, no logo, no text overlay.
```

---

## 💎 STEP 5: THE ABSOLUTE FLATTENED PROMPT STRUCTURE (V19.1)
Untuk output akhir (terutama saat menggunakan Seedance 2.5, Kling 3.0, atau model yang membutuhkan prompt padat dan kinetik), **WAJIB** meratakan (*flatten*) seluruh instruksi ke dalam **Struktur 3-Blok Mutlak** di bawah ini. Jangan gunakan bullet points.

Gunakan format ini sebagai *Output Akhir* yang akan disalin ke AI Generator:

```text
[PROSE & IN-LINE SPATIAL & GLOBAL LOCK]:
[0s-3s]: [Aksi kinetik pertama, pergerakan kamera, dan penguncian geometri/fisika awal].
[3s-6s]: [HARD CUT TO: ANGLE BARU] [Deskripsi kelanjutan aksi, interaksi karakter, dan penguncian konsistensi desain 100%].
[6s-10s]: [HARD CUT TO: ANGLE BARU] [Aksi resolusi/follow-through, stasis protocol jika ada, dan penguncian lingkungan].

[ACTING & LIGHTING SCIENCE]:
High-quality modern anime production, [Style spesifik]. [COLOR GRADE LOCK]: Primary Triadic Separation ([Warna 1, Warna 2, Warna 3]). Atmospheric lighting [Sumber dan arah cahaya]. Cel-shaded animation with rich gradient shading, expressive natural eye highlights, zero flat plastic shading, zero robotic stiffness.

[CAMERA SCIENCE & KINETIC PHYSICS]:
Fluid 24fps cinema motion, anime-standard shutter angle, zero temporal warping. [Lensa], cinematic shallow depth of field, sharp subject separation. Organic subtle human-held camera physics, smooth S-curve easing on all character micro-motions, strict 3D volume preservation across all shots.
```

---

## 🎞️ SPECIALIZED EXTENSIONS

### 1. Match-Cut Anime Montage (Pixar/Anime Commercial Style)
Jika meminta iklan sinematik dengan perpindahan lokasi yang dinamis:
- Gunakan **Hero Object (Match-Cut)**: Sebuah objek (misal bola voli atau kelopak bunga sakura) berada di posisi, skala, dan lintasan yang sama persis di setiap potongan scene.
- Potongan bergeser mengikuti ritme / beat musik.

### 2. Anime Storyboard Sheet / Shot Breakdown
Jika pengguna meminta "Storyboard Anime" berupa satu gambar grid:
- **Format:** `1 landscape sheet, 12 panels in 3x4 grid`.
- **Gaya Visual:** `Black-and-white, hand-drawn anime pencil sketch (Genga style), numbered panels with motion arrows.`
- (Ini adalah pengecualian untuk aturan larangan teks, karena nomor panel dan panah gerakan diperlukan).
