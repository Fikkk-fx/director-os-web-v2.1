---
name: "ContinuitySkill — The Cross-Clip Memory & Physics Engine v1.0"
description: >
  Enforces strict logical continuity across multi-clip video prompts. Acts as a memory engine to ensure physical physics, wardrobe states, environmental lighting, and character conditions realistically persist and transform from one clip to the next without hallucination or resets.
---

# ContinuitySkill — The Cross-Clip Memory Engine v1.0

## The Core Mandate
AI Video Engines (Sora, Kling, Runway) suffer from "amnesia." They treat every prompt as a completely independent universe. Even if you use a locked `@image` reference, the AI will naturally reset the character to a clean, default state in every clip.
**Your job as Director O.S. is to manually force Continuity Logic by EXPLICITLY overwriting the character and environment states in the `[PROSE]` and `[GLOBAL LOCK]` based on the causality of the previous clip.**

Whenever orchestrating a multi-clip sequence, you MUST autonomously apply these 5 Continuity Laws.

---

## Law 1: Kinetic Physics & Secondary Attributes (The Movement Consequence)
If a character engages in extreme physical movement (sprinting, fighting, falling, extreme panic) in Clip A, their secondary physical attributes MUST explicitly reflect this in Clip B.
- **Accessories:** If a character wears glasses and is violently thrown to the ground, the next shot MUST state the glasses are broken, skewed, or missing.
- **Hair/Grooming:** Hair cannot remain perfectly styled after heavy action. You must inject terms like "disheveled hair," "sweat-drenched hair," or "unkempt hair."
- **Example:** *(Clip 1: High speed run)* -> *(Clip 2 Prompt: "The man's glasses are slipping down his nose, his hair completely disheveled from the sprint...")*

## Law 2: Spatial Consistency & Angle Logic
AI models lack 3D spatial awareness. If a character interacts with a physical surface, the consequence of that interaction MUST persist when the camera angle changes.
- **The Anatomical Precision Rule (CRITICAL):** You MUST explicitly specify the EXACT anatomical position of the damage/dirt. NEVER just write "he is muddy" or "she is bleeding". You MUST write "thick mud coating his upper left shoulder" or "dark blood trickling from her lower right lip."
- **The Mud/Dirt Rule:** If Clip A shows a character falling backward into mud, Clip B (even if the character is now standing up) MUST explicitly state that the back of their shirt and the back of their head are covered in thick mud.
- **The Blood Rule:** If a character gets punched in the left cheek in Clip A, Clip B MUST explicitly describe a bruised and bleeding left cheekbone.

## Law 3: Wardrobe & State Transformation (The Anti-Reset Law)
`CharSheets` guarantee identity lock, but they are NOT an excuse to ignore story progression. Wardrobe states MUST transform over time.
- **The Weather Consequence:** If Clip 1 takes place in torrential rain, the characters in Clip 2 MUST be explicitly described as having "soaking wet clothes clinging to their bodies," unless the story clearly states hours/days have passed and they have dried off.
- **The Battle Damage Consequence:** Clothes tear, stretch, and get dirty. In a multi-clip fight scene, you MUST specify EXACTLY which part of the clothing is damaged. Do not write "torn clothes". Instead write "a massive tear on the right sleeve exposing the elbow" or "a blood-stained left collar".
- **The Footwear Permanence Rule:** Pay absolute attention to when a character takes off their shoes/socks (e.g., entering a house, sleeping). If they are barefoot in Clip 1, and they run outside in Clip 2 due to panic, they MUST be explicitly described as "running barefoot" or "wearing socks without shoes" in Clip 2. Do not let the AI auto-generate default shoes.
- **Exception:** Do NOT apply hyperbolic/cartoonish damage unless requested. Stick to grounded, subtle realism.

