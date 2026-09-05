---
name: codecraft-contracts
description: The frozen file-ownership map, data schema, component prop contracts, and hook signatures for CodeCraft. Load before writing any CodeCraft file so parallel work integrates without drift.
---

# CodeCraft Integration Contracts

These contracts are **frozen**. Multiple agents build against them in
parallel. Do not rename a prop, change a signature, or write a file you do
not own. If a contract seems wrong, implement it as written and say so in
your final report.

## Stack

Vite + React 18, plain JS (`.jsx`), **CSS Modules** for component styles
(`Foo.module.css`, imported as `styles`), plain global CSS for tokens.
`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`,
`@dnd-kit/modifiers` are installed. **No other dependencies may be added.**
No routing library, no state library, no backend, no localStorage.

## File ownership

```
src/data/courseData.js        OWNER: data
src/lib/progress.js           OWNER: data

src/styles/tokens.css         OWNER: ui
src/styles/global.css         OWNER: ui
src/components/Header.jsx     + Header.module.css        OWNER: ui
src/components/Roadmap.jsx    + Roadmap.module.css       OWNER: ui
src/components/SectionView.jsx + SectionView.module.css  OWNER: ui

src/hooks/useAudio.js         OWNER: interaction
src/hooks/useCountUp.js       OWNER: interaction
src/components/LessonView.jsx      + LessonView.module.css      OWNER: interaction
src/components/ReorderExercise.jsx + ReorderExercise.module.css OWNER: interaction
src/components/SortableLine.jsx                                 OWNER: interaction

src/App.jsx                   OWNER: lead (do not touch)
src/main.jsx                  OWNER: lead (do not touch)
```

## Data schema — `src/data/courseData.js`

```js
export const sections = [
  {
    id: 'strings',                 // stable kebab-case slug, unique
    title: 'Section title',
    description: 'One sentence, sentence case, no exclamation marks.',
    lessons: [
      {
        id: 'strings-reverse',     // unique across the WHOLE course
        title: 'Lesson title',
        xp: 40,                    // integer, 20–80
        type: 'reorder',           // only 'reorder' exists in this build
        codeLines: [               // 5 strings, in CORRECT order
          'function reverse(str) {',
          '  ...',
        ],
      },
    ],
  },
]
export default sections
```

Rules: exactly **5 sections**, each with **3–5 lessons**, every lesson
`type: 'reorder'` with exactly **5 `codeLines`**. `codeLines` are stored in
correct order; shuffling happens at runtime. Lines are real, runnable-looking
JavaScript that reads correctly top-to-bottom, use two-space indent inside the
string, and are short enough not to wrap at ~60 chars.

## Progress derivation — `src/lib/progress.js`

```js
/**
 * @param {Array} sections
 * @param {string[]} completedLessonIds
 * @returns {{
 *   sections: Array<{
 *     id: string, completed: number, total: number,
 *     ratio: number,                    // 0..1
 *     status: 'completed'|'current'|'locked'
 *   }>,
 *   completedCount: number, totalCount: number
 * }}
 */
export function deriveProgress(sections, completedLessonIds) {}
```

Lock rule: section 0 is never locked. Section *n* is `locked` unless section
*n−1* is fully complete. A section is `completed` when all its lessons are
done, otherwise `current` if unlocked. Exactly one section can be `current`.
Return a stable object shape even for an empty `completedLessonIds`.

Also export:
```js
export function isLessonUnlocked(section, lesson, completedLessonIds) {}
```
Lesson 0 of an unlocked section is open; lesson *n* needs lesson *n−1* done.

## Component contracts

```jsx
// OWNER: ui
<Header
  xp={number}                 // total XP; animate changes with useCountUp
  muted={boolean}
  onToggleMute={() => {}}
  onHome={() => {}}           // click the wordmark
  crumbs={[{ label: string, onClick: (() => void) | null }]}  // may be []
/>

<Roadmap
  sections={sections}
  progress={progress}         // the deriveProgress(...) return value
  onOpenSection={(sectionId) => {}}   // NOT called for locked sections
/>

<SectionView
  section={section}
  completedIds={string[]}
  onOpenLesson={(lessonId) => {}}     // NOT called for locked lessons
  onBack={() => {}}
/>

// OWNER: interaction
<LessonView
  section={section}
  lesson={lesson}
  isCompleted={boolean}       // already solved before this visit
  muted={boolean}
  onComplete={(xpAwarded: number) => {}}  // fire ONCE, only on first solve
  onBack={() => {}}
  onNext={(() => void) | null}            // null when it is the last lesson
/>
```

`Roadmap` and `SectionView` import `sections` **via props only** — never
import `courseData` directly. `LessonView` renders `lesson.codeLines`; it must
contain **zero hardcoded course content**.

## Hook contracts

```js
// useAudio(muted) -> stable callbacks; lazily create one AudioContext on the
// first user gesture; no-op (and never construct a context) while muted.
const { playCorrect, playIncorrect } = useAudio(muted)
// playCorrect:   two-note RISING blip  (~660Hz -> ~880Hz, ~90ms each)
// playIncorrect: one muted LOWER blip  (~180Hz, ~160ms, low gain)
// Envelope every note (attack + exponential release) — never a raw square
// gate, it clicks. Keep peak gain <= 0.09. Close/suspend nothing on unmount
// except a context you created.

// useCountUp(value, { duration = 600 }) -> number to render
// Animates from previous value to `value` with requestAnimationFrame and an
// ease-out curve. Returns an integer. Snaps instantly on first mount and
// under prefers-reduced-motion. Cancels its RAF on unmount.
const shown = useCountUp(xp)
```

## Exercise behaviour — `ReorderExercise`

- 5 lines, shuffled on mount with a seeded-enough shuffle that **never**
  equals the correct order.
- Reordering via `@dnd-kit` (`PointerSensor` + `KeyboardSensor`,
  `verticalListSortingStrategy`, `restrictToVerticalAxis`).
  **The HTML5 drag-and-drop API is forbidden.**
- A `Check` button evaluates the order.
  - **Correct:** the whole block flashes emerald (~500ms), `playCorrect()`,
    `onComplete(lesson.xp)` fires once, the Check button becomes `Next lesson`
    (or `Back to section` when `onNext` is null), and the list locks.
  - **Incorrect:** every line that is in the wrong position shakes
    (~420ms, ±4px, then settles), `playIncorrect()`, **no XP is lost**, and a
    terse message states how many lines are placed correctly. The user may
    retry immediately.
- Dragging state: `--surface-3` background, `--border-hi` border, cursor
  `grabbing`, and the row stays exactly 1px-bordered (no shadow, no scale).
- Each row shows a mono line-number gutter (`01`…`05`) and a 6-dot drag
  handle drawn as inline SVG or CSS dots — **not an emoji, not a library icon**.
- Revisiting an already-completed lesson shows the solved state; re-solving
  must not award XP twice.
