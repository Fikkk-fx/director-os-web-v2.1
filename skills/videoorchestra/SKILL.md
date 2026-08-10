---
name: "VideoOrchestra — Film Director Conductor v1.0"
description: >
  Orchestrates multi-clip cinematic productions by breaking long-form video projects into
  independent segments of 10 seconds or less. Manages duration breakdown, self-contained prompt
  construction, dynamic reference re-numbering, and provides editing/sequencing guides for
  seamless stitching. Works with Elite Screenwriter for story structure, CinSkill for cinematic
  quality, and Seedance Prompting Skill for individual prompt generation. Activates on any
  multi-clip or long-duration video production request.
---
# VideoOrchestra — Film Director Conductor v1.0

## Core Principles
- **THE 10-SECOND MINIMUM DURATION MANDATE PER CLIP (WAJIB MINIMAL 10 DETIK):**
  - Every single generated video clip (`KLIP 1`, `KLIP 2`, `KLIP 3`, etc.) MUST be orchestrated with a **MINIMUM DURATION OF 10 SECONDS** (e.g., `KLIP 1 [0s-10s]`, `KLIP 2 [10s-20s]`, `KLIP 3 [20s-30s]`) up to native single-clip durations of 20s or 30s.
  - Standalone 3-second or 5-second clips are STRICTLY BANNED as separate prompt blocks to eliminate excessive manual work (copy-pasting prompts, uploading assets, and stitching clips in video editors).
  - Internal pacing within the 10-second clip uses the *Dar-Der-Dor* progression (e.g. `[0s-3s]: Hook/Action`, `[3s-7s]: Escalation`, `[7s-10s]: Micro-Payoff/Cut`).
- **THE MULTI-DURATION ADAPTIVE CHARACTER CAP SCALE:**
  - **Tier 1 (Durasi 10s – 15s):** Character count wajib strictly between **1.900 – 1.950 Karakter (Max 2.000)**.
  - **Tier 2 (Durasi 16s – 20s):** Character count wajib strictly between **2.800 – 2.950 Karakter (Max 3.000)**.
  - **Tier 3 (Durasi 21s – 30s):** Character count wajib strictly between **3.700 – 3.950 Karakter (Max 4.000)**.
- **Reference Management**: When user provides reference images (@image1, @image2, etc.):
  - Mention each reference **exactly once** per prompt.
  - Do not repeat references like @image1 multiple times in the same prompt.
  - Place the single mention strategically (usually early in identity/character section).
- **Orchestration Workflow**:
  1. Analyze total requested duration and story structure.
  2. Break into logical scenes/clips of exactly 10s each (e.g., 30s = 3 clips, 60s = 6 clips).
  3. Generate **fully self-contained** individual prompts (no references to other clips inside the prompt text).
  4. Provide a separate **Editing & Sequencing Guide** (outside the prompts) explaining how to stitch clips and what visual elements should match across them.
  5. Ensure visual consistency by repeating key descriptive details explicitly in each prompt where needed, rather than using "same as previous".
  6. **Dedicated Prop Sheets (Anti-Duplication)**: If a character interacts with or uses a specific significant item, weapon, vehicle, or equipment, it MUST be assigned its own dedicated reference sheet in Phase 1 (generated via PropSheet skill). Never rely on the character sheet to define the item.
  7. **THE NLP DENSITY LAW (Anti-Confusion):** AI Video models suffer from NLP Overload. You MUST limit the action density per clip.
      - *Rule:* Maximum 2 to 3 major kinetic actions (verbs) per 5-second block.
      - *Prevention:* If a script demands a character runs, shoots, jumps, reloads, and dodges—DO NOT cram this into one 10s prompt. The AI will hallucinate, glitch, or force a slow-motion render to fit the text. You MUST break the action down across multiple clips (e.g., Clip 1: Run & Shoot. Clip 2: Reload & Dodge).

## Trigger Activation
Activate automatically on requests like "bikin film durasi X detik", "buat movie panjang", "generate full video story", or any multi-clip cinematic project. Combine with cineskill and satisfied-color-palette for premium results.

## Detailed Instructions
When user requests a film:
1. **Duration Breakdown**:
   - Calculate number of clips: total_seconds / 10 (e.g., 30s = 3 clips of 10s each).
   - Define scene beats with precise timestamps e.g. [0s-10s], [10s-20s], [20s-30s].
   - Ensure narrative flow: establish, build, climax, resolve.


