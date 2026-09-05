# CodeCraft

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-10B981?style=for-the-badge&logo=githubpages&logoColor=white)](https://aladin002dz.github.io/code-craft-ii/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

> [!TIP]
> **Live Preview**: Experience CodeCraft directly in your browser at **[https://aladin002dz.github.io/code-craft-ii/](https://aladin002dz.github.io/code-craft-ii/)**

A React course-platform shell with a dark terminal aesthetic. Three screens:
a git-graph style roadmap, a section lesson list, and a drag-to-reorder code
exercise.

## 🚀 Live Preview

Test the interactive course platform online without needing to install anything locally:

👉 **[https://aladin002dz.github.io/code-craft-ii/](https://aladin002dz.github.io/code-craft-ii/)**

## 💻 Local Development

```bash
npm install
npm run dev
```

## Architecture

```
src/
  App.jsx              view state, progress state, XP, mute — the only stateful shell
  main.jsx             entry
  data/courseData.js   ALL content. Every screen renders from this file.
  lib/progress.js      pure derivation: completion, ratios, lock rules
  hooks/
    useAudio.js        Web Audio blips (two-note rising / muted lower)
    useCountUp.js      requestAnimationFrame count-up for the XP readout
  components/
    Header.jsx         wordmark, breadcrumbs, XP readout, mute toggle
    Roadmap.jsx        home — vertical rail with section nodes
    SectionView.jsx    lesson list with status glyphs
    LessonView.jsx     lesson chrome
    ReorderExercise.jsx  the dnd-kit exercise + check logic
    SortableLine.jsx   one draggable code line
  styles/
    tokens.css         every design token
    global.css         ground, type, container, focus, reduced-motion
```

State lives in React only — no backend, no auth, no router, no persistence.
`App.jsx` holds a single `view` object (`home` / `section` / `lesson`),
the list of completed lesson ids, the XP total, and the mute flag.

## Content

`src/data/courseData.js` is the single source of truth:

```js
sections[{ id, title, description,
  lessons[{ id, title, xp, type, codeLines[] }] }]
```

`codeLines` are stored in **correct** order; the exercise shuffles at runtime.
No component contains hardcoded course content.

## Agent setup

This project was built by parallel subagents working against frozen contracts.

`.claude/skills/`
- `codecraft-design-system` — tokens, type scale, state language, anti-slop rules
- `codecraft-contracts` — file ownership, data schema, prop and hook signatures

`.claude/agents/`
- `codecraft-data` — owns `courseData.js` and `progress.js`
- `codecraft-ui` — owns tokens, global CSS, Header, Roadmap, SectionView
- `codecraft-interaction` — owns the hooks, LessonView, ReorderExercise, SortableLine
- `codecraft-reviewer` — read-only audit against both skills

The skills are the reason parallel work integrates: every agent reads the same
contract file before writing, and file ownership is disjoint.

## Design constraints

Background `#0D1117`, surface `#161B22`, border `#30363D`. Emerald `#10B981`
for progress and success, amber `#F59E0B` for the current position and XP.
JetBrains Mono for code and numbers, Inter for prose. Sharp corners, 1px
borders, no gradients, no drop shadows.

## License

MIT — see [LICENSE](LICENSE).
