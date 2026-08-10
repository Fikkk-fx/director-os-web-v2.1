---
name: "CharSheet — Cinematic Character Reference Sheet Generator"
description: >
  Generates photorealistic character reference sheet prompts for AI image generation models.
  Produces multi-view sheets with extreme close-up, left/right profiles, medium shot,
  and full body (front/back) with text annotations and white background. Designed to feed directly
  into CinSkill and PromptSkill as @image references for identity-locked AI video generation.
  Ensures absolute visual consistency across all views: same person, same clothing, same lighting,
  same skin texture, same proportions. Supports photorealistic human characters only — grounded
  realism mandatory, no illustration, no stylization unless explicitly requested as anime.
---

# CharSheet — Cinematic Character Reference Sheet Generator v1.0

## Purpose

Generate **multi-view character reference sheets** optimized for AI video production pipelines. These sheets become the @image references that CinSkill and PromptSkill use for identity-locked video generation.

## Core Philosophy

- **Aesthetic Inheritance**: The CharSheet MUST perfectly inherit the visual aesthetic of the main film. If the film is "High-contrast 90s Anime", the sheet must be High-contrast 90s Anime. If it is "Cinematic HDR Live-Action", the sheet must be Cinematic HDR Live-Action. Do not force generic "professional photoshoot" styles if it contradicts the film's intended aesthetic.
- The character sheet is **evidence**, not art. It documents a real person/character from multiple angles.
- Absolute consistency across all views — the viewer must believe all images are of the same physical person captured in the same session.
- **ZERO tolerance** for AI artifacts: plastic airbrushed skin, symmetrical doll face, wax texture, dead eyes, digital speckling, coarse stippling dots, smooth hair blobs, melted fingers, or inconsistent proportions.

## Universal Tri-Sheet System (MANDATORY DEFAULT)
For EVERY character sheet you generate, you MUST ALWAYS output **3 distinct CharSheet Prompts** and explain how the user should use them:
1. **[AI ORIGINAL]**: ... [standard charsheet prompt] ... (Explain: "Use this to generate the character entirely from scratch").
2. **[FACE LOCK]**: "Please use the attached image as a character reference to lock the face. Preserve exact facial structure, bone structure, eye shape, and refined natural skin complexion with 100% fidelity. Do not airbrush or beautify. [standard charsheet prompt]" (Explain: "Attach your photo to this prompt to lock your face, while the AI designs the costume").
3. **[FULL CUSTOM LOCK]**: "Please use the attached image as a character reference to lock the exact face and clothing. Preserve exact facial structure, refined natural skin complexion, and clothing details with 100% fidelity. Do not airbrush or beautify. [standard charsheet prompt]" (Explain: "Attach your photo to this prompt with maximum weight to replicate your exact face and clothing").

---

## Mandatory Views (Layout Options & Scope Law)

### ABSOLUTE SCOPE LAW (LIVE-ACTION DEFAULT):
For **ALL live-action / photorealistic video requests** (Romance, Arthouse, Action, Horror, Sci-Fi, Drama), EVERY `CharSheet` prompt MUST MANDATORILY use **Mode B: Raw UGC 3-Panel Smartphone Realism Layout** on a **PURE SOLID WHITE BACKGROUND**.
- **EXEMPTION:** The 6-Panel Layout (Mode A) or stylized sheets are strictly reserved ONLY when the user explicitly requests **2D Anime** or **3D Animation/Comic** styles.

### Mode B: Raw UGC 3-Panel Smartphone Realism Layout (MANDATORY DEFAULT FOR ALL LIVE-ACTION)
Used for ALL photorealistic/live-action character reference sheets. EVERY live-action CharSheet MUST start with `"Raw UGC smartphone photo aesthetic..."` and end with `"Shot on iPhone 15 Pro main camera 24mm f/1.7..."` on a **PURE SOLID WHITE BACKGROUND**:
- Panel 1: **Extreme Close-Up Face Front** showing unedited smooth organic skin, refined natural complexion, eye color, labeled with typography text reading **"EXTREME CLOSE UP"**.
- Panel 2: **Front Full Body (Head to Feet)** showing entire body facing camera from head to toes, full wardrobe down to shoes/feet completely visible in frame, labeled with typography text reading **"FRONT FULL BODY"**, **"AGE: [X] YRS"**, and **"HEIGHT: [X]CM"**.
- Panel 3: **Back Full Body (Head to Feet)** showing entire body from behind from head to toes, back hair, back wardrobe details down to shoes/feet completely visible in frame, labeled with typography text reading **"BACK FULL BODY"**.

