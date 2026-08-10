---
name: "AnimationSkill — The 12 Principles of Animation Engine v1.0"
description: >-
  Menerjemahkan 12 Prinsip Animasi (Disney/Pixar) menjadi vektor fisika eksplisit untuk
  prompt AI Video. Mencegah gerakan robot, objek tanpa massa, dan kekakuan CGI.
  Menyediakan blueprint temporal untuk klip 5 detik dan 10 detik.
---

# AnimationSkill — The 12 Principles of Animation Engine v1.0

Skill ini berfungsi sebagai penerjemah hukum fisika animasi klasik menjadi sintaks AI Video Prompt Engineering. AI Video generator seringkali menghasilkan gerakan yang kaku, linier, atau melanggar hukum massa (physics hallucination). Dengan mengaplikasikan 12 Prinsip Animasi ke dalam [PHYSICS VECTORS] dan [CAMERA & PHYSICS LOCK], kita memaksa model untuk merender fisika dunia nyata yang organik, memiliki bobot, dan sinematik.

## SECTION A: THE 12 PRINCIPLES OF ANIMATION (AI VIDEO TRANSLATION)

### 1. Squash & Stretch (Preservasi Volume & Elastisitas)
**Theory:** Benda organik dan semi-solid akan memipih saat berbenturan dan memanjang saat berakselerasi, namun total volumenya tetap sama.
**AI Video Engine Failure Mode:** AI sering menganggap semua objek kaku seperti batu (rigid) atau malah berubah wujud tanpa mempertahankan volume (liquid morphing).
**Prompt Keywords & Physics Cues:** `kinetic compression`, `elastic volume retention`, `flex-rebound physics`, `impact flattening`.
```markdown
[PROSE]
Bola basket membentur aspal dengan keras, memipih sesaat sebelum memantul kembali ke udara.

[PHYSICS VECTORS]
- Kinetic compression at impact frame
- Elastic volume retention during rebound
- Flex-rebound physics on surface contact
```

### 2. Anticipation (Persiapan Gerak & Wind-up)
**Theory:** Setiap gerakan besar didahului oleh gerakan kecil ke arah yang berlawanan (mengumpulkan energi).
**AI Video Engine Failure Mode:** AI melompati frame persiapan gerak, menyebabkan subjek tampak berteleportasi atau bergerak tanpa sumber tenaga yang logis.
**Prompt Keywords & Physics Cues:** `pre-action wind-up`, `directional counter-movement`, `energy-loading posture`.
```markdown
[PROSE]
Petarung menarik bahunya ke belakang dan mengambil napas dalam, sebelum melontarkan pukulan memutar yang eksplosif.

[RENDER & ACTING LOCK]
- Pre-action wind-up sequence
- Directional counter-movement before strike
- Energy-loading posture
```

### 3. Staging (Siluet & Separasi Fokus)
**Theory:** Presentasi visual yang jelas; mata penonton harus tahu persis ke mana harus melihat pada frame pertama.
**AI Video Engine Failure Mode:** Cluttering; foreground dan background menyatu, subjek utama tertutup oleh elemen yang tidak penting.
**Prompt Keywords & Physics Cues:** `unobstructed silhouette readability`, `focal separation`, `high-contrast subject isolation`.
```markdown
[PROSE]
Siluet samurai berdiri tegak di atas bukit, terisolasi dengan jelas berlatar belakang bulan purnama yang terang.

[CAMERA & PHYSICS LOCK]
- Unobstructed silhouette readability
- High-contrast subject isolation
- Multi-plane focal separation
```

### 4. Straight Ahead vs Pose to Pose (Jangkar Keyframe vs Fluiditas)
**Theory:** Straight ahead menghasilkan chaos yang organik (seperti api/air), Pose to pose menghasilkan struktur gerak yang terukur (seperti tarian).
**AI Video Engine Failure Mode:** AI secara default merender frame demi frame (Straight Ahead) sehingga anatomi bergeser (morphing) dan proporsi hilang.
**Prompt Keywords & Physics Cues:** `structured keyframe anchoring`, `unscripted fluid turbulence`.
```markdown
[PROSE]
Penari balet melakukan pirouette dengan posisi tubuh yang presisi dan stabil.

[PHYSICS VECTORS]
- Structured keyframe anchoring for limbs
- Strict anatomical volume persistence
- No unscripted fluid turbulence on body structure
```

### 5. Follow Through & Overlapping Action (Inersia & Keterlambatan Fase)
**Theory:** Tidak semua bagian tubuh/objek berhenti bersamaan. Rambut, pakaian, atau daging berlebih akan terus bergerak karena inersia setelah tubuh utama berhenti.
**AI Video Engine Failure Mode:** AI menghentikan seluruh elemen dalam frame secara serentak pada millisecond yang sama, terlihat sangat kaku dan robotik.
**Prompt Keywords & Physics Cues:** `inertia momentum decay`, `appendage drag physics`, `phase-shifted motion`, `damped oscillation`.
```markdown
[PROSE]
Gadis itu berhenti berlari secara tiba-tiba, namun rambut panjangnya terlempar ke depan sebelum perlahan jatuh kembali ke bahunya.

[PHYSICS VECTORS]
- Inertia momentum decay on secondary appendages
- Appendage drag physics (hair, fabric)
- Phase-shifted motion arrival
- Damped oscillation settling
```

