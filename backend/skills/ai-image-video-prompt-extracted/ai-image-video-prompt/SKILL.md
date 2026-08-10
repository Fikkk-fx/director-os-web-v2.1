---
name: ai-image-video-prompt
description: Generate optimized, pro-grade prompts for AI image and video models (Midjourney, Flux, SD, Sora 2, Kling, Veo 3.1, Runway, Pika). ALWAYS searches visual references from the web BEFORE writing any prompt — a mandatory Step 0. Use whenever the user wants prompts for AI visuals, to animate an image, or a cinematic/animated video prompt — including stylized "Pixar-style" match-cut montage commercials where a hero object travels across scenes (also Indonesian). Also for character consistency, identity-preserving photo transforms ("turn me into…"), and viral editorial looks (CCTV, paparazzi). ALSO for multi-panel storyboard SHEETS / shot grids of every flavor — cinematic FILM / SPORTS / COMMERCIAL pitch boards and previs (hand-drawn black-and-white pencil-sketch boards with timed numbered panels, camera and motion notes; e.g. "film storyboard sheet", "sports commercial pitch board") AND ASMR / recipe / process color grids — and for animating any storyboard into a video. Apply for any AI image/video prompt request.
---

# AI Image & Video Prompt Engineer

Generate professional, optimized prompts for the world's leading AI image and video generation models. Always include keywords from the relevant categories — especially VFX and sound — to maximize realism, cinematic depth, and immersion.

> **GLOBAL RULE — NO WATERMARK:** Every prompt must include `no watermark, no logo, no text overlay, no signature` in the quality/booster section. For SD/Flux, also add these to the negative prompt field. This applies to all models, all prompt types, no exceptions.

> **GLOBAL RULE — REFERENCE SEARCH FIRST:** Before writing any prompt, ALWAYS search for visual references from Google, Instagram, X (Twitter), Facebook, and YouTube. Use the `web_search` and `image_search` tools. References must be gathered BEFORE the prompt is written — not after.

---

## 🔍 REFERENCE GATHERING SYSTEM

**This is Step 0 — mandatory before writing any prompt.**

Visual references from real platforms eliminate guesswork and ground every prompt in real aesthetic data. Always gather references before writing the prompt. Use them to extract: color palettes, lighting conditions, composition, textures, style signatures, and VFX details.

---

### PLATFORM SEARCH PROTOCOLS

#### 🖼️ Image References

| Platform | Search Method | Best For |
|---|---|---|
| **Google Images** | `web_search` + `image_search` → `[topic] [style] photography site:pinterest.com OR -site:x.com` | Broad aesthetic sweep, lighting refs, composition |
| **Instagram** | `web_search` → `[topic] instagram [year]` or `site:instagram.com [style]` | Editorial, fashion, lifestyle, real-world aesthetics |
| **X (Twitter)** | `web_search` → `[topic] [style] site:x.com OR site:twitter.com` | Concept art drops, AI art community, trending styles |
| **Facebook** | `web_search` → `[topic] [style] site:facebook.com` | Event photography, community art, regional aesthetics |
| **YouTube** | `web_search` → `[topic] [style] site:youtube.com thumbnail` | Thumbnail color grading, cinematic stills, creator aesthetics |

#### 🎬 Video References

| Platform | Search Method | Best For |
|---|---|---|
| **Google** | `web_search` → `[topic] cinematic video reference [year]` | General video refs, film stills, BTS footage |
| **Instagram Reels** | `web_search` → `[topic] reel aesthetic instagram` | Short-form visual language, trending motion styles |
| **X (Twitter)** | `web_search` → `[topic] video clip site:x.com` | Raw viral clips, AI video showcases, motion trends |
| **Facebook** | `web_search` → `[topic] video facebook` | Documentary-style, event reels, regional footage |
| **YouTube** | `web_search` → `[topic] [style] cinematic [year]` | Full cinematic refs, color grades, shot sequences |

---

### REFERENCE EXTRACTION WORKFLOW

```
STEP 0A — SEARCH
─────────────────────────────────────────────────────────
1. Identify the core visual theme (e.g., "neon cyberpunk alley", "golden hour desert portrait")
2. Run 2–3 searches across platforms:
   • image_search: "[theme] [style]" (Google Images)
   • web_search: "[theme] [style] site:instagram.com"
   • web_search: "[theme] cinematic site:youtube.com"
   • web_search: "[theme] concept art site:x.com"
3. Fetch 3–5 most relevant results

STEP 0B — EXTRACT VISUAL DATA
─────────────────────────────────────────────────────────
From each reference, extract:
  🎨 COLOR: Dominant palette? Teal/orange? Muted earth? Neon accent?
  💡 LIGHTING: Hard/soft? Direction? Color temp? Practical sources?
  📐 COMPOSITION: Shot type? Angle? Foreground elements? Negative space?
  🌫️ ATMOSPHERE: Weather? Fog? Dust? Rain? Haze?
  ✨ VFX: Any practical or digital FX visible in reference?
  📹 MOTION (video): Speed? Camera movement? Transitions?

STEP 0C — INJECT INTO PROMPT
─────────────────────────────────────────────────────────
Use extracted data to:
  • Select matching STYLE KEYWORDS from the library
  • Select matching LIGHTING KEYWORDS
  • Select matching VFX KEYWORDS
  • Set accurate COLOR GRADING direction
  • Inform SOUND DESIGN (video) based on visual context
```

---

### REFERENCE SEARCH EXAMPLES

**Example: User asks for "prompt cyberpunk street portrait"**
```
Search 1 (image_search): "cyberpunk street neon portrait photography"
Search 2 (web_search): "cyberpunk neon portrait site:instagram.com"
Search 3 (web_search): "cyberpunk cinematic street photography site:x.com"
Search 4 (web_search): "cyberpunk city night cinematic site:youtube.com"

→ Extracted: teal/magenta neon, rain-slicked pavement, rim-lit face from below, 
  deep shadows, holographic billboard glow, anamorphic flare streaks, 
  35mm street lens, shallow depth of field
→ Injected directly into prompt keyword selection
```

**Example: User asks for "video prompt golden hour beach walk"**
```
Search 1 (image_search): "golden hour beach walk cinematic"
Search 2 (web_search): "golden hour beach walk reel instagram aesthetic"
Search 3 (web_search): "golden hour beach cinematic site:youtube.com"
Search 4 (web_search): "beach golden hour video site:x.com"

→ Extracted: warm amber/orange grade, lens flare into camera, slow Steadicam tracking, 
  silhouette moments, shallow DOF on person, bokeh ocean background,
  ambient wave sound + soft wind score direction
→ Timeline + sound design built from reference data
```

---

### REFERENCE OUTPUT FORMAT

Always show references before the prompt:

