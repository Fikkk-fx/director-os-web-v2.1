---
name: "PropSheet — Cinematic Object & Weapon Reference Generator v1.0"
description: >
  Generates high-priority, standalone reference sheets for significant props, weapons, tools,
  vehicles, logos, and symbols. Prevents AI duplication or hallucination by separating objects from character
  sheets.
---

# PropSheet — Cinematic Object & Weapon Reference Generator v1.0

## Purpose
AI Video models often hallucinate or duplicate objects if a character is holding a complex item in their main character reference sheet (e.g. an AI might render a Viking holding two axes if the axe was baked into his character sheet). 

To prevent this, **every significant prop, weapon, vehicle, logo, or symbol that appears in 2 or more clips MUST have its own standalone reference sheet**. Props appearing in only ONE clip should be described inline in [GLOBAL LOCK] unless the user explicitly requests a sheet.

---

## Core Philosophy (CRITICAL PRIORITY)

- **Isolation Principle**: The prop MUST be shown alone, completely isolated from any human characters. Do not show anyone holding it.
- **4-Panel Blueprint Layout**: Props must be displayed in a clean 2x2 grid representing 4 precise angles to provide the AI with perfect 3D geometry reference.
- **No Floating Hands**: Never include hands, arms, or people in the prop sheet.

---

## The Master 4-Panel Prop Blueprint

Every output prompt MUST follow this exact structural template, regardless of whether it is a small weapon, a large vehicle, or a graphic logo:

```text
**[Aesthetic/Style Tags]**. A comprehensive 4-panel object design reference sheet of a **[Detailed Description of the Prop/Logo/Vehicle]**. The image is split into a 2x2 grid on a flat neutral grey background. Panel 1 (Top-Left): Perfect Front Elevation view showing **[Front Details]**. Panel 2 (Top-Right): Perfect Back Elevation view showing **[Back Details]**. Panel 3 (Bottom-Left): Perfect 90-degree Left Side Profile showing **[Left Details]**. Panel 4 (Bottom-Right): Perfect 90-degree Right Side Profile showing **[Right Details]**. The object is displayed completely alone. Soft dramatic studio lighting, high resolution, precise structural consistency across all 4 panels. [ASPECT RATIO TARGET]
```

---

## Universal Tri-Sheet System (MANDATORY DEFAULT)
For EVERY prop or vehicle sheet you generate, you MUST ALWAYS output **3 distinct PropSheet Prompts** and explain how the user should use them:
1. **[AI ORIGINAL]**: ... [standard propsheet prompt] ... (Explain: "Use this to generate the prop entirely from scratch").
2. **[STRUCTURE LOCK]**: ... [standard propsheet prompt] ... (Explain: "Attach your sketch/photo to this prompt to use it as a base shape, while the AI redesigns the cinematic details").
3. **[FULL CUSTOM LOCK]**: ... [standard propsheet prompt] ... (Explain: "Attach your sketch/photo to this prompt with maximum weight to exactly replicate its shape, color, and design").

---

## Step-by-Step Prompt Generation

When Orchestrator Phase 1 calls for a prop (e.g. "The Viking's Battleaxe", "The Umbrella Corp Logo", or "A Cyberpunk Motorcycle"), follow these steps:

### 1. Establish the Aesthetic
Ensure the aesthetic matches the main film (e.g., Cinematic live-action photography, Bright modern shonen anime, Flat vector graphic).

### 2. Define the Material & Details
Is it scarred rusted iron with a splintered oak handle? Is it sleek carbon fiber? Is it a glowing neon hologram logo? Texture is everything. Describe what is visible on the front, back, left, and right.

### 3. Output the Prompt (CRITICAL FORMAT)
Deliver the final, ready-to-copy Midjourney/Flux prompt using the Master Template above. You MUST output the prompt inside a Markdown Code Block (```) for instant user copy-pasting. Do not output anything else inside the code block.

Example Output Format:
```text
[Aesthetic/Style Tags]. A 4-panel blueprint reference sheet of a [Prop Name]... [Rest of the prompt]
```
---

## Integration with Orchestrators
This skill is a **Dependency** for VideoOrchestra and AnimeOrchestra. When Phase 1 identifies a significant item being used in the script, it MUST generate a @imageX reference using this PropSheet logic.

---

## Multi-Item Bundle Extraction Protocol (CRITICAL RULE)
When a prop reference image contains a full kit, product box, or multi-item bundle (e.g. a product box + 3 bottles):
1. **Never** instruct the AI for a character to hold the entire bundle at once.
2. **Split the Prop Tags Automatically**:
   - `@PropX_Box`: The full kit/packaging box -> Locked statically in background/midground on tables or shelves.
   - `@PropX_SingleItem`: The extracted single bottle/tool -> Bound physically to human hands with 5 distinct fingers in foreground.
