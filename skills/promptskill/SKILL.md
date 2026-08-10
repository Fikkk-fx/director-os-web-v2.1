---
name: "PromptSkill — Cinematic Prompting Engine v2.0"
description: >
  Transforms cinematic direction into optimized AI video prompts. Contains perfectly isolated 
  aesthetic compilers via XML tags (LIVE_ACTION, ANIME, 3D_COMIC) to prevent context bleed.
  Covers the complete prompt structure, visual storytelling principles, reference mapping,
  and anti-border enforcement. Works with VideoOrchestra for multi-clip workflows.
---
# PromptSkill — Cinematic Prompting Engine v2.0

## PURPOSE
To act as the final "Compiler" that turns director intent into a dense, physically observable text prompt for AI Video Generators (like Sora, Kling, Runway, Midjourney).

**THE NARRATIVE ANCHOR LAW:** Segala elemen visual yang Anda *compile* (kamera, lensa, warna, lokasi, *layering* kedalaman ruang, pakaian, properti) **WAJIB MUTLAK** dipicu dan dibenarkan oleh Cerita/Naskah (*Story/Writing*). Dilarang merakit kata kunci (*keywords*) atau elemen estetika hanya demi "tampilan sinematik yang keren". Jika elemen tersebut tidak menyumbang makna psikologis, karakter, atau lingkungan cerita, HAPUS. Estetika tanpa narasi adalah sampah.

**THE ANTI-SLOP DICTIONARY LAW:** DILARANG KERAS menggunakan kata *modifier* estetika AI pasaran dan murahan seperti: *"epic, masterpiece, 8k, highly detailed, trending on artstation, cinematic, unreal engine, gorgeous"*. Ganti semua kata adjektif malas tersebut dengan instruksi **GEOMETRI FISIK** (Misal: ganti "epic lighting" dengan "harsh 45-degree volumetric rim light", ganti "highly detailed" dengan "smooth organic skin, refined natural complexion, and fine fabric micro-threading, zero digital speckling, zero coarse pores").

**ROUTER INSTRUCTION:** Anda **TIDAK** mengatur gaya estetika (Live-Action, Anime, dll). Aturan estetika 100% dikendalikan oleh **CinSkill**. Tugas Anda di sini murni sebagai *Syntax Compiler* yang merakit blok teks Prompt (`[PROSE]`, `[GLOBAL LOCK]`, `[RENDER & ACTING LOCK]`, dll) sesuai dengan standar sintaks V19.1.

---

## UNIVERSAL PROTOCOLS (Applies to all engines)

### 0. PREMIUM AESTHETIC MANDATE (Anti-Dullness Law & Environmental Creativity)
**CRITICAL:** AI models often default to boring, pale/flat/sterile backgrounds OR fall back to cliché "cyberpunk" colors (generic neon pink/blue). You MUST actively override this lazy default behavior.
- **The Pale Ban (Anti-Pucat):** DILARANG menggunakan latar belakang putih polos, abu-abu pucat, atau ruangan kosong sebagai "default malas". Latar pucat/steril (seperti tembok putih) HANYA BOLEH digunakan jika memiliki **alasan naratif/tematik yang kuat** (contoh: *high-end minimalist art gallery, mental asylum, ruang interogasi, atau isolasi psikologis*). Jika menggunakan tembok putih, wajib tambahkan interaksi cahaya yang dramatis (misal: *harsh window shadows, soft bounced rim light*).
- **The Cliché Ban (Anti-Neon Pink/Blue):** DILARANG menggunakan kombinasi warna "cyberpunk neon pink & blue" kecuali user eksplisit meminta genre cyberpunk. Paksa AI menggunakan palet warna yang lebih canggih dan sinematik (misal: *Neo-Noir Gold & Deep Emerald, Crimson & Tungsten, Chiaroscuro Amber & Obsidian*, dsb).
- **Spatial Coordinate Anchors (Spatial Blueprint V2):** In `[GLOBAL LOCK]` and `[SPATIAL DEPTH ENGINE]`, you MUST explicitly anchor major structural elements (doors, windows, goalposts, floodlight towers, furniture) using absolute screen-space coordinates (`SCREEN-LEFT`, `SCREEN-RIGHT`, `CENTER`). Never describe landmarks generically without screen coordinates.
- **Real-World Euclidean Architectural Sanitation Law (Anti-Anomali Pintu/Jendela):** AI Video models naturally hallucinate side-by-side duplicate doors, floating windows, or impossible non-Euclidean walls when given vague plurals. You MUST explicitly lock exact numerical counts and hinge physics: *"strictly a single dark teak doorframe anchored on SCREEN-LEFT, exactly two tall glass windows on SCREEN-RIGHT, zero duplicate doorframes, zero floating window frames, strict 100% Euclidean real-world spatial architecture"*.
- **Architectural Exploration:** Selalu eksplorasi geometri dan gaya arsitektur secara ekstrem (hyper-creative). Jika user meminta "kamar tidur", JANGAN berikan kamar kotak biasa. Berikan *"Sunken bedroom with dark weathered teak wood walls, suspended glass fireplace, and deep amber rim lights"*. Jadikan lingkungan (environment) sebagai "karakter" tersendiri yang memukau.
- **Visual Justification:** Every element in the frame must look expensive, purposeful, architecturally complex, and aesthetically breathtaking.