```
🔍 VISUAL REFERENCES FOUND:
─────────────────────────────────────────────────
[Source 1 — Platform]: Brief description of what was extracted
[Source 2 — Platform]: Brief description
[Source 3 — Platform]: Brief description

📊 EXTRACTED VISUAL DATA:
  🎨 Color: [palette extracted]
  💡 Lighting: [lighting style extracted]
  📐 Composition: [composition style extracted]
  🌫️ Atmosphere: [atmosphere extracted]
  ✨ VFX: [VFX elements spotted]
  📹 Motion (if video): [motion style extracted]

⬇️ PROMPT BUILT FROM REFERENCES:
─────────────────────────────────────────────────
[Full prompt below ↓]
```

---

## Model Selection Guide

### Image Models (2026)
| Model | Best For | Pricing |
|---|---|---|
| **Midjourney v7** | Artistic, editorial, cinematic stills — gold standard for aesthetics | ~$10/mo |
| **FLUX 1.1 Pro Ultra** | Photorealistic detail, commercial, fast | Pay-per-image |
| **DALL-E 3** | Accurate text-in-image, concept art, general use | ChatGPT Plus |
| **Adobe Firefly** | Brand-safe, IP-indemnified, commercial use | Creative Cloud |
| **Google Imagen 4** | Photorealism, product shots, Google ecosystem | Gemini API |
| **Ideogram 2.0** | Typography + image, poster design | Free tier (40/day) |
| **Stable Diffusion (SDXL/Turbo)** | Open-source, custom fine-tuning, local | Free self-host |

### Video Models (2026 Rankings)
| Tier | Model | Best For |
|---|---|---|
| **S** | Veo 3.1 (Google) | Physics realism, native audio sync |
| **S** | Kling 3.0 (Kuaishou) | 4K native, AI Director mode, value |
| **S** | Sora 2 (OpenAI) | Cinematic quality, physics simulation |
| **A** | Runway Gen-4.5 | Pro post-production, Motion Brush |
| **A** | Wan 2.6 | Open-source, self-host, social content |
| **A** | Luma Ray3.14 | HDR 4K, reasoning video model |
| **B** | Pika 2.2 | Fast social clips, fun effects |
| **B** | Hailuo 2.3 | Budget ($14.99/mo), high volume |

---

## 🔑 KEYWORD LIBRARY

Always pick the most relevant keywords from each category and weave them into the prompt.

---

### 🎨 STYLE KEYWORDS

**Photographic Styles**
`cinematic photography` · `editorial photography` · `documentary photography` · `fashion photography` · `street photography` · `fine art photography` · `commercial photography` · `product photography` · `portrait photography` · `architectural photography` · `astrophotography` · `macro photography` · `analog film photography` · `Polaroid aesthetic` · `lomography` · `photojournalism`

**Artistic Mediums**
`digital painting` · `oil painting` · `watercolor illustration` · `gouache painting` · `concept art` · `matte painting` · `photo-bashing` · `ink illustration` · `charcoal sketch` · `cel animation style` · `3D render` · `CGI render` · `octane render` · `Unreal Engine 5 render` · `Blender cycles render` · `clay render` · `isometric illustration` · `vector art` · `flat design` · `line art`

**Director / Cinematographer References**
`Wes Anderson aesthetic` · `Denis Villeneuve cinematic` · `Stanley Kubrick symmetry` · `Christopher Nolan IMAX` · `Wong Kar-Wai neon warmth` · `Ridley Scott epic scale` · `Tim Burton gothic whimsy` · `Terrence Malick naturalism` · `David Fincher cold precision` · `Guillermo del Toro dark fantasy` · `Hayao Miyazaki lush warmth` · `Roger Deakins cinematography`

**Art Movements & Visual Aesthetics**
`Art Nouveau` · `Art Deco` · `Bauhaus` · `Brutalism` · `Surrealism` · `Impressionism` · `Minimalism` · `Maximalism` · `Baroque` · `Gothic` · `Ukiyo-e` · `Cyberpunk` · `Solarpunk` · `Synthwave` · `Vaporwave` · `Retrofuturism` · `Steampunk` · `Dark Academia` · `Noir` · `Neo-noir` · `Afrofuturism` · `Biopunk` · `Dieselpunk`

**Camera & Film References**
`Shot on ARRI ALEXA` · `Shot on RED Monstro` · `Shot on Hasselblad` · `Shot on Sony Venice` · `Kodak Portra 400 film` · `Kodak Ektar 100` · `Fujifilm Velvia 50` · `Ilford HP5 black and white` · `35mm film grain` · `medium format film`

---

### 💡 LIGHTING KEYWORDS

**Natural Lighting**
`golden hour` · `magic hour` · `blue hour` · `harsh midday sun` · `overcast soft diffused light` · `dappled sunlight through leaves` · `window light` · `sunrise backlight` · `sunset silhouette` · `moonlight` · `foggy diffused light` · `caustic water light`

**Cinematic & Dramatic**
`chiaroscuro` · `Rembrandt lighting` · `dramatic side lighting` · `three-point lighting` · `butterfly lighting` · `split lighting` · `rim lighting` · `backlit halo` · `contre-jour` · `God rays` · `volumetric light shafts` · `lens flare` · `anamorphic lens flare` · `light leak` · `silhouette lighting`

**Artificial & Atmospheric**
`neon light` · `neon rim light` · `LED strip light` · `candlelight` · `firelight` · `studio strobe` · `softbox diffused` · `bokeh lights` · `bioluminescence` · `holographic glow` · `subsurface scattering` · `emissive glow` · `bloom effect` · `screen glow`

**Color Temperature**
`warm tungsten 3200K` · `cool daylight 5600K` · `teal and orange grade` · `desaturated muted tones` · `high contrast` · `crushed blacks` · `lifted shadows` · `warm amber tones` · `cool blue shadows`

---

### 🎭 MOOD & ATMOSPHERE KEYWORDS

`ominous` · `melancholic` · `nostalgic` · `ethereal` · `triumphant` · `serene` · `tense` · `mysterious` · `romantic` · `lonely` · `hopeful` · `desolate` · `euphoric` · `haunting` · `eerie` · `meditative` · `intense` · `raw` · `powerful` · `bittersweet` · `dreamlike` · `surreal` · `liminal space` · `fever dream` · `cinematic tension` · `end of an era` · `quiet before the storm`

**Atmospheric Conditions**
`moody fog` · `heavy rain` · `light drizzle` · `snow-covered` · `dust storm` · `smoke-filled air` · `humid tropical haze` · `morning mist` · `storm clouds rolling in` · `apocalyptic sky` · `heat haze shimmer` · `deep twilight`

---

### 📐 COMPOSITION KEYWORDS

