---
name: codecraft-i18n
description: The CodeCraft localization contract — the three locales, what is and is not translated, the RTL rules for Arabic, and the typography adjustments cursive script requires. Load before adding a string, a locale, or any direction-sensitive CSS.
---

# CodeCraft Localization

CodeCraft ships in **English (en)**, **French (fr)** and **Arabic (ar)**.
Arabic is right-to-left; the other two are left-to-right.

## Non-negotiable constraints

- **No i18n dependency.** The contracts freeze the dependency list. The
  whole system is a context, three plain-object dictionaries, and a `t()`.
- **Code is never translated.** `lesson.codeLines` are JavaScript. Keywords,
  identifiers, string literals and the line-number gutter stay exactly as
  authored, in every locale, always rendered **LTR** even inside an RTL page.
  A learner reordering `const` and `=>` must see the same tokens they will
  type into a real editor.
- **Western digits (0–9) everywhere**, including Arabic. The gutter numbers
  index code lines and must match the code; XP and counts must match the
  gutter. Eastern Arabic numerals would split the app's numeric language.
- **No flag emoji, no flags at all.** Anti-slop rule 1 still holds, and a
  flag names a country, not a language. The switcher is three mono
  language codes: `EN` `FR` `AR`.

## What carries a translation

| Layer | Translated |
|---|---|
| UI chrome (buttons, labels, messages, `aria-label`s) | yes |
| Section titles and descriptions | yes |
| Lesson titles | yes |
| `lesson.codeLines` | **never** |
| The `codecraft` wordmark | **never** — it is the brand |

## Where the strings live

```
src/i18n/en.js      canonical; every key that exists, exists here first
src/i18n/fr.js
src/i18n/ar.js
src/i18n/index.jsx  LanguageProvider, useI18n(), LOCALES
```

`courseData.js` keeps its **frozen schema** and stays the canonical English
source of structure. Course-content translations are keyed by the same ids
under a `course` map in each locale file:

```js
course: {
  'foundations':       { title: '…', description: '…' },
  'foundations-greet': { title: '…' },
}
```

A missing key falls back to English, then to the raw `courseData` value.
Nothing ever renders a bare key or `undefined`.

## Plurals and interpolation

`t(key, vars)` interpolates `{name}` placeholders. Where a noun's form
varies with a count, the dictionary supplies a `{ one, other, … }` object
and the runtime picks a form with **`Intl.PluralRules`** — built into the
browser, so it costs nothing.

Arabic plural rules have six categories. Rather than fight them, Arabic
copy is **phrased around the count** (`"أسطر في موضعها الصحيح: 3 من 5"`)
wherever a natural form would need all six. Restructure the sentence before
you add a plural category you cannot check.

## Direction

`<html>` carries `lang` and `dir`, set from the active locale. Everything
downstream is written in **CSS logical properties** so a single `dir` flip
mirrors the layout:

- `text-align: start`, never `left`
- `inset-inline-start`, never `left`
- `margin-inline`, `padding-inline`, `border-inline-start`

Two things must **not** mirror:

1. **The code block.** `direction: ltr` is pinned on the exercise list.
2. **Symmetric motion.** The shake is `±4px` about centre; it is
   direction-neutral and stays as written.

Directional glyphs (`←`, `→`) **do** mirror, via `scaleX(-1)` under
`html[dir='rtl']`. A back arrow points at the edge the user came from.

## Typography under Arabic

Arabic is cursive: letters join. Two Latin-typographic habits actively
damage it and must be switched off.

- **`letter-spacing` breaks the joins.** Micro-labels read their tracking
  from `--ls-micro`, which tokens.css sets to `0` under `[dir='rtl']`.
- **`text-transform: uppercase` is meaningless** — Arabic is unicameral.
  Micro-labels read `--tt-micro`, which becomes `none` under `[dir='rtl']`.

Neither JetBrains Mono nor Inter covers Arabic. `Noto Sans Arabic` is
appended to **both** the `--sans` and `--mono` stacks, so Latin and digits
keep their intended face while Arabic falls through to a face that has the
glyphs. There is no credible Arabic monospace, and a mono micro-label is a
Latin-typographic idea — Arabic taking a proportional face there is correct,
not a compromise.

Arabic also sits lower and needs more leading than Latin at the same size;
`html[dir='rtl'] body` carries a slightly looser `line-height`.

## Adding a string

1. Add the key to `en.js` first.
2. Add it to `fr.js` and `ar.js` in the same position.
3. Never inline a user-facing literal in a component. If it renders, it is
   a key — including every `aria-label` and `title`.
