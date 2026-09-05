import { useCallback, useRef } from 'react'

/**
 * useAudio(muted) -> { playCorrect, playIncorrect }
 *
 * Lazily constructs a single AudioContext on the first user gesture that
 * actually needs sound. Never constructs a context while muted. Every note
 * is an oscillator routed through its own gain node with a real envelope
 * (fast linear attack, exponential release) so nothing clicks or gates
 * abruptly. All entry points are wrapped in try/catch — audio must never be
 * able to break the UI.
 */
export function useAudio(muted) {
  const ctxRef = useRef(null)

  const getContext = useCallback(() => {
    if (muted) return null
    try {
      if (!ctxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (!AudioCtx) return null
        ctxRef.current = new AudioCtx()
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') {
        // Fire and forget; resume() returns a promise but we don't need to
        // await it before scheduling — scheduling against a suspended
        // context is safe, playback just starts once it resumes.
        ctx.resume().catch(() => {})
      }
      return ctx
    } catch {
      return null
    }
  }, [muted])

  // Play a single tone: oscillator -> gain -> destination, with an attack /
  // exponential-release envelope so the note reads as an intentional blip
  // rather than a raw square-wave click.
  const playTone = useCallback((ctx, { freq, startAt, duration, peakGain, type = 'sine' }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, startAt)

    const attack = 0.008 // ~8ms rise
    gain.gain.setValueAtTime(0.0001, startAt)
    gain.gain.linearRampToValueAtTime(peakGain, startAt + attack)
    // Exponential ramps can't target 0 exactly; 0.0001 reads as silence.
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(startAt)
    osc.stop(startAt + duration + 0.02)
  }, [])

  const playCorrect = useCallback(() => {
    try {
      const ctx = getContext()
      if (!ctx) return
      const now = ctx.currentTime
      const noteLen = 0.09
      // Two rising notes, the second starting as the first ends.
      playTone(ctx, { freq: 660, startAt: now, duration: noteLen, peakGain: 0.085, type: 'sine' })
      playTone(ctx, { freq: 880, startAt: now + noteLen, duration: noteLen, peakGain: 0.085, type: 'sine' })
    } catch {
      // never let audio break the UI
    }
  }, [getContext, playTone])

  const playIncorrect = useCallback(() => {
    try {
      const ctx = getContext()
      if (!ctx) return
      const now = ctx.currentTime
      // One muted, low note — triangle wave reads softer/duller than sine
      // or square at this register, so it reads as "muted" not "harsh".
      playTone(ctx, { freq: 180, startAt: now, duration: 0.16, peakGain: 0.05, type: 'triangle' })
    } catch {
      // never let audio break the UI
    }
  }, [getContext, playTone])

  return { playCorrect, playIncorrect }
}