**Shot Types**
`extreme wide shot` · `wide shot` · `medium wide shot` · `medium shot` · `medium close-up` · `close-up` · `extreme close-up` · `macro close-up` · `over-the-shoulder shot` · `POV shot` · `bird's eye view` · `worm's eye view` · `aerial view` · `low angle heroic` · `high angle diminished`

**Compositional Techniques**
`rule of thirds` · `golden ratio` · `symmetrical composition` · `asymmetrical balance` · `leading lines` · `framing within frame` · `foreground interest` · `layered depth planes` · `negative space` · `dynamic diagonal` · `Dutch angle` · `juxtaposition` · `visual flow path` · `radial composition`

**Depth & Optics**
`shallow depth of field` · `bokeh background` · `tilt-shift effect` · `forced perspective` · `atmospheric perspective` · `anamorphic lens` · `telephoto compressed perspective` · `motion blur` · `chromatic aberration` · `lens distortion`

**Focal Lengths**
`14mm ultra-wide` · `24mm wide angle` · `35mm street` · `50mm standard` · `85mm portrait` · `135mm telephoto` · `macro 1:1 extreme detail`

---

### 🖌️ COLOR PALETTE & GRADING KEYWORDS

`monochromatic` · `teal and orange` · `black and gold` · `muted earth tones` · `soft pastel palette` · `jewel tones` · `neon accent on dark` · `cool blue dominant` · `warm amber dominant` · `split-tone warm highs cool shadows`

**Grade References**
`Kodachrome color grade` · `Fujifilm Velvia hyper-saturated` · `Kodak Portra natural skin tones` · `bleach bypass desaturated` · `orange and teal Hollywood grade` · `crushed blacks` · `film grain overlay` · `Villeneuve desaturated epic` · `Wes Anderson pastel grade`

---

### ✨ QUALITY KEYWORDS

**Boosters** *(add 3–4 to every prompt)*
`masterpiece` · `best quality` · `ultra-detailed` · `highly detailed` · `sharp focus` · `8K resolution` · `4K HDR` · `photorealistic` · `hyperrealistic` · `ray tracing` · `subsurface scattering` · `ambient occlusion` · `global illumination` · `award-winning photography` · `studio quality` · `no watermark` · `no text overlay` · `no logo`

**Texture & Surface**
`realistic skin pores` · `wet surface reflections` · `metallic specular sheen` · `rough concrete texture` · `translucent glass refraction` · `iridescent material` · `weathered patina` · `dust particles in light`

**Anti-Watermark Keywords** *(add to EVERY prompt, all models)*
`no watermark` · `no text overlay` · `no logo` · `no signature` · `no copyright mark` · `no branding`

**Negative Keywords** *(SD/Flux — add to negative prompt field)*
`ugly, blurry, low quality, bad anatomy, deformed, extra limbs, watermark, text overlay, logo, signature, copyright mark, branding, oversaturated, noisy, pixelated, out of focus, duplicate, cropped, low resolution, bad proportions, mutated hands`

---

## 💥 VFX DETAIL KEYWORDS

### For Image Prompts — Embedded VFX
Use these to make still images feel dynamic and visually rich with visual effects layered into the scene.

**Particle & Atmospheric FX**
`floating dust particles in light shafts` · `embers drifting upward` · `ash falling like snow` · `pollen floating in air` · `steam rising from surface` · `condensation on glass` · `fog rolling across ground` · `water vapor mist` · `smoke tendrils curling` · `haze and atmospheric scattering`

**Elemental FX**
`fire with realistic flame physics` · `molten lava glow` · `electric arc discharge` · `lightning strike aftermath` · `explosion shockwave debris` · `water splash frozen in time` · `rain streaks on lens` · `ice crystal formation` · `snow accumulation on surfaces` · `frost breath visible in cold air`

**Light FX**
`lens flare from practical light source` · `anamorphic horizontal lens flare` · `light diffraction through crystal` · `light caustics from water reflection` · `bloom effect on bright highlights` · `god rays through fog` · `neon sign flicker glow` · `bioluminescent trail` · `plasma energy glow` · `holographic projection shimmer`

**Impact & Destruction FX**
`shattered glass frozen mid-air` · `bullet hole with radial cracks` · `concrete debris scatter` · `wood splinter explosion` · `metal deformation and sparks` · `impact crater with dust cloud` · `surface burn marks and char` · `structural collapse dust plume`

**Sci-Fi & Fantasy FX**
`energy shield ripple effect` · `portal swirling vortex` · `force field distortion` · `gravity distortion visual` · `time warp visual effect` · `teleportation light burst` · `alien bioluminescence` · `magical rune glow` · `digital glitch artifact` · `holographic data stream`

**Environmental FX**
`volumetric fog with light interaction` · `heat distortion shimmer` · `underwater caustic light patterns` · `aurora borealis color wash` · `blood moon atmospheric haze` · `eclipse corona glow` · `tornado funnel cloud formation` · `sandstorm wall approaching`

**Post-Processing FX (Image)**
`film grain overlay` · `vignette edges` · `chromatic aberration on edges` · `anamorphic bokeh ovals` · `barrel distortion subtle` · `halation glow from lights` · `bleach bypass look` · `infrared film effect` · `motion blur on edges` · `tilt-shift miniature effect`

---

### For Video Prompts — Dynamic VFX in Motion
Include these to describe how VFX should behave over time.

**Physics-Based FX**
`physically accurate fluid dynamics` · `realistic fire propagation` · `smoke simulation with turbulence` · `rigid body debris scatter` · `soft body cloth simulation` · `hair and fur dynamic motion` · `water surface tension and ripple` · `explosion with pressure wave` · `dust cloud billowing outward`

**Camera & Optical FX**
`rack focus pull from foreground to background` · `anamorphic flare streaks across frame` · `chromatic aberration pulse on impact` · `lens shake on explosion` · `camera zoom breathing` · `rolling shutter on fast pan` · `digital noise grain visible` · `vignette pulse on beat` · `slow zoom creep for tension`

**Energy & Sci-Fi FX**
`energy pulse radiating outward` · `lightning arc between objects` · `EMP visual wave distortion` · `portal opening with light implosion` · `force field impact ripple` · `tractor beam light column` · `laser trail with glow decay` · `quantum particle disintegration`

**Environmental & Weather FX**
`volumetric fog interaction with movement` · `rain impact ripples on all wet surfaces` · `snow accumulating in real time` · `wind bending grass and trees realistically` · `heat shimmer rising from hot pavement` · `underwater particle field with light rays` · `fire burning with ember drift upward`

**Transition & Visual FX**
`smash cut with chromatic flash` · `speed ramp slow to fast` · `motion trail on fast movement` · `object dissolve into particles` · `glitch transition with pixel scatter` · `light wipe transition` · `match cut with visual echo`

