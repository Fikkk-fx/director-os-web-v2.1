---
name: "AudioSkill — Cinematic Sound Design Engine v1.0"
description: >
  Generates professional-grade audio prompts for Voice Acting (ElevenLabs), Foley/SFX (ElevenLabs SFX),
  and Music Scoring (Suno/Udio). Enforces HDR audio mixing, uncompressed formats, dynamic range, and
  emotional pacing.
---

# AudioSkill — Cinematic Sound Design Engine v1.0

> [!WARNING]
> **V19.1 DEPRECATION NOTICE (PURE VIDEO LAW)**
> Do NOT use this skill for standard AI Video Orchestration workflows. Under V19.1, AI video engines process audio natively from text prose. Generating separate ElevenLabs/Audio parameters is strictly forbidden unless the user explicitly asks for a standalone audio/voiceover project.

## Purpose
Visuals are only 50% of the cinematic experience. This skill dictates how to write prompts for AI audio generators to produce studio-quality soundscapes, voice acting, and musical scores.

### 🛑 THE ANTI-CHEESE AUDIO MANDATE (DEFAULT: NO MUSIC)
1. **No Music by Default:** Unless the user explicitly requests a soundtrack or music video, DO NOT generate background music. Rely entirely on rich Foley, ambient room tone, and dialogue to carry the scene. Music often makes AI videos feel like cheap commercials.
2. **The "Anti-Whip" Rule:** Absolutely ban all generic YouTube-style transition sound effects, specifically "whip" and "whoosh" sounds. They destroy cinematic realism.
3. **Subtle SFX Scoring:** If the scene needs audio tension, use low-frequency rumbles, ambient drones, or environmental sounds (e.g., distant thunder, ticking clock) rather than traditional musical instruments. SFX must not be overly distracting.

---

## 1. Voice Acting Engine (ElevenLabs/Play.ht)

Never just write "A man talking." Voice prompts must dictate the emotional performance, recording environment, and timbre.

### Voice Prompt Structure:
`[Character Type], [Emotional State], [Vocal Timbre], [Pacing/Flow], [Micro-expressions/Breathing]. [Technical Spec].`

### Rules:
- **Language & Phonetic Lock (CRITICAL):** If dialogue is NOT in English (e.g., Japanese, Indonesian), you MUST explicitly state the native language (e.g., "Speaking in fluent native Indonesian"). For Indonesian TTS, you MUST import respelling anchors from `PhoneticSkill` to distinguish 'e' pepet `[ə]` from 'e' taling `[e]/[ɛ]` (e.g., respell "pepet" as "peupet" if needed) to prevent ElevenLabs mispronunciations.
- **Timbre:** Raspy, booming, breathy, squeaky, resonant, nasal.
- **Pacing/Flow:** Machine-gun fast, slow and deliberate, trembling, hesitant, arrogant flow.
- **Micro-expressions:** Include physical vocalizations in the description (e.g., "heavy breathing between words", "stifling a sob", "gritting teeth").
- **Technical Spec (MANDATORY):** End every voice prompt with: `Wide dynamic range audio, uncompressed HDR mix, zero audio clipping.`

**Example:**
> *Prompt:* "Middle-aged gruff male voice, suppressed rage. Raspy and resonant timbre. Slow, deliberate pacing in fluent native Indonesian with heavy breathing between words like he is gritting his teeth. Wide dynamic range audio, uncompressed HDR mix, zero audio clipping."

---

## 2. Foley & SFX Engine (ElevenLabs SFX)

Sound effects must be layered and physically grounded.

### SFX Prompt Structure:
`[Primary Sound Action], [Material Collision], [Reverb/Environment], [Technical Spec].`

### Rules:
- **Material Collision:** What is hitting what? (e.g., "Heavy metal boot scraping against wet asphalt and rusted iron").
- **Frequency Layers:** Always combine low frequencies (sub-bass drop, heavy thud) with high frequencies (glass shatter, sharp hiss).
- **Technical Spec (MANDATORY):** End every SFX prompt with: `Cinematic theatrical mix, heavy sub-bass, Dolby Atmos style spatial panning.`

**Example:**
> *Prompt:* "Massive cinematic sci-fi explosion. High-frequency electrical glass shattering followed immediately by a deafening low-frequency sub-bass shockwave. Ominous metallic debris raining down on wet asphalt and oxidized steel. Cinematic theatrical mix, heavy sub-bass, Dolby Atmos style spatial panning."

---

## 3. Musical Scoring Engine (Suno/Udio)

Music dictates the emotional subtext of a scene.

### Rules:
- **BPM (Beats Per Minute):** Dictate the speed. (e.g., 60 BPM for sad/ambient, 140+ BPM for action/fight scenes).
- **Instrumentation:** Specify the exact instruments (e.g., "distorted electric cello", "808 sub-bass synth", "massive taiko drums").
- **Structure:** Use tags like `[Build up]`, `[Drop]`, `[Crescendo]` to guide the AI's composition flow.

**Example:**
> *Prompt:* "[Instrumental] Epic cyberpunk battle theme. 145 BPM. Aggressive distorted 808 sub-bass, frantic analog synth arpeggios, and massive taiko drums. [Build up] into a chaotic [Drop] with soaring distorted electric cello."

---

## 5. Master Audio High-Loudness & Spatial Glue Engine

### 🔊 1. Maximum Perceived Loudness & High-Gain Protocol (Volume Loud & Clean)
To ensure output audio is naturally loud, punchy, and high-volume without any volume drops or clipping distortion:
- **High-Gain Master Spec:** Always specify: `Maximum perceived loudness master, punchy high-gain audio mix, full-bodied uncompressed master, clean peak limiter, zero digital distortion`.
- **Analog Warmth Calibration:** `Warm Neve 1073 preamp saturation, De-Essed silky highs, zero digital sibilance, full-bodied 200Hz chest resonance`.

### 🎛️ 2. Audio Glue & Dialogue Dominance Protocol (Bikin Audio Nyatu & Vokal Jernih)
To prevent dialogue from sounding drowned out or disconnected:
- **Matched Acoustic Environment (Reverb Match):** ALL audio prompts in a scene MUST share the exact same environmental acoustic signature. (e.g. `Acoustic Reverb Lock: Humid Teak Warehouse, 1.4s Decay, Early Reflections`).
- **Dialogue Dominance & Vocal Presence:** `Primary Vocal Priority, center channel vocal anchor, crystal-clear dialogue presence, dynamic frequency separation for speech intelligibility`.
- **Master Bus Glue Directive:** `VCA Master Bus Compression (2:1 Ratio, 30ms Attack), cohesive spatial glue, integrated 3D soundstage`.




