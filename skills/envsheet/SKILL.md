---
name: "EnvSheet — Cinematic Environment Sheet Generator v2.0"
description: >
  Generates clean, unsegmented, spatial-locked dual environment reference sheets (Master Wide Shot + Reverse Angle Shot) for AI video pipelines.
  Eliminates grid splits, 2D blueprint maps, and text artifacts to ensure 100% consistency across AI Video Generators (Kling, Sora, Runway, Seedance).
---

# EnvSheet — Cinematic Environment Sheet Generator v2.0 (Dual Clean Master Shot Protocol)

## Purpose

Generate **clean, spatial-locked environment references** optimized for modern AI video production engines (Kling 1.5, Sora, Seedance 2.0, Runway Gen-3). 

### ⚠️ THE V2.0 SHIFT: WHY 7-PANEL GRIDS & MAPS WERE PURGED
In older workflows, 7-panel grids and top-down 2D blueprint maps were used to define room layout. **HOWEVER, AI Video engines fail on multi-grid images**, causing split-screen glitches, text bleed, and morphing geometry when fed into video prompts as `@image` references. 

**EnvSheet v2.0** solves this by producing **two clean, unsegmented 16:9 master photos (Establishing Shot + Reverse Angle Shot)** combined with **Text-Based Cardinal Spatial Anchors** injected directly into the video orchestrator prompt.

---

## Core Philosophy (CRITICAL PRIORITY)

1. **The Clean Frame Law (Zero Grid, Zero Text):** Reference images fed into AI Video models MUST be single, unsegmented 16:9 photos. NO text labels ("North", "2D Map"), NO blueprint lines, and NO multi-panel borders.
2. **Dual-Shot System (180° Spatial Lock):** Every environment sheet output consists of two complementary 16:9 master shots:
   - **Shot A (`@image_env1`): Master Establishing Wide Shot** (Facing primary action / North-East camera vector).
   - **Shot B (`@image_env2`): Reverse-Angle Wide Shot** (Facing 180° opposite axis / South-West camera vector).
3. **Text-Based Cardinal Anchors:** Spatial geometry is locked in text via `[GLOBAL LOCK]` in video prompts rather than drawn on the image. (e.g., `[NORTH: Teak Double Door | SOUTH: Shoji Screen | EAST: Bamboo Garden | WEST: Sunken Pit]`).
4. **Negative Prop & Lived-In Realism:** Specify architectural materials, practical light sources, and environmental wear cleanly. Exclude temporary hero props (which belong exclusively to `PropSheet`).

---

## The Auteur Architecture Lexicon

1. **The "Lived-In" Texture Protocol (Anti-Plastikan):**
   - *Luxury/Elegant Settings:* Subtle micro-details (warm dust motes in light beams, fingerprints on polished glass, rain streaking on exterior windows, slight fabric wear).
   - *Gritty/Underground Settings:* Heavy practical textures (weathered teak wood, oxidized brass patina, weathered natural stone, peeling paint, damp asphalt).
2. **The Single-Clip & Clean Environment Exemption Law:**
   - **Zero Embedded Characters or Props:** EnvSheets MUST contain 100% pure arsitektur & spatial atmosphere. NO embedded characters, NO temporary hero props, and NO background extras.
   - **Single-Clip Asset Exemption:** If an environment appears in ONLY 1 clip, it is STRICTLY EXEMPT from EnvSheet generation. Handle it textually in that clip's prompt block.
3. **Practical Lighting Anchors:**
   - EVERY environment prompt MUST lock at least TWO physical light sources with defined color temperatures:
     - Primary Practical (e.g., 2700K Warm Tungsten Lantern or 3000K Fireplace).
     - Environmental Ambient (e.g., 7500K Indigo Dusk Light or 5600K Overcast Daylight).
3. **Cultural & Micro-Biome Fusion:** Avoid generic environments ("modern room", "cyberpunk street"). Fusion architecture creates high visual identity (e.g., *Javanese Joglo with Kyoto Shoji screens*, *Brutalist concrete bunker draped in velvet*).
4. **The Architectural Sanitation Protocol (Anti-Geometric Anomaly):**
   - **Explicit Quantity Lock:** NEVER use vague plurals like "doors", "windows", or "entryways". Explicitly state exact counts and screen-space positions (e.g. *"a single dark teak wood doorframe on SCREEN-LEFT, zero duplicate doors, zero floating window frames"*).
   - **Structural Sanity Anchor:** Inject `"Strict architectural geometry, single entryway lock, zero duplicate doorframes, zero floating window frames"` into every EnvSheet prompt to prevent AI Video generators from hallucinating double doors, overlapping frames, or distorted non-Euclidean walls.
