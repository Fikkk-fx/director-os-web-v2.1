# Advanced Techniques

## First/last frames and multi-keyframe sequences

For first-and-last-frame generation with additional references, state each anchor image's role separately — don't combine them ("@Images 1 and 2 are the first and last frames" is wrong). The first and last images should share an aspect ratio, or the last frame may stretch.

```
@Image 1 is the first frame. It defines the opening composition, subject position, pose, prop state, scene, and camera direction.
@Image 2 is the last frame. It defines the ending composition, subject position, pose, prop state, scene, and camera direction.
@Image 3 defines <Subject A>'s <appearance, clothing, structure, or material>. Do not change the first-frame composition defined by @Image 1 or the last-frame composition defined by @Image 2.

<Describe one continuous action or event>.
The video begins naturally from the first frame defined by @Image 1 and reaches the last frame defined by @Image 2 after the continuous action.
Between the first and last frames, maintain continuity in <character identity, prop structure and ownership, scene layout, and camera direction>.
```

**Multi-keyframe sequences** (3+ ordered images defining stages): open with "Use @Image 1 through @Image N as keyframes in this order," then describe the key state each image represents. Independent keyframe images are easier to align than several frames combined into one grid — they control stage order and key states, not every intermediate frame.

## Storyboard grids

A storyboard grid communicates overall story, shot order, and approximate composition — not strict per-panel reproduction. Prefer ≤15 panels, clean line art, minimal text. State the reading order, then describe each shot's action, camera treatment, and what to ignore from the grid itself:

```
@Image 1 provides an <N-panel storyboard grid> for shot order and approximate composition. Read it <left to right, top to bottom>. Do not use the grid's <line-art style, text labels, or placeholder characters>.
@Image 2 defines <Subject A>'s <appearance and clothing>.

Shot 1: <shot size, subject action, and scene state>.
Shot 2: <shot size, subject action, camera movement, or transition>.
...
Shot N: <closing action and final visible state>.

The final video uses <visual style>. Audio includes <dialogue, ambience, action sound effects, or music>.
```

## Blockout references

First determine whether the blockout controls a **motion skeleton** (coarse) or a **complete model** (fine) — this decides the prompt structure.

| Type | Best for | Material needs | Prompt focus |
|---|---|---|---|
| Coarse blockout | Simple geometry previewing action/paths/blocking/camera/cuts | Clear shape relationships + complete action sequence; add character/prop/scene images separately | Map every blockout subject; state which temporal/spatial info to inherit |
| Fine blockout | Complete modeling needing new materials/colors/characters/style | Complete, clean model — no path lines, axes, or camera frustums | Preserve structure/action/camera; define what to re-render |

**Coarse blockout** — map each geometric shape to its real subject, and specify only the temporal/spatial info to inherit:

```
@Video 1 is a coarse blockout reference. It provides only <motion paths, subject blocking, camera position, camera movement, cuts, lighting changes, sound rhythm, or spatial relationships>. Do not use its blockout appearance, materials, or scene.
<Blockout Subject A> in @Video 1 corresponds to <Subject A>.
@Image 1 defines <Subject A>'s <appearance, clothing, or structure>.

<Subject> completes <primary action or event> in <scene>.
Keep <motion path, blocking, camera movement, cuts, lighting, or sound rhythm> from @Video 1.
The final video uses <characters, scene, materials, and visual style>.
```
Prefer simple geometry with clear relationships; appendages (arms, wings) should only appear when their action sequence is complete, or they risk stiff/misread motion.

**Fine blockout** — preserve structure/action/camera, re-render appearance only:

```
@Video 1 is a fine blockout reference. Preserve <subject structure, action, spatial layout, camera position, camera movement, and cuts>. Do not use its original gray materials or empty background.
@Image 1 defines <subject>'s <character appearance, material, color, or surface details>.

Re-render <subject> from @Video 1 as <final subject>, and re-render the scene as <final scene>.
Keep <structure, action, camera treatment, and spatial relationships> from @Video 1. Use <materials, colors, and style>.
```

## One-click video (images → edited video)