---

## 🔊 SOUND EFFECT KEYWORDS (Video Prompts Only)

Sound is a first-class prompt component for Veo 3.1, Kling 3.0, Sora 2, and Pika — always describe it explicitly.

### Ambient & Environmental Sounds
`distant city hum` · `wind through trees` · `gentle rain on rooftop` · `heavy downpour on concrete` · `ocean waves crashing` · `river water babbling` · `forest ambience with birds` · `desert silence with wind` · `underground cave echo drip` · `busy street traffic ambient` · `crowd murmur in distance` · `factory machinery hum` · `electrical hum from neon signs` · `crickets at night` · `thunder rumble in distance`

### Impact & Action Sounds
`glass shattering impact` · `metal clang on concrete` · `heavy footsteps on gravel` · `footsteps on wet pavement echo` · `door slam reverb` · `explosion with low-frequency rumble` · `gunshot with echo decay` · `fist impact with thud` · `car tires screeching` · `chain dragging on floor` · `wood cracking and splintering` · `bone snap sharp crack` · `body hitting water splash`

### Elemental & Atmospheric Sounds
`fire crackling with popping embers` · `wind howling through structure` · `water dripping in echo chamber` · `ice cracking under pressure` · `electricity sparking and buzzing` · `steam hissing release` · `rocks falling and bouncing` · `sand shifting in wind` · `metal groaning under stress` · `deep earth rumble`

### Technology & Machine Sounds
`server room ambient hum` · `keyboard typing clicks` · `holographic UI activation tone` · `sci-fi door sliding open` · `mechanical servo whir` · `drone propeller buzz` · `modem dial-up glitch sound` · `digital data stream chirps` · `laser charge and fire` · `robot joint movement` · `engine ignition roar` · `hydraulic press hiss`

### Human & Voice Sounds
`muffled conversation in background` · `crowd cheer rising` · `single voice echo in empty space` · `breathing heavy in silence` · `heartbeat low and rhythmic` · `whisper barely audible` · `laugh fading into silence` · `scream reverberating off walls` · `footsteps approaching from off-screen`

### Music & Score Direction
`tense string ostinato` · `deep bass drone building` · `single piano note decaying` · `electronic pulse synth` · `orchestral swell climax` · `tribal percussion rhythm` · `lo-fi ambient texture` · `silence broken by single note` · `diegetic radio music in background` · `score cuts to silence on impact`

### Model-Specific Sound Formatting

**Veo 3.1** (native audio generation — most capable):
```
Audio: [ambient layer] + [foreground sound event] + [music/score direction]
Example: "Audio: rain on glass ambient, thunder rumble distant, electric hum from neon — score: low cello drone building"
```

**Kling 3.0** (audio-visual sync — timeline format):
```
[0-3s: ambient sound establishes] → [3-5s: sound event on action] → [5-10s: score swells]
Example: "[0-3s: city hum, rain drizzle] → [4s: glass shatter on impact] → [5-10s: silence then heartbeat"
```

**Sora 2** (describe sound as part of physics):
```
Describe sound as physical consequence: "The collision sends a sharp metallic clang echoing through the empty corridor"
```

**Pika 2.2 / Hailuo** (simple, punchy):
```
Sound: [1-2 key sounds] e.g. "bass drop on impact, crowd cheer fade in"
```

---

## Image Prompt Formula

### Universal Structure
```
[STYLE] + [Subject] + [Environment] + [LIGHTING] + [VFX DETAIL] + [COMPOSITION] + [MOOD] + [QUALITY] + [Parameters]
```

### Example — Cinematic Action Scene (Midjourney)
```
cinematic photography, Shot on ARRI ALEXA, anamorphic lens, Kodak Portra 400, Denis Villeneuve cinematic,

a soldier mid-sprint through collapsing building, debris frozen in motion, determined expression,

war-torn urban ruins, golden hour backlighting, thick dust in air,

chiaroscuro side lighting, warm god rays through dust, cool teal shadows,

-- VFX: shattered concrete debris frozen mid-air, dust particles in light shafts, fire embers drifting upward,
smoke tendrils curling from rubble, anamorphic lens flare, chromatic aberration on edges, film grain overlay --

extreme wide shot, low angle heroic, rule of thirds, foreground rubble interest, atmospheric perspective,

intense and raw, cinematic tension, aftermath atmosphere,

masterpiece, ultra-detailed, 8K HDR, subsurface scattering, ray tracing, award-winning photography, no watermark, no logo, no text overlay

--ar 2.35:1 --stylize 900 --v 7
```

---

## Video Prompt Formula

### Universal Structure
```
[Camera Movement] + [Subject + Action] + [Setting] + [LIGHTING] + [VFX IN MOTION] + [MOOD] + [SOUND EFFECTS] + [Quality] + [Technical]
```

### Example — Cinematic Action Video (Kling 3.0)
```
Dolly push-in from wide to medium, tracking subject movement, Steadicam smooth,

a woman running through flooded underground tunnel, water splashing with each step, 
desperate expression, soaked clothing with dynamic fabric physics,

underground concrete tunnel, blue-white emergency strip lighting, fog machine haze,

chiaroscuro harsh lighting, rim light from behind, volumetric light shafts through grates above,

-- VFX: water splash impact with realistic fluid dynamics, droplets catch light mid-air, 
condensation mist visible in cold air, electrical sparks from damaged fixture, 
motion blur on fast movement, chromatic aberration pulse, lens shake on explosion nearby --

ominous and tense, cinematic thriller, quiet desperation building,

-- SOUND: rushing water echo in tunnel, heavy wet footsteps reverb, 
distant explosion with low rumble, electrical sparks buzzing, 
breathing heavy rhythm, heartbeat low beneath ambient, 
score: tense string ostinato building --

physically accurate fluid dynamics, 4K native, photorealistic, hyperrealistic motion, no watermark, no logo, no text overlay

[0-3s: wide establishing with water rushing] → [3-7s: tracking run, splashes] → [7-10s: close-up on face, breath visible]
```

### 🎞️ Specialized video recipe — STYLIZED-ANIMATED / "PIXAR-STYLE" MATCH-CUT MONTAGE COMMERCIAL

When the user wants a **stylized 3D-animated ("Pixar-style") cinematic commercial** built as a **hero-object match-cut montage** — one object (a ball, paper plane, water drop, product) travels seamlessly across many locations and builds to a big emotional finale (the global-unity sports/brand spot, e.g. "a football match-cuts Tokyo → Barcelona → Rio → … → World Cup final") — **read `references/animated-matchcut-commercial.md`**. It covers: the stylized-3D-animation style block (with IP-safe fallback tokens for when "Pixar" is filtered), the five match-cut locks (hero object as through-line; match position/scale/direction across cuts; cut on motion; one location-beat per segment; escalate to finale), the per-segment timeline template, match-cut audio bridges + per-model sound, model notes, a real-IP safety block (no real FIFA/team/sponsor marks, no named athletes, no on-screen text), and a full worked 15-second global-football → championship-final example.