5. **Tactile Hardware & Prop Sanitation in EnvSheet:**
   - **Zero Generic Nouns:** FORBIDDEN from using generic unadorned nouns in EnvSheet prompts (`TV`, `neon light`, `lamp`, `chair`, `fan`, `clock`).
   - **Mandatory 4-Pillar Spec:** Always specify Era + Form Factor + Physical Material + Realism Physics (e.g., *"heavy boxy Sony Trinitron CRT TV set with convex glass and dark mahogany cabinet"*, *"hand-bent 1970s argon-gas blown-glass neon signage with humming external transformer box"*).
6. **Aesthetic Weathering Protocol in EnvSheet (Anti-Chaotic Trash):**
   - **Zero Floor Trash / Paper Clutter:** NEVER use words like `dirty`, `messy`, `trash`, `garbage`, `cluttered`.
   - **Motivated Architectural Patina:** All wear must be structural (*vertical water-drip streaks on dark mahogany, oxidized copper patina on brass fittings, soot smudges near hanging lamps*). Always enforce *"Clean floor geometry, zero paper trash, structured environmental patina, cinematic wear"*.
7. **EnvSheet Defect Refinement & Real-World Euclidean Architectural Protocol:**
   - **Real-World Euclidean Logic:** All doors, windows, staircases, pillars, and ceiling beams MUST follow 100% real-world architectural gravity and human ergonomics. No floating windows, no side-by-side duplicate doors, no staircases to nowhere.
   - **The Door-Leaf Anatomy & Hardware Law:** FORBIDDEN from using vague terms like "door" or "doorframe" alone. ALWAYS specify Door Leaf State (`solid single-leaf paneled teak door flush inside jamb` OR `swung inward 45 degrees exposing 50mm leaf edge`), hardware (`brushed brass lever handle at 1.0m height`), and threshold (`raised 20mm marble door sill threshold`).
   - **Defect Refinement Override:** When an environment reference sheet (`@image_env`) generated by image models contains minor visual artifacts or weird geometry, the video orchestrator MUST explicitly override and refine those defects textually: `"Architectural Refinement Lock overriding @image defects: strictly a single solid single-leaf paneled teak door flush in jamb on SCREEN-LEFT, human-scale 2.1m x 0.9m proportion, zero floating window frames, zero missing door leaves. Strict 100% Euclidean real-world spatial architecture."`
   - **8. Euclidean Architectural Window & Sill Height Law:** Always lock window dimensions and sill height: `"Symmetrical 100% Euclidean real-world architecture: dual identical 1.2x1.5-meter teak-framed glass windows, bottom window sill set at 0.9-meter height from floor level on SCREEN-LEFT and SCREEN-RIGHT, zero asymmetric or floating window frames"`.
   - **9. Human-Ergonomic Scale Binding Law:** Always anchor door scale to human height: `"Standard real-world architectural proportions: a single 2.1-meter height x 0.9-meter width solid single-leaf teak door, human-scale 1.0x ergonomic proportions, zero oversized doorframe, zero mini doorframe, zero missing door leaf"`.
   - **10. Inward Hinge Swing Vector Law:** Always lock inward door swing trajectory: `"Solid single-leaf teak door physically swung INWARD INTO THE ROOM toward SCREEN-RIGHT at a 45-degree angle exposing 50mm leaf edge and steel hinges, exposing interior hallway, zero outward door swing, zero ghost door physics"`.



---

## 🏛️ The Sub-Environment & Focal Coverage Reference Sheet Protocol (SubEnvSheet)

### ⚠️ WHY MASTER ENVSHEETS FAIL ON LONG / MULTI-SHOT SEQUENCES (>15s)
When a sequence stays in the same location for **>15 seconds (2+ consecutive clips)**, or involves repeated dialogue multi-shots (e.g. sitting near a TV, dining table, desk, couch, or OTS dialogue), AI video generators degrade and hallucinate micro-background props if fed only a macro wide-shot `EnvSheet`.

### 🎯 THE SUBENVSHEET SOLUTION
For any sequence lasting **>15s or 2+ consecutive clips** in a sub-zone, OR for over-the-shoulder (OTS) / medium dialogue coverage, you MUST automatically generate **Dedicated Sub-Environment Reference Sheets (`SubEnvSheet`)** derived from the Master `EnvSheet`:

