import React, { useEffect, useRef, useState } from 'react'
import ReorderExercise from './ReorderExercise'
import { useCountUp } from '../hooks/useCountUp'
import styles from './LessonView.module.css'

/**
 * Lesson chrome: back control, section/lesson crumb, title, this lesson's
 * XP value, a short prompt, then the reorder exercise itself. Renders
 * lesson.codeLines etc. via props only — zero hardcoded course content.
 */
export default function LessonView({ section, lesson, isCompleted, muted, onComplete, onBack, onNext }) {
  // Guards onComplete so a re-render or a second correct check cannot
  // double-award XP. Reset whenever the lesson identity changes.
  const hasAwardedRef = useRef(isCompleted)
  const [awardedXp, setAwardedXp] = useState(isCompleted ? lesson.xp : 0)
  const shownXp = useCountUp(awardedXp)

  useEffect(() => {
    hasAwardedRef.current = isCompleted
    setAwardedXp(isCompleted ? lesson.xp : 0)
  }, [lesson.id, isCompleted])

  const handleComplete = (xp) => {
    if (hasAwardedRef.current) return
    hasAwardedRef.current = true
    setAwardedXp(xp)
    onComplete(xp)
  }

  return (
    <section className={styles.wrap}>
      <button type="button" className={styles.back} onClick={onBack}>
        <span aria-hidden="true">&larr;</span> Back
      </button>

      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <span className={styles.crumbItem}>{section.title}</span>
        <span className={styles.crumbSep} aria-hidden="true">/</span>
        <span className={styles.crumbItem}>{lesson.title}</span>
      </nav>

      <div className={styles.titleRow}>
        <h1 className={styles.title}>{lesson.title}</h1>
        <span className={styles.xp} aria-live="polite">
          <span className={styles.xpValue}>{shownXp}</span> xp
        </span>
      </div>

      <p className={styles.prompt}>Drag the lines into the correct order, then check your work.</p>

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
