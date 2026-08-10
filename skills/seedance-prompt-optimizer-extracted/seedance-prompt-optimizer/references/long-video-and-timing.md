# Long Videos and Timing Control

Seedance 2.5 supports up to 30s natively, plus extension (see `editing-and-extension.md`) up to 60s, and an Ultra Long Video mode up to 180s. For anything with several events, don't write one flat paragraph — break it into stages.

## Staging template

Give each stage exactly one primary state change, and state what's directly visible at the end of that stage. Each new stage should note what carries over from the previous one.

```
[Generation Goal]
Generate a <video type>. The central subject is <subject>, and the primary event is <story summary>.

[Stage 1]
Initial state: <initial state of characters, props, and scene>.
Primary event: <one primary action or event>.
End state: <character positions, prop ownership, or visible scene state>.

[Stage 2]
Continue from the previous stage: <state that must remain unchanged>.
Primary event: <one primary action or event>.
End state: <observable state>.

[Stage 3]
Primary event: <closing event>.
End state: <final visible state>.

[Maintain Consistency]
Keep <character identity, number of characters, clothing, prop ownership, spatial direction, and audio relationships> consistent.
```

### Example

```
[Generation Goal]
Generate an instructional video showing a flower shop's order-packing process. <Florist> and <Store Assistant> arrange, wrap, and hand off a bouquet together.

[Stage 1]
Initial state: <Florist> stands behind the workbench. Loose flower stems, scissors, and wrapping paper lie on the tabletop.
Primary event: <Florist> arranges the stems and trims them to length.
End state: <Florist> holds the bouquet in the left hand, and the scissors are back on the right side of the workbench.

[Stage 2]
Continue from the previous stage: both characters retain the same identities and clothing, and <Florist> still holds the bouquet.
Primary event: <Store Assistant> unfolds the wrapping paper. <Florist> places the bouquet inside and ties it with a green ribbon.
End state: the wrapped bouquet lies flat in the center of the workbench, with the ribbon bow facing the camera.

[Stage 3]
Primary event: <Store Assistant> picks up the bouquet and places it on the pickup shelf.
End state: the bouquet is centered on the pickup shelf, and both characters stand behind the workbench inspecting the finished order.

[Maintain Consistency]
Keep <Florist> and <Store Assistant>'s identities, clothing, workbench orientation, scissors position, and bouquet ownership consistent.
```

## Timestamps and pacing

Use stages by default for ordinary narratives. Reach for one-second timestamp precision only when a specific handoff, entrance/exit, transition, or beat needs to be locked to a moment.

| Pattern | Use for | Example |
|---|---|---|
| Time range | Allocating pacing to a segment | `0-3 seconds... 3-7 seconds... 7-12 seconds...` |
| Exact time point | A single key event | `At 5 seconds, the camera whip-pans rapidly to the left and completes the transition.` |
| Relative timing | A delay between two events | `Three seconds after the character presses the button, the room lights gradually turn off.` |

Rules:
- Time ranges should be consecutive and non-overlapping — they're a time *budget* for an event, not a frame-accurate edit point. Actions may land slightly before/after a boundary.
- Too little content in a range gives the model more freedom than intended; too much causes excessive cutting or dropped events.
- Never demand a frequency inside one second (e.g. "complete three actions in one second") — timestamps allocate time, they don't enforce a cadence.
- End each timestamped segment with an explicit end state, same as a staged segment:

```
0-5 seconds: Show an empty wooden display table. A hand places a white ceramic plate on it. End state: the hand has left the frame, only the white plate remains centered.
5-10 seconds: Remove the white plate, then place a clear glass on the table. End state: only the clear glass remains centered.
```