Triggered by: "Pixar-style / 3D-animated commercial", "animated brand film", "seamless match-cut / ball-match-cut transitions", "the [object] travels across countries / into the next scene", "global football culture spot", "World Cup cinematic commercial." Pairs with the storyboard *sheet* recipe (sheet → this animated video).

---

## 📸 STRUCTURED LABELED PROMPT FORMAT (Viral Editorial / Social Style)

This is the high-converting prompt structure used by viral AI-photo creators (Nano Banana Pro, GPT Image, Midjourney, Flux) for editorial portraits, "transform-me" selfies, surveillance looks, and paparazzi shots. Use it whenever the user wants a **single hero image with a strong concept**, an **image-to-image identity transform** ("turn me into…", "transform the subject…", "from input photo"), or a **viral social aesthetic** (CCTV, Y2K, paparazzi, press scrum, POV brand ad).

### When to use this format over the comma formula
- User uploads a photo of a person and wants them restyled/placed in a scene → **labeled format + identity lock**.
- User asks for a recognizable "look" or trend (surveillance cam, flip-phone selfie, media swarm) → **pull a recipe from the pack**.
- User wants a clean, skimmable, block-structured prompt they can paste and tweak → **labeled format**.

### The block template (UPPERCASE labels, one per line)
```
[TYPE / TITLE LINE]: e.g. ULTRA-REALISTIC EDITORIAL PORTRAIT FROM INPUT PHOTO  /  CCTV SURVEILLANCE SNAPSHOT
VIBE: genre + mood + cultural reference (e.g. "Y2K cyberpunk, MTV music video, intrusive paparazzi")
ANGLE / ENVIRONMENT: camera viewpoint AND/OR the setting (e.g. "high-angle security cam from a building corner" / "blurry neon alley at night")
LIGHTING: source + direction + color (e.g. "hard direct on-camera flash, mixed red & cyan neon ambient")
STYLING (MALE/FEMALE) / OUTFIT: garments, materials, accessories, eyewear — be specific
ACTION / EXPRESSION / POSE: what the subject is doing + facial expression
TECH: lens (12mm/macro/fisheye), grain, chromatic aberration, resolution/noise aesthetic, distortion, forced perspective
[OPTIONAL FAUX-UI]: only if the user wants it — "REC dot + timestamp overlay", "viewfinder frame". Otherwise add the no-text negatives below.
```

> Same global rule applies: end with `no watermark, no logo, no text overlay, no signature` UNLESS the user explicitly wants a faux-UI overlay (e.g. a REC/timestamp surveillance look). When the user says "no text", drop ALL overlays and keep the negatives.

### 🎯 IDENTITY-PRESERVING TRANSFORM (image-to-image)
When the prompt starts from an uploaded person, **lock identity** so the model restyles the scene without changing the face:
```
Preserve the subject's face, bone structure, skin tone, and overall identity — clearly recognizable.
Do NOT beautify, slim, age, or alter facial features. Keep [hair], [distinguishing marks] intact.
Only change: wardrobe, environment, lighting, and camera treatment as described below.
```
Place this block right under the TYPE line. For Midjourney use `--cref [image] --cw 100`; for Flux/SD use an IP-Adapter / identity reference; for Nano Banana / GPT Image, attach the photo and keep the "preserve identity" sentence verbatim.

### 🔥 VIRAL AESTHETIC RECIPE PACK
Ready-to-paste presets for the most-requested looks live in **`references/viral-editorial-recipes.md`**. Read that file when the user asks for any of these (or something adjacent):
1. **CCTV / Surveillance Snapshot** — night-vision green, REC + timestamp, fisheye, low-res noise, gorpcore.
2. **Y2K Paparazzi Flip-Phone** — forced perspective prop close to lens, on-camera flash, neon, chromatic aberration.
3. **Press Scrum / Media Swarm** — claustrophobic ring of mics & cameras pointing inward, direct flash, celebrity moment.
4. **POV "Inside-Out" Brand Ad** — shot framed through an object opening (bag/jacket zipper, helmet, fridge), tagline space, product hero (e.g. the Tricotè "What's Inside Matters" concept).
5. **Forced-Perspective Prop Hero** + **Faux-UI Overlay** modular add-ons usable on top of any look.

Each recipe in that file is given in the labeled block format with an identity-lock line and both a "with faux-UI" and a "clean / no-text" variant.

---

## 🎬 STORYBOARD-SHEET FORMAT (Single-Image Multi-Panel Grids for Video Reference)

Use this when the user wants **one image containing a grid of N panels** that maps out a short film/video shot-by-shot. This is distinct from the character-consistency **STORYBOARD PROMPTS** section below: that one tracks *characters* across narrative beats; this one lays out a *sequence* as a clean, readable grid a video model can interpolate from.

**There are two flavors — pick the right one before writing** (they differ completely in style, color, and annotations):

1. **Cinematic FILM / SPORTS / COMMERCIAL pitch board** — a **black-and-white, hand-drawn pencil / ink-wash shooting board** with framed panels, **numbered + timed** cells (01–N, 0.0s–15s), one-line action + camera notes beneath each frame, white **motion arrows** for the hero/ball/object trajectory, and **match-cut arrows** between panels. The director's/agency "pitch board" or "previsualization" look. Triggered by: "professional film storyboard sheet", "sports commercial pitch board", "previs / previsualization", "shot breakdown", "trailer storyboard", "Hollywood pitch board", "black-and-white pencil-sketch storyboard." **Here the on-frame annotations ARE the deliverable — this is the one deliberate exception to the global no-text rule** (still forbid stray watermarks/logos/signatures).

2. **ASMR / PROCESS color grid** — a **clean, full-color** grid mapping a *process* (cooking, latte art, craft, unboxing, skincare) with **no on-frame text**, sound implied by visible motion. Triggered by: "ASMR cooking storyboard", "recipe reel grid", "process / craft / unboxing sheet."

**This is a two-step pipeline for both flavors:** (1) generate the storyboard *sheet*, then (2) **animate that exact sheet into a video**. When the user already has a sheet and says "turn this storyboard into a video", "animate my storyboard", or "colorize the storyboard into a video", jump to the animation half — the prompt's job is to make the drawing come to life faithfully, NOT to invent a new video.

