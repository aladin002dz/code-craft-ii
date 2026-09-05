import { useI18n } from '../i18n'
import styles from './Roadmap.module.css'

function pad2(n) {
  return String(n).padStart(2, '0')
}

export function Roadmap({ sections, progress, onOpenSection }) {
  const { t, tc } = useI18n()
  const progressById = new Map(progress.sections.map((p) => [p.id, p]))

  // index of the section currently in progress — everything at or above
  // this point on the rail reads emerald, everything below reads --border
  let currentIndex = sections.findIndex(
    (s) => progressById.get(s.id)?.status === 'current'
  )
  if (currentIndex === -1) {
    const allDone = sections.every(
      (s) => progressById.get(s.id)?.status === 'completed'
    )
    currentIndex = allDone ? sections.length : 0
  }

  return (
    <>
      <div className={styles.screenHead}>
        <h1 className={styles.screenTitle}>{t('roadmap.title')}</h1>
        <p className={styles.screenProgress}>
          <span className={styles.screenProgressCount}>
            {progress.completedCount}
          </span>
          {' / '}
          <span className={styles.screenProgressCount}>
            {progress.totalCount}
          </span>{' '}
          {t('roadmap.lessonsComplete', { count: progress.totalCount })}
        </p>
      </div>

      <ol className={styles.rail}>
        {sections.map((section, i) => {
          const p = progressById.get(section.id)
          const status = p?.status ?? 'locked'
          const completed = p?.completed ?? 0
          const total = p?.total ?? section.lessons.length
          const ratio = p?.ratio ?? 0

          const segTopEmerald = i <= currentIndex
          const segBottomEmerald = i < currentIndex
          const isLast = i === sections.length - 1
          const isFirst = i === 0

          const cardInner = (
            <>
              <div className={styles.cardHead}>
                <span className={styles.index}>{pad2(i + 1)}</span>
                {status === 'current' && (
                  <span className={styles.labelCurrent}>
                    {t('roadmap.inProgress')}
                  </span>
                )}
                {status === 'locked' && (
                  <span className={styles.labelLocked}>
                    {t('roadmap.locked')}
                  </span>
                )}
                {status === 'completed' && (
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                )}
              </div>
              <h3 className={styles.title}>
                {tc(section.id, 'title', section.title)}
              </h3>
              <p className={styles.description}>
                {tc(section.id, 'description', section.description)}
              </p>
              <div className={styles.meta}>
                <span className={styles.count}>
                  {completed} / {total}{' '}
                  {t('roadmap.lessonCount', { count: total })}
                </span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  data-status={status}
                  style={{ width: `${Math.round(ratio * 100)}%` }}
                />
              </div>
            </>
          )

          return (
            <li key={section.id} className={styles.row}>
              <div className={styles.railCol}>
                <div
                  className={styles.segTop}
                  data-emerald={segTopEmerald}
                  data-hidden={isFirst}
                />
                <div className={styles.node} data-status={status}>
                  {status === 'current' && (
                    <span className={styles.pulseRing} aria-hidden="true" />
                  )}
                </div>
                <div
                  className={styles.segBottom}
                  data-emerald={segBottomEmerald}
                  data-hidden={isLast}
                />
              </div>

              {status === 'locked' ? (
                <div
                  className={`${styles.card} ${styles.cardLocked}`}
                  title={t('roadmap.lockedHint')}
                >
                  {cardInner}
                </div>
              ) : (
                <button
                  type="button"
                  className={`${styles.card} ${
                    status === 'completed' ? styles.cardCompleted : styles.cardCurrent
                  }`}
                  onClick={() => onOpenSection(section.id)}
                >
                  {cardInner}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </>
  )
}

export default Roadmap
