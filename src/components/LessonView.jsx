import { useEffect, useRef, useState } from 'react'
import ReorderExercise from './ReorderExercise'
import { useI18n } from '../i18n'
import styles from './LessonView.module.css'

/**
 * Lesson chrome: back control, a section micro-label, title, this lesson's
 * XP badge, a short prompt, then the reorder exercise itself. Renders
 * lesson.codeLines etc. via props only — zero hardcoded course content.
 */
export default function LessonView({ section, lesson, isCompleted, muted, onComplete, onBack, onNext }) {
  const { t, tc } = useI18n()
  // Guards onComplete so a re-render or a second correct check cannot
  // double-award XP. Reset whenever the lesson identity changes.
  const hasAwardedRef = useRef(isCompleted)
  // Whether the XP badge should show its earned (emerald) treatment. The
  // badge itself always displays lesson.xp — it states the reward on
  // offer, not a running total, so it never animates up from zero.
  const [earned, setEarned] = useState(isCompleted)

  useEffect(() => {
    hasAwardedRef.current = isCompleted
    setEarned(isCompleted)
  }, [lesson.id, isCompleted])

  const handleComplete = (xp) => {
    if (hasAwardedRef.current) return
    hasAwardedRef.current = true
    setEarned(true)
    onComplete(xp)
  }

  const xpClassName = [styles.xp, earned ? styles.xpEarned : ''].filter(Boolean).join(' ')

  return (
    <section className={styles.wrap}>
      <button type="button" className={styles.back} onClick={onBack}>
        <span className="cc-flip" aria-hidden="true">
          &larr;
        </span>{' '}
        {t('lesson.back')}
      </button>

      <span className={styles.sectionLabel}>
        {tc(section.id, 'title', section.title)}
      </span>

      <div className={styles.titleRow}>
        <h1 className={styles.title}>{tc(lesson.id, 'title', lesson.title)}</h1>
        <span className={xpClassName} aria-live="polite">
          <span className={styles.xpValue}>{lesson.xp}</span> {t('lesson.xp')}
        </span>
      </div>

      <p className={styles.prompt}>{t('lesson.prompt')}</p>

      <ReorderExercise
        key={lesson.id}
        lesson={lesson}
        isCompleted={isCompleted}
        muted={muted}
        onComplete={handleComplete}
        onNext={onNext}
        onBack={onBack}
      />
    </section>
  )
}
