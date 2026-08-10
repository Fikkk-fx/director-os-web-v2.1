# Video Editing and Extension

## Auto-locked parameters

These task types automatically lock some generation parameters based on the input — the user cannot set them separately on the generation page or via API. Know this before promising a specific aspect ratio or duration.

| Task | Aspect Ratio | Duration |
|---|---|---|
| Video editing | Locked to input video's ratio | Locked to ~input duration (±~0.3s from frame processing) |
| First-frame / first-and-last-frame generation | Locked to the first image's ratio (first and last images should share a ratio, or the last frame may stretch) | Settable |
| Video extension | Locked to input video's ratio | Settable |

## Video editing

Define the source video as the sole editing master, then state the edit target, scope, target material, and what to preserve.

```
[Edit Goal]
Edit @Video 1. Within <the entire video or a specific time range>, <add, remove, replace, or adjust> <visual object, region, or audio category>.

[Source Video Role]
@Video 1 is the sole editing master. It defines <characters, scene, actions, composition, camera movement, occlusion relationships, audio, and event order>.

[Target Material Role]
@Image 1 or @Audio 1 defines <specified attributes of the target object or sound>.

[Edit Scope]
Modify only <object, region, time range, or audio category>.

[Content to Preserve]
Keep <visual content, motion, audio, and timing relationships that must not change> from @Video 1.
```

### Subject replacement

Add a **Timeline Inheritance** clause so the new object inherits the old one's exact motion/timing/occlusion:

```
[Timeline Inheritance]
<Target object> inherits every appearance, motion, occlusion, and exit of <original object>, including timing, duration, path, and speed changes.
Except for the object or area explicitly modified above, keep all other people, props, scene content, camera movements, cuts, and event order from @Video 1 unchanged.
```

### Background replacement

Scope the edit explicitly to outside the subject's silhouette:

```
[Edit Scope]
Modify only <background outside the subject's silhouette>. Do not modify <subject identity, facial features, hairstyle, clothing, expression, position, size, or motion>.
```

### Audio editing

Dialogue, language, voice, BGM, and sound effects can be edited independently — name the category, the change, and what must stay untouched:

```
Edit @Video 1. Remove only the original background music. Keep the character dialogue, lip sync, ambience, and action sound effects; preserve the visuals, camera treatment, and editing rhythm from @Video 1.
```

## Video extension

Extension adds content *beyond* a source video's boundary. The critical rule: **align the boundary frame before describing new content.** A forward extension's first frame continues from the source's last frame; a backward extension's last frame connects to the source's first frame.

### Forward extension (after the source)

Describe the continuous boundary state first, then the new action:

```
@Video 1 is the source video to extend forward.

Extend @Video 1 forward. The first frame of the extended segment directly continues from the last frame of @Video 1. Maintain continuity in <subject pose and orientation>, <prop position>, <background and spatial relationships>, <camera position and composition>, <lighting>, and <motion direction>.

Then, <describe the new action, event, camera treatment, or audio to add>.

Throughout the extension, maintain continuity in <character identity and clothing>, <key props>, <background layout>, and <axis of action>.
Keep each subject as the same continuous instance throughout: do not duplicate or split it.
```

If adding new reference materials (e.g. a new prop the character will use), define their roles first, but make clear the source video's last frame still controls the extension's opening image — new materials supplement, they don't override the boundary.

### Backward extension (before the source)

Describe what happens *before* the source starts, then explicitly land on the source's first frame as the end state of the extension — don't just say "then connect to the source video," which risks introducing later elements too early or having the image drift after reaching the target state:

```
@Video 1 is the source video to extend backward.

Extend @Video 1 backward. Before the source video begins, <describe the preceding action, event, camera treatment, or audio>.

The last frame of the extended segment naturally connects to the first frame of @Video 1: <subject pose and orientation>, <prop position>, and <background and spatial relationships>. Match the <camera position and composition>, <lighting>, and <motion direction> of @Video 1's first frame.

Throughout the extension, maintain continuity in <character identity and clothing>, <key props>, <background layout>, and <axis of action>.
```

If using extra reference materials, state which ones belong to the backward segment and which should appear only after the source video begins — this keeps later characters/props/effects from leaking into the preceding footage.

### Notes

- Boundary frames connect naturally at a visual level — they won't be pixel-identical. Review both sides of the boundary plus the full extended segment.
- Single extension: up to 30s. Nested/repeated extensions: up to 60s total.