### When to use it
- "Make a professional B&W film storyboard sheet / sports-commercial pitch board, 12 numbered timed panels." (flavor 1, step 1 — sheet)
- "Give me a 12-panel previsualization / shot breakdown for a [trailer / advert / music video]." (flavor 1)
- "Make a 12-panel storyboard for a 15-second ASMR cooking video." (flavor 2, step 1 — sheet)
- "Give me a 9-panel grid / shot sheet for [recipe / latte art / unboxing / skincare] reel." (flavor 2)
- "I need a reference sheet of panels to feed a video model." (either flavor)
- "Turn this storyboard into a video / animate it / colorize it to a color video." (step 2 — animation)
- Any request for a multi-panel sequence in **one** image, or for animating such a sheet.

### The locks that make a SHEET usable (step 1 — set once, up front; full detail in the reference file)
1. **Aspect + grid stated explicitly** — e.g. "one landscape sheet, 12 panels in a 3-row × 4-column grid". Always state rows AND columns; never let the model improvise the layout.
2. **Style block stated ONCE** — for the **film board**: "black-and-white, hand-drawn graphite pencil + ink-wash, rough shooting-board texture, high-contrast cinematic lighting" → `Consistent hand-drawn B&W storyboard style across all panels`. For the **process grid**: art style + color rule + set + lighting + prop set → `Consistent [style] across all panels`. Re-describing style per panel causes cell-to-cell drift.
3. **One beat per panel** — action + camera framing only; never cram two beats into a cell.
4. **Text rule — depends on flavor:** film board *keeps* its annotations (frame number 01–N top-left, timing stamp top-right, action + camera note beneath, motion arrows, match-cut arrows) — they ARE the deliverable; ban only stray watermarks/garbled text. Process grid is **strictly no-text**; evoke sound through visible motion.
5. **Negative pins the panel count** — "more than N panels, fewer than N panels, messy panel layout" + flavor hazards (film board: `color, garbled lettering`; process grid: `unsafe knife handling, raw/overcooked food`).

Panel-count → grid map: 6=3×2 · 8=4×2 · 9=3×3 · 12=3×4 or 4×3 · 16=4×4. Budget ~1–1.5s of final video per panel (15s ≈ 10–12 panels).

### Sheet → VIDEO is the faithful-animation half (step 2): reference-fidelity lock, colorization lock (B&W boards → full color + per-element palette), consistency lock, payoff lock (name the climax + forbidden mutations), audio lock — plus the critical grid-animation negatives (`storyboard grid display, multiple frames visible, black-and-white output, monochrome, pencil-sketch look, art-style flicker`) so the model animates the *scene*, not the grid. Full templates and the worked examples live in the reference file.

➡️ **`references/storyboard-sheet-recipes.md`** — READ IT for any storyboard-sheet / shot-grid / pitch-board / previs request OR any "animate/colorize my storyboard into a video" request. Contents: §A pick-the-flavor · §B **cinematic film / sports / commercial pencil-sketch board** (template, panel-grid map, negative, the worked *Global Street-Football → World Cup* 12-panel example, re-skins) · §C sheet→video animation handoff (+ worked football→15s color film) · §D ASMR / process color grid (template + worked example).

Reference search (Step 0) still applies: pull real shooting boards / pitch boards (Behance, StudioBinder) and the subject's look from Google/Instagram/YouTube before writing, so the style block and per-panel framing are grounded. For sports/commercial boards, do **not** depict real, named athletes or real brand logos — keep heroes anonymous.

---

## Model-Specific VFX & Sound Notes

**Veo 3.1** → Best native audio. Describe both VFX and audio as physical facts. Label with `Audio:` prefix.

**Kling 3.0** → Use timeline format. Sync sound events to timestamps. Label `[Xs: sound event]`.

**Sora 2** → Frame VFX as physics consequences. Sound as physical reality, not instruction.

**Runway Gen-4.5** → Describe forces + motion; mention sound design for context even if model doesn't generate it natively.

**Pika 2.2** → Keep VFX and sound simple: 1–2 key effects, 1–2 key sounds. Punchy and direct.

---

## Professional Workflows (2026)

### High-Fidelity Cinematic
1. **Midjourney v7** → Keyframes with VFX baked in `--stylize 750`
2. **Veo 3.1** → Interpolate + native audio + VFX motion
3. **Topaz Video AI** → Upscale to 4K

### Social Video
1. **Flux / Imagen 4** → Hero image with VFX detail
2. **Kling 3.0 or Pika** → Animate with sound, 9:16
3. **ElevenLabs** → Voiceover · **CapCut** → Final edit

### Product Demo
1. **Adobe Firefly** → IP-safe scene with atmospheric VFX
2. **Runway Gen-4.5** → Motion brush + particle VFX
3. **ElevenLabs + Suno** → VO + ambient music

---

## 🧬 CHARACTER CONSISTENCY SYSTEM

When generating multiple prompts for the same character across different models (image, video, character sheet, storyboard), **character drift** is the #1 failure point. Use this system to lock character identity across every prompt in the pipeline.

---

### STEP 1 — BUILD THE CHARACTER DNA CARD

Before writing any prompt, fill out this template once. Paste a condensed version into **every subsequent prompt** that features this character.

```
╔══════════════════════════════════╗
║       CHARACTER DNA CARD         ║
╠══════════════════════════════════╣
║ NAME: [Character name]
║ ROLE: [Hero / Villain / Support]
║
║ — BODY —
║ Build: [e.g. tall muscular / slender agile]
║ Skin: [e.g. dark bronze / pale porcelain]
║ Height ref: [e.g. 180cm]
║
║ — FACE —
║ Eyes: [color + effect, e.g. amber with ember trails]
║ Hair: [length + color + style]
║ Jaw/Face shape: [e.g. sharp jaw, high cheekbones]
║ Expression default: [e.g. stoic, cold smirk]
║
║ — COSTUME —
║ Core material: [e.g. layered bronze tribal plate]
║ Key item 1: [e.g. shoulder pauldrons shaped like flame wings]
║ Key item 2: [e.g. ash-gray war cape fraying at edges]
║ Signature colors: [PRIMARY / SECONDARY / ACCENT]
║ Forbidden colors: [colors that must NEVER appear]
║
║ — WEAPON / PROPS —
║ Primary: [e.g. dual curved fire-blade swords]
║ FX on weapon: [e.g. living flame edge, ember orbit]
║
║ — POWER VFX SIGNATURE —
║ Aura: [e.g. ember particles drifting upward]
║ Ability FX: [e.g. heat-distortion haze around body]
║ Ground FX: [e.g. scorch marks underfoot]
║
║ — FORBIDDEN TRAITS —
║ NEVER: [e.g. cybernetic implants, futuristic HUD]
║ NEVER: [e.g. wings, horns, tail]
║ NEVER: [e.g. light skin, blue eyes]
╚══════════════════════════════════╝
```

