---
name: "AnimeSkill — The Pure 2D Sakuga & Cel Animation Engine v1.0"
description: >
  Specialized master engine for generating pure 2D traditional Japanese anime, Sakuga keyframe animation, 
  cel-shaded production stills, and manga video prompts using Industry-Standard Technical Medium Specification Tokens.
---

# AnimeSkill — The Pure 2D Sakuga & Cel Animation Engine v1.0

## 1. PURPOSE & THE ZERO-3D PARADIGM SHIFT
AI Video and Image Generators (Kling, Sora, Seedance, Runway, Midjourney, Flux) are trained on vast datasets containing 3D CGI video game cutscenes and PBR renders. If given natural language prompts describing lighting (e.g. `volumetric depth`, `6500K lighting`, `specular reflections`), the AI's text encoder maps the scene to 3D pipelines.

**AnimeSkill** enforces **The Technical Medium Specification Law**: It completely purges all weak negative commands (like "no 3D") and replaces them with **Authoritative Technical 2D Medium Specification Tokens** and **Sakugabooru-style Animation Shorthand Tags** to guarantee 100% flat 2D raster rendering.

---

## 2. THE SAKUGABOORU TECHNICAL TAG DATABASE

To force the AI text encoder into flat raster rendering, compile prompts using these explicit technical tags from animation datasets:

### A. Kinetics & Action Physics (Fisika Gerak Laga)
- **`impact_frames`** (Brief high-contrast black/white flashing frames to accentuate hits).
- **`obake_smears`** / **`smear_frames`** (Hand-drawn elongated motion smears replacing optical blur).
- **`speed_lines`** / **`shuuchuusen`** (Action lines radiating from center to convey high velocity).
- **`blocky_cube_debris`** (Yutaka Nakamura-style blocky, square debris shards flying off surfaces).
- **`paint_splatter_impact`** (Brutal hits rendered as flat 2D ink/paint splatters).
- **`smoky_explosions`** (Thick, flat, balloon-like hand-drawn smoke plumes).

### B. Linework & Contour Anatomy (Anatomi Garis Tinta)
- **`clean vector contour line art`** / **`bold outlines`** (Solid black outlines on all assets).
- **`tsukegami ink contours`** (Varying ink line weight: thick outer edges, thin inner facial lines).
- **`zero-blend black contours`** (Completely solid ink lines that never blend with background color).
- **`constant line-weight ink stroke`** (Maintains clean flat lines without 3D depth shadowing).

### C. Shading & Color Palette (Pewarnaan & Shadow Cel)
- **`cel shading`** / **`two-tone shading`** (Sharp shadow cuts without soft gradients).
- **`flat color fills`** / **`flat matte paint fills`** (Untextured matte color planes).
- **`limited color palette`** (Blocks AI from generating millions of gradient shades).
- **`flat tone shadow cutlines (kage-gaki)`** (Technical anime shadow shape cuts).
- **`solid white specular linework`** (Pantulan cahaya berupa sapuan garis putih padat).

### D. Broadcast Format Anchors (Jangkar Format Penyiaran)
- **`anime screencap`** / **`screencap`** (Forces format of a television broadcast capture frame).
- **`production still`** / **`still from anime episode`** (Forces flat 2D raster cel format).
- **`retro anime still`** (Invokes pre-CGI traditional animation database properties).

---

## 3. THE 4 GREAT ANIME DIRECTOR ARCHETYPES

Steer visual style by invoking these technical studio/director profiles:

### 1. MAPPA / Wit / Ufotable Modern Action Seinen (Crisp & High-Budget)
- *Aesthetic:* `modern high-budget 2D TV anime screencap, crisp digital cel paint fills, sharp clean outlines, dramatic digital shadow cutlines, high visual density`.
- *Use Case:* High-intensity modern martial arts, gritty crime, realistic urban sequences.

### 2. Studio Bones Sakuga Action (The Yutaka Nakamura Cadence)
- *Aesthetic:* `peak 2D Sakuga animation keyframe, blocky cube debris shards, dynamic impact frames, extreme perspective warp, exaggerated Obake smears, hand-drawn motion velocity`.
- *Use Case:* Destructive action, superpowered hits, complex camera sweeps.

### 3. Studio Ghibli / Kyoto Animation Atmospheric (Organic & Detailed)
- *Aesthetic:* `retro hand-painted anime background still, digital gouache painted scenery, atmospheric sunlight shafts (Komorebi), delicate line weights, soft organic flat colors`.
- *Use Case:* Quiet dramatic dialogue, emotional beats, outdoor natural settings.

