# example5 - Interaction UI Kit

path: `/example/example5`
module: `src/modules/example/example5`
kit: `src/modules/example/example5/kit` (separate from example3 `src/ui-components`)
kind: **component**
axis: UI Kit - same IA, different interaction

## What this sample shows

Same menus and states as example3, but controls are not the default kit.
Difference is interaction, not neon / gradient decoration.

- Input / Select / Textarea - boxed field + floating label
- Radio - card select
- Checkbox - chip toggle
- Toggle - spring thumb
- Button - hover lift, press scale, loading
- Spinner - orbit / bounce / bars / pulse
- Calendar / Datepicker / Colorpicker - round day cells, popover
- Alert / Popup / Loading - local overlay (no global store)

Shell (sidebar / panel) matches the example3 catalog layout.

## Pages

| page | UI point |
|---|---|
| overview | kit index |
| Input / Select / Textarea | floating label, size, state |
| Radio / Checkbox / Toggle | card, chip, spring toggle |
| Calendar / Datepicker / Colorpicker | round day, popover |
| Button | press, loading |
| Alert / Popup / Loading | local overlay |

## Related

- `src/modules/example/example5/kit/*`
- pair: [example3.md](./example3.md)
- plan: [plan.md](./plan.md)