**Rule:** If a trait isn't in the DNA Card, it doesn't exist. If a model adds something extra, add it to FORBIDDEN TRAITS in the next prompt.

---

### STEP 2 — CONSISTENCY ANCHOR BLOCK

This is the compressed version of the DNA Card — paste it verbatim at the **top of every prompt** that features the character, before any scene description.

```
[CHARACTER ANCHOR — DO NOT DEVIATE]
Character: [NAME]
Face: [eye color+FX] · [hair] · [jaw/face shape]
Body: [build] · [skin tone] · [height]
Costume: [2-3 key armor/clothing pieces + signature colors]
Weapon: [weapon name + FX]
Power VFX: [aura signature]
FORBIDDEN: [1-2 hard forbidden traits]
[END ANCHOR]
```

**Example — KAEL:**
```
[CHARACTER ANCHOR — DO NOT DEVIATE]
Character: KAEL — ember warrior male
Face: amber glowing eyes with ember trails · short black hair with ash tips · sharp jaw
Body: tall muscular build · dark bronze skin · 180cm
Costume: layered bronze tribal chest plate with orange fire runes · flame-wing pauldrons · ash-gray war cape
Weapon: dual curved fire-blade swords with living flame edge
Power VFX: ember particles drifting upward · heat-distortion haze around armor
FORBIDDEN: no cybernetics · no wings · no pale or light skin · no blue/green eyes
[END ANCHOR]
```

---

### STEP 3 — MODEL-SPECIFIC CONSISTENCY PROTOCOLS

Each model processes character description differently. Apply these model-specific strategies on top of the anchor block.

---

#### 🖼️ IMAGE MODELS (Midjourney, Nano Banana Pro, Flux, Stable Diffusion)

**Strategy: Redundant Description + Negative Prompting**

```
[CHARACTER ANCHOR block at top]

→ Repeat the 3 most visually critical traits mid-prompt in different words
→ End the prompt with explicit CONSISTENCY LOCK:

CONSISTENCY LOCK: maintain exact face structure, exact costume colors, 
exact eye glow effect — no variation from anchor description

→ For SD/Flux, add negative prompt:
[character name] wrong costume, wrong eye color, different hair, 
inconsistent face, extra armor pieces not described, missing weapons
```

**Midjourney-specific:** Use `--cref [image URL]` (Character Reference) from a prior approved generation. Set `--cw 80–100` for strict face lock.

```
--cref [approved_character_image_URL] --cw 85 --stylize 750
```

**Flux-specific:** Use `img2img` with the approved character render as base at 40–60% strength for new poses.

---

#### 📋 CHARACTER SHEET PROMPTS (any image model)

Character sheets have the highest consistency demand — all panels must look identical.

```
[CHARACTER ANCHOR block]

CONSISTENCY MANDATE: All [N] panels in this sheet depict THE SAME character.
Identical face geometry, identical eye color, identical costume — only pose and angle change.
Lighting may vary per panel but costume colors must stay constant.
Use consistent ambient occlusion and subsurface scattering across all panels.

PANEL LABEL SYSTEM: Label each panel with the character name + view direction.
Do not introduce new accessories, weapons, or costume elements not in the anchor.
```

**Golden rule for character sheets:** Describe the character ONCE in the anchor, then describe only the **pose/angle** in each panel. Do NOT re-describe the character per panel — this causes drift between panels.

```
✅ CORRECT:
Panel 1 — FRONT VIEW: neutral stance, arms at side
Panel 2 — BACK VIEW: same stance, looking away
Panel 3 — FACE CLOSEUP: 3/4 angle left

❌ WRONG:
Panel 1 — FRONT VIEW: warrior with bronze armor...
Panel 2 — BACK VIEW: warrior wearing heavy armor...  ← different wording = drift
```

---

#### 🎬 STORYBOARD PROMPTS (any image model)

Storyboards show multiple characters in the same scene across multiple panels.

```
[CHARACTER ANCHOR — KAEL] (paste full anchor)
[CHARACTER ANCHOR — LYRA] (paste full anchor)

MULTI-CHARACTER CONSISTENCY MANDATE:
— KAEL always identifiable by: amber glowing eyes, orange rune glow, ash cape
— LYRA always identifiable by: violet glowing eyes, silver-white hair, void smoke aura
— Both characters must be visually distinguishable in every panel, even in action/motion
— Consistent scale relationship: KAEL is 180cm, LYRA is 167cm — maintain height difference

PANEL-BY-PANEL: Describe only new scene action per panel. 
Character appearance is fixed by anchors above.
```

**Silhouette Rule:** Each character should be identifiable by silhouette alone. Add this to storyboard prompts:
```
Each character must have a UNIQUE SILHOUETTE — readable even as a shadow.
Kael: wide-shoulder armor, cape, dual blades.
Lyra: slim form, flowing hair, twin daggers.
```

---

#### 🎥 VIDEO MODELS (Seedance 2, Kling 3.0, Sora 2, Runway Gen-4.5, Veo 3.1)

Video models are the hardest to keep consistent because they generate 15–30s of frames. Use this layered approach:

**Layer 1 — Anchor at top of prompt (mandatory)**
```
[CHARACTER ANCHOR — DO NOT DEVIATE]
[paste anchor block]
Maintain character appearance locked across ALL frames. No costume drift. No face drift.
```

**Layer 2 — Reference image injection (most effective)**
Upload the approved character render (from image model step) as reference:
```
Reference image: [approved character render]
Match character exactly to reference — face, costume, colors, proportions.
```

**Layer 3 — Per-model consistency syntax**

| Model | Consistency Syntax |
|---|---|
| **Seedance 2** | Add `CONSISTENCY: character locked to reference — zero drift permitted` at prompt end |
| **Kling 3.0** | Use `--ref [image]` + describe character in SUBJECT block verbatim |
| **Sora 2** | Describe character as physical facts: "His amber eyes catch firelight" — not just labels |
| **Runway Gen-4.5** | Upload ref image to Motion Brush; describe character in Motion section |
| **Veo 3.1** | Include reference image + character description block; Veo respects detailed anchors |

**Layer 4 — Timeline Consistency Checks**

For videos longer than 8 seconds, add explicit per-segment anchors:

```
[0-5s]: KAEL — amber eyes, bronze armor, ash cape — ember aura active
[5-10s]: KAEL — same appearance — fire blades drawn, runes brighter
[10-15s]: KAEL — same appearance — post-battle, cape torn slightly at edge only

DO NOT change: eye color, skin tone, armor base color, hair style across any segment
ALLOWED to change: damage wear, lighting mood, cape physics
```

---

### STEP 4 — CROSS-MODEL HANDOFF PROTOCOL

