---
name: action-fight-director-template
description: >
  Action & Fight Scenes Extension v1.0 for Master Director Template v1.3+.
  Specialized directing rules for grounded photorealistic action and fight choreography.
  Emphasizes intimate kinetic camera work, visceral impact clarity, realistic physical consequence,
  motivated dynamic movement, gritty practical lighting, and unbreakable causal/spatial logic in combat.
  Use together with master-director-template when user requests fight scenes, hand-to-hand combat, or intense action.
  Enforces the same strict continuity, reference locking, natural performance, and <2500 char prompt limit.
  Camera feels like a real operator inside the violence — tight, purposeful, never random or detached.
---

# Action & Fight Director Extension v1.0
## (For use with Master Director Template v1.3+)

**When to activate this extension:**
Any time the user requests a fight scene, combat sequence, hand-to-hand action, brawl, or intense physical confrontation in an action film context. Combine with the full v1.3+ rules. This extension overrides or adds to CAMERA PACKAGE, CINEMATOGRAPHY, BLOCKING, SHOT DESIGN, PHYSICS, and NEGATIVE PROMPTS specifically for fights while keeping all core continuity, face DNA lock + natural performance, causal logic, and spatial geography rules 100% active.

---

### Core Fight Directing Philosophy (added to VISUAL PHILOSOPHY & DIRECTOR'S INTENT)
- The fight must feel raw, committed, and physically real. Every strike carries weight, momentum, and immediate consequence.
- Camera is an active participant inside the violence — it gets close, moves with purpose, and reveals impact and strain without ever feeling detached or floaty.
- Beauty comes from brutal authenticity and clear technique, not from clean choreography or stylized posing.
- Audience should feel the effort, the hits landing, the breathing, the desperation or focus — not watch a performance.
- Every visible action has clear physical cause and visible effect on bodies, clothing, environment, or opponent.

---

### Fight-Specific Additions to CAMERA PACKAGE & IMAGE CHARACTER
- **Primary:** Dynamic motivated handheld / roving camera operated by a real human inside the chaos.
- **Movement:** Purposeful and kinetic but always grounded and controlled. Tiny human breathing and imperfections allowed. Never random wild shaking or gimbal-perfect smoothness.
- **Proximity:** Frequently tight and intimate on key moments of contact, muscle tension, facial strain, sweat, and immediate reactions. The camera "leans in" to important impacts.
- **Lens feel:** Wide-angle characteristics (proximity, slight natural distortion, heightened sense of closeness and space compression) especially effective in confined fights. Switch to slightly longer focal length only when needed for spatial clarity or to reveal new threats.
- **Lighting & texture priority:** Strong practical sources that carve sweat, blood, dirt, fabric tension, and skin detail. High contrast, gritty, desaturated raw look. Shadows and highlights reveal physical effort and environmental interaction.
- **Overall image:** Organic, slightly imperfect, documentary-action hybrid. Fine grain, natural halation, real lens characteristics. No clean commercial action look.

---

### Fight-Specific Additions to CINEMATOGRAPHY & SHOT DESIGN
- Every camera movement and cut must be clearly motivated by the energy, threat, or revelation in the fight.
- **Default approach:** Start relatively tight to establish intensity and technique clarity → move dynamically with the fighters (follow, circle, or push in on commitment) → occasionally pull back or reposition only when it reveals new spatial information, a new attacker, or a major consequence.
- Prioritize readable, grounded technique visibility while maintaining visceral intensity. The audience must understand what just happened physically.
- **Rhythm:** Alternating moments of committed violence with micro-pauses of tension, breathing, or repositioning. Silence and stillness between exchanges are powerful.
- In multi-shot fight sequences in one location: Strictly enforce the SPATIAL GEOGRAPHY & CONTINUITY RULES. Fighters' positions, facing directions, and object states must remain logically consistent with previous action. No magical repositioning.

---

### Fight-Specific Additions to BLOCKING & PHYSICS
- Every strike (punch, kick, elbow, knee, throw, grapple) must have:
  - **Clear wind-up / preparation visible.**
  - **Committed execution** with full body weight and momentum.
  - **Visible, believable impact** and immediate physical reaction on the receiver (stagger, recoil, loss of balance, pain response, clothing shift, floor scuff, wall impact, etc.).
- No weightless, floaty, or consequence-free hits. Human limitations respected at all times.
- Environmental interaction is mandatory when logical: fighters use walls, furniture, floor, debris. These interactions leave visible marks or change object states permanently (until reversed on-screen).
- Grapples, clinches, and ground work must feel heavy, sweaty, and struggle-based — not clean or acrobatic.
- **Causal persistence is absolute:** blood, sweat, torn clothing, bruises, moved furniture, or environmental damage stays changed in all subsequent shots.

