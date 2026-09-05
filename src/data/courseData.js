// Course content for CodeCraft: modern JavaScript, five sections.
// Every screen in the app renders from this file. See
// .claude/skills/codecraft-contracts/SKILL.md for the frozen shape.

export const sections = [
  {
    id: 'foundations',
    title: 'Syntax Foundations',
    description:
      'Modern declarations, arrow functions, and template literals that replace var and string concatenation.',
    lessons: [
      {
        id: 'foundations-greet',
        title: 'Build a greeting with a template literal',
        xp: 20,
        type: 'reorder',
        codeLines: [
          'function greet(name, hour) {',
          "  const period = hour < 12 ? 'morning' : 'evening';",
          "  const emphasis = period === 'morning' ? '' : ', friend';",
          '  return `Good ${period}, ${name}${emphasis}`;',
          '}',
        ],
      },
      {
        id: 'foundations-format-price',
        title: 'Format a price with a default currency',
        xp: 25,
        type: 'reorder',
        codeLines: [
          "const formatPrice = (amount, currency = 'USD') => {",
          '  const rounded = Math.round(amount * 100) / 100;',
          '  const fixed = rounded.toFixed(2);',
          '  return `${currency}${fixed}`;',
          '};',
        ],
      },
      {
        id: 'foundations-destructure-config',
        title: 'Destructure a config object with a default',
        xp: 25,
        type: 'reorder',
        codeLines: [
          'const config = { retries: 3, timeout: 1000 };',
          'const { retries: maxRetries, delay = 200 } = config;',
          'const totalWait = maxRetries * delay;',
          'const message = `Waiting up to ${totalWait}ms`;',
          'console.log(message);',
        ],
      },
      {
        id: 'foundations-rest-sum',
        title: 'Collect arguments with a rest parameter',
        xp: 30,
        type: 'reorder',
        codeLines: [
          'function sum(...numbers) {',
          '  const total = numbers.reduce((acc, n) => acc + n, 0);',
          '  const average = total / numbers.length;',
          '  return { total, average };',
          '}',
        ],
      },
    ],
  },
  {
    id: 'arrays',
    title: 'Arrays & Destructuring',
    description:
      'Filtering, mapping, and destructuring the arrays that replace manual for loops.',
    lessons: [
      {
        id: 'arrays-filter-map-reduce',
        title: 'Filter, map, and reduce a list of numbers',
        xp: 30,
        type: 'reorder',
        codeLines: [
          'const numbers = [1, 2, 3, 4, 5, 6];',
          'const evens = numbers.filter((n) => n % 2 === 0);',
          'const doubled = evens.map((n) => n * 2);',
          'const sum = doubled.reduce((acc, n) => acc + n, 0);',
          'console.log(sum);',
        ],
      },
      {
        id: 'arrays-swap-destructure',
        title: 'Swap two values with array destructuring',
        xp: 35,
        type: 'reorder',
        codeLines: [
          'function swap(a, b) {',
          '  const pair = [b, a];',
          '  const [first, second] = pair;',
          '  return { first, second };',
          '}',
        ],
      },
      {
        id: 'arrays-merge-unique',
        title: 'Merge two arrays and remove duplicates',
        xp: 35,
        type: 'reorder',
        codeLines: [
          'function mergeUnique(a, b) {',
          '  const combined = [...a, ...b];',
          '  const unique = [...new Set(combined)];',
          '  return unique.sort((x, y) => x - y);',
          '}',
        ],
      },
      {
        id: 'arrays-rank-by-score',
        title: 'Rank players by score with sort and map',
        xp: 40,
        type: 'reorder',
        codeLines: [
          'function rankPlayers(list) {',
          '  const sorted = list.sort((a, b) => b.score - a.score);',
          '  const [leader] = sorted;',
          '  return `${leader.name} leads with ${leader.score} points`;',
          '}',
        ],
      },
    ],
  },
  {
    id: 'closures',
    title: 'Closures & Scope',
    description:
      'Closures, scope chains, and the functions that outlive their callers.',
    lessons: [
      {
        id: 'closures-counter',
        title: 'Create a counter with a closure',
        xp: 40,
        type: 'reorder',
        codeLines: [
          'const createCounter = (start = 0) => {',
          '  let count = start;',
          '  const increment = () => (count += 1);',
          '  return { increment, current: () => count };',
          '};',
        ],
      },
      {
        id: 'closures-id-generator',
        title: 'Generate unique ids with a closure',
        xp: 45,
        type: 'reorder',
        codeLines: [
          'const createIdGenerator = (prefix) => {',
          '  let count = 0;',
          '  const next = () => `${prefix}-${++count}`;',
          '  return next;',
          '};',
        ],
      },
      {
        id: 'closures-scope-chain',
        title: 'Read an outer variable through a scope chain',
        xp: 45,
        type: 'reorder',
        codeLines: [
          'const outer = () => {',
          "  const secret = 'lexical';",
          '  const middle = () => () => `scope: ${secret}`;',
          '  return middle()();',
          '};',
        ],
      },
      {
        id: 'closures-partial-chain',
        title: 'Build a partial application chain',
        xp: 50,
        type: 'reorder',
        codeLines: [
          'const add = (a, b) => a + b;',
          'const addFive = (b) => add(5, b);',
          'const addFiveThenDouble = (b) => addFive(b) * 2;',
          'const result = addFiveThenDouble(3);',
          'console.log(result);',
        ],
      },
    ],
  },
  {
    id: 'async',
    title: 'Asynchronous JavaScript',
    description:
      'Promises and async/await, the control flow for code that waits on real work.',
    lessons: [
      {
        id: 'async-promise-chain',
        title: 'Chain promises with then',
        xp: 50,
        type: 'reorder',
        codeLines: [
          "const getUser = (id) => Promise.resolve({id, name: 'Ada'});",
          'getUser(1)',
          '  .then((user) => user.name)',
          '  .then((name) => `Hello, ${name}`)',
          '  .then((greeting) => console.log(greeting));',
        ],
      },
      {
        id: 'async-await-basics',
        title: 'Rewrite a promise chain with async and await',
        xp: 55,
        type: 'reorder',
        codeLines: [
          'async function loadProfile(id) {',
          '  const user = await fetchUser(id);',
          '  const posts = await fetchPosts(user.id);',
          '  return { user, posts };',
          '}',
        ],
      },
      {
        id: 'async-catch-recover',
        title: 'Recover from a rejected promise with catch',
        xp: 60,
        type: 'reorder',
        codeLines: [
          'function safeLoad(id) {',
          '  return fetchUser(id)',
          '    .then((user) => ({ ok: true, user }))',
          '    .catch((err) => ({ ok: false, error: err.message }));',
          '}',
        ],
      },
      {
        id: 'async-parallel-all',
        title: 'Fetch a list in parallel with Promise.all',
        xp: 65,
        type: 'reorder',
        codeLines: [
          'async function loadDashboard(ids) {',
          '  const requests = ids.map((id) => fetchUser(id));',
          '  const users = await Promise.all(requests);',
          '  return users.filter((u) => u.active);',
          '}',
        ],
      },
    ],
  },
  {
    id: 'advanced-patterns',
    title: 'Advanced Patterns',
    description:
      'Debouncing, memoization, currying, and the generators behind production-grade tools.',
    lessons: [
      {
        id: 'patterns-debounce',
        title: 'Debounce a callback',
        xp: 65,
        type: 'reorder',
        codeLines: [
          'const debounce = (fn, ms, timer) => (...args) => {',
          '  clearTimeout(timer);',
          '  timer = setTimeout(() => fn(...args), ms);',
          '  return timer;',
          '};',
        ],
      },
      {
        id: 'patterns-memoize',
        title: 'Memoize a function with a Map',
        xp: 70,
        type: 'reorder',
        codeLines: [
          'const memoize = (fn, cache = new Map()) => (arg) => {',
          '  if (cache.has(arg)) return cache.get(arg);',
          '  const result = fn(arg);',
          '  return cache.set(arg, result).get(arg);',
          '};',
        ],
      },
      {
        id: 'patterns-curry',
        title: 'Curry a three-argument function',
        xp: 75,
        type: 'reorder',
        codeLines: [
          'const curry = (fn) => (a) => (b) => (c) => fn(a, b, c);',
          'const add3 = (a, b, c) => a + b + c;',
          'const curriedAdd = curry(add3);',
          'const result = curriedAdd(1)(2)(3);',
          'console.log(result);',
        ],
      },
      {
        id: 'patterns-generator',
        title: 'Generate an infinite sequence lazily',
        xp: 80,
        type: 'reorder',
        codeLines: [
          'function* idGenerator(start = 1) {',
          '  for (let id = start; ; id++) {',
          '    yield id;',
          '  }',
          '}',
        ],
      },
    ],
  },
]

export default sections