## Law 4: Environmental Transformation & Reference Continuity
`EnvSheets` provide spatial layout, but lighting, camera angle vectors, and environment states MUST adapt to the narrative causality across cuts.
- **The 180° Reference Angle Vector Binding Law:** Map `@image_env1` (Shot A - Master Establishing Shot) ONLY for North/East-facing camera angles. When cutting 180° to a Reverse Angle (South/West-facing), you MUST switch the prompt reference tag to `@image_env2` (Shot B - Reverse Angle Ref) to prevent background morphing and geometry inversion.
- **Focal SubEnvSheet Exclusivity Lock:** In medium coverage shots or dialogue cuts (>15s in a sub-zone), `SubEnvSheet` (`@image_subenvX`) MUST completely replace `Master EnvSheet` (`@image_env1`). Never supply both master wide and sub-env references in the same prompt codeblock.
- **Time Progression:** If a sequence spans several hours, the lighting MUST dynamically shift. A daytime `EnvSheet` can be overridden by adding "Dusk lighting, long shadows" or "Nighttime, illuminated by harsh street lamps" in the subsequent clip's prompt.
- **Destruction & State Override Persistence:** If a car or wall explodes in Clip 1, Clip 2 MUST map to `@image_env_Damaged` OR inject `[ENVIRONMENT STATE OVERRIDE: locked to @image_env1, OVERRIDE background to heavy scorched blast damage, active smoke plumes]` to prevent the AI from erasing the destruction.

## Law 5: The Cross-Clip Shared World (Micro-Cues)
Even if the location changes slightly between clips (e.g., from an alleyway to a street corner), you must inject "Micro-Cues" to make the world feel cohesive and continuous.
- If Clip 1 shows a neon sign flickering in the rain, and Clip 2 is an extreme close-up of a character hiding nearby, explicitly write that the "flickering pink neon light casts shadows on the character's face." This optical continuity glues the two independent clips together into a single cinematic reality.

## Law 6: Prop & Handheld Weapon Permanence & Combat Vector Lock
AI Models will often make handheld weapons (katanas, keris, pistols, pipes) randomly disappear, flip hands, or spawn new objects out of thin air during fast action. You MUST explicitly track the state of handheld props across clips:
- **Handheld Weapon Permanence & Chirality Lock:** If a character holds a weapon (`@prop1`), you MUST explicitly state which hand holds it AND enforce finger grip physics: `"held firmly in RIGHT HAND, 5 distinct fingers gripping hilt, zero weapon vanishing, zero hand melting, strict structural weapon permanence"`.
- **The Discard / Disarm Rule:** If they are NO LONGER holding the weapon in Clip 2, the prose MUST explicitly state why: `"having dropped the weapon, now entirely empty-handed"`, so the AI doesn't hallucinate it back into their grip.
- **Impact Momentum Vector Lock:** In combat scenes, physical fall trajectories MUST be bound to kinetic impact vectors in `[PROSE]` and `[PHYSICS VECTORS]`: `"impact force directed 45 degrees to SCREEN-RIGHT, body tumbles backward along kinetic impact vector, zero illogical fall reversal"`.

## Law 7: The Progressive Sheet Law (Universal Image Override Mandate)
We have mathematically proven that if an `@image` reference has strong visual data (like glasses, a pristine car, or a clean room), the AI's image weight will completely crush text instructions if the camera angle exposes the subject clearly. Text reiteration is not enough.
- **Universal State Change Threshold:** If ANY subject—a primary character, a side character, an environment (EnvSheet), or a prop/vehicle (PropSheet)—undergoes a PERMANENT, drastic physical change (e.g., character heavily bleeding, building destroyed, car heavily crashed, sword broken in half), you CANNOT use the original clean `@image1` for the subsequent clips.
- **The Progressive Sheet Generation:** You MUST instruct the user to generate an updated "Battle Damaged" or "State B" Sheet (e.g., CharSheet 2, EnvSheet 2, PropSheet 2) depicting the new destroyed/altered state. **CRITICAL IDENTITY LOCK:** You CANNOT generate State B from scratch. The prompt for this Progressive Sheet MUST explicitly begin with an Image Lock instruction (e.g., *"Please use the attached image as a reference to lock the structural identity..."*) so the AI maintains the exact core identity while generating the damage.
- **The Override Execution:** For all clips following the damage, map the subject to the new `@image2`. This is the ONLY way to force an I2V engine to respect major continuity changes without hallucinating back to the clean state.
- **The One-Take Real-Time Exception:** If the destruction/damage happens dynamically ON-CAMERA in a single continuous shot (e.g., a car crashes, a character gets punched, a building explodes in real-time), DO NOT use `@image2`. You only use `@image1` (the clean state) as the starting reference. The transformation must be driven entirely by Kinetic Action in the `[PROSE]`. `@image2` is ONLY used for the *subsequent* clips (after a camera cut) to lock the aftermath of that damage.

