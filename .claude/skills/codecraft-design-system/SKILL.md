---
name: codecraft-design-system
description: The CodeCraft visual language — exact color/type/spacing tokens, the "terminal, not costume-terminal" design doctrine, and the anti-slop rules. Load before writing any CodeCraft component, CSS, or markup.
---

# CodeCraft Design System

CodeCraft is a code-learning platform with a **dark terminal aesthetic**. The
reference feeling is a well-built developer tool — GitHub's dark UI, a good
terminal emulator, a git log — not a "hacker movie" set.

## Non-negotiable constraints

- Background `#0D1117`, surface `#161B22`, border `#30363D`
- Accent emerald `#10B981` → progress, completion, success
- Accent amber `#F59E0B` → current position, XP
- JetBrains Mono for **code, numbers, labels, metadata**; Inter for **prose**
- **Sharp corners** (`border-radius: 0` everywhere, no exceptions)
- **1px borders** — the only structural device
- **No gradients. No drop shadows. No blur. No glow.**

## Tokens (use the CSS variables, never raw hex in components)

```
--bg          #0D1117   page ground
--surface     #161B22   cards, rows, panels
--surface-2   #1C222B   hover / raised state
--surface-3   #21262D   pressed / dragging
--border      #30363D   default 1px rule
--border-hi   #414B58   hover border
--text        #E6EDF3   primary prose
--text-dim    #8B949E   secondary / metadata
--text-faint  #6E7681   tertiary / disabled

--emerald        #10B981
--emerald-soft   rgba(16,185,129,0.12)   fill behind success
--emerald-line   rgba(16,185,129,0.42)   border on success

--amber          #F59E0B
--amber-soft     rgba(245,158,11,0.12)
--amber-line     rgba(245,158,11,0.42)

--danger         #F85149   incorrect state ONLY (never a fill, border+text only)
--danger-soft    rgba(248,81,73,0.10)

--sp-1 4px  --sp-2 8px  --sp-3 12px  --sp-4 16px
--sp-5 24px --sp-6 32px --sp-7 48px  --sp-8 64px

--mono 'JetBrains Mono', ui-monospace, monospace
--sans 'Inter', system-ui, sans-serif

--t-fast 120ms cubic-bezier(0.4,0,0.2,1)
--t-med  220ms cubic-bezier(0.4,0,0.2,1)
```

## Type scale

| Use | Size / weight / family |
|---|---|
| Micro label (`SECTION 02`, `XP`, `LOCKED`) | 11px / 500 / mono / `letter-spacing: .1em` / uppercase / `--text-dim` |
| Metadata (lesson counts, durations) | 12px / 400 / mono / `--text-dim` |
| Code line | 14px / 400 / mono / `line-height: 1.7` |
| Body prose | 14–15px / 400 / sans / `line-height: 1.65` / `--text-dim` |
| Card title | 16px / 600 / sans / `--text` |
| Screen title | 26–28px / 700 / sans / `--text` / `letter-spacing: -.02em` |

Numbers are **always** mono and **zero-padded** where they index something
(`01`, `02`). Tabular figures: `font-variant-numeric: tabular-nums` on every
number that can change (XP, progress %, counts).

## Layout doctrine

- One centered content column, `max-width: 760px`, `padding: 0 24px`.
- Vertical rhythm from the spacing scale only. No arbitrary pixel values.
- Whitespace is the primary luxury signal. When in doubt, add space, not ink.
- The header is a single 1px-bottom-bordered bar, 56px tall, `--bg` ground.

## The roadmap is a git graph

The Home roadmap must read as a **vertical rail with commits on it**, not as a
stack of cards:

- A 1px vertical line (`--border`) runs down the left, through every node.
- The line is **emerald above** the user's current position and `--border`
  below it — progress is legible from the rail alone.
- Each node is a 12px square (sharp, of course) sitting *on* the rail,
  `--bg` filled with a 1px border in its state color.
- The card sits to the right of the rail. Rail and card are separate objects.

## State language

| State | Treatment |
|---|---|
| Completed | emerald node (filled), emerald 1px card border on hover only, `✓` in mono, progress bar full emerald |
| Current | amber node with a **pulsing ring**, amber micro-label `IN PROGRESS`, card border `--border-hi` at rest |
| Locked | `opacity: .38`, `cursor: not-allowed`, `pointer-events` still on the card for the tooltip but no click handler, `LOCKED` micro-label, node is a hollow `--border` square |

The pulse is a `::after` pseudo-element ring that scales `1 → 1.9` and fades
`.55 → 0` over 2s infinite. **It is a border ring, not a shadow or glow.**
Respect `prefers-reduced-motion` — the pulse becomes a static ring.

## Interaction feel

- Hover on any clickable row/card: `background: --surface-2`, `border-color:
  --border-hi`, and a 1px accent bar appears on the left edge. Never scale,
  never lift, never shadow. Transition `--t-fast`.
- Focus-visible: `outline: 1px solid var(--emerald); outline-offset: 2px`.
  Every interactive element must be keyboard reachable.
- Buttons are 1px-bordered rectangles. Primary = emerald border + emerald
  text on `--emerald-soft`. Fill on hover, `--bg` text. No other button style.
- Disabled buttons: `--text-faint` text, `--border` border, no hover change.

## Anti-slop rules (read twice)

1. **No emoji as UI.** Status is conveyed by mono glyphs (`✓`, `→`, `·`) and
   color, or a hand-written inline SVG. Never 🎉 / 🚀 / 🔥.
2. **No purple.** No violet-to-blue anything. The palette is exactly two
   accents on grey.
3. **Color is signal, not decoration.** A screen should be ~92% greyscale.
   If two things are emerald and neither is "done", one is wrong.
4. **No centered hero text** with a big tagline. This is a tool; content
   starts at the top-left of the column.
5. **No rounded pills, no chips with 999px radius, no soft cards.** Sharp.
6. **No `box-shadow` for any reason**, including "subtle" ones and focus rings.
7. **No decorative icon next to every label.** Icons earn their place.
8. **Don't animate everything.** Motion belongs to: the pulse, the XP count-up,
   the correct-flash, the shake, and drag. Everything else is instant or a
   120ms color transition.
9. Copy is terse and lowercase-ish in metadata, sentence case in prose. No
   exclamation marks. "3 of 5 complete", not "Awesome — 3 done! 🎉".
10. The playfulness lives in **craft** — the git-graph rail, the tabular
    count-up, the two-note blip, the drag physics — not in decoration.

## Accessibility floor

- All interactive elements are real `<button>` / `<li>` semantics.
- `aria-live="polite"` on the XP counter and the check-result message.
- Drag list carries dnd-kit keyboard sensor; arrow keys reorder.
- Never rely on color alone — pair every state color with a glyph or label.
