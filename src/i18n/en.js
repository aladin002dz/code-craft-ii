// English — the canonical dictionary. Every key that exists anywhere in the
// app exists here first. See .claude/skills/codecraft-i18n/SKILL.md.

export default {
  header: {
    breadcrumb: 'Breadcrumb',
    xp: 'xp',
    mute: 'Mute sound',
    unmute: 'Unmute sound',
    language: 'Language',
  },

  roadmap: {
    title: 'Roadmap',
    // {done} and {total} render as their own elements, so this string is
    // only the trailing noun phrase.
    lessonsComplete: { one: 'lesson complete', other: 'lessons complete' },
    inProgress: 'in progress',
    locked: 'locked',
    lessonCount: { one: 'lesson', other: 'lessons' },
    lockedHint: 'Locked — finish the previous section first',
  },

  section: {
    back: 'back to roadmap',
    lockedHint: 'Locked — finish the previous lesson first',
    xp: 'xp',
  },

  lesson: {
    back: 'Back',
    prompt: 'Drag the lines into the correct order, then check your work.',
    xp: 'xp',
    dragHandle: 'Drag to reorder line',
    check: 'Check',
    next: 'Next lesson',
    backToSection: 'Back to section',
    correct: {
      one: 'Correct. The line is in the right order.',
      other: 'Correct. All {total} lines are in the right order.',
    },
    incorrect: {
      one: '{correct} of {total} lines is in the right position. Try again.',
      other: '{correct} of {total} lines are in the right position. Try again.',
    },
  },

  // Course content, keyed by the ids in courseData.js. Structure and the
  // English source of truth stay in that file; this mirrors its text so the
  // frozen data schema is never widened.
  course: {
    foundations: {
      title: 'Syntax Foundations',
      description:
        'Modern declarations, arrow functions, and template literals that replace var and string concatenation.',
    },
    'foundations-greet': { title: 'Build a greeting with a template literal' },
    'foundations-format-price': { title: 'Format a price with a default currency' },
    'foundations-destructure-config': { title: 'Destructure a config object with a default' },
    'foundations-rest-sum': { title: 'Collect arguments with a rest parameter' },

    arrays: {
      title: 'Arrays & Destructuring',
      description:
        'Filtering, mapping, and destructuring the arrays that replace manual for loops.',
    },
    'arrays-filter-map-reduce': { title: 'Filter, map, and reduce a list of numbers' },
    'arrays-swap-destructure': { title: 'Swap two values with array destructuring' },
    'arrays-merge-unique': { title: 'Merge two arrays and remove duplicates' },
    'arrays-rank-by-score': { title: 'Rank players by score with sort and map' },

    closures: {
      title: 'Closures & Scope',
      description:
        'Closures, scope chains, and the functions that outlive their callers.',
    },
    'closures-counter': { title: 'Create a counter with a closure' },
    'closures-id-generator': { title: 'Generate unique ids with a closure' },
    'closures-scope-chain': { title: 'Read an outer variable through a scope chain' },
    'closures-partial-chain': { title: 'Build a partial application chain' },

    async: {
      title: 'Asynchronous JavaScript',
      description:
        'Promises and async/await, the control flow for code that waits on real work.',
    },
    'async-promise-chain': { title: 'Chain promises with then' },
    'async-await-basics': { title: 'Rewrite a promise chain with async and await' },
    'async-catch-recover': { title: 'Recover from a rejected promise with catch' },
    'async-parallel-all': { title: 'Fetch a list in parallel with Promise.all' },

    'advanced-patterns': {
      title: 'Advanced Patterns',
      description:
        'Debouncing, memoization, currying, and the generators behind production-grade tools.',
    },
    'patterns-debounce': { title: 'Debounce a callback' },
    'patterns-memoize': { title: 'Memoize a function with a Map' },
    'patterns-curry': { title: 'Curry a three-argument function' },
    'patterns-generator': { title: 'Generate an infinite sequence lazily' },
  },
}