### 6. Slow In / Slow Out (Easing & Kurva S)
**Theory:** Gerakan organik membutuhkan waktu untuk berakselerasi dan berdeselerasi. Tidak ada yang langsung bergerak pada kecepatan maksimum atau berhenti seketika tanpa dampak.
**AI Video Engine Failure Mode:** Linear velocity; subjek bergerak dengan kecepatan konstan yang statis seperti objek di video game lawas.
**Prompt Keywords & Physics Cues:** `smooth S-curve easing`, `gradual acceleration ramping`, `organic kinetic deceleration`, `damped arrival`.
```markdown
[PROSE]
Mobil sport itu mulai melaju, berangsur-angsur menambah kecepatan hingga mencapai batas maksimal, lalu mengerem halus di depan lobi.

[PHYSICS VECTORS]
- Smooth S-curve easing on vehicle trajectory
- Gradual acceleration ramping
- Organic kinetic deceleration
- Cushioned, damped arrival
```

### 7. Arcs (Trayektori Parabolik)
**Theory:** Hampir semua gerakan makhluk hidup berotasi pada persendian, menciptakan jalur lengkung (arc), bukan garis lurus.
**AI Video Engine Failure Mode:** Model AI menginterpolasi gerakan melalui garis lurus 3D terpendek, menghasilkan gerakan mekanis yang canggung.
**Prompt Keywords & Physics Cues:** `parabolic rotational trajectory`, `natural joint-pivot arc`, `sweeping circular swing`.
```markdown
[PROSE]
Pria itu mengayunkan pedangnya dari bawah ke atas dalam satu tebasan melingkar yang mulus.

[PHYSICS VECTORS]
- Parabolic rotational trajectory of the blade
- Natural joint-pivot arc on shoulders and elbows
- Sweeping circular swing dynamics
```

### 8. Secondary Action (Aksi Sekunder & Micro-acting)
**Theory:** Gerakan tambahan yang mendukung gerakan utama dan memberikan dimensi emosional (misal: orang berjalan sambil mengusap tengkuknya).
**AI Video Engine Failure Mode:** AI memusatkan seluruh komputasinya pada kata kerja utama (main verb), menghasilkan figur yang kaku (zombie-like) tanpa kehidupan.
**Prompt Keywords & Physics Cues:** `subconscious micro-gestures`, `ambient secondary layer`, `non-conflicting micro-acting`.
```markdown
[PROSE]
Detektif itu menginterogasi tersangka sambil tanpa sadar memutar-mutar koin di jari tangan kirinya.

[RENDER & ACTING LOCK]
- Primary action: Intense dialogue delivery
- Ambient secondary layer: Subconscious micro-gestures (coin rolling)
- Non-conflicting micro-acting
```

### 9. Timing & Spacing (Persepsi Massa & Kalibrasi Waktu)
**Theory:** Durasi gerakan dan jarak antar-frame menentukan ilusi berat/massa. Benda berat bergerak lebih lambat dan membutuhkan tenaga besar.
**AI Video Engine Failure Mode:** AI gagal membedakan fisika bola bowling vs balon helium; semuanya bergerak dengan timing seragam.
**Prompt Keywords & Physics Cues:** `calibrated mass perception`, `visceral weight distribution`, `explosive short-duration impulse`.
```markdown
[PROSE]
Pekerja tambang mengangkat batu raksasa; otot-ototnya menegang hebat dan batu itu terangkat dengan sangat lambat.

[PHYSICS VECTORS]
- Calibrated mass perception (extreme heavy weight)
- Visceral weight distribution and muscular strain
- Delayed spacing, extended timing
```

### 10. Exaggeration (Amplitudo Ekspresi)
**Theory:** Menekankan esensi sebuah aksi atau ekspresi agar lebih mudah terbaca dan berdampak kuat, tanpa merusak realisme emosinya.
**AI Video Engine Failure Mode:** Karakter AI menampilkan "flat micro-expressions" atau poker-face yang tidak sesuai dengan intensitas adegan.
**Prompt Keywords & Physics Cues:** `hyper-real expressive amplitude`, `amplified cinematic intensity`, `dramatic muscular strain`.
```markdown
[PROSE]
Prajurit itu berteriak marah ke arah langit, urat lehernya menonjol dan matanya terbelalak penuh keputusasaan.

[RENDER & ACTING LOCK]
- Hyper-real expressive amplitude
- Amplified cinematic intensity
- Dramatic muscular strain on facial features
```

