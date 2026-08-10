---
name: "ColorSkill — Cinematic Color Science & Film Stock Emulation Engine v1.0"
description: >
  Generates precise, physically motivated color grading and film stock emulation parameters
  (Kodak Vision3 500T 5219, Fuji Eterna 250D, ARRI LogC4, Technicolor 2-Strip, Chiaroscuro Amber)
  to give video prompts billionaire-level color separation without muddy AI blending.
---

# 🎨 COLOR-SKILL V1.0: CINEMATIC COLOR SCIENCE & FILM STOCK ENGINE

## PURPOSE
To force AI Video Generators to render **striking, harmonious, physically motivated color separation** and precise film stock emulation. Eliminates desaturated, pale, or muddy AI color blending.

---

## 🎞️ MASTER FILM STOCK & COLOR SCIENCE DATABASE

### 1. KODAK VISION3 500T 5219 (Tungsten Warmth & Rich Shadows)
- **Vibe:** Cinematic Hollywood Warmth, Golden Hour, Intimate Drama, Retro Noir.
- **Color Science:** Warm golden-amber tungsten midtones (+3200K), lifted deep teal-obsidian shadows, rich warm skin tones, halation glow around practical bulbs.
- **Sintaks Injection:** `"Shot on 35mm Kodak Vision3 500T 5219 film stock, warm 3200K tungsten midtones, deep obsidian-teal shadow separation, subtle optical halation around light sources."`

### 2. FUJI ETERNA 250D (Desaturated Poetic Realism)
- **Vibe:** Asian Auteur Cinema (Kamila Andini, Edward Yang), Melancholy, Rain, Atmospheric Quiet.
- **Color Science:** Soft muted pastel palette, desaturated moss green & cyan shadows, gentle highlight roll-off, naturalistic cool skin tones.
- **Sintaks Injection:** `"Shot on 35mm Fuji Eterna 250D film stock, soft desaturated pastel color science, muted cyan-moss shadows, gentle highlight roll-off, poetic atmospheric realism."`

### 3. PANAVISION MILLENNIUM DXL2 8K LARGE FORMAT (The King of Organic Human Latitude)
- **Vibe:** Hollywood Masterclass Realism, Intimate Human Texture, Organic 3D Depth.
- **Color Science:** 16-bit RED Monstro 8K sensor profile transformed to Panavision Light Iron Color 3, ultra-organic skin latitude, creamy highlight roll-off, natural micro-contrast.
- **Sintaks Injection:** `"Shot on Panavision Millennium DXL2 8K Large Format cinema camera, Panavision Primo 70 prime lens, Light Iron Color 3 science, natural creamy highlight roll-off, ultra-organic human skin latitude."`

### 3b. PANAVISION SYSTEM 65MM IMAX (The Celluloid Emulsion Sovereign)
- **Vibe:** Christopher Nolan Epic Realism, Physical Silver Halide Depth, Infinite Texture.
- **Color Science:** 65mm analog celluloid chemical emulsion, organic silver halide grain, natural biological skin tone warmth, zero digital plastic clipping.
- **Sintaks Injection:** `"Shot on 65mm IMAX cinema film stock, Panavision System 65 anamorphic optics, natural silver-halide organic grain, infinite depth texture, breathtaking human physical presence."`

### 4. ARRI LOGC4 TO REC.709 (Modern Billionaire Commercial Grade)

### 4. TECHNICOLOR 2-STRIP VINTAGE (1940s-1950s Avant-Garde)
- **Vibe:** Vintage Nostalgia, Conceptual Surrealism, High Contrast Retro.
- **Color Science:** Extreme separation between Cyan-Teal and Crimson-Red, muted yellows, zero blue saturation.
- **Sintaks Injection:** `"Technicolor 2-strip color process emulation, extreme contrast separation between crimson red and deep teal cyan, lifted vintage blacks."`

### 5. CHIAROSCURO AMBER & MERCURY TROPICAL (Nusantara Crime / Wong Kar-Wai)
- **Vibe:** Indonesian Crime Noir, Wong Kar-Wai Rain, Night Markets, Warung Remang.
- **Color Science:** Sodium vapor 2700K amber glow clashing with mercury vapor desaturated green-blue shadows.
- **Sintaks Injection:** `"Chiaroscuro sodium vapor 2700K amber key light clashing with mercury vapor desaturated teal-green shadows, high-contrast triadic color separation."`

---

## 🎨 TRIADIC COLOR LOCK INJECTION FORMULA
Setiap prompt video WAJIB mengunci 3 warna utama di `[COLOR GRADE LOCK]`:
```text
[COLOR GRADE LOCK]: Primary Triadic Separation (Color 1: Key, Color 2: Fill/Shadow, Color 3: Accent).
```
