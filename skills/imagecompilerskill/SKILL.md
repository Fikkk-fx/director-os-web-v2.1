---
name: "ImageCompilerSkill — Midjourney v6.1 & Flux.1 Reference Prompt Optimizer v1.0"
description: >
  Generates hyper-optimized image prompts specifically formatted for Midjourney v6.1 and Flux.1 Dev/Schnell
  to produce clean, unsegmented, zero-defect character, environment, and prop reference sheets.
---

# 📸 IMAGE-COMPILER-SKILL V1.0: MIDJOURNEY & FLUX OPTIMIZER

## PURPOSE
To format all Phase 3 Pre-Production Reference Prompts (`CharSheet`, `EnvSheet`, `PropSheet`, `SubEnvSheet`) using exact parameters for **Midjourney v6.1** and **Flux.1 Dev/Schnell**. Ensures 100% clean, unsegmented, high-fidelity reference images without text labels, grids, or floating artifacts.

---

## 🎯 MODEL-SPECIFIC PROMPT PARAMETERS

### 1. MIDJOURNEY V6.1 SYNTAX ARCHITECTURE
- **Format:** `[Aesthetic & Subject] + [Lighting & Materials] + [Clean Frame Enforcement] + [Parameters]`
- **Mandatory Parameters:**
  - `--ar 16:9` (untuk Environment, SubEnvSheet, PropSheet)
  - `--ar 16:9` (untuk 3-Panel Raw UGC CharSheet)
  - `--style raw` (Wajib untuk mematikan beautification AI Midjourney)
  - `--stylize 250` (Keseimbangan realisme & kebebasan estetika)
  - `--v 6.1` (Generasi Midjourney terbaru)

```text
Raw UGC smartphone photo aesthetic, authentic unedited skin texture, natural ambient studio light. A clean 3-panel casting character reference sheet on a pure solid white background. Panel 1: EXTREME CLOSE UP of a 30-year-old Indonesian woman (@image1) with faint epidermal pores, unpolished realism. Panel 2: FRONT FULL BODY wearing a dark indigo denim jacket, black trousers, and boots. Panel 3: BACK FULL BODY from behind. Shot on iPhone 15 Pro main camera 24mm f/1.7, unpolished raw UGC aesthetic, zero plastic skin, zero airbrushing, crisp solid white background. --ar 16:9 --style raw --v 6.1
```

---

### 2. FLUX.1 DEV / SCHNELL SYNTAX ARCHITECTURE
- **Format:** `[Photorealistic / Raw Photography Tag] + [Natural Descriptive Language] + [Optics & Sensor] + [Clean Frame]`
- **Mandatory Keywords:**
  - `Raw photography, unedited 35mm film photo, natural skin texture, visible pores`
  - `Shot on Leica SL2 50mm f/1.4 lens, natural grain, zero plastic skin, zero digital airbrushing`
  - `Single clean 16:9 photo frame, no text, no borders, no grid lines`

```text
Raw photography, unedited 35mm film photo of a 1990s Indonesian lower-middle-class dining room. Teak wood table in the center with enamel mugs, overhead 2700K warm tungsten bulb glow. Boxy Sony Trinitron 29-inch CRT TV on the screen-right wall with subtle scanline glare. Single teak door on screen-left. Shot on Leica SL2 35mm f/1.4 lens, natural grain, zero plastic render, single clean 16:9 photo frame, no text, no borders.
```

---

## 🛑 THE CLEAN FRAME ENFORCEMENT LAWS
1. **Zero Text Labels:** DILARANG menyuntikkan kata "North", "South", "2D Map", "Blueprint" ke dalam prompt gambar.
2. **Zero Multi-Panel Borders:** Selalu sertakan frasa `"clean unsegmented single frame, zero borders, zero grid lines"`.
3. **Solid Background for CharSheets:** CharSheet live-action WAJIB `"pure solid white background"`.
