---
name: seedance-prompt-optimizer
description: Write and optimize prompts for Dreamina's Seedance 2.5 video generation model (ByteDance/Jimeng), based on ByteDance's official Seedance 2.5 Prompt Guide. Use this skill whenever the user mentions Seedance, Seedance 2.5, Dreamina video generation, or Jimeng video prompts — including requests to write a Seedance prompt from a rough idea, optimize/rewrite an existing Seedance prompt, structure prompts using image/video/audio references, do video editing/extension/transition prompts for Seedance, or build long-form (30s+) or multi-reference Seedance prompts. Always consult this skill for any Seedance 2.5 prompt-writing task, even a short one, since correct reference-material syntax (@Image/@Video/@Audio roles) and formatting are easy to get wrong without it.
---

# Seedance 2.5 Prompt Optimizer

Transform a user's rough idea, existing prompt, or set of reference materials (images/videos/audio, first/last frames, storyboards, blockouts) into a production-ready prompt for Dreamina's Seedance 2.5 video generation model, following ByteDance's official Prompt Guide.

**Goal:** maximize generation quality, motion consistency, prompt clarity, and adherence to Seedance 2.5's actual syntax and rules — not creativity for its own sake. Never change the user's intent.

## Step 1: Clarify before drafting

A rough idea is almost always underspecified for a good Seedance prompt — the gaps are exactly where generation quality is won or lost. Before writing anything, ask about whatever isn't already clear from the request. Don't ask about things the user already specified or that don't apply to this task.

Common gaps worth checking, roughly in priority order:

- **Setting/era ambiguity** — anything that could read multiple ways (e.g. a historical subject in a modern city: is it a real historical setting, or an intentional anachronism?).
- **Reference materials** — does the user have any images, videos, or audio to reference (subject appearance, a specific location, a motion/pacing reference, first/last frames)? This changes whether Step 3 (reference roles) applies at all.
- **Duration / number of beats** — one continuous short shot, or a longer sequence with multiple events? This decides whether `references/long-video-and-timing.md` applies.
- **Mood and visual style** — realistic/cinematic vs. stylized, lighting mood, color palette, if not implied by the idea.
- **Camera intent** — a specific shot type in mind, or should Claude choose what fits the action?
- **Audio** — does the user want dialogue, music, sound effects, or ambience specified, or should audio be left out entirely?

Ask only what's genuinely ambiguous or missing — usually 1-4 questions, not all six. If the user says to just go with your best judgment, or gives a highly specific/detailed request that leaves little ambiguous, skip straight to drafting and state the assumptions you made inline instead of asking.

## Step 2: Identify the task type

Seedance 2.5 supports several distinct workflows, each with its own prompt structure. Identify which one applies (a request can combine more than one):

| User is asking for... | Use |
|---|---|
| A prompt from a plain idea, no references, or only 1-8 subject images | Core Prompt Formula (below) |
| Multiple images/videos/audio defining different subjects, props, or scenes | `references/multi-reference.md` |
| A video longer than ~15s, or with several distinct events/beats | `references/long-video-and-timing.md` |
| Editing an existing video (remove/replace/add an object, background, or audio) | `references/editing-and-extension.md` |
| Extending a video forward or backward from a boundary frame | `references/editing-and-extension.md` |
| First/last frame generation, multi-keyframe sequences, storyboard grids, or blockout (rough/fine) references | `references/advanced-techniques.md` |
| Turning a batch of images into an edited video ("one-click video") | `references/advanced-techniques.md` |
| A seamless transition between two videos | `references/advanced-techniques.md` |
| Precise emotional performance, or niche cinematography terms | `references/advanced-techniques.md` |
| Final sanity check before handing back the prompt | `references/checklist-and-limits.md` |

Read only the reference file(s) relevant to the task — don't load all of them for a simple prompt.

## Step 3: Core Prompt Formula

Every Seedance 2.5 prompt is built by flexibly combining these elements. Omit any component that isn't needed — don't pad the prompt with unused slots.

```
<Subject> performs <primary action or event> in <scene and environment>.
The visuals feature <visual style>.
Use <shot size, camera angle, camera movement, or cuts>.
Audio includes <dialogue, ambience, sound effects, or music>.
```