### 11. Solid Drawing (Volume 3D & Kekokohan Ruang)
**Theory:** Objek harus terasa memiliki volume, massa, dan keseimbangan di ruang tiga dimensi. Menghindari simetri total (twinned poses) yang terlihat kaku.
**AI Video Engine Failure Mode:** Lateral mirroring; tangan kiri dan kanan bergerak identik. Objek terlihat seperti potongan kardus datar (flat cutout) saat kamera memutar.
**Prompt Keywords & Physics Cues:** `strict 3D volume preservation`, `volumetric shading lock`, `chirality lock (no mirroring)`.
```markdown
[PROSE]
Monster itu menoleh ke arah kamera; bahu kanannya lebih rendah, mematahkan simetri tubuhnya yang masif.

[SPATIAL DEPTH ENGINE]
- Strict 3D volume preservation
- Volumetric shading lock across Z-axis
- Chirality lock (no mirroring, asymmetrical pose)
```

### 12. Appeal (Daya Tarik Visual & Magnetisme)
**Theory:** Bukan sekadar "cantik", tapi memiliki desain, tekstur, dan pencahayaan yang membuat penonton *ingin* terus melihatnya.
**AI Video Engine Failure Mode:** Default rendering yang "generic plastic", "AI slop", over-smoothed, atau kehilangan tekstur organik.
**Prompt Keywords & Physics Cues:** `auteur visual magnetism`, `textured human skin realism`, `triadic color separation`.
```markdown
[PROSE]
Close-up wajah pria tua; kulitnya memiliki pori-pori nyata dan tekstur kasar yang disinari cahaya keemasan matahari sore.

[GLOBAL LOCK]
- Auteur visual magnetism
- Textured human skin realism (no plastic smoothing)
- Triadic color separation
```

---

## SECTION B: MOTION DESIGN PRINCIPLES

Dalam komposisi gerak AI, terlalu banyak vektor gerak akan menyebabkan halusinasi (video pecah). Gunakan prinsip desain gerak berikut:

- **The Dominant Motion Rule:** Hanya SATU elemen dalam frame yang boleh memiliki *primary high-velocity motion*. Elemen lainnya (background, secondary subjects) harus berada pada kecepatan yang lebih rendah (subtle ambient motion) atau dikunci (stasis).
- **Directional Vector Persistence Across Cuts:** Arah energi kinetik HARUS dipertahankan saat perpindahan shot. Jika Clip A diakhiri dengan *whip-pan RIGHT*, maka Clip B harus dimulai dengan subjek masuk dari *LEFT*.
- **Zero-Hallucination Typography Physics:** Jika ada teks, rambu, atau tipografi dalam adegan, berikan instruksi eksplisit: `text/signage locked with explicit spatial geometry`. Ini mencegah huruf meleleh atau berubah ejaan saat kamera bergerak.

---

## SECTION C: CAMERA ANIMATION MECHANICS

Prinsip animasi tidak hanya berlaku pada subjek (aktor/objek), tetapi **sangat krusial** diaplikasikan pada pergerakan kamera (Virtual Camera Physics).

| Animation Principle | Camera Translation |
| :--- | :--- |
| **Anticipation** | Camera pre-pans opposite to subject direction |
| **Slow In / Slow Out** | Damped shoulder-rig acceleration ramps |
| **Arcs** | 3D Orbital tracking (never flat linear pans) |
| **Staging** | Multi-plane depth layering (paralaks yang jelas) |
| **Follow Through** | Camera lens inertia drift after subject stops |
| **Secondary Action** | Subtle micro-handheld sway during primary dolly |

**Aturan Wajib (Hard Rules) Kamera AI:**
1. **Camera Anticipation:** Wajib ada `0.3s pre-pan in opposite direction` sebelum *fast tracking shot*. Kamera mengumpulkan energi sebelum mengejar subjek.
2. **Damped Camera Inertia:** Wajib ada `0.3s organic drift` sebelum kamera benar-benar diam setelah pergerakan cepat. Kamera virtual harus terasa memiliki massa fisik yang berat.
3. **Camera Easing:** SEMUA pergerakan kamera wajib menggunakan kurva-S (S-curve easing). `never linear velocity`.

---

## SECTION D: TEMPORAL ALLOCATION BLUEPRINTS

AI Video membutuhkan struktur waktu (timing) yang jelas agar tidak menghabiskan seluruh aksi di 1 detik pertama. Gunakan blueprint di bawah ini sebagai struktur dasar prompt untuk durasi spesifik.

### 5-Second Clip Standard Blueprint:
*Cocok untuk adegan aksi cepat, reaksi instan, atau insert shot.*
- **[0.0s - 1.0s]** Anticipation & Easing In (wind-up, pre-action breath, scene orientation)
- **[1.0s - 3.5s]** Primary Kinetic Action (main movement, multi-plane camera sweep)
- **[3.5s - 5.0s]** Follow Through & Easing Out (appendage settling, camera inertia decay)

