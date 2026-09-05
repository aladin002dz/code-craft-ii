// Verifies the three CodeCraft dictionaries stay in parity, and that every
// course id in courseData.js has a translation in each of them.
//
//   npm run check:i18n
//
// Plain node, no dependencies — the contracts freeze the dependency list.

import en from '../src/i18n/en.js'
import fr from '../src/i18n/fr.js'
import ar from '../src/i18n/ar.js'
import { sections } from '../src/data/courseData.js'

const DICTS = { en, fr, ar }
const CLDR = new Set(['zero', 'one', 'two', 'few', 'many', 'other'])

// A {one, other, ...} plural bag is a single leaf: a locale may legitimately
// supply fewer categories than another, or a plain string where the sentence
// was restructured to avoid agreement entirely.
const isPluralBag = (v) =>
  v &&
  typeof v === 'object' &&
  Object.keys(v).length > 0 &&
  Object.keys(v).every((k) => CLDR.has(k))

function leaves(node, prefix = '') {
  return Object.entries(node).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    if (isPluralBag(v)) return [key]
    if (v && typeof v === 'object') return leaves(v, key)
    return [key]
  })
}

const problems = []

// 1. Every locale carries exactly the keys English defines.
const enKeys = new Set(leaves(en))
for (const locale of ['fr', 'ar']) {
  const keys = new Set(leaves(DICTS[locale]))
  for (const k of enKeys) if (!keys.has(k)) problems.push(`${locale}: missing  ${k}`)
  for (const k of keys) if (!enKeys.has(k)) problems.push(`${locale}: unknown  ${k}`)
}

// 2. Every section and lesson id is translated in every locale.
for (const section of sections) {
  for (const [locale, dict] of Object.entries(DICTS)) {
    const s = dict.course?.[section.id]
    if (!s?.title) problems.push(`${locale}: course.${section.id}.title missing`)
    if (!s?.description) problems.push(`${locale}: course.${section.id}.description missing`)
    for (const lesson of section.lessons) {
      if (!dict.course?.[lesson.id]?.title) {
        problems.push(`${locale}: course.${lesson.id}.title missing`)
      }
    }
  }
}

// 3. No course id is translated that no longer exists in the data.
const knownIds = new Set(sections.flatMap((s) => [s.id, ...s.lessons.map((l) => l.id)]))
for (const [locale, dict] of Object.entries(DICTS)) {
  for (const id of Object.keys(dict.course ?? {})) {
    if (!knownIds.has(id)) problems.push(`${locale}: course.${id} is stale (no such id)`)
  }
}

if (problems.length) {
  console.error('i18n check FAILED:\n' + problems.map((p) => '  ' + p).join('\n'))
  process.exit(1)
}

const lessonCount = sections.reduce((n, s) => n + s.lessons.length, 0)
console.log(
  `i18n OK — ${enKeys.size} keys x 3 locales, ` +
    `${sections.length} sections and ${lessonCount} lessons translated.`
)
