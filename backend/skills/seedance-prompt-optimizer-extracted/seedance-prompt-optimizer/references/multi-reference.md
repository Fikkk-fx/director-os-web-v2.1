# Multi-Reference Creation

Use this when the user supplies several materials (images/videos/audio) covering multiple characters, props, or scenes. Seedance 2.5 supports up to 50 reference materials total. The goal is **not** to cram every reference into one sentence — it's to define the relationships among characters, props, scenes, actions, and audio so the model picks the right material for the right moment.

## Workflow

Work through these steps in order:

**1. Name and map each subject individually** — bind each person/product/prop to its own material, one line per subject:

```
<Character A> corresponds to @Image 1. Use only the appearance, hairstyle, and clothing.
<Character B> corresponds to @Image 2. Use only the appearance, hairstyle, and clothing.
<Prop A> corresponds to @Image 3. Use only the structure, material, and color.
<Scene A> references @Image 4. Use only the spatial layout, architecture, and lighting. Do not use the people in the image.
```

Never write vague group references like "@Images 1 through 4 define four characters respectively" — that doesn't say which image is which character.

**2. Group materials by type** once there are several subjects — characters, then props, then scenes, then motion/audio:

```
[Characters]
<Conservator> corresponds to @Image 1. Use only the appearance, hairstyle, and clothing.
<Registrar> corresponds to @Image 2. Use only the appearance, hairstyle, and clothing.
Do not interchange these characters' appearances, clothing, actions, positions, or dialogue.

[Props]
<Sample Case> corresponds to @Image 5 and belongs only to <Conservator>.

[Scenes]
<Conservation Lab> references @Image 7. Use only the space, materials, and lighting.

[Motion and Audio]
@Video 1 defines the motion of <Conservator> opening <Sample Case>. Do not use the person or scene from the video.
@Audio 1 defines <Guide>'s voice and specified dialogue.
```

**3. Create a centralized profile** for any subject that recurs across multiple scenes or has several materials attached:

```
[Subject Profile: Conservator]
Appearance and clothing: @Image 1.
Fixed prop: <Sample Case> from @Image 5.
Locations: <Conservation Lab> and <Gallery>.
Motion references: the case-opening motion from @Video 1 and the sample-placement motion from @Video 2.
Do not use: other characters' clothing. Do not give this character other equipment.
```

**4. Select references by scene** — for each scene, list only the subset of subjects/props/scenes actually used in it, then describe the event and its end state:

```
Scene 1 | Inspection in the Conservation Lab
Use: <Conservator>, <Sample Case>, <Conservation Lab>, and the case-opening motion from @Video 1.
Event: <Conservator> opens <Sample Case> at the workbench and inspects the sample inside.
End state: <Conservator> remains on the inner side of the workbench. <Sample Case> stays beside the conservator's right hand.
```

## Reminders

- If several images show different views of the same person/product, say so explicitly: "All four images define one folding desk lamp. The output must contain only one lamp throughout." Otherwise the model may duplicate the subject.
- When a reference video already defines motion/camera/sequence accurately, state only which attributes to inherit — don't restate every action, since repeating it can conflict with the reference itself. Still define the intended subjects, scene, action, and visual style in the prompt text, since a blockout/motion video mainly carries motion and spatial structure, not identity.
- Recommended ranges (not hard caps) for stability: 1-8 subjects in subject images, 1-5 subjects with 5-10s each in video/audio. Going above these (up to the hard limits: 30 images/4K, 10 videos/30s combined, 10 audio/30s combined) is possible but stability decreases and may need multiple generation attempts.