### 4. Gainax / Trigger Kinetic Retro Cel (Stylized & Stylistic)
- *Aesthetic:* `1990s Gainax retro anime still, thick black ink strokes, high-velocity speedlines, exaggerated perspective distortion, high contrast color block fills`.
- *Use Case:* Over-the-top comedy, retro sci-fi, chaotic combat.

---

## 4. THE ANIME IMAGE COMPILER GUIDE (Midjourney Niji v6 & Flux)

When generating character reference sheets (`CharSheet`), environment references (`EnvSheet`), or prop sheets (`PropSheet`), apply these technical structures:

### A. Character Model Sheet (`CharSheet`):
```text
[Subject Description], 2D anime screencap, character model sheet, multi-angle view sheet, front view, side profile, clean digital outline ink lines, flat shading, flat color fills, pure solid white background, no shadows --niji 6 --style raw --s 200
```

### B. Environment Reference Sheet (`EnvSheet`):
```text
[Environment Description], 2D anime screencap background layout, hand-painted digital art layers, flat colors, poster color scenery painting --niji 6 --style raw
```

---

## 5. THE VIDEO COMPILER GUIDE (Kling, Sora, Runway, Seedance)

### A. Frame Rate Modulation (Cadence)
To prevent the AI from generating smooth 3D interpolation ("tweening"), which creates a fluid CGI/3D look, explicitly dictate the keyframing cadence in `[CAMERA SCIENCE & KINETIC PHYSICS]` using positive technical tags:
*   *Acting/Dialogue Cadence:* **`animating on twos with a hand-drawn 12fps motion cadence`**, **`staggered 12fps hand-drawn keyframe pacing`**, **`limited-rate frame-by-frame cadence`**, **`discrete cell updates`**.
*   *Action/Combat Cadence:* **`kinetic staggered 12fps hand-drawn keyframe pacing`**, **`hand-drawn Obake smear interpolation replacing fluid motion blur`**, **`impact frames`**.
*   *Anti-Tweening Rules:* Never allow smooth fluid motions. Command: **`limited frame rate cadence, discrete keyframed intervals, hand-drawn 12fps timing`** (strictly mandate 12fps, zero 24fps elements).

### B. 2D Camera Motion Mechanics
AI Video engines default to 3D camera tracks. Ban Dolly and Crane track syntax, and replace them with **2D multi-plane panning** terms:
*   *Instead of Dolly In:* **`Dynamic 2D camera push-in tracking, background layer parallax`**.
*   *Instead of Pan/Tilt:* **`Multi-plane 2D camera sweep, 2D panning layout, background panning parallax`**.

---

## 6. MASTER SANDBOX RULES (ANTI-BLEED SAFEGUARDS)

To ensure this rich database never leaks or corrupts other genres:
1.  **Strict Isolation Check:** The compiler MUST check if the project genre is `2D ANIME / SAKUGA`. If not, all terms in this document are **BLOCKED** from the prompt.
2.  **No Camera Science Bleed:** Live-action terms like `cinéma vérité`, `Panavision Millennium`, `f/1.4 lens`, or `35mm lens` are strictly forbidden inside anime prompts.
3.  **No PBR Shading Bleed:** Terms like `ambient occlusion`, `subsurface scattering`, `volumetric light`, `photorealistic`, or `Kelvin temperatures` are strictly forbidden inside anime prompts.

---

## 7. THE MASTER ANIME STYLE INHERITANCE & TEXTURE SYNCHRONIZATION LAW

To prevent style collisions between Text-to-Image reference sheets (`CharSheet`, `EnvSheet`, `PropSheet`) and Image-to-Video / Text-to-Video prompts:
1. **Phase 0 Master Style Anchor:** The specific anime director/studio archetype selected in Phase 0 (e.g. MAPPA Modern Seinen, Studio Trigger Retro Cel, Studio Bones Sakuga, Studio Ghibli Gouache) MUST be logged in `[SYS-LOG: RNG INITIATIVE]` as `[MASTER ANIME STYLE LOCK]`.
2. **Mandatory Inheritance across All Phases:** EVERY single prompt generated in Phase 3 (reference sheets) AND Phase 4 (video prompts) MUST explicitly inherit the exact same `[MASTER ANIME STYLE LOCK]` technical specification tokens.
3. **Zero Style Collision Guarantee:** This guarantees 100% texture, line-weight, shading, and aesthetic synchronization between Midjourney Niji / Flux reference sheets and Kling / Sora / Seedance video generation!