### 10-Second Clip Standard Blueprint:
*Cocok untuk adegan naratif, establishing shot kompleks, atau transisi emosional.*
- **[0.0s - 2.0s]** Beat 1 — Setup & Anticipation (scene establish, environmental physics, wind-up)
- **[2.0s - 6.0s]** Beat 2 — Action & Reaction (primary kinetic movement + camera arc trajectory)
- **[6.0s - 8.5s]** Beat 3 — Follow Through & Secondary Action (momentum decay, subtle micro-acting)
- **[8.5s - 10.0s]** Beat 4 — Resolution / Transition Anchor (cushioned arrival, clean pose hold for next cut)

### Timing vs Spacing Matrix:
Gunakan matriks ini untuk mendikte *Spacing* (jarak antar frame virtual) dan profil kecepatan AI.

| Velocity Profile | Spacing | Timing | Prompt Keywords | Physical Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Explosive Burst** | Wide (Jauh) | 0.2 - 0.5s | `explosive short-duration impulse` | Heavy impact, gunshots |
| **Organic Ease-In** | Gradually opening | 1.0 - 3.0s | `smooth acceleration ramping` | Human start, cars moving |
| **Constant Drift** | Equal (Sama) | 4.0 - 10.0s | `linear continuous glide` | Ambient/Sci-fi, drones |
| **Cushioned Stop** | Rapidly narrowing | 0.5 - 1.5s | `damped arrival`, `inertial cushion` | Heavy object stop, landing |

---

## SECTION E: MASS & GRAVITY PHYSICS SIMULATION

Gravitasi adalah jangkar dari realisme video. Prompt harus selalu mendikte massa objek secara implisit atau eksplisit.

- **Weight Ratio Rule:** Berlaku hukum fisika murni. Semakin BERAT objek = gerakan awal lebih LAMBAT, *anticipation* lebih LAMA, deformasi (*squash*) saat jatuh lebih BESAR, dan waktu yang dibutuhkan untuk inersia berhenti lebih PANJANG.
- **Friction & Drag (Gesekan):** Interaksi permukaan harus memodifikasi berhentinya sebuah gerakan. Prompt harus spesifik mengenai gesekan: permukaan licin (wet pavement), tahanan berat (mud/lumpur), atau hambatan bertekstur (gravel).
- **Micro-Physics Protocol:** Setiap frame harus memuat organik mikro-mosi. Objek yang diam total (0 velocity) akan membuat AI merender gambar statis yang perlahan meleleh. Selalu gunakan: `organic micro-motion (breathing, hair flutter, dust motes, light flicker)` untuk mencegah "dead static rendering". Cek persilangannya dengan CinemaSkill Stasis Protocols.

---

## SECTION F: INTEGRATION NOTES

AnimationSkill bertindak sebagai layer *Physics & Movement* yang diinjeksikan ke dalam struktur sistem Director OS yang lebih besar:

1. **Ke CinemaSkill:** AnimationSkill menyuplai parameter untuk [PHYSICS VECTORS] ke dalam mesin CinemaSkill (baik itu Live Action, Anime, maupun 3D Comic style).
2. **Ke VideoOrchestra:** Blueprint alokasi temporal (5s/10s) dari AnimationSkill memberikan panduan *pacing* mutlak bagi VideoOrchestra dalam menyusun urutan scene.
3. **Untuk AuditSkill:** Saat melakukan review prompt, AuditSkill **WAJIB** mengecek keberadaan 4 pilar utama gerak: *Anticipation, Follow-through, Easing (S-curve),* dan *Arcs*. Jika tidak ada, prompt harus direvisi.
4. **Ke 6 Master Stasis Protocols:** Jika adegan menuntut karakter diam (zero-velocity exception), sistem harus memanggil 6 Master Stasis Protocols (di dalam CinemaSkill) untuk menangani *ambient animation* agar shot tidak terlihat membeku.

*Sistem Director OS — v19.1 Engine / End of AnimationSkill*

---

## SECTION G: GLOBAL ANIMATION AESTHETICS & STUDIO VISUAL SIGNATURES

Untuk mendikte *visual style* yang spesifik kepada AI Video Engine, gunakan referensi gaya animasi global, demografi anime, dan teknik pembuatan animasi. AI Video Engines dapat meniru "Visual Signature" dari studio-studio terkenal.

### 1. The Three Primary Mediums (Teknik Animasi)
- **Traditional 2D (Cel/Hand-drawn):** Gunakan keyword `hand-drawn 2D animation, flat cel shading, expressive linework, traditional ink and paint aesthetic`. Cocok untuk estetika nostalgia atau artistik.
- **3D CGI (Computer Generated):** Gunakan keyword `3D computer animation, rich volumetric lighting, realistic physically-based rendering (PBR), Pixar-style 3D models`. Cocok untuk detail lingkungan yang kaya dan pergerakan kamera 3D yang kompleks.
- **Stop Motion (Tactile/Practical):** Gunakan keyword `stop-motion animation, tactile physical puppets, claymation, miniature set design, Laika-style practical aesthetic, subtle thumbprint textures, 12fps choppy motion`. Cocok untuk nuansa *creepy*, unik, atau *hand-crafted*.

