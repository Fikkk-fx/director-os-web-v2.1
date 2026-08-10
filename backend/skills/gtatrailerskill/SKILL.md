---
name: GTATrailerSkill — The Photoreal-Painterly Hybrid Engine
description: Engine estetika untuk merender gaya "GTA 6 trailer", perpaduan 3D photorealistic dengan sentuhan painterly halus di pinggiran objek. Menitikberatkan pada density crowd, urban motion blur, lighting overcast/golden hour cinematic, dan komposisi jalanan padat (seperti London atau Vice City). Sangat cocok untuk merender kerumunan hyper-real dengan karakter spesifik di tengahnya.
---

# 💥 GTA-TRAILER-SKILL: THE PHOTOREAL-PAINTERLY HYBRID ENGINE
**Versi:** 1.0 (Urban Cinematic Density Edition)
**Fungsi Utama:** Memaksa AI Video/Image Generator (Midjourney v7, Flux 1.1 Pro Ultra, Kling 3.0, Veo 3.1) untuk merender dalam gaya turunan dari trailer GTA VI Desember 2023. Gaya ini bukan murni foto asli, melainkan *hyperrealistic 3D game-engine render* yang dicampur sentuhan painterly halus, khususnya pada pinggiran objek (edge smear), dipadukan dengan motion blur pada kerumunan kota yang padat.

---

## 🛑 THE AESTHETIC MANDATE (ANTI-PURE-PHOTO & ANTI-FLAT-3D)
- **DILARANG KERAS** merender 100% foto tajam seperti jepretan kamera asli (sharp photo look) tanpa sentuhan render engine.
- **DILARANG KERAS** menggunakan shading kartun, flat shading, atau oversaturated colors.
- **WAJIB** menggunakan gaya hibrida photoreal-painterly dengan *subsurface scattering* dan *ray tracing* khas Unreal Engine 5 / Rockstar Advanced Game Engine (RAGE).

---

## 👁️ BAGIAN A: THE AESTHETIC & RENDER LOCK

### 1. THE HYBRID RENDER SIGNATURE
*   **Vibe:** Realisme yang di-elevasi (hyper-reality) dari engine game next-gen. Tekstur tajam di tengah, sedikit brush-stroke/smeared di pinggiran, *wet-look specular sheen* pada bodi kendaraan atau aspal basah.
*   **[RENDER & ACTING LOCK] INJECTION:**
    `hyperrealistic 3D game-engine cinematic render, GTA 6 trailer aesthetic, painterly-photoreal hybrid rendering, subtle brushstroke edge texture, Unreal Engine 5 render, ray tracing, global illumination.`
*   **Color Grading:** Desaturated cool-neutral base dengan warm highlight (golden hour/pagi) atau soft overcast daylight. Sedikit teal di bayangan (muted cinematic).

### 2. THE URBAN DENSITY
*   **Vibe:** Jalanan kota sibuk (contoh: jalanan London dengan double-decker bus, black cab, zebra cross) dengan lapisan manusia (layered depth planes).
*   **Injection Tambahan:**
    `dense crowd of pedestrians in business attire, layered depth planes, urban, grounded, cinematic tension, quiet observational mood.`

---

## 💨 BAGIAN B: KINETIC MOTION & VFX

### 1. URBAN MOTION BLUR (The Living Street)
Kunci dari look GTA Trailer adalah dunia yang terasa hidup dan sibuk, dengan karakter utama (atau focal point) yang terkunci tajam di antara keramaian yang bergerak.
*   **[PHYSICS VECTORS] / [VFX]:**
    `foreground motion blur on passing crowd, motion blur streaking on periphery, light haze and atmospheric scattering, subtle chromatic aberration on edges, soft bloom on highlight reflections, painterly edge smear.`

---

## 🎥 BAGIAN C: CAMERA & COMPOSITION

### 1. STATIC STREET WALK (The Observer)
*   Komposisi deep street perspective, banyak layer.
*   `shallow depth of field, foreground motion blur on passing crowd, 35mm street lens, rule of thirds, deep street perspective, soft overcast daylight.`

### 2. FPV MOTION SHOT (The Rider)
*   Gaya point-of-view bergerak menembus lalu lintas yang padat.
*   `first-person POV, gloved hands gripping motorcycle/moped handlebar, looking down through crowded narrow street, buildings towering on both sides, weaving through traffic, motion blur streaking on periphery, low sun glare reflecting off wet asphalt.`

---

## ⚙️ BAGIAN D: ENGINE PARAMETERS & NEGATIVE PROMPTS

### 1. MIDJOURNEY PARAMETERS
*   **Model:** Wajib menggunakan `--v 7`
*   **Style Strength:** `--stylize 600` hingga `--stylize 750`.
    *(Catatan: Stylize tinggi diperlukan untuk mendapatkan look painterly hybrid. Terlalu tinggi akan menjadi lukisan penuh, terlalu rendah akan menjadi foto polos).*
*   **Aspect Ratio:** `--ar 16:9` atau `--ar 21:9` (Cinematic widescreen).

### 2. NEGATIVE PROMPT (Untuk SD/Flux/Engine dengan Negative Prompt)
*   `watermark, logo, text overlay, signature, copyright mark, oversaturated, cartoonish flat shading, sharp photo look, video game HUD, low quality, blurry face, deformed hands`

---

## 🧩 THE CHARACTER INSERTION WORKFLOW
Untuk menyisipkan karakter spesifik (misal: gothic, fantasy, atau custom avatar) ke dalam kerumunan real-world ini:
1. **Fase Pra-Produksi:** Generate karakter terlebih dahulu secara terpisah menggunakan Character Sheet prompt (Kunci: warna outfit, wajah, aksesoris).
2. **Fase Komposisi:** Sisipkan referensi karakter ke dalam prompt utama `GTATrailerSkill` dengan instruksi eksplisit:
   `[INSERTION LOCK]: Insert this character standing among the crowd. The character must be rendered perfectly sharp and in focus, while the background and foreground pedestrians have heavy motion blur.`