- **Subject + Action/Event** — who or what does what. This is the foundation; get it concrete and specific rather than generic ("the man runs" → "the man accelerates into a sprint while his jacket reacts to the airflow").
- **Scene and Environment** — location, time, weather, spatial relationships, background state.
- **Visual Style** — lighting, color, materials, texture, mood. Only include descriptors that genuinely add information — avoid generic buzzwords stacked for their own sake (e.g. don't just chain "cinematic, 8K, masterpiece" with nothing specific behind them).
- **Camera Movement/Cut** — shot size, angle, movement (push in, pull out, pan, dolly, orbit, handheld, etc.), focus subject, transitions. Camera motion should match the action, not be decorative.
- **Audio** — dialogue, voice characteristics, ambience, sound effects, music, kept synchronized with the visuals.

Generation parameters (resolution, duration, aspect ratio) are **not** part of the prompt — those are set on the generation page or via API, except where a task type auto-locks them (see `references/editing-and-extension.md`).

## Step 4: Reference materials — always define roles explicitly

The moment the user supplies more than one reference material, or a reference alongside a text description, **state in the prompt what each material contributes** — never rely on the model to infer which image/video/audio maps to which subject.

```
@Image 1 defines <subject>'s <appearance, clothing, structure, or material>.
@Video 1 defines <motion, camera movement, or pacing>.
@Audio 1 defines <character or sound type>'s <voice, dialogue, ambience, or music>.
```

Add explicit exclusions whenever a material could bleed in something unwanted:
`@Image 2 defines the workbench and window light. Do not use the people in the image.`

Rules of thumb:
- Images: prefer 1-8 distinct subjects (up to 30 images total, each ≤4K).
- Videos: prefer 1-5 subjects, 5-10s each (up to 10 videos, ≤30s combined).
- Audio: keep only what's directly relevant (up to 10 clips, ≤30s combined).
- If more than 5 subjects need multiple views, put each view in a separate image rather than one collage — independent view images are more stable.
- Video-only references are motion/pacing references by default (not identity), unless the user says otherwise.

For 2+ named subjects, props, or scenes, use `references/multi-reference.md` — don't try to freehand complex material mapping in the core formula.

## Step 5: Special syntax for audio and text

When the user needs music, sound effects, dialogue, or subtitles distinguished explicitly (not just described in prose):

| Content | Syntax | Example |
|---|---|---|
| Music | `()` | `(Soft, rhythmic piano music plays in the background)` |
| Sound Effects | `<>` | `<A bell rings in the distance>` |
| Dialogue | `{}` | `{Hello, welcome back.}` |
| Subtitles | `【】` | `【Chapter One: Departure】` |

For non-Chinese dialogue, or to reinforce a specific accent/regional variety, state it before the line:
`Dialogue language: authentic Los Angeles English. The young man says in natural Los Angeles vernacular: {No way, you actually made it.}`

## Style and output rules

- Write naturally, in flowing prose — avoid bullet-list-style prompts (structured `[Section]` labels are fine and expected for multi-reference/long-video/editing workflows, per the templates in the reference files, but the descriptive content itself should read as prose, not fragments).
- Maintain subject consistency throughout: appearance, clothing, identity, proportions, facial features, hairstyle, accessories. Don't introduce unnecessary new characters.
- Favor realistic physics and motion: momentum, inertia, cloth/hair reaction, weight, collision, secondary motion — described concretely, not just named as buzzwords.
- Never contradict earlier parts of the prompt: no impossible camera moves, conflicting lighting, or scene changes that weren't asked for.
- Match prompt length to the request — short ideas get clean, concise prompts; complex multi-reference or long-video requests get the fuller structured templates. Every sentence should add information; don't pad for length.
- **Output only the optimized prompt** unless the user explicitly asks for an explanation of the changes.

## Before finalizing

Run through `references/checklist-and-limits.md` — it has the pre-submission checklist and the hard technical limitations (timestamp precision, aspect-ratio/duration locking rules, what the model can't guarantee) so you don't promise something Seedance 2.5 can't actually do.