### Mode A: 6-Panel Blueprint Layout (EXCLUSIVELY FOR 2D ANIME & 3D ANIMATION)
Used ONLY when the user explicitly requests 2D Anime, Sakuga, 3D Render, or Comic styles. Contains 6 views on a **PURE SOLID WHITE BACKGROUND**:
- Panel 1: **Extreme Close-Up (Front)** ("EXTREME CLOSE UP")
- Panel 2: **Left Profile** ("LEFT PROFILE")
- Panel 3: **Right Profile** ("RIGHT PROFILE")
- Panel 4: **Medium Shot (Front)** ("MEDIUM SHOT")
- Panel 5: **Full Body Depan (Front)** ("FRONT FULL BODY", "AGE: [X] YRS", "HEIGHT: [X]CM")
- Panel 6: **Full Body Belakang (Back)** ("BACK FULL BODY")

---

## Master Prompt Templates

### Template 1: Master 6-Panel Prompt Template (Cinematic Mode)
```text
**[Aesthetic/Style Tags (MUST MATCH FILM)]**. A 6-panel casting character reference sheet on a **pure solid white background**. The image is split into 6 equal grid panels. The character's design and identity are perfectly synchronized across all panels. Panel 1: Extreme Close-Up Face Front showing **[Facial Details/Smooth Complexion/Eye Color]**, with typography text reading **"EXTREME CLOSE UP"**. Panel 2: Perfect 90-degree Left Side Profile Face showing **[Left details]**, with typography text reading **"LEFT PROFILE"**. Panel 3: Perfect 90-degree Right Side Profile Face showing **[Right details]**, with typography text reading **"RIGHT PROFILE"**. Panel 4: Medium Shot Waist-Up Front showing **[Upper Clothing]**, with typography text reading **"MEDIUM SHOT"**. Panel 5: Full Body Front showing **[Full Wardrobe, including feet/shoes visible in frame]**, with clear typography text annotations reading **"FRONT FULL BODY"**, **"AGE: [X] YRS"**, and **"HEIGHT: [X]CM"**. Panel 6: Full Body Back showing **[Back Details/Weapons/Hair, including feet/shoes visible in frame]**, with typography text reading **"BACK FULL BODY"**. The character is **[Age, Ethnicity, Body Type, Posture, Clothing Details]**. **[Specific camera/lighting settings that match the aesthetic]**, absolutely consistent identity. --ar 16:9
```

### Template 2: Master 3-Panel Prompt Template (UGC Smartphone Realism Mode)
```text
Raw UGC smartphone photo aesthetic, authentic unedited skin texture, natural ambient studio light. A clean 3-panel casting character reference sheet on a pure solid white background. The image is split into 3 side-by-side equal vertical grid panels. The character's design, facial structure, smooth organic skin, and wardrobe are 100% synchronized across all 3 panels. Panel 1: Extreme Close-Up Face Front showing unedited refined natural complexion, soft matte finish, realistic eye reflection, zero digital speckling, zero coarse pores, with clean typography text reading "EXTREME CLOSE UP". Panel 2: Full Body Front showing the entire character from head to toe facing camera with shoes and feet completely visible in frame, with typography text reading "FRONT FULL BODY", "AGE: [X] YRS", and "HEIGHT: [X]CM". Panel 3: Full Body Back showing the entire character from behind from head to toe with shoes and feet completely visible in frame, showing back hair and clothing details, with typography text reading "BACK FULL BODY". The character is [Age, Ethnicity, Body Type, Outfit/Wardrobe Details]. Shot on iPhone 15 Pro main camera 24mm f/1.7, unpolished raw UGC aesthetic, zero plastic skin, zero airbrushing, crisp solid white background. --ar 16:9
```

---