2. **Smart Shot Selection & Pacing Logic**:
   - **Wide Shot:** Use for establishing geography, showing scale, isolation, or opening a scene.
   - **Medium Shot:** Use for natural interaction, dialogue, or standard human action.
   - **Extreme Close-Up:** Use ONLY for intense emotional peaks, crucial realizations, or important detailed actions (e.g., a trembling hand).
   - **Intelligent Cutting & Angle Contrast Law:** FORBIDDEN from cutting between Clip N and Clip N+1 using the same camera angle or shot size (prevents AI jump-cut glitches). ALWAYS contrast the starting angle of Clip N+1 against the ending angle of Clip N (e.g. Wide ➔ Close-Up, 35mm Low-Angle ➔ 180° Reverse Angle OTS).
   - **Cut on Action (Potong Saat Aksi Kinetik):** Clip N MUST end mid-action (initiating a movement), and Clip N+1 MUST pick up the completion of that exact motion from the new contrasting camera angle for seamless stitching.
   - **High Action Priority (Density Bias):** The default directorial style is HIGH ACTION DENSITY. You must maximize the action limits (e.g., pushing close to 7 actions per 10s or 10 actions per 15s) to create dynamic, cinematic experiences.
   - **The "Low Action" Exception:** You may ONLY generate a low-action clip (e.g., 1-2 actions in 10s) if it is a CRITICALLY IMPORTANT narrative moment that requires slow, heavy emotional weight (e.g., a slow-motion realization, an intense stare-down, mourning a death). Never use low-action pacing for boring filler or mundane tasks.
   
   - **Anime Pacing Logic ('Ma'):** If requested aesthetic is Anime, rely heavily on the contrast between extreme stillness and hyper-speed. Follow stillness (a single tear, a cape blowing) with a rapid burst of Sakuga action.
   - **Anime Invisible Stitching (Alternative Wipes):** For Anime, you can also use "The Energy Flash Cut" (ending and starting on a blinding white/colored impact flash) or "The Speed Line Wipe" (ending and starting in abstract speed lines) to stitch clips seamlessly.
   - **One-Take (Continuous Shot) Protocol:** If the user requests a "One-Take" or continuous unbroken shot that exceeds 15 seconds, you must use **Invisible Stitching**:
     - *End of Clip 1:* The camera must pan quickly into a blur (whip-pan) OR push into a dark object (someone's back, a wall, shadow) completely filling the frame.
     - *Start of Clip 2:* Must begin from the exact same blur/darkness and pull back to reveal the new action. This allows the editor to stitch them seamlessly.

3. **Prompt Construction Rules**:
   - Each prompt must be **completely self-contained** â€” the video model has no memory of other clips.
   - Do **NOT** write phrases like "same as previous clip", "continue from before", "same lighting/wardrobe as clip 1", "like the last scene", etc. inside any prompt.
   - Start with global style/identity + reference images (mention each reference **exactly once**).
   - Explicitly repeat important visual details (character appearance, lighting mood, color palette, environment) in every clip where consistency matters.
   - Detail scene-specific action, camera movement, timing.
   - Use cineskill engines for cinematic quality.
   - Keep each prompt under model limits.


4. **Action Density Protocol (Duration Matching):**
   - **Under-dense Rescue (15s rule):** If you allocate 15 seconds to a clip, but the written action is only "Character stares at the wall", the AI video model will stretch it into slow-motion or freeze. You MUST rescue this by artificially adding environmental or camera density to fill the time. Example: *"Character stares at the wall. The camera slowly pushes in for 15 seconds. Dust motes drift heavily in the air. The light from the window slowly crawls across the wall."*
   - **Over-dense Prevention (Max Action Limits):** You must strictly obey the maximum physical action limit based on clip duration to prevent the AI from melting or failing to render:
     - **5 seconds:** MAXIMUM 3 distinct actions.
     - **10 seconds:** MAXIMUM 7 distinct actions.
     - **15 seconds:** MAXIMUM 10 distinct actions.
     If a script or user requests more actions than the limit for a specific duration, you MUST either split the scene into multiple clips or use time-compression cinematic techniques (e.g., whip-pans, speed-lines) to bypass the limit safely.

5. **Node-Based API Workflow Protocol (V3.0)**:
   - For each clip, **only include the references (Image and Audio) that are actually used** in that specific scene.
   - **Absolute Dynamic Re-numbering**: You MUST re-number both Images and Audio sequentially starting from 1 (e.g., `@image1`, `@audio1`) to prevent gaps in node-based workflows (like ComfyUI). 
   - **CRITICAL PRE-FLIGHT CHECK**: Before writing ANY prompt in Phase 2, you MUST output explicit mapping logic blocks:
     `**[IMAGE MAPPING: Global @imageX -> Local @image1 (Name) | Global @imageY -> Local @image2 (Name)]**`
     `**[AUDIO MAPPING: Global @audioX -> Local @audio1 (Name) | Global @audioY -> Local @audio2 (Name)]**`
   - **Single-Clip Exemption (NUCLEAR — ZERO EXCEPTIONS):** You MUST NOT generate CharSheets, EnvSheets, or PropSheets in Phase 1 for ANY asset (character, environment, or prop) that appears in ONLY ONE clip. This is the #1 most common waste error. Before generating ANY sheet, you MUST perform a **Cross-Clip Appearance Audit**: scan ALL clips and count how many clips each asset appears in. If count = 1, DO NOT generate a sheet — describe it inline in [GLOBAL LOCK]. If count ≥ 2, generate a sheet. The ONLY exception is if the user explicitly requests a sheet for a specific asset.
      - **Example (CORRECT):** Film has 3 clips. Character A appears in Clip 1+2+3 → Generate CharSheet. Character B appears ONLY in Clip 2 → NO CharSheet, describe inline. Environment X appears ONLY in Clip 1 → NO EnvSheet. Prop Y appears in Clip 1+3 → Generate PropSheet.
      - **Example (WRONG):** Generating 5 CharSheets, 2 EnvSheets, and 1 PropSheet for a 2-clip film where most assets appear once. This wastes the user's time and AI credits.
    - **Audio Single-Clip Exemption:** Do NOT generate Audio Persona tags for characters who only speak in ONE clip. Let the native TTS engine handle them purely from the text description in [PROSE].
    - **"No Ref" (Zero Reference Protocol):** If the user explicitly requests "no ref" or "tanpa referensi", you MUST completely skip Phase 1 (Asset Generation). In Phase 2, you MUST NOT use any `@image` or `@audio` tags anywhere in the prompt. All descriptions must be purely textual without any `@` variables.

6. **Output Structure (2-Phase Protocol)**:
   - **PHASE 1: Asset & Audio Persona Generation Sheet (MULTI-CLIP ASSETS ONLY)**: Before writing video prompts, perform a **Cross-Clip Appearance Audit** to identify which assets appear in 2+ clips. ONLY generate sheets for those assets.
     - **Image Assets (MULTI-CLIP ONLY):** Write Image Generation Prompts (Midjourney/Flux style) ONLY for characters/environments/props appearing in 2+ clips. Use CharSheet/EnvSheet/PropSheet rules respectively.
        - **Environmental Asset Rule & SubEnvSheet Protocol**: Any location appearing in 2+ clips MUST get a dual-panel 16:9 EnvSheet. Furthermore, if a scene remains in the same room for **>15s (2+ clips)** or involves seating/OTS dialogue coverage (e.g. near TV, desk, dining table), you MUST generate dedicated **SubEnvSheets** (`EnvSheet_SubA_TVZone`, `EnvSheet_SubB_CharA_Angle`). In medium coverage clips, `@image_subenvX` MUST completely replace `@image_env1` to prevent dual reference conflict. Single-clip locations are described inline in [GLOBAL LOCK].
        - **PropSheet Enforcement**: Generate PropSheets ONLY for props that appear in 2+ clips AND are central story objects. Single-clip props are described inline.

       - **State-Change Protocol (Character & Environment Evolution):** If the script contains a [STATE CHANGE] tag for a character or environment (e.g. scar, damaged building, fire), you MUST generate State B Sheets (`@image1_Damaged`, `@image_env_Damaged`).
      - **Audio Assets (Vocal Persona):** Generate Voice Persona Descriptions ONLY for characters who speak in **multiple clips** (2 clips or more). Do NOT write separate dialogue instructions or ElevenLabs prompts. This is strictly a definition of the voice characteristics (vibrato, pitch, tone, raspiness) assigned to a tag (e.g., `Global @audio1 (Kenji)`). Use strictly numeric IDs for clean node parsing.

   - **PHASE 2: Video Orchestration**:
     - Summary: Total clips needed, total runtime, scene breakdown.
     - **Per-clip prompts**: Fully independent and self-contained — numbered clearly with timestamp e.g. [0-15s].
       - **SCENE-LEVEL RNG LOCK & MULTI-SCENE RESET PROTOCOL:** DILARANG KERAS merender ulang (RNG) lokasi, cuaca, baju, atau pencahayaan untuk klip yang berada di *scene* (adegan) yang sama! Anda WAJIB memutar dadu `[SYS-LOG: RNG INITIATIVE]` HANYA SATU KALI di klip pertama dari sebuah *scene*. Untuk klip-klip berikutnya dalam *scene* yang sama, Anda WAJIB mem-fotokopi persis isi dari `[GLOBAL LOCK]` dan `[RENDER & ACTING LOCK]` dari klip pertama. **MULTI-SCENE EXCEPTION:** Saat adegan berpindah lokasi (Scene A ➔ Scene B), Anda WAJIB menerbitkan tag `[SCENE BREAK / LOCATION RESET]`, memutar ulang RNG untuk lokasi baru, dan memperbarui `[GLOBAL LOCK]` untuk Scene B!
       - **MULTI-CHARACTER COMPRESSION LAW (3+ ACTORS):** Jika adegan melibatkan 3 atau lebih karakter utama sekaligus, kompres deskripsi fisik & pakaian menjadi 1 baris ringkas per aktor untuk mencegah kebocoran batas 2.000 karakter, memastikan panjang prompt tetap terkunci presisi di **1.900 – 1.950 karakter**.
       - **Explicit Tagging Override (The Rule of One)**: You MUST NEVER mention an `@image` tag more than once per clip to prevent severe AI hallucination and character bleed. If a shot is wide and multiple characters are visible, use their names and physical descriptions to identify them (e.g., "Kenji and Ryu are standing in the wide alley"), but DO NOT repeat their `@image` tags if they were already mentioned.
       - **Spatial Continuity & 180° Reference Vector Lock**: Map `@image_env1` ONLY for North/East-facing shots. When cutting 180° to a Reverse Angle (South/West-facing), you MUST switch the prompt reference tag to `@image_env2` (Shot B - Reverse Angle Ref). In medium coverage clips, `@image_subenvX` MUST completely replace `@image_env1`. Always anchor camera vector: `[CAMERA ORIENTATION: Facing EAST VECTOR wall relative to @image_env1]`.
         - **Master Lighting & Color Grade Protocol:** AI Video models are forgetful. If a scene occurs in a specific lighting environment (e.g., "Neon pink cyberpunk alley, heavy fog, high contrast"), you MUST copy-paste that EXACT lighting phrase into EVERY SINGLE CLIP PROMPT for that scene. Do not leave any clip without explicit lighting/weather instructions, or the AI will hallucinate different weather/lighting between cuts.
         - **Audio Integration & Anti-Lip-Sync Protocol**: 
           * **NATIVE LANGUAGE LOCK (CRITICAL):** You MUST explicitly define the language in the prose. 
           * If the dialogue is ON-SCREEN and requires lip-sync: write the dialogue normally and inject the language lock with the persona tag (e.g., `Kenji shouts (Local @audio1: fluent native Japanese, NO English) "Ikiro!"`).
           * If the dialogue is (O.S.) or (V.O.): You MUST include the dialogue text for native TTS engines, but you MUST forcefully lock the on-screen character's mouth to prevent the AI from lip-syncing them. (e.g., `Voice O.S. (Local @audio1: fluent native Japanese, NO English): "System breach." [CRITICAL PHYSICS: Kenji's mouth is strictly CLOSED, zero lip movement, jaws locked, he is only listening]`).
         - **MANDATORY PHYSICS VECTORS COMPRESSION (MULTI-CLIP ONLY):** Dalam mode multi-clip, setiap klip WAJIB menyertakan vektor fisika spasial SETELAH blok `[LENS & CAMERA PHYSICS LOCK]`. Tag ini berfungsi sebagai "GPS spasial" agar AI Video Engine tidak berhalusinasi arah pandang atau pencahayaan antar klip. Untuk menghemat batas 2000 karakter, Anda WAJIB menggabungkannya ke dalam satu baris dengan format:
         **`[PHYSICS VECTORS]: Gaze: [val] | Body: [val] | Compass: [val] | Momentum: [val] | Light: [val] | Prox: [val] | Relativity: [val]`**
         (Contoh: `[PHYSICS VECTORS]: Gaze: off-screen right | Body: 3/4 screen-right | Compass: toward camera | Momentum: slow pour | Light: Night mercury green | Prox: 0.8m | Relativity: camera slow push-in subject micro`) 
     - **Editing & Sequencing Guide** (separate section after all prompts):
       - How to stitch the clips (recommended order, transitions, crossfades).
       - Which visual elements must match across clips (lighting, color grade, wardrobe, environment, character details) — so the user can check/adjust during editing.
                - Any post-production notes (sound design, music sync, etc.).
         - **Audio Editing Guide for (V.O.) and (O.S.):** If a clip contains Voice-Over or Off-Screen dialogue, explicitly instruct the user: *"RENDER CLIP INI TANPA GERAKAN MULUT (Bungkam). Sinkronisasi suara (O.S.) atau (V.O.) ditaruh di layer audio terpisah di aplikasi editing Anda (CapCut/Premiere)."*

## Best Practices
- **Each prompt is independent** â€” never assume the video model can "see" or remember previous clips. All consistency must come from within the prompt itself (strong descriptions + reference images).
- Repeat key visual details explicitly across prompts when continuity is important (this is normal and expected).
- Prioritize story coherence and clear visual continuity over trying to make every single clip perfect in isolation.
- For very long films (>60s), suggest generating in batches and doing iterative refinement between batches.
- Always confirm with user before generating multiple clips.
- After generation, the **Editing & Sequencing Guide** becomes the main tool for the user to achieve a seamless final film.

This skill turns single-clip limitations into full cinematic productions.

## Grounded Realism Enforcement (MANDATORY)

Every clip prompt generated by VideoOrchestra MUST enforce grounded realism:

- **Motion**: All human motion must show weight, inertia, momentum, and physical consequence. No floaty, weightless, or robotic movement. Every action has wind-up and follow-through. Walking has heel-to-toe contact and arm counter-swing.
- **Texture**: Every prompt must specify natural skin texture (visible pores, subsurface scattering), individual hair strands, fabric weave/fiber detail, and material-appropriate surface behavior. No plastic skin, no wax texture, no airbrushed smoothness.
- **Camera**: Camera behavior must feel like a real human operator — subtle breathing, micro-reframe corrections, organic focus hunting. No perfectly smooth gimbal movement unless explicitly a steadicam shot.
- **Human Behavior**: Characters must show natural blinking, breathing, weight shifts, idle fidgeting, and micro-expressions. No statue-like stillness, no dead eyes, no robotic precision.
- **Environment**: Surfaces show natural wear, dust, and age. Materials interact with light correctly (metal reflects, wood absorbs, glass refracts). Wind affects all elements consistently.
- **Anti-AI Words**: Never use "beautiful", "perfect", "stunning", "masterpiece", "8K ultra HD" in any clip prompt. Replace with specific, technical, observable descriptions.
- **Priority Rule**: Physics > Realism > Story > Style. Only explicit "anime style" requests bypass grounded enforcement.

Every clip must produce video indistinguishable from real footage shot by a real camera operator capturing real people in a real location.

## CharSheet Integration

When character reference sheets are available (generated by CharSheet skill):
- Use CharSheet images as `@image` references for identity lock across all clips.
- CharSheet provides 6-panel references (extreme close-up face, left profile, right profile, medium shot, front full body, back full body).
- Reference the appropriate CharSheet view based on the clip's camera angle for strongest identity match.
- Repeat key identity descriptors from CharSheet in every clip prompt — never rely on "same as previous."

## Full Pipeline

```
CharSheet (character reference images)
    ↓
WriterSkill (story/script with duration-aware timing)
    ↓
CinSkill (cinematic direction — 23 engines)
    ↓
PromptSkill (individual clip prompt compilation)
    ↓
VideoOrchestra (THIS SKILL — multi-clip orchestration + sequencing)
    ↓
AI Video Generation → Editing & Sequencing Guide → Final Film
```