### 2. Studio Visual Signatures (Locking Aesthetics)
- **Studio Ghibli (Japan):** `painterly watercolor backgrounds, grounded natural movement, soft lighting, graphic nature textures, Hayao Miyazaki aesthetic`.
- **Walt Disney (US):** `classic Disney animation, fluid full-frame lifelike movement, appealing clear silhouettes, lush traditional hand-drawn`.
- **Pixar (US):** `high-end 3D CGI, stylized yet physically grounded character designs, rich detailed environments, emotional lighting scripts`.
- **LAIKA (US):** `dark intricate stop-motion, spooky fantasy, tactile puppet textures, physical set lighting`.
- **Science SARU / Masaaki Yuasa (Japan):** `reality-bending fluid motion, zany experimental style, bold abstract color palettes, hyper-stylized proportions`.
- **MAPPA / Ufotable (Japan):** `high-impact modern anime, dynamic 3D camera work mixed with 2D characters, intense action choreography, high-contrast VFX lighting`.

### 3. Anime Demographics & Thematic Art Styles
Dalam Master Director Template — Anime Edition, tentukan **GENRE** berdasarkan demografi dan estetika yang spesifik:
- **Shonen (Action/Adventure):** `bold dynamic linework, high-energy pacing, high-contrast shading`.
- **Shojo (Romance/Drama):** `delicate expressive character designs, soft pastel color palette, floral motifs, emotional depth`.
- **Seinen / Josei (Mature/Gritty):** `mature realistic detailing, muted dark colors, complex psychological atmosphere, grounded physics`.
- **Moe / Chibi (Comedy/Slice of Life):** `super deformed (SD), exaggerated cute features, large eyes, soft endearing aesthetics`.

### 4. Visual Pillars of Animation Design
Selalu pertimbangkan pilar desain ini dalam prompt:
- **Shape Language:** Tentukan bentuk dasar (`round friendly shapes`, `sharp angular dangerous silhouettes`, `solid blocky structures`).
- **Color Theory (Color Scripts):** Tentukan mood scene melalui palet warna dominan (misal: `monochromatic blue color script for melancholy`).

---

# Master Director Template — Anime Edition v1.0

## (Appended from Rangkuman_dan_Kompilasi_Skill.md — 2026-07-30)

---
name: master-director-template-anime
description: >
  Master Director Template Anime Edition v1.0 for grounded anime cinematic video prompts.
  Emphasizes logical scene continuity, spatial coherence, object permanence, cross-shot consistency,
  strict character design reference locking, natural fluid non-stiff anime performance, and zero unexplained events.
  Directing adapts to any anime genre while keeping unbreakable causal logic within the stylized anime world.
  Eliminates AI failures: character design drift, stiff animation, unexplained anomalies, direction flips, object morphing, geography breaks.
  Enforces prompts under 2500 characters for Kling, Runway, Luma and similar tools.
---

## Overview

This skill encodes the complete **Universal Anime Cinematic Video Prompt Framework – Master Director Template Anime Edition v1.0 (Strict Character Design Lock + Natural Fluid Performance Edition)**. It turns the model into a rigorous anime director that produces grounded, high-quality anime production style prompts for AI video generators.

**Core Philosophy:** Believable anime world first. Coherent stylized logic and physics second. Emotion before spectacle. **Spatial logic, object permanence, causal consistency, character design consistency (especially exact design match from user reference images), and natural non-stiff fluid anime performance are sacred.** When a user provides a character reference image, the character design must match 100% in design DNA, proportions, eye style, hair, costume details across every frame, yet the character must perform with completely natural, fluid anime-typical micro-expressions, eye highlights, hair dynamics, cloth movement, and emotional range — never stiff, frozen, limited keyframe, or robotic.

## When to Activate

Use this skill for:
- Creating or iteratively refining anime-style video prompts
- Breaking down scenes into structured cinematic anime language (especially 8–12 second clips)
- Maintaining strict character design consistency (100% design match from user-provided reference images without causing stiffness)
- Anime football/sports scenes, action sequences, slice-of-life, montages, or any grounded anime storytelling project

## Instructions

**Mandatory Rule:** When this skill is active, **every** video prompt assistance **must** follow the full Master Director Template Anime structure below. Directing, camera language, rhythm, editing, and tone must adapt to the user-specified ANIME GENRE and STYLE while strictly obeying all causal logic, reference locking, natural fluid performance, and world coherence rules.

### Step-by-Step Workflow

1. **Gather / Clarify Key Elements** — scene concept, main character design (Image A), environment in anime style (Image B), supporting characters (Image C/D), desired feeling, duration, key emotional beats. Define or lock the spatial geography early.

