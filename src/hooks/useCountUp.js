import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

function easeOutCubic(t) {
  const p = t - 1
  return p * p * p + 1
}

/**
 * useCountUp(value, { duration = 600 }) -> number
 *
 * Animates from the previous rendered value to `value` with
 * requestAnimationFrame and an ease-out cubic curve. Snaps instantly on
 * first mount and whenever the user prefers reduced motion. Cancels its RAF
 * on unmount and whenever the target changes mid-flight.
 */
export function useCountUp(value, { duration = 600 } = {}) {
  const [display, setDisplay] = useState(value)
  const rafRef = useRef(null)
  const fromRef = useRef(value)
  const mountedRef = useRef(false)
  const currentRef = useRef(value) // latest animated value, kept in sync every tick

  useEffect(() => {
    // First mount: snap, no animation.
    if (!mountedRef.current) {
      mountedRef.current = true
      fromRef.current = value
      setDisplay(value)
      return
    }

    const from = fromRef.current
    const to = value

    if (from === to) return

    if (prefersReducedMotion()) {
      fromRef.current = to
      setDisplay(to)
      return
    }

    let start = null
    const tick = (timestamp) => {
      if (start === null) start = timestamp
      const elapsed = timestamp - start
      const t = Math.min(1, elapsed / duration)
      const eased = easeOutCubic(t)
      const current = Math.round(from + (to - from) * eased)
      currentRef.current = current
      setDisplay(current)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
        currentRef.current = to
        rafRef.current = null
      }
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      // Whatever we had animated to becomes the new baseline so a value
      // change mid-flight resumes smoothly from where we actually were.
      fromRef.current = currentRef.current
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [])

  return display
}
