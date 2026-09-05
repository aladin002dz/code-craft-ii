// CodeCraft localization runtime. No dependency — a context, three plain
// dictionaries, and a t(). See .claude/skills/codecraft-i18n/SKILL.md.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import en from './en.js'
import fr from './fr.js'
import ar from './ar.js'

const DICTS = { en, fr, ar }

// Order is the order they appear in the switcher.
export const LOCALES = [
  { code: 'en', label: 'EN', name: 'English', dir: 'ltr' },
  { code: 'fr', label: 'FR', name: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'AR', name: 'العربية', dir: 'rtl' },
]

const DEFAULT_LOCALE = 'en'

/** Walks a dotted key path. Returns undefined rather than throwing. */
function lookup(dict, path) {
  return path.split('.').reduce((node, part) => {
    return node && typeof node === 'object' ? node[part] : undefined
  }, dict)
}

/** Replaces every {placeholder} with the matching var, left as-is if absent. */
function interpolate(template, vars) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (whole, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole
  )
}

/**
 * Picks a plural form from a { one, other, ... } object using the browser's
 * own CLDR rules. Falls back through 'other' so a dictionary that only
 * supplies one form still renders.
 */
function selectPlural(forms, count, locale) {
  let category = 'other'
  try {
    category = new Intl.PluralRules(locale).select(count)
  } catch {
    category = count === 1 ? 'one' : 'other'
  }
  return forms[category] ?? forms.other ?? forms.one ?? ''
}

/**
 * Resolves a key against the active locale, then English, so a locale that
 * is missing a string degrades to a readable one instead of a raw key.
 */
function resolve(locale, key) {
  const own = lookup(DICTS[locale], key)
  if (own !== undefined) return own
  const fallback = lookup(DICTS[DEFAULT_LOCALE], key)
  return fallback
}

const I18nContext = createContext(null)

/** Best-effort initial locale from the browser. Never persisted (contracts). */
function detectLocale() {
  try {
    const tags = navigator.languages?.length
      ? navigator.languages
      : [navigator.language]
    for (const tag of tags) {
      const base = String(tag).toLowerCase().split('-')[0]
      if (DICTS[base]) return base
    }
  } catch {
    /* SSR or a locked-down browser — fall through */
  }
  return DEFAULT_LOCALE
}

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(detectLocale)

  const dir = useMemo(
    () => LOCALES.find((l) => l.code === locale)?.dir ?? 'ltr',
    [locale]
  )

  // The <html> element is the only thing outside React's tree we touch, and
  // it is the correct owner of lang/dir for the whole document.
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  /**
   * t('some.key')                       -> string
   * t('some.key', { name: 'Ada' })      -> interpolated
   * t('some.key', { count: 3 })         -> plural-selected, then interpolated
   */
  const t = useCallback(
    (key, vars) => {
      const entry = resolve(locale, key)
      if (entry === undefined) return key
      const template =
        typeof entry === 'object' && entry !== null
          ? selectPlural(entry, vars?.count ?? 0, locale)
          : entry
      return interpolate(String(template), vars)
    },
    [locale]
  )

  /**
   * Course content: translated by id, falling back to the English text that
   * already lives in courseData.js so the frozen data schema is untouched.
   */
  const tc = useCallback(
    (id, field, fallback) => {
      const entry = resolve(locale, `course.${id}`)
      const value = entry && typeof entry === 'object' ? entry[field] : undefined
      return value ?? fallback
    },
    [locale]
  )

  const value = useMemo(
    () => ({ locale, dir, setLocale, t, tc }),
    [locale, dir, t, tc]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <LanguageProvider>')
  return ctx
}