2. **Complete Every Section of the Template** with specific, concrete, vivid language adapted for anime. In CHARACTER BIBLE: describe observable anime animation cues. In REFERENCE LOCK: apply strict 100% character design lock while explicitly requiring completely natural, fluid, non-stiff anime performance.

3. **Self-Audit** against VISUAL PHILOSOPHY, NEGATIVE PROMPTS, PHYSICS (stylized), SPATIAL GEOGRAPHY & CONTINUITY RULES, and FINAL GOAL. Audit for design drift, stiff animation, causal logic breaks. Fix immediately.

4. **Synthesize Tool-Ready Prompt** — max 2500 characters. Preserve: design lock & continuity, spatial geography, key acting directions in anime terms, motivated camera work, stylized physics, negative prompts.

5. **Handle Iteration & Continuity** — Update only changed sections. Re-affirm design consistency, costume, proportion, and environmental continuity.

6. **Multi-Shot** — One template + SPATIAL GEOGRAPHY section + SHOT 1/SHOT 2. Never allow multi-shot to treat clips as disconnected — the anime world must feel like one real place.

**Non-Negotiable Constraints**
- Nothing feels static. Environment and characters always alive with proper physics.
- Final audience feeling: "This looks like real high-quality anime from a professional production."
- **Prompt Length Limit:** 2500 characters or fewer for every final tool-ready prompt.

---

## Master Director Template Anime Edition v1.0