## Law 8: Intra-Clip & Cross-Clip Lighting & Solar Vector Lock (Anti-Chromatic Shift)
AI Video Generators suffer from severe light flickering and mid-clip chromatic hallucination (e.g. starting with warm sunset lighting and randomly shifting to blue/green neon mid-clip or across cuts).
- **Intra-Clip Chromatic Stability:** In every clip's `[PROSE]` and `[RENDER & ACTING LOCK]`, you MUST anchor the primary light source and state: *"Constant single light key, zero chromatic flickering, zero mid-clip light source shift"*.
- **Cross-Clip Solar Vector & Kelvin Continuity Law:** If Clip 1 and Clip 2 take place in the same setting and time, the exact key-to-fill light ratio, Kelvin color temperature, primary shadow direction, and solar vector angle (e.g. `5500K volumetric daylight bleeding at 45-degree angle from SCREEN-LEFT`) MUST be mathematically identical across ALL sequence clips. Do not change light vector descriptions between cuts unless the narrative explicitly dictates a physical light source change (e.g., a candle blowing out or sun setting).

## Law 9: The Absolute Seamless Cut-on-Action & Velocity Matching Mandate (Zero-Jump-Cut Law)
AI Video Generators naturally create a buffering glitch or static pause at the start of a clip if the physical action isn't anchored to continuous velocity vectors. When stitching multi-clip sequences in post-production, this creates jarring jump cuts. You MUST enforce the Zero-Jump-Cut Law across ALL multi-clip sequences without exception:
1. **Mid-Kinetic Termination (End of Clip N):** `KLIP N` MUST NEVER terminate on a static, passive, or fully completed posture. The final 1.0 second of `KLIP N` MUST explicitly depict an active, unfinished physical motion or posture shift (e.g. *initiating a turn of the head, beginning to dive, mid-swing of an arm, mid-step of a sprint*).
2. **Instant Velocity Continuation (Start of Clip N+1):** `KLIP N+1` at timestamp `[0.0s]` MUST immediately pick up the completion of that exact same physical velocity and momentum vector from a new contrasting camera angle (*85mm Extreme Close-Up, 180° Reverse Angle, or Nadir Look-Up*).
3. **Eyeline & Chirality Vector Anchor:** Left/Right screen coordinates (`SCREEN-LEFT` vs `SCREEN-RIGHT`) and eyeline vectors MUST be mathematically locked across the cut boundary.
4. **Post-Production Guarantee:** When stitched sequentially in any video editing software (CapCut, Premiere, DaVinci), the transition between `KLIP N` and `KLIP N+1` MUST feel like a single unbroken, seamless, fluid cinematic cut.

---

## ⚠️ THE CONTINUITY AUDIT (MANDATORY)
Before printing the final Phase 2 Video Prompts, you MUST run a silent self-audit:
1. Did the character fall/get hit in the last clip? -> If YES, add dirt/blood to this clip.
2. Was it raining/wet in the last clip? -> If YES, make the hair/clothes wet in this clip.
3. Is time passing? -> If YES, change the lighting condition.
4. Is lighting locked across cuts? -> If YES, lock Kelvin temperature, shadow vector, and light key.
5. Is Cut-on-Action velocity matched at timestamp 0.0s across cuts? -> If YES, verify seamless frame stitching.

**Enforce this logic absolutely. Never allow the AI to silently reset a character's state or shift lighting mid-clip.**