### 0.5 THE ANTI-GENERIC DESCRIPTOR LAW (Anti-Malas)
**CRITICAL:** AI sering menggunakan deskripsi yang sangat generik jika tidak dipaksa. Anda **WAJIB** mengganti kata-kata generik dengan spesifikasi tekstural yang berdimensi:
- **Wardrobe Generik:** DILARANG menulis *"casual clothes"*, *"a suit"*, atau *"a dress"*. WAJIB spesifik secara material dan siluet: *"Oversized heavy wool trench coat, distressed denim, structured silk faille gown, tailored charcoal herringbone suit"*.
- **Cuaca/Waktu Generik:** DILARANG menulis *"Daytime"*, *"Night"*, atau *"Clear sky"*. WAJIB menggunakan cuaca yang memantulkan tekstur sinematik: *"Overcast morning mist, golden hour harsh shadows, post-rain wet neon streets, suffocating midday desert sun"*.
- **Ekspresi Generik (Show, Don't Tell):** DILARANG menulis *"He looks sad"*, *"She is angry"*, *"He is scared"*. AI Video tidak memahami emosi abstrak dengan baik. WAJIB mendeskripsikan anatomi otot wajah: *"Jaw clenched, swallowing hard, micro-tremor in the lower lip, widened pupils, flared nostrils, stiffened neck muscles"*.
- **The "Gritty" Ban:** DILARANG KERAS menggunakan kata AI generik *"gritty"* untuk mendeskripsikan tekstur kotor/kasar. Kata ini memicu render *noise* murahan pada mesin AI. WAJIB mendeskripsikan detail fisik teksturnya secara spesifik: *"oxidized rust, embedded grime in the fabric weave, heavily distressed surface, chipped industrial paint, oil-stained concrete"*.

### 0.55 THE DOCUMENTARY REALISM & ANIME PURITY MANDATE (Aesthetic Scoping Law)
**CRITICAL:** You MUST enforce genre-aware physics locking:
- **For Live-Action / Photorealistic Genres:** Inject into `[RENDER & ACTING LOCK]` or `[CAMERA & PHYSICS LOCK]`: *"Documentary-style camera physics, cinéma vérité, objective observational framing, heavy real-world gravity, grounded realism, smooth fluid 24fps cinema motion, 180-degree natural shutter angle."*
- **For 2D Anime / Sakuga / Animation Genres (ANIME PURITY & SAKUGA CADENCE MANDATE):** You MUST ABSOLUTELY EXEMPT 2D Anime from live-action optical camera jargon (`180-degree natural shutter angle`, `f/1.4 Anamorphic prime lens`, `35mm film stock`, `photorealistic motion blur`, `cinéma vérité`). Live-action shutter creates cheap 3D CGI motion blur and ruins 2D aesthetic. You MUST instead inject **The Authentic 2D Sakuga Frame & Smear Physics**:
  - **Anime Camera & Physics Lock:** *"2D Sakuga keyframe animation layout physics, dynamic multi-plane camera sweeps, expressive On-Twos drawing cadence transitioning into high-velocity 1-koma full Sakuga impact frames, sharp hand-drawn line smears (Obake smears), zero live-action optical shutter blur, pure cel-shaded aesthetic."*
  - **Anime Storyboard Lock:** *"A professional anime storyboard, 10-panel grid layout, 2D anime animation stills, crisp cel-shaded linework, clean white borders."*

### 0.6 THE IN-MEDIA-RES COMPOSITION LAW (Anti-Walking-Forward)
**CRITICAL:** AI Video memiliki bias bawaan (*default*) yang sangat malas: jika Anda tidak mendikte posisi kamera dan pose karakter di detik pertama, AI akan SELALU memulai klip dengan "Karakter berjalan lurus menatap kamera di tengah frame". Ini membosankan, datar, dan generik.
- **BANNED:** DILARANG memulai adegan dengan komposisi netral tanpa sudut kamera (misal: *"He is walking down the street"*).
- **MANDATORY (Dynamic Anchor):** Mulailah setiap klip dengan karakter **sudah berada di tengah sebuah pose/aksi spesifik**, direkam dari sudut yang dinamis.
  - *Contoh 1:* `[LOW ANGLE SHOT] Kamera merekam dari balik bahu, karakter sedang menunduk mengikat tali sepatu.`
  - *Contoh 2:* `[DUTCH ANGLE] Karakter bersandar miring di dinding, membelakangi lensa.`
  - *Contoh 3:* `[OVERHEAD ZENITH SHOT] Kamera menatap tegak lurus ke bawah, karakter terbaring menatap langit-langit.`
- **Kuncinya:** Jadikan letak geografis kamera dan pose awal tubuh karakter sebagai perintah mutlak di awal paragraf `[PROSE]`.

### 0.7 THE FLUENT LANGUAGE DIALOG PROTOCOL (Anti-Lip-Sync)
**CRITICAL:** AI Video model generasi baru (yang memproses audio/video native) sering kali merender gerakan mulut yang kaku atau tidak sinkron jika Anda menggunakan istilah teknis seperti "lip-syncing".
- **BANNED:** DILARANG menggunakan kata *"lip-syncing"* atau *"lip-sync"* di dalam teks `[PROSE]`.
- **MANDATORY:** Anda WAJIB menggunakan frasa *"speaking fluent [Nama Bahasa]"* untuk memicu mesin analitik bahasa bawaan AI agar merender pelafalan bibir *native*.
- *Contoh yang Benar:* *"He looks directly at the camera, speaking fluent Japanese, shouting: 'Kirei!'"*
- *Contoh yang Benar:* *"She leans in, speaking fluent Spanish, whispering: 'Te amo.'"*

### 0.8 THE NATIVE AUDIO INTEGRATION LAW (NO SEPARATE BLOCKS)
**CRITICAL:** AI Video models (seperti Kling, Seedance, Presti) menghasilkan Video dan Audio secara *native* dari satu teks. DILARANG KERAS membuat blok `[AUDIO PROMPT]` yang terpisah. Semua dialog dwibahasa, efek suara (SFX), dan teknik audio tingkat tinggi WAJIB dilebur langsung ke dalam paragraf aksi `[PROSE]`.
- **Cross-Voice / Pre-lap (Audio Bleed):** Untuk membuat suara bocor sebelum adegannya muncul. (*Contoh: "While the camera tracks the silent hallway, we hear an early audio bleed from completely off-screen: a man screaming 'Get out!' in fluent English."*)
- **Off-Screen (O.S.) Dialog:** Untuk suara dari luar layar tanpa merusak fokus kamera. (*Contoh: "The camera focuses strictly on her terrified face. Suddenly, a harsh voice yells from completely OFF-SCREEN: 'Waktumu habis!' in fluent Indonesian."*)
- **Voice-Over (V.O.) / Inner Monologue:** Untuk suara hati tanpa menggerakkan bibir. (*Contoh: "His lips are completely closed, no mouth movement. Over this visual, we hear a deep VOICE-OVER (internal thoughts) whispering: 'Ini belum selesai...'"*)
- **Integrated SFX:** Deskripsikan SFX bersamaan dengan tabrakan fisiknya. (*Contoh: "The bat shatters the glass table with a sickening high-frequency shatter and heavy sub-bass crunch."*)

### 1. Multi-Reference Protocol & The Rule of One (Anti-Bleed)
- **MULTI-CHARACTER DISTINCT TAG MANDATE (ZERO TAG SHARING):** Every distinct character or subject in a scene MUST be assigned a UNIQUE reference tag (e.g. Mother = `@image1`, Father = `@image2`, Son = `@image3`, Daughter = `@image4`). You are STRICTLY FORBIDDEN from assigning the same tag (like `@image1`) to multiple different characters. Tag sharing causes catastrophic AI face-merging and character cloning glitches.
- **THE RULE OF ONE & MULTI-SHOT TIMESTAMP EXCEPTION:** In AI Video Diffusion, mentioning a reference tag multiple times in a single continuous shot damages weighting. Therefore, for single continuous shots, mention a local reference tag (e.g., `@image1`) **EXACTLY ONCE** inside `[PROSE]`. For multi-shot timestamped prompts (`[0s-3s]`, `[3s-7s]`, etc.), `@image1` is permitted **EXACTLY ONCE PER TIMESTAMP BLOCK** inside `[PROSE]` to lock identity across cuts.
- **Bracket Exclusion:** NEVER place `@image` or `@audio` tags inside technical blocks (`[ACTING & LIGHTING SCIENCE]`, `[CAMERA SCIENCE & KINETIC PHYSICS]`). Technical blocks MUST use the character's NAME only (e.g., "Kenji wears..."). The reference tag is ONLY permitted inside `[PROSE]`.
- **Anchor Locking System:** To ensure the AI doesn't mix up characters when they are only tagged once, you must use Name Binding (e.g., `Kenji (Local @image1)`) inside `[PROSE]`, and rely on `[GLOBAL LOCK]` (using just the name "Kenji") to define their exact wardrobe.
- **Multi-Ref Assembly:** When assigning multiple references to ONE character (e.g., Face from Image 1, Body from Image 2), assign roles explicitly: *"Using the exact person across all provided reference images. Take the face from @image2. Take the full body from @image1."* 
- **Lighting Recalculation:** Always add: *"Completely recalculate all lighting, shadows, and reflections to match the new environment. Ensure a seamless natural skin transition between the face and neck."*

### 1.2 THE STRICT CLONE & SCREEN MAPPING PROTOCOL (UI/Props)
**CRITICAL:** Jika pengguna telah menyiapkan gambar referensi (*Reference Image*) untuk antarmuka UI, Logo, atau Properti Spesifik:
- **Aturan Veto Desain:** Jangan pernah mencampuri desain yang sudah ada di gambar referensi. Biarkan gambar referensi yang berbicara.
- **MANDATORY INSTRUCTION:** Gunakan frasa absolut untuk memaksa AI mengkloning gambar tersebut tanpa halusinasi.
- **The Screen Mapping Protocol:** Jika pengguna melampirkan gambar "Full UI" (tangkapan layar utuh) tapi adegannya menuntut UI tersebut berada di dalam HP karakter, Anda WAJIB memberikan instruksi *mapping* secara eksplisit.
- **Anti-Generic UI Framing (The POV Screen Protocol):** DILARANG KERAS menggunakan klise murahan di mana karakter menunjukkan layar HP/UI menghadap lurus ke arah lensa (*breaking the 4th wall*). UI WAJIB ditampilkan melalui logika tata ruang (*spatial logic*) yang membumi, seperti *Over-The-Shoulder* (OTS) dari sudut pandang karakter kedua (POV), atau *Extreme Close-Up* khusus pada tangan yang memegang layar. 
- **The Off-Screen Voice Protocol:** Jika kamera berada dalam mode *Extreme Close-Up* layar/tangan atau sudut mana pun di mana wajah karakter yang berbicara TIDAK TERLIHAT di layar (*off-frame*), Anda WAJIB mendeskripsikan dialognya sebagai `Off-Screen Voice` atau `Off-Screen Dialogue`. Hal ini sangat kritis untuk mencegah AI kebingungan mencari wajah dan mencoba melakukan *lip-sync* pada benda mati (seperti tangan atau layar HP).


### 1.4 THE ZERO-REDUNDANCY SYNTAX LAW (Anti-Echo)
**CRITICAL:** Mengulang deskripsi pakaian, lingkungan, atau warna yang sama persis di berbagai blok *prompt* (misal: ditulis di PROSE, diulang di GLOBAL LOCK, diulang lagi di COLOR LOCK) akan melipatgandakan bobot secara artifisial dan membuat AI berhalusinasi (menghasilkan gambar ganda atau kebocoran warna).
- **[PROSE] (Fokus Aksi murni):** HANYA gunakan nama pendek. DILARANG menjabarkan detail pakaian di sini. (Contoh Benar: *"The Groom (@image1) panics beside the Bride (@image2)."*) (Contoh Salah: *"The Groom (@image1) wearing a black suit panics..."*).
- **[GLOBAL LOCK] (Satu-satunya tempat definisi):** Ini adalah SATU-SATUNYA tempat Anda mendeskripsikan pakaian lengkap dan tata ruang/lingkungan secara utuh. (Contoh Benar: *"Subject 1: Groom, wearing a black tailored suit... Environment: Ominous dark red sky."*)
- **[COLOR GRADE LOCK]:** Hanya tulis nama 3 warnanya saja, jangan sebut ulang objeknya. (Contoh Benar: *"Primary Triadic Separation (Crisp White, Dark Red, Obsidian Black)."*)

### 1.5 THE UNIFIED OBJECT PERMANENCE LAW (Anti-Disappearing Glitch)
**CRITICAL:** AI Video Generators menderita **Amnesia Objek 100%**. Jika barang/desain tidak terus-menerus diingatkan, AI akan menghapusnya dari layar.
- **Continuous Prop Binding (Cross-Clip):** Jika sebuah barang (pistol, payung, tas) dipegang di Klip 1, Anda WAJIB mendeskripsikan ulang barang tersebut di Klip 2 jika masih ada di *frame* (baik di `[PROSE]` maupun `[GLOBAL LOCK]`).
  - *Contoh Salah:* (Klip 2: Dia berlari menembus hujan). -> AI menghapus pedang di Klip 2.
  - *Contoh Benar:* (Klip 2: Dia berlari menembus hujan, **tangan kanannya masih menggenggam erat pedang baja**).
- **The 180-Degree Blindspot (Cross-Angle):** Saat karakter berbalik badan 180 derajat (membelakangi kamera), AI sering melupakan desain ransel, jubah, atau logo punggung. Anda WAJIB memaksa AI membaca referensi punggung.
  - *Contoh Benar:* *"Character turns around. Reference the BACK FULL BODY panel of @image1 to maintain exact 3D geometry of the backpack."*

### 2. Tri-Sheet Reading Protocol (The Blueprints & Anti-Grid Glitch)
**CRITICAL:** When feeding a multi-panel grid (CharSheet/EnvSheet) into an AI Video Generator (like Sora/Kling) as a reference, you MUST explicitly forbid it from rendering the grid lines, or it will generate a video of a floating grid.
When dealing with references, instruct the AI how to read them:
- **6-Panel Character:** *"Reference @image1 is a 6-panel character sheet. ONLY use it as an identity reference. DO NOT render the grid lines, text labels, or multiple panels. Render a single, unified cinematic frame. Read the top panels for facial structure, and bottom panels for body/wardrobe."*
- **7-Panel Environment:** *"Reference @image4 is a 7-panel map. DO NOT render the map or grid lines. ONLY render a single cinematic frame from the [North/South/East/West/Up/Down] POV."*
- **4-Panel Prop:** *"Reference @image3 is a 4-panel prop sheet. DO NOT render the grid. ONLY render the [Front/Back/Left/Right] view texture for the object in this scene."*

### 3. Typography Constraint & Background Blur (Anti-Garbage Text)
- **CRITICAL:** AI Video models cannot spell complex sentences and will generate alien/melting text on background signs (e.g., in supermarkets, cyberpunk cities, billboards).
- **Foreground Text:** If the scene requires readable text (e.g., a logo on a shirt), limit it to 1-2 words MAX and enclose it in bold quotes. Example: A glowing neon sign displaying the word **"HOTEL"**.
- **Background Text (The Bokeh Trick - Use with Logic):** If the scene takes place in a sign-heavy environment (like a supermarket aisle), you can blur the background to hide AI spelling errors using shallow depth of field (bokeh). **HOWEVER, this must make cinematographic sense.** Only use this on Medium or Close-Up shots focused on a character. Do NOT artificially blur Wide Establishing Shots just to hide text (it looks unnatural).

### 5. Continuity & Override Protocol (State-Changes & Costume Override Law)
- **Costume Override Cleanup Law:** When a dedicated per-costume `CharSheet` reference image is uploaded for a clip (`@image`), you MUST ELIMINATE the word `OVERRIDE` in `[GLOBAL LOCK]` and directly specify the costume (`"wearing Female Look #2..."`). The `OVERRIDE` keyword is strictly reserved ONLY for dynamic mid-scene state transformations, weather physics (wet/damp), or subtle combat damage (soot/dirt/torn fabric) that are not represented by a standalone reference sheet.
- **Mid-Scene Physics Override:** If a character undergoes dynamic mid-scene damage or wetness (e.g., falling into mud, getting rained on), write the Override Command strictly for physical state: *"Use @image1 as identity base, OVERRIDE physical state to wet damp hair and soot smudges on cheeks."*
- **Chronological Trauma & Healing (Time-Context Logic):** AI Video models suffer from temporal blindness. You MUST calculate the passage of time between clips. If characters are in a continuous battle, explicitly instruct the AI to accumulate damage in the wardrobe check (e.g., "bruises are now darker, shirt is torn, covered in sweat"). If the script says "The Next Day" or "3 Days Later", explicitly instruct the AI to heal them (e.g., "wet clothes are now completely dry, bleeding cuts have faded into yellow healing scabs, completely unbruised"). Do NOT let the AI guess the passage of time.

### 6. Voice Characteristic Reference (@audio)
If the clip contains character dialogue, do NOT use rigid protocol brackets. Instead, treat `@audio` tags as **Voice Characteristic References** (e.g., bass, raspiness, pitch, vibrato) and integrate them fluidly into the dynamic prose.
- **Strict Persona Rule:** These tags are STRICTLY used as persona anchors for native video engines or node workflows. Do NOT generate separate ElevenLabs prompts. The dialogue remains 100% native in the prose.
- **Dynamic Flow:** The flow of the dialogue and the physical act of speaking must adapt dynamically to the action in the video.
- **Prose Integration:** Describe *how* they speak alongside their actions. Example: `Rama dodges the strike, his chest heaving as he shouts (Local @audio1: fluent native Indonesian, deep raspy bass) "Sini lo!"`
- **ANTI-RIGID DIALOGUE MANDATE:** You MUST NOT use rigid, script-like formatting for dialogue such as `SPEAK:`, `DIALOGUE:`, or `SAYS:`. Dialogue MUST be seamlessly integrated into the narrative prose as a natural continuation of the character's physical action.
- The Rule of One (Audio): You must NEVER mention a character's @audio tag more than once per clip to avoid parser duplication. If a character speaks multiple times in a single clip, attach the @audio tag ONLY to their FIRST line of dialogue.
- The Rule of Silence: You MUST NOT use a character's @audio tag in a clip if they do not speak in that specific clip.
- **The One-Off Voice Exception:** You MUST ONLY assign an `@audio` tag for characters who speak across MULTIPLE clips. If a character only speaks ONCE, DO NOT use a tag. Let the AI engine invent a native voice.
- Anti-Typo Dialogue (Verbatim Protocol): To prevent AI video models from hallucinating or generating "typo" audio (e.g., saying B when the prompt says A), you MUST strictly follow this formatting:
  1. Verbatim Extraction: You must copy the dialogue EXACTLY character-for-character from the original script. Do NOT summarize, rephrase, or translate it. If the script dialogue is in Indonesian, write the exact Indonesian text inside the prompt.
  2. Strict Quotation: The spoken dialogue MUST be wrapped in standard double quotes "".
  3. Punctuation Sanitization & TTS Safety: AI Video text-to-speech engines struggle with complex symbols. Strip out unnecessary ellipses ..., em dashes -, or brackets () from inside the quotation marks so the engine reads the words cleanly. Keep only basic punctuation (, . ! ?).
  4. GLOBAL ANTI-MARKDOWN & BRACKET SYNTAX LAW: Do NOT use Markdown formatting (bullet points -, *, or bold/italic) inside the narrative `[PROSE]` paragraph. Bracket tags `[...]` are reserved ONLY for timestamp beat headers (e.g., `[0s-3s]`) and explicit editing markers (e.g., `[HARD CUT: ANGLE SHIFT]`). All internal narrative camera and kinetic movements MUST be written as smooth, natural flowing English sentences (e.g., "the camera executes a rapid push-in toward..."). Separate visual items using commas, spaces, or pipes |.
- Lip-Sync Anchoring (Anti-Ventriloquist Glitch): When Rapid Banter occurs, the AI model will often move both mouths at the same time. To prevent this, you MUST explicitly dictate the mechanical turn-taking of their mouths in the [NARRATIVE ACTION PARAGRAPH]. 
  - Rule of One Compliance: Even in Rapid Banter, NEVER use their @image tags more than once in the paragraph. Use their physical descriptions or names to anchor the lip-sync instructions.


### 8. MACRO & FINE-MOTOR PROTOCOL (Anti-Melting Insert Shots)
**CRITICAL:** AI Video Generators are notoriously bad at rendering fine-motor skills (fingers interacting with small objects like keys, locks, wires, keyboards) and will often melt the fingers into the metal.
**Action:** If the scene involves an Insert Shot of a character manipulating an object with their hands, you MUST apply these three rules in the prompt:
1. **Camera Logic:** Force an Extreme Close-Up (ECU) with a Macro Lens. (e.g., "Macro lens, extreme close-up insert shot, ultra-shallow depth of field completely blurring the background"). This forces the AI to spend 100% of its processing power on the object and fingers.
2. **Mechanical Physics:** Do NOT use vague verbs like "He unlocks the padlock". You must describe the mechanical physics. (e.g., "A steel key is inserted into a brass keyhole and turned 90-degrees clockwise until a mechanical click is heard").
3. **Anti-Melting Tag:** You MUST append this exact phrase to the Narrative Action Paragraph: *"Physically accurate object permanence, 5 distinct human fingers, fingers do NOT melt or merge with the metal object, maintaining strict structural boundaries."*

### 9.1 ANTI-ZOOM-ZOOM LAW (Anti-Position-Teleport)
**CRITICAL:** AI Video Engines have zero 3D spatial memory. When you zoom in then zoom out, the AI reconstructs the scene from scratch and often teleports the subject to a different position.
- **BANNED PATTERN:** Never write "zoom in then zoom out" or "push in then pull back" within a single clip prompt.
- **SOLUTION (Mono-Directional):** Use only ONE camera direction per clip: either zoom IN the entire clip, or zoom OUT the entire clip, or track laterally. Never reverse.
- **SOLUTION (Hard Cut):** If you need both a close-up AND a wide shot, use `[HARD CUT: ANGLE SHIFT]` between them. This resets the AI's spatial expectations cleanly.
- **SOLUTION (Orbit):** A continuous orbital move (camera circles the subject) is safe because distance stays constant.

### 9.2 ANTI-FREEZE WORD LAW (Anti-Still-Frame)
**CRITICAL:** AI Video Engines interpret the words "freeze", "static", "still", "hold pose", "motionless", and "locked in place" LITERALLY — they will generate a completely frozen still image for the remaining duration.
**SCOPE:** This ban applies ONLY to the `[PROSE]` narrative action paragraph and `[MOMENTUM CARRY-OVER]` tag. It does NOT apply to style engine descriptions (e.g., "static camera" in Comedy/Deadpan is a legitimate artistic direction for the CAMERA, not the CHARACTER).
- **BLACKLISTED WORDS in [PROSE]:** `freeze`, `frozen`, `static`, `still`, `motionless`, `hold pose`, `locked in place`, `stops moving`.
- **SAFE REPLACEMENT:** Instead of "contrapposto freeze", write: *"settles into contrapposto stance, continuous subtle micro-tremors in fingers, hair drifting, fabric settling, chest breathing."*
- **THE LIVING STATUE RULE:** Even when a character "stops" moving, you MUST describe at least 3 continuous micro-movements: (1) breathing/chest rise, (2) hair/fabric drift, (3) finger/eye micro-twitch. This keeps the AI rendering motion instead of a still frame.

### 10. STRICT CHARACTER LIMIT MANDATE (1,900 - 1,950 CHARACTERS) - MATHEMATICAL ABSOLUTE
**CRITICAL:** Native AI video engines (Sora, Kling, Runway) truncate anything over 2000 characters, cutting off camera science parameters at the end of the prompt. You MUST mathematically guarantee that your total output block per clip is strictly between 1,900 and 1,950 characters (Max 2,000).
- **Hard Floor (1,900 Minimum):** You MUST NOT output a prompt shorter than 1,900 characters. If your draft is 1,600-1,800, inject additional micro-physics, haptic textures, and cinematic lighting details until it crosses 1,900.
- **Hard Ceiling (1,950 Maximum / Strictly Max 2,000):** The absolute maximum for default API execution is 1,950 characters (Strictly Under 2,000).
- **Mandatory Self-Audit:** Before outputting, count your characters. If under 1,900, expand physics/textures. If over 1,950, trim adjectives. Mode *uncompressed* (>2,000 chars) is ONLY allowed if explicitly requested by the user.

### 11. EXPLICIT CUT SYNTAX (Editing Logic)
**CRITICAL:** To prevent AI Video models from hallucinating location or time shifts within a single prompt, you MUST use explicit cut syntax instead of generic `[HARD CUT]`. Do NOT change locations or time-of-day within a single 10s prompt; if a script demands a location/time shift, split it into separate prompts using VideoOrchestra.
For cuts WITHIN the same location/time, use these explicit markers:
1. `[HARD CUT: ANGLE SHIFT]` — Forces the AI to change the camera angle/lens while maintaining the exact same time and location.
2. `[HARD CUT: JUMP CUT]` — Skips forward 1-3 seconds in time at the exact same location (e.g., character moves from standing to suddenly sitting).
3. `[MATCH CUT: VISUAL TRANSITION]` — Used for creative transitions where Object A cuts to Object B with a similar shape/composition.

### 12. ARCHITECTURAL METRIC & DOOR-LEAF MECHANICS PROTOCOL
**CRITICAL:** AI Video Generators hallucinate missing door leaves, floating window frames, or impossible door sizes unless explicit metric door leaf & sill anchors are injected into `[GLOBAL LOCK]` and `[PROSE]`.
1. **Door Leaf Anatomy:** NEVER write "door" or "doorframe" alone. You MUST explicitly specify Door Leaf State (`solid single-leaf paneled teak door flush inside door jamb` OR `swung inward 45 degrees exposing 50mm leaf edge`), hardware (`brushed brass lever handle at 1.0m height`), and threshold (`20mm marble door sill threshold`).
2. **Human Metric Scale Binding:** ALWAYS anchor architectural openings to human body metrics: `"Standard 2.1-meter height x 0.9-meter width single-leaf teak door, bottom window sill set at 0.9m height from floor level, 3.0m ceiling clearance"`.
3. **Global Lock Defect Override:** You MUST inject into `[GLOBAL LOCK]` and `[CAMERA SCIENCE & KINETIC PHYSICS]`: *"Strict 100% Euclidean real-world architecture: single-leaf paneled teak door flush inside jamb, human-scale 2.1m x 0.9m proportion, zero floating window frames, zero missing door leaves, zero phantom openings."*