## 🎭 CASTING SCIENCE (Actor Archetype Selection & Major Cinema Engine)
**CRITICAL:** In major world cinema (Fincher, Villeneuve, Nolan, Bong Joon-ho, Wong Kar-wai), casting is 50% of the director's job. AI defaults to generating generic "Instagram-Face" models. You MUST explicitly design the CHARACTER through their facial bone structure, dermal markers, and physical posture. The face and body MUST tell a story before a single word of dialogue is spoken.

### 1. The Facial Geometry & Bone Structure Protocol (Anatomi Wajah Auteur)
Do NOT describe characters with vague terms like "attractive man" or "beautiful woman". Instead, describe the SPECIFIC facial bone structure and dermal markers that reveal their lived history:

| Facial Component | Architectural Cinematic Specifier | Narrative Impact |
|---|---|---|
| **Jawline & Masseter** | *Sharp mandibular ramus, clenched masseter muscle, angular jawline* | Repressed emotional friction, lethality, unyielding willpower |
| **Orbital Sockets** | *Deep-set orbital sockets, heavy hooded eyelids, prominent brow ridge* | Mysterious intensity, fatigue, shadow-cast gaze (Villeneuve aesthetic) |
| **Nasal Architecture** | *Slightly crooked nasal bridge from old impact, sharp aquiline nose* | Real-world physical history, anti-symmetrical realism |
| **Cheekbones & Cheeks** | *High angular cheekbones, subtle hollowed bucco-labial shadows* | Raw athletic exhaustion, hunger, high-fashion bone structure |
| **Dermal Micro-Fleshing** | *Translucent epidermis, soft biological warmth, zero coarse pores, zero digital speckling* | Organic human blood flow, 0% plastic CGI skin |

### 2. The Kinetic Posture & Body Anatomy Science (Anatomi Postur Aktor)
Before generating any CharSheet or video prompt, define the character's EXACT physical posture and weight distribution:

- **Contrapposto (Classic Cinema Stance):** Body weight resting on one leg, asymmetric hip alignment, relaxed shoulders. Prevents stiff 3D-game mannequin standing.
- **Predatory Low Center (Lethal Threat):** Lowered center of gravity, broad shoulders pinned back, chin slightly tucked, calm grounded focus. Stillness before explosive movement.
- **Exhausted Cervical Slump (Physical / Mental Breakdown):** Curved cervical spine, rounded weary shoulders, heavy limp arm hang. Weight leaning against physical surroundings.
- **Tense Rigid Spine (Formal / Military / Hidden Panic):** Rigid upright spinal alignment, locked shoulder blades, tight jaw masseter.
- **Gangly Adolescent Asymmetry (Authentic Teen / Gen-Z):** Elongated gangly limbs, awkward shoulder hunch, uncoordinated step cadence, fidgeting hands.

### 3. Actor Archetype Selection Matrix

| Character Archetype | Physical Design & Posture |
|---|---|
| **War Veteran** | Deep crow's feet, sun-weathered natural skin, asymmetric jawline, thousand-yard stare, rigid shoulder posture |
| **Overworked Mother** | Dark circles, messy tied-back hair, chapped lips, micro-wrinkles, exhausted cervical slump posture |
| **Corrupt Politician** | Puffy face, manicured nails, forced smile, upright contrapposto posture taking up space |
| **Street Fighter** | Cauliflower ear, crooked nose, scar tissue on brow, thick neck, predatory low-center posture |
| **Tech Entrepreneur** | Pale indoor skin, slight forward hunch from screen posture, gangly uncoordinated movement |
| **Rural Farmer** | Deep tan lines, calloused massive hands, squint wrinkles, grounded wide-based posture |

### 4. Age Accuracy Protocol
Enforce age-accurate physical markers across all prompts:
- **Teen (15-19):** Unfinished facial bone structure, gangly proportions, awkward posture.
- **Young Adult (20-30):** Peak physical condition showing early stress markers (mild orbital shadows).
- **Middle Age (35-50):** Crow's feet, forehead furrows, softening jawline, graying temples, settled heavy posture.
- **Senior (60+):** Deep nasolabial folds, age spots, sagging neck skin, dignified slower gait.