1. **SubEnvSheet A (Focal Zone / Micro-Area):** e.g., `EnvSheet_SubA_TVZone` (Locks the background wall, seating couch, TV cabinet, table, and lamp arrangement).
2. **SubEnvSheet B (Character A Coverage Angle):** e.g., `EnvSheet_SubB_CharA_Angle` (Locks the background artwork, wall texture, and window visible behind Character A during coverage).
3. **SubEnvSheet C (Character B Coverage Angle):** e.g., `EnvSheet_SubC_CharB_Angle` (Locks the background bookshelf, lamp, and door visible behind Character B during reverse coverage).

---

## Output Template (Dual Clean 16:9 Master & SubEnvSheet System)

When generating environment references, output the following structured format containing ready-to-copy Midjourney / Flux prompts inside code blocks, alongside the `[SPATIAL CARDINAL ANCHORS]` block:

### 1. Spatial Cardinal Anchors & Architectural Blueprint (Inject into Video Prompt `[GLOBAL LOCK]`)
```text
SPATIAL ANCHORS: [NORTH: Primary focal point] | [SOUTH: Reverse entrance/wall] | [EAST: Right boundary feature] | [WEST: Left boundary feature] | [DOORS: 1 solid teak door on SCREEN-LEFT] | [WINDOWS: 2 arched glass windows on SCREEN-RIGHT] | [CONNECTIVITY: Door 1 connects to Room B/Kitchen]
```

### 2. Shot A: Master Establishing Shot (`@image_env1`)
```text
[Aesthetic & Camera Tags]. Wide 16:9 establishing shot of [Location Name]. Showcasing [North/East features] on the right and [North/West features] on the left. Featuring [Primary Practical Light] clashing with [Ambient Light]. High resolution architectural photography, clean unsegmented frame, zero text, zero borders, photorealistic textures --ar 16:9
```

### 3. Shot B: Reverse Angle Shot (`@image_env2`)
```text
[Aesthetic & Camera Tags]. Wide 16:9 reverse angle shot of [Location Name] taken from the opposite 180-degree camera position looking back toward [South features]. Showcasing [South/East features] and [South/West features]. Maintaining identical materials, [Lighting & Weather], clean unsegmented frame, zero text, zero borders, photorealistic textures --ar 16:9
```

### 4. SubEnvSheet A: Focal Coverage Zone (`@image_subenv1`) — [MANDATORY FOR >15s / MULTI-SHOT]
```text
[Aesthetic & Camera Tags]. Medium wide 16:9 focal coverage shot of [Sub-Zone Name e.g. TV Seating Area] inside [Location Name]. Showcasing exact micro-background of [TV cabinet, sofa placement, wall decor]. Clean unsegmented frame, zero text, zero borders, photorealistic textures --ar 16:9
```

### 5. SubEnvSheet B: Character A Coverage Angle (`@image_subenv2`) — [MANDATORY FOR MULTI-SHOT DIALOGUE]
```text
[Aesthetic & Camera Tags]. Medium shot 16:9 background coverage of [Wall / Feature behind Character A]. Showcasing exact wall texture, hanging practical lamp, window placement on SCREEN-RIGHT. Clean unsegmented frame, zero text, zero borders, photorealistic textures --ar 16:9
```

---

## Integration with Video Orchestrators & Multi-Clip Engines

When `videoorchestra`, `ContinuitySkill`, or `PromptSkill` executes a multi-clip production:
1. **Shot A (`@image_env1`)** MUST be mapped ONLY for macro establishing shots aligned with the North/East axis.
2. **Shot B (`@image_env2`)** MUST be mapped when cutting 180° to macro reverse-angle shots aligned with the South/West axis. Never feed `@image_env1` into a South-facing reverse shot.
3. **SubEnvSheets (`@image_subenv1`, `@image_subenv2`)** MUST completely replace `Master EnvSheet` (`@image_env1`) for medium coverage shots, OTS dialogue cuts, and scenes lasting **>15 seconds** in a sub-zone! FORBIDDEN from supplying master wide and sub-env references in the same prompt codeblock.
4. **State Override:** If the environment is damaged or altered in Clip 1, Clip 2 MUST map to `@image_env_Damaged` or inject `[ENVIRONMENT STATE OVERRIDE]`.
5. Inject the `SPATIAL ANCHORS` text block directly into `[GLOBAL LOCK]` of every video prompt.