```
##################################################
# UNIVERSAL ANIME CINEMATIC VIDEO PROMPT FRAMEWORK #
# MASTER DIRECTOR TEMPLATE ANIME EDITION v1.0      #
##################################################

TITLE: <Scene Title>
DURATION: <Length>
GENRE: <Anime Genre: Sports Anime, Action Shonen, Slice of Life, Drama, etc.>
STYLE: High-Quality Modern Anime Production
- Clean expressive linework with consistent weight
- Professional high-end studio anime rendering quality
- Lively detailed eye highlights + natural micro-expressions
- Natural hair flow, strands, and physics
- Natural cloth/fabric dynamics responding to movement
- Balanced vibrant color palette with rich tonal separation
- Smooth fluid animation with professional timing & spacing
Adaptasi genre: Shading more bold/cel-shaded for action & sports, softer & more cinematic for drama/slice-of-life.

----------------------------------------
REFERENCE LOCK (STRICT)
----------------------------------------
IMAGE A (Main character):
- Character Design Lock (100% design consistency): Exact eye design (shape, size, color, iris pattern, highlight style), eyebrow shape, nose shape, mouth shape, jawline, facial proportions, hair style/length/color/flow dynamics, ear shape/position, skin tone, body type/proportions, posture baseline, and all costume details must match 100%. No design drift, no morphing, no "similar but different" character.
- Performance MUST remain completely natural and fluid in anime style: Full, fluid, professional anime-quality micro-expressions, natural eye behavior (blinks, saccades, gaze shifts, expressive highlights), head movements with proper hair follow-through, mouth movements for speech (natural lip sync in anime style), emotional timing and transitions (gradual builds, hesitations, releases). Hair, cloth, and accessory dynamics: natural flow, bounce, and response to movement.
- The referenced character must NEVER appear stiff, frozen, limited in expression, robotic, or static because of the design lock.
- Costume, hairstyle, body type, posture, accessories remain consistent unless a clear on-screen action changes them.

IMAGE B: Environment / Background reference in matching anime style. Maintain exact geographical layout, architecture, lighting direction, and key anchor objects. No background morphing or art style shifts between shots.

IMAGE C: Supporting character. Apply same strict design lock + natural non-stiff fluid anime performance rules as IMAGE A.

IMAGE D: Vehicle / Animal / Object reference in consistent anime style. Maintain exact appearance, design language, and state unless physically interacted with on-screen.

AUDIO: Voice consistency if dialogue present. Natural breathing patterns and timing. Natural rhythm and pacing of speech in anime style. Appropriate room tone and ambient sound design.

----------------------------------------
DIRECTOR'S INTENT
----------------------------------------
What should the audience FEEL? Curiosity? Fear? Wonder? Sadness? Joy? Suspense? Excitement?
Never explain. Always reveal. Show. Never tell.
Every second must move emotion forward through animation and direction.

----------------------------------------
CHARACTER BIBLE
----------------------------------------
Describe behavior. Never describe emotion directly.
Example: He hides disappointment. She pretends to smile. He listens before acting.
He attacks only when necessary. He never wastes movement.
(For anime: emphasize observable animation cues: "His eyes narrow slightly before he speaks." "Her hair shifts as she turns her head sharply.")

----------------------------------------
WORLD BUILDING
----------------------------------------
The anime world must behave naturally within its own stylized rules and physics.
Wind affecting hair, clothes, and loose elements.
Atmospheric particles fitting the genre (falling leaves, dust, cherry blossoms, rain, sparks, etc.).
Background characters reacting logically to events.
Everything continues animating even if main characters stop moving.
Background details must remain consistent in design language and detail level.

----------------------------------------
SPATIAL GEOGRAPHY & CONTINUITY RULES (MANDATORY FOR MULTI-SHOT)
----------------------------------------
1. Overall Layout Description (1-3 sentences, very concrete, in anime style context).
2. Fixed Geography Anchor: "Camera North established at SHOT 1. All movement, facings, and camera pans relative to this fixed north."
3. Key Anchor Objects & Initial States (list 6-10 critical ones that must stay consistent).
4. Strict Rules for ALL shots:
   - Room layout, wall positions, window/door placements, large furniture: 100% identical in every shot.
   - Small props only change if character physically interacts with them on-screen.
   - Lighting direction, quality, and color temperature stay consistent. No magical lighting jumps.
   - Character body orientation and facing must make physical sense relative to geography.
   - Object permanence is absolute.
   - Art style, line quality, color palette, and rendering consistency must remain uniform across all shots.

In every multi-shot: "STRICT CONTINUITY ENFORCED: All shots share exact same spatial geography, object states, lighting, character design, and art style consistency. No design drift, no art style shifts."

----------------------------------------
VISUAL PHILOSOPHY
----------------------------------------
Believable anime world first. Grounded behavior and natural (stylized) physics within the anime aesthetic are non-negotiable.
Cinematic beauty and intentional composition in professional anime language are allowed when they serve emotion, atmosphere, and storytelling — as long as they never feel artificial, unmotivated, or break the sense of a coherent anime production.

----------------------------------------
CAMERA PACKAGE
----------------------------------------
Professional anime cinematography.
Dynamic motivated camera moves inspired by high-end anime studio productions.
Fluid animation timing with natural easing and follow-through.
Expressive framing that serves the story and emotion.
Human-like operator motivation — camera moves feel intentional and observed, not robotic.
Natural focus breathing and depth of field appropriate to anime style.
No robotic camera movement or stiff panning.

----------------------------------------
IMAGE CHARACTER
----------------------------------------
High-quality modern anime style.
Clean expressive linework with consistent weight.
Detailed and lively eye highlights, reflections, and shape changes.
Natural hair flow, strands, and physics with proper follow-through.
Cloth, fabric, and accessory dynamics responding to movement and environment.
Vibrant yet balanced color palette with rich tonal separation.
Expressive lighting and shading (cel-shaded or soft depending on genre/style reference).
Smooth fluid animation with professional timing and spacing.
Atmospheric particles or effects that fit the scene naturally.
No oversharpening or artificial edge enhancement.
No excessive clarity that looks digital/AI.
No static or poorly animated elements.

----------------------------------------
COLOR SCIENCE
----------------------------------------
Vibrant anime palette with natural color separation.
Rich shadows and expressive highlights.
Balanced saturation appropriate to genre (higher for action/sports, more muted for dramatic).
Natural skin tones or stylized rendering consistent with character design.
Expressive color contrast without clashing.
No crushed shadows or clipped highlights unless intentional.
No unnatural color shifts between shots.

----------------------------------------
CINEMATOGRAPHY
----------------------------------------
Every camera movement must have clear motivation within the anime scene.
Beautiful and intentional anime cinematic framing is allowed when it enhances mood, tension, or discovery — as long as it feels motivated.
The camera can be aesthetically pleasing in anime language while still behaving like an observer inside the scene.

----------------------------------------
BLOCKING
----------------------------------------
Every character has intention. All blocking must respect the SPATIAL GEOGRAPHY defined earlier.
Specify: Where Character A enters. Where Character B waits. Who notices first. Who reacts first. Who remains still.
Character orientations and movement paths must always be physically logical relative to the room layout and previous shot's ending position. Movement must obey the established physics and animation rules of the anime world.

----------------------------------------
ACTING DIRECTION
----------------------------------------
Never use: Sad. Happy. Angry.
Instead use:
- Breath slows (or animation timing slows)
- Eyes narrow slightly
- Looks away with subtle head turn and hair follow
- Tiny smile with eye crinkle
- Regrets speaking (hesitation in timing, slight shoulder drop)
- Hesitates before acting
- Forces confidence (posture shift, eye focus change)
- Avoids eye contact (gaze direction shifts)
- Almost loses control (subtle body tension, hair strands reacting)
- Micro expressions through eye shape and timing changes
- Natural pauses in animation and movement
(For anime: emphasize fluid timing, hair/cloth response to micro movements, eye highlight changes, proper easing in and out of expressions. Performance must feel like professional anime key animation, not limited or stiff.)

----------------------------------------
SHOT DESIGN
----------------------------------------
SHOT 1: HOOK — Immediately stop scrolling. Never explain. Create curiosity instantly.
SHOT 2: Reveal information. Not everything. Only enough to increase curiosity.
SHOT 3: Escalate. Raise tension.
SHOT 4: Deliver payoff. Reveal character. Not plot.
SHOT 5: Leave one unanswered question. Hard cut.
(Adapt pacing to anime genre — faster cuts for shonen/sports, more deliberate holds for drama/slice-of-life.)

----------------------------------------
RHYTHM
----------------------------------------
Movement. Stillness. Movement. Silence / hold. Action. Silence / hold. Cut.
Silence / hold is a storytelling tool in anime pacing.
Adapt rhythm to genre (faster energetic for action, deliberate and atmospheric for drama).

----------------------------------------
AUDIO
----------------------------------------
Natural (or stylized fitting) location sound design.
No unnecessary music unless motivated by scene/genre.
Dialogue only if absolutely needed — prioritize visual storytelling.
Wind. Footsteps with proper foley timing. Leaves rustling. Traffic. Animals.
Cloth movement and hair whoosh. Breathing (subtle animation cues).
Voice performance consistent with character design and genre.

----------------------------------------
EDITING
----------------------------------------
Natural anime pacing. No flashy transitions unless genre-appropriate and motivated.
No speed ramps unless clearly motivated. No unnecessary slow motion.
Invisible or seamless editing that serves the anime flow and emotional beats.
Feels observed and directed by a professional anime director, not artificially edited.

----------------------------------------
PHYSICS (ANIME STYLIZED)
----------------------------------------
Every movement obeys gravity and momentum within the established anime world's stylized physics.
Weight and impact have appropriate animation response (squash/stretch if genre allows, or realistic weight and follow-through in dramatic scenes).
Environmental logic: wind, rain, particles interact properly with characters and objects.
Causal persistence: Any change caused by a character must remain changed in all subsequent shots unless visibly reversed.
No random or unexplained changes: Nothing changes, appears, disappears, moves, reacts, or creates an anomaly without a clear visible physical or stylized cause.
Spatial direction consistency: Character facing and camera direction must follow logical geography. 180° flips without physical motivation are forbidden.
Nothing impossible within the anime world's established rules. Nothing random. Nothing that breaks object permanence, spatial logic, or design consistency.

----------------------------------------
NEGATIVE PROMPTS
----------------------------------------
No AI acting or stiff animation. No robotic / limited keyframe movement or timing. No overacting beyond motivated genre norms.
No commercial or generic anime lighting that looks artificial. No oversharpening. No hyper detail that fights the anime style.
No floating objects or poor physics. No static hair, hair clipping, or inconsistent hair flow/physics. No static cloth or poor cloth simulation.
No low quality anime rendering (blurry lines, flat colors, compression artifacts, inconsistent detail levels).
No 3D CGI / polygon look or western 3D animation style unless explicitly requested.
No western cartoon, Disney, or Pixar style unless specified.
No static background or poorly detailed / animated environment.
No flat or plastic shading / inconsistent rendering quality. No fake or inconsistent lighting effects.
No unrealistic camera movement or robotic panning. No unnecessary VFX without clear cause.
No sudden changes in art style, line quality, color palette, or rendering between shots.

CONTINUITY & LOGIC ERRORS — HIGH PRIORITY:
- Inconsistent room/environment/background layout between shots in the same scene
- Background details changing, morphing, or disappearing
- Furniture or objects teleporting without visible physical cause
- Any unexplained event or change without clear visible physical/stylized cause
- Character design, eye style/shape/highlights, hair, costume, body proportions suddenly different or drifted from reference (design drift) — OR character becoming stiff/frozen/static because of reference locking
- Multiple copies of the same character appearing without story reason
- Sudden unexplained changes in character facing direction or position (especially 180° flips)
- Stiff, frozen, limited, or unnatural facial performance / static hair and cloth / poor follow-through
- Lighting direction jumping illogically between shots
- Camera crossing the line of action without clear motivation
- Environment feeling like different anime productions edited together
- Any break in object permanence, causal logic, spatial logic, character design consistency, or animation quality consistency

----------------------------------------
FINAL GOAL
----------------------------------------
The audience should forget they are watching AI.
They should feel they are watching real high-quality anime footage from a professional anime studio production — consistent character designs across every frame, fluid natural performances with proper animation physics and follow-through, coherent world and storytelling, motivated camera work, as if it was a real scene from a high-end anime series or film.
```

---

**Version Note:** Anime Edition v1.0 — Adapted from the photorealistic Master Director Template v1.3. The core directing philosophy, continuity enforcement, causal logic rules, spatial geography requirements, and reference locking principles remain identical and non-negotiable. All visual language has been fully adapted for high-quality anime video generation while preserving the unbreakable rules against: character design drift, stiff/limited animation, continuity breaks, unexplained events/anomalies, and poor physics.

*Source: Extracted from Rangkuman_dan_Kompilasi_Skill.md — Added 2026-07-30*