### 5. The Anti-Photogenic Protocol (Ugly Beauty & Natural Restraint)
**CRITICAL:** Purge "Instagram-Face Syndrome". Inject natural human imperfections:
- **Natural Asymmetry:** "Slightly crooked nose bridge", "one eyelid slightly heavier", "asymmetrical smirk".
- **Skin Texture:** "Clean matte skin", "refined natural epidermal texture", "uneven skin tone", "zero digital speckling".
- **Sweat & Moisture:** NEVER use "very sweaty". Use clinical terms: *"Micro-beads of perspiration on forehead"*, *"matte skin with subtle localized specular highlights"*.
- **Camera-Shy Posture:** Character is unaware of the camera, mid-movement, awkward posture, resting face.

---

## 👔 WARDROBE DESIGN PROTOCOL (Costume as Character)
**CRITICAL:** Clothing is NOT decoration. In cinema, wardrobe is a VISUAL LANGUAGE that communicates status, psychology, and narrative arc WITHOUT dialogue.

### 1. The Wardrobe Storytelling Matrix

| What Clothing Reveals | Example |
|---|---|
| **Economic Status** | Frayed collar = poverty. Perfect tailoring = wealth. Brand-new ill-fitting suit = trying to pretend |
| **Personality** | All-black = guarded/powerful. Bright colors = extrovert. Neutral beige = invisible/forgettable |
| **Emotional State** | Buttoned-up = in control. Loosened tie, rolled sleeves = breaking down. Mismatched = not thinking |
| **Occupation** | Ink-stained fingers + rolled sleeves = writer. Steel-toed boots = construction. Scrubs = medical |
| **Time Period** | 90s baggy jeans, 60s mod skirts, Edo-period hakama, Victorian corset |
| **Cultural Identity** | Batik, Kebaya, Kimono, Dashiki, Sari — must be culturally accurate |

### 2. The Wardrobe Arc (Costume Evolution)
In multi-clip films, wardrobe MUST change to reflect the character's emotional journey:

- **Act 1 (Control):** Clean, pressed, symmetrical, buttoned up. Everything in order.
- **Act 2 (Crisis):** Same clothes but progressively disheveled — untucked shirt, missing button, sweat stains, rolled sleeves, loosened collar.
- **Act 3 (Transformation):** Either completely different outfit (new identity) OR the same clothes now destroyed (torn, bloodied, soaked).

### 3. The Full-Body Wardrobe Mandate (Head-to-Toe)
**ABSOLUTE RULE:** When describing ANY character's wardrobe, you MUST describe ALL 5 zones. Leaving ANY zone undefined will cause AI to hallucinate random clothing:

| Zone | Must Define |
|------|------------|
| **1. Head** | Hair (style, length, color, wet/dry), headwear (hat, bandana, none), facial hair |
| **2. Upper Body** | Undershirt, shirt/blouse, jacket/coat, accessories (necklace, tie, scarf) |
| **3. Hands** | Rings, gloves, watches, bracelets, tattoos, nail condition |
| **4. Lower Body** | Pants/skirt/shorts type, belt, specific fit (baggy, tailored, torn) |
| **5. Feet** | Specific shoe type (combat boots, stilettos, sandals, barefoot) — NEVER leave undefined |

### 4. Color Costume Psychology

| Wardrobe Color | Character Signal |
|---|---|
| **All Black** | Power, mourning, hiding, authority, mystery |
| **Pure White** | Innocence, purity, clinical, angelic, OR about to get destroyed (blood contrast) |
| **Red** | Passion, danger, aggression, the one you can't ignore |
| **Blue** | Trust, calm, sadness, loyalty, corporate |
| **Gray** | Anonymity, depression, bureaucracy, moral ambiguity |
| **Earth Tones** | Grounded, rural, honest, humble, connected to nature |
| **Neon/Bright** | Chaotic, attention-seeking, unhinged, party, youth |

### 5. The Texture Detail Mandate
AI renders all clothing as smooth plastic unless told otherwise. You MUST specify fabric texture:

- "Wrinkled linen shirt with visible weave texture"
- "Worn leather jacket with scuff marks and cracking at the elbows"
- "Rain-soaked cotton t-shirt clinging to skin, semi-transparent from water"
- "Starched crisp white dress shirt with razor-sharp collar creases"
- "Faded denim with white stress marks at the knees and pockets"


---