When passing output from one model to the next in a pipeline, use this handoff checklist:

```
PIPELINE HANDOFF CHECKLIST
─────────────────────────────────────────────────
Step 1 → Image model (character portrait)
  ✅ Save the output image
  ✅ Note the seed number (if available)
  ✅ Evaluate: does it match ALL anchor traits? 
     If NO → regenerate with stricter anchor
  ✅ Lock this as the "approved reference render"

Step 2 → Character sheet (same image model)
  ✅ Paste anchor block at top
  ✅ Use --cref [approved reference] if MJ
  ✅ Verify all panels show identical face/costume

Step 3 → Storyboard (same or compatible model)
  ✅ Paste BOTH character anchors
  ✅ Upload approved renders for both characters as reference
  ✅ Check silhouette distinctiveness in all panels

Step 4 → Video model
  ✅ Upload approved character renders as reference images
  ✅ Paste anchor at start of video prompt
  ✅ Add per-segment timeline anchors for 10s+ videos
  ✅ Review first 3 seconds — if character has drifted, add stronger reference weight
─────────────────────────────────────────────────
```

---

### STEP 5 — DRIFT RECOVERY PROMPTS

If a model outputs a character that has drifted from the anchor, use these repair phrases:

**For image models:**
```
CORRECTION: Previous output had wrong [trait]. 
Enforce strictly: [correct trait description].
This is a CHARACTER LOCKED generation — no creative deviation from anchor.
```

**For video models:**
```
IMPORTANT CORRECTION: Character reference must override model defaults.
The character is LOCKED — do not infer or add traits not in the anchor.
Specifically enforce: [3 most-drifted traits from anchor].
```

**Hard reset (when all else fails):**
1. Generate a clean character portrait at `--stylize 0` (MJ) or minimum creativity setting
2. Use that as new reference render
3. Re-enter pipeline from Step 2

---

### CONSISTENCY CHECKLIST (Quick Reference)

Before submitting any prompt in a multi-model pipeline, check:

```
☐ CHARACTER ANCHOR block pasted at top of prompt?
☐ Forbidden traits listed explicitly?
☐ Approved reference image attached (image models: --cref / video models: ref upload)?
☐ Signature colors mentioned by name (not just described)?
☐ Eye color + glow effect stated explicitly?
☐ Weapon description matches anchor exactly?
☐ Power VFX signature included?
☐ For storyboards: silhouette rule verified for each character?
☐ For videos: per-segment timeline anchors added for 10s+ clips?
☐ Negative prompt includes wrong costume, wrong eye color (SD/Flux)?
```

## Output Format

**Single image/video prompt:**

```
🔍 VISUAL REFERENCES FOUND:
─────────────────────────────────────────────────
[Source 1 — Platform]: [what was found and extracted]
[Source 2 — Platform]: [what was found and extracted]
[Source 3 — Platform]: [what was found and extracted]

📊 EXTRACTED VISUAL DATA:
  🎨 Color: [palette]
  💡 Lighting: [style and direction]
  📐 Composition: [shot type, angle, framing]
  🌫️ Atmosphere: [weather, mood, environmental conditions]
  ✨ VFX: [visual effects spotted in references]
  📹 Motion (video only): [movement style, pacing]

📌 RECOMMENDED MODEL: [model] — [why]

✅ MAIN PROMPT:
[Style + Subject + Setting + Lighting + VFX Detail + Composition + Mood + Quality + Parameters]

💥 VFX DETAIL:
[Specific VFX elements described in motion or frozen, matched to scene]

🔊 SOUND DESIGN (video only):
Ambient: [background layer]
Foreground SFX: [key sound events + timing]
Score/Music: [direction]
Format: [model-specific labeling]

🚫 NEGATIVE PROMPT (SD/Flux — always include):
watermark, logo, text overlay, signature, copyright mark, branding, [other exclusion keywords]

⚙️ PARAMETERS:
• Aspect ratio: [ratio]
• Style strength: [--stylize XXX]
• Model: [--v 7]

🔀 VARIATION A: [alt style/mood]
🔀 VARIATION B: [alt composition/atmosphere]

💡 WORKFLOW TIP: [multi-model suggestion]
```

**Multi-model pipeline (character + sheet + storyboard + video):**

Always output in this order:
```
🧬 CHARACTER DNA CARD:
[Fill out DNA Card for each character in pipeline]

🔗 CHARACTER ANCHOR (paste into every prompt below):
[Compressed anchor block — one per character]

📋 PIPELINE ORDER:
1. [Image model] → Character portrait → save as approved reference render
2. [Image model] → Character sheet → attach --cref or reference image
3. [Image model] → Storyboard → both character anchors + silhouette rule applied
4. [Video model] → Final video → approved renders uploaded + timeline anchors

— PROMPT 1: Character Portrait —
[anchor block + full portrait prompt]

— PROMPT 2: Character Sheet —
[anchor block + sheet layout prompt]

— PROMPT 3: Storyboard —
[both anchor blocks + storyboard panel prompt]

— PROMPT 4: Video —
[both anchor blocks + timeline anchors + full video prompt]
```

---

## Example Trigger Phrases
- "Buatkan prompt Midjourney untuk [tema]"
- "Prompt Sora/Kling untuk video [deskripsi] dengan sound effects"
- "Gimana cara prompt Runway biar hasilnya cinematic dengan VFX?"
- "Generate AI image prompt for [topic] with particle effects"
- "I want to make an AI video of [scene] with realistic sound"
- "Cariin referensi dulu dari Instagram/YouTube terus buatin prompt-nya"
- "Cari referensi visual dari Google dan X buat prompt ini"
- "Buatkan prompt berdasarkan referensi yang kamu cari sendiri"
- "Buatkan storyboard 12 panel untuk video ASMR masak [hidangan]"
- "Make a 12-panel storyboard sheet for a 15-second ASMR cooking video"
- "Give me a 9-panel shot grid / reference sheet for a [recipe/latte art] reel"
- "Buatkan professional film storyboard sheet / sports commercial pitch board (B&W pencil sketch)"
- "Make a 12-panel previsualization / shot breakdown for a [football advert / trailer / music video]"
- "Hand-drawn black-and-white storyboard, numbered timed panels with camera notes and motion arrows"
- "Bikin pitch board ala Hollywood untuk iklan sepak bola, 3×4 panel, gaya sketsa pensil"
- "Make a Pixar-style 3D-animated World Cup commercial with seamless ball match-cut transitions"
- "Buatkan prompt video animasi 3D gaya Pixar, bola di-match-cut keliling dunia ke final Piala Dunia"
- "Animated brand film where a [ball/paper plane/product] travels across countries and builds to a finale"
- "I want a match-cut montage commercial, one object connecting every scene, Veo/Kling"