Turning a batch of images (optionally + a style-reference video) into one video with consistent pacing. Never just say "turn these into a video" — always specify:

`Material Roles → Image Order → Motion Amount → Editing Style → Visual Treatment → Audio`

```
[Material Roles]
@Image 1 is used for <character, product, scene, or opening image>.
@Video 1 is used only for <editing rhythm, transitions, subtitle treatment, or music style>. Do not use its character identities or scene (optional).

[Arrangement]
Show the images in <upload order, a specified order, or a model-selected thematic order>.
<State the character, product, location, and event relationships that must remain consistent>.

[Image Motion]
Apply <subtle live motion, parallax, push-in/pull-out, lateral movement, or local action> to each image.
Keep <subject appearance, product structure, text, or background relationships> stable.

[Final Style]
Use <editing rhythm, transition style, subtitle or graphic treatment, and color style>.

[Audio]
Include <dialogue, ambience, sound effects, or music>.
```
State the exact image sequence if order matters; otherwise say the model may arrange by theme. Continue to name and bind each character/product separately if there are several.

## Seamless video transitions

Generates continuous bridge content between two videos: `Before Video → After Video → Trigger Action → Camera Movement → Visual Transformation → Arrival State → Audio`.

```
@Video 1 is the before-transition clip. Use its <ending subject, action, composition, camera direction, and audio>.
@Video 2 is the after-transition clip. Use its <opening subject, composition, camera direction, and audio>.
Keep <character identity, product structure, scene, and primary action> stable in the original portions of @Video 1 and @Video 2.

At the end of @Video 1, <subject or foreground object> triggers the transition through <action>.
The camera <movement direction and speed change>, while <shape, material, light, or space> gradually transforms into <corresponding element> at the start of @Video 2.
The transition ends naturally at @Video 2's opening composition, preserving continuity in <subject position, camera direction, and motion trend>.
Audio transitions smoothly from <before audio> to <after audio>.
```

Common transition methods and what to specify: dive/reverse movement (direction, speed change, when next scene begins), character rotation (pose, rotation direction, continuous background change), foreground occlusion (when it fills frame, composition after), object morph (corresponding shapes/materials, transformation process), push/pull or focus change (movement, focus target, continuous spatial relationship). Note: this aims for visual/audio continuity, not pixel-identical preservation of both source videos.

## Emotional direction

Abstract emotion words ("tense," "warm," "oppressive") leave too much to interpretation. Pair them with directly visible/audible cues: eye movement, brow tension, mouth movement, breathing, gaze direction, hand movement. 2-4 clear cues is usually enough for one transition — don't list every facial detail.

**Single transition:**
```
The overall emotion shifts from <starting emotion> to <ending emotion>.
After <triggering event>, <subject> first shows <immediate observable reaction>.
Then, <eyes, brows, mouth, breathing, gaze, or hand movement> gradually <changes>.
Finally, <subject> expresses <target emotion> through <restrained or explicit outward behavior>.
```

**Multi-stage** (only when the emotion changes several times): chain triggering events, each with its own observable reaction, building toward a final action/expression/manner of speaking.

## Cinematography terms

Common terms (shot size: extreme wide/wide/medium/close-up/extreme close-up; movement: push in/pull out/pan/lateral move/follow/orbit/dive/dolly out/tilt up/handheld shake; position: low angle/overhead/first-person) can be used directly.

For popular techniques (one-take, dolly zoom, aerial view, FPV, bullet time, handheld, bounce speed ramp) or **any uncommon/niche term**, also state the subject, the visual change, and foreground/background relationship — translate the term into an observable result:

`Rack focus: shift focus smoothly from the leaves in the foreground to the person in the background. The leaves gradually blur while the person's face changes from soft to sharp.`

For a precise transition moment, add trigger time, occluding object, direction, and what continues after: `Whip-pan transition: at 5 seconds, move the camera rapidly to the left. Cut when the foreground bookshelf fully covers the frame, then continue moving left at a similar speed in the next scene.`

Numeric aperture/focal-length/shutter values are optional — describing the intended visible result is usually clearer than a raw number alone.