---

### Fight-Specific Negative Prompts (add to NEGATIVE PROMPTS section)
- No clean, stylized, wire-fu, or overly acrobatic movement.
- No superhero posing, unnecessary flips, or weightless combat.
- No bloodless or consequence-free violence.
- No floaty or detached camera that observes from outside the fight.
- No random or unmotivated camera shake.
- No perfect gimbal smoothness or robotic tracking.
- No unexplained changes in fighter positioning or facing without visible body movement.
- No environment or object resetting between shots.
- No overly polished or commercial action lighting.
- Camera never crosses the line of action without clear physical motivation.

---

### How to Use This Extension in Practice
1. Start with the full Master Director Template v1.3+.
2. Set GENRE = "Grounded Action Film" or "Intense Realistic Combat".
3. In STYLE add: "Raw, visceral, intimate action cinematography. Kinetic but realistic motivated camera. Gritty practical lighting. Tight immersive coverage of physical conflict."
4. In CAMERA PACKAGE and CINEMATOGRAPHY sections, insert the fight-specific rules above.
5. In BLOCKING and PHYSICS, emphasize the strike → impact → consequence chain and environmental interaction.
6. In NEGATIVE PROMPTS, append the fight-specific negatives.
7. For multi-shot fights in one space, keep the full SPATIAL GEOGRAPHY & CONTINUITY RULES active and reference it in every shot description.
8. When synthesizing the final <2500 char prompt, aggressively condense while preserving: tight motivated camera language, physical consequence rules, gritty lighting intent, and all continuity/negative prompts.

---

### Example Condensed Fight Scene Prompt Structure (copy-paste ready)

```
TITLE: [Short descriptive title]
DURATION: 8-12 seconds
GENRE: Grounded Action Film — intense realistic hand-to-hand combat
STYLE: Raw visceral intimate action. Kinetic motivated handheld camera operated inside the fight. Tight immersive coverage. Gritty practical lighting. Physical consequence and effort visible. No stylized movement.

REFERENCE LOCK: [Insert full face DNA + natural non-stiff performance rules for Image A, B, C as needed]

SPATIAL GEOGRAPHY & CONTINUITY: [Define the exact physical space once — layout, walls, key objects, fixed "camera north", initial fighter positions and facings. Enforce 100% consistency across all shots.]

DIRECTOR'S INTENT: Audience feels the raw physicality, committed technique, strain, and immediate consequences of every exchange. Tension from realistic danger and effort.

CHARACTER BIBLE: [Observable behavior only — e.g. "He commits fully to every strike but stays balanced. He uses the environment. He breathes heavily after exchanges. He protects his core."]

WORLD BUILDING: Normal environment + fight debris, sweat, blood persistence, scuffed surfaces, torn fabric remain changed.

CAMERA PACKAGE: Dynamic motivated handheld/roving camera with tiny human breathing and imperfections. Frequently tight and intimate on impacts and strain. Wide-angle lens characteristics for closeness. Practical gritty lighting reveals sweat, texture, and effort.

CINEMATOGRAPHY: Camera stays close and active inside the violence. Purposeful kinetic movement that follows energy and reveals consequence. Tight on key contacts and reactions. Occasional motivated pull-back only to show new threat or spatial shift. Every move has clear motivation from the fight itself.

BLOCKING: [Concrete positions relative to geography. Every strike has visible preparation, committed execution, and immediate believable physical effect. Fighters interact with environment naturally. Positions and object states persist logically.]

ACTING DIRECTION: Full committed physical effort. Natural breathing, strain, micro-reactions to impacts. Fluid but heavy movement. No stiffness even with face reference lock.

SHOT DESIGN: [Break into 2-4 shots max for 8-12s. Each shot: motivated camera behavior + clear physical action + visible consequence. Maintain strict geography.]

RHYTHM: Committed violence → micro pause of tension/breathing/reposition → next exchange. Natural pacing.

PHYSICS: Full weight and momentum on every strike. Immediate visible consequence on bodies and environment. No weightless hits. Causal persistence absolute.

NEGATIVE PROMPTS: [Full base negatives + fight-specific: no clean stylized combat, no floaty camera, no consequence-free hits, no random shake, no repositioning without body movement, no polished action look.]

FINAL GOAL: Feels like real documentary footage of a brutal, skilled, grounded fight shot by a real crew in one real location.
```

---

**Version Note:** Action & Fight Extension v1.0 — Strengthens the master director template specifically for fight and action scenes while preserving every non-negotiable rule (face DNA + natural performance, spatial continuity, causal logic, object permanence, no unexplained events). Always keep final output prompts under 2500 characters.

*Source: Extracted from Rangkuman_dan_Kompilasi_Skill.md — Added 2026-07-30*
