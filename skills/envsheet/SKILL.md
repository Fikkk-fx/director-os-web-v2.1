# EnvSheet — Cinematic Environment Sheet Generator v3.0 (4-Panel Cardinal Compass Grid Protocol)

## Purpose

Generate **spatial-locked, 4-panel cardinal compass environment reference sheets** optimized for AI video production engines (Kling 1.5/2.0, Sora, Seedance 2.0, Runway Gen-3).

---

## 🛑 THE MULTI-CLIP MANDATE & ADAPTIVE ACTIVE-PANEL ENVSHEET LAW

### 1. Trigger & Adaptive Panel Count Mandate:
- **Mandatory Trigger:** Whenever an environment/location appears in **MORE THAN 1 CLIP (>1 clip)**, the system **MUST MANDATORILY GENERATE** an `EnvSheet` prompt BEFORE generating final video prompts.
- **Adaptive Active-Panel Rule (Hukum Panel Adaptif Sesuai Sudut Kamera Naskah):**
  - **4-Panel Grid (`--ar 4:3`, 2x2 Grid):** Generated ONLY IF all 4 cardinal directions (North, East, South, West) are actually revealed across the sequence.
  - **3-Panel Grid (`--ar 16:9` atau `--ar 4:3`):** Generated IF ONLY 3 cardinal directions are revealed in the screenplay (e.g. Panel 1: North, Panel 2: East, Panel 3: South 180° Reverse Angle).
  - **2-Panel Dual Master (`--ar 16:9`):** Generated IF ONLY 2 camera angles are revealed in the screenplay (e.g. Panel 1: Establishing North & Panel 2: Reverse Angle South).
  - **Single-Clip Exemption:** If an environment appears in ONLY 1 clip or 1 camera vector, it is EXEMPT from `EnvSheet` generation and handled textually inline.

### 2. Panel Specifications & White Panel Border Standard:
- **Aspect Ratio:** `--ar 4:3` for 4-Panel 2x2 grids; `--ar 16:9` for 2-Panel or 3-Panel side-by-side grids.
- **Border Style:** `Crisp White Panel Dividing Lines` (`separated by crisp thin white panel dividing lines`).
- **Panel Typography Labeling:** Clear vector typography text labels printed on each active panel (e.g., `"PANEL 1: NORTH VECTOR"`, `"PANEL 2: EAST VECTOR"`, `"PANEL 3: SOUTH VECTOR"`).

### 3. 360-Degree Room Topology Continuity Law (Hukum Mutlak Kesambungan Ruangan):
- **Corner Junction Stitching (Sambungan Sudut 90°):** Active adjacent panels MUST seamlessly connect at their corner junctions (Panel 1 Right ≡ Panel 2 Left, Panel 2 Right ≡ Panel 3 Left, etc.).
- **180-Degree Parallax Inversion:** Panel 3 (South 180° Reverse Angle) MUST invert Screen-Left features of Panel 1 onto Screen-Right.
- **Shared Core Anchor:** Ceiling height/material and floor material MUST be 100% identical across all active panels.

---

## Master 4-Panel Prompt Template (Midjourney v6.1 / Flux.1 Dev)

```text
[Aesthetic & Camera Tags]. A clean 4-panel 2x2 grid environment reference sheet on a clean background, 4:3 aspect ratio, separated by crisp thin white panel dividing lines. 100% Euclidean continuous room topology across all 4 panels: Panel 1 right edge seamlessly connects to Panel 2 left edge at North-East corner junction, Panel 2 right edge connects to Panel 3 left edge at East-South corner, Panel 3 right edge connects to Panel 4 left edge at South-West corner, Panel 4 right edge connects to Panel 1 left edge at West-North corner. Panel 1 (Top-Left): North vector wide shot of [Location Name] showing [Primary Architectural Feature / Main Door] on SCREEN-LEFT, labeled with clean vector typography reading "PANEL 1: NORTH VECTOR". Panel 2 (Top-Right): East vector wide shot showing right-side wall with [Primary Window / Lighting Anchor], labeled with typography reading "PANEL 2: EAST VECTOR". Panel 3 (Bottom-Left): South vector 180-degree reverse angle wide shot looking back toward [Main Entrance / Back Boundary], labeled with typography reading "PANEL 3: SOUTH VECTOR". Panel 4 (Bottom-Right): West vector wide shot showing left-side wall with [Corridor / Depth Feature], labeled with typography reading "PANEL 4: WEST VECTOR". Identical ceiling and floor materials, [Lighting & Weather], 100% spatial synchronization, crisp vector typography panel labels, thin white grid borders --ar 4:3 --v 6.1
```

---

## Integration with Video Orchestrators & Multi-Clip Engines

When `videoorchestra`, `ContinuitySkill`, or `PromptSkill` executes a multi-clip production:
1. The video prompt codeblocks MUST explicitly state which panel of `@image_env1` is being referenced for each specific camera angle:
   - **Camera facing Front / North:** `[CAMERA ORIENTATION: Facing PANEL 1 NORTH VECTOR relative to @image_env1]`
   - **Camera facing Right Side / East:** `[CAMERA ORIENTATION: Facing PANEL 2 EAST VECTOR relative to @image_env1]`
   - **Camera cutting 180° Reverse Angle / South:** `[CAMERA ORIENTATION: Facing PANEL 3 SOUTH VECTOR REVERSE ANGLE relative to @image_env1]`
   - **Camera facing Left Side / West:** `[CAMERA ORIENTATION: Facing PANEL 4 WEST VECTOR relative to @image_env1]`
2. **State Override:** If the environment is damaged or altered in Clip 1, Clip 2 MUST map to `@image_env_Damaged` or inject `[ENVIRONMENT STATE OVERRIDE]`.
3. Inject the `SPATIAL CARDINAL ANCHORS` text block directly into Blok 1 of every video prompt.


