import { isLessonUnlocked } from '../lib/progress.js'
import { useI18n } from '../i18n'
import styles from './SectionView.module.css'

function pad2(n) {
  return String(n).padStart(2, '0')
}

// done takes priority; otherwise defer to the shared lock rule so this
// stays in lockstep with the roadmap's own locking logic.
function lessonStatus(section, lesson, completedIds) {
  if (completedIds.includes(lesson.id)) return 'done'
  if (!isLessonUnlocked(section, lesson, completedIds)) return 'locked'
  return 'current'
}

export function SectionView({ section, completedIds, onOpenLesson, onBack }) {
  const { t, tc } = useI18n()

  return (
    <>
      <button type="button" className={styles.back} onClick={onBack}>
        <span className="cc-flip" aria-hidden="true">
          ←
        </span>{' '}
        {t('section.back')}
      </button>

      <h2 className={styles.title}>{tc(section.id, 'title', section.title)}</h2>
      <p className={styles.description}>
        {tc(section.id, 'description', section.description)}
      </p>

      <ol className={styles.list}>
        {section.lessons.map((lesson, i) => {
          const status = lessonStatus(section, lesson, completedIds)
          const locked = status === 'locked'

          const rowInner = (
            <>
              <span className={styles.index}>{pad2(i + 1)}</span>
              <span
                className={`${styles.glyph}${status === 'current' ? ' cc-flip' : ''}`}
                data-status={status}
                aria-hidden="true"
              >
                {status === 'done' ? '✓' : status === 'current' ? '→' : '·'}
              </span>
              <span className={styles.lessonTitle}>
                {tc(lesson.id, 'title', lesson.title)}
              </span>
              <span className={styles.xp}>
                {lesson.xp} {t('section.xp')}
              </span>
            </>
          )

          return (
            <li key={lesson.id} className={styles.item}>
              {locked ? (
                <div
                  className={`${styles.row} ${styles.rowLocked}`}
                  data-status={status}
                  title={t('section.lockedHint')}
                >
                  {rowInner}
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.row}
                  data-status={status}
                  onClick={() => onOpenLesson(lesson.id)}
                >
                  {rowInner}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </>
  )
}

export default SectionView
