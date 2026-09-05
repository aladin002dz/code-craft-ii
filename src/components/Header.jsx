import { useCountUp } from '../hooks/useCountUp'
import styles from './Header.module.css'

// two-state speaker icon, hand-written paths, ~14px box
function SpeakerIcon({ muted }) {
  return (
    <svg
      className={styles.speakerIcon}
      viewBox="0 0 14 14"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 5.5H3.4L6.6 2.6V11.4L3.4 8.5H1V5.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {muted ? (
        <path
          d="M9.4 5.3L12.6 8.5M12.6 5.3L9.4 8.5"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M9.3 4.6C10.2 5.4 10.2 8.4 9.3 9.2M10.9 3.1C12.4 4.7 12.4 9.1 10.9 10.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export function Header({ xp, muted, onToggleMute, onHome, crumbs = [] }) {
  const shownXp = useCountUp(xp)

  return (
    <header className={styles.header}>
      <div className={`cc-container ${styles.inner}`}>
        <div className={styles.left}>
          <button type="button" className={styles.wordmark} onClick={onHome}>
            <span className={styles.wordmarkBright}>code</span>
            <span className={styles.wordmarkDim}>craft</span>
          </button>

          {crumbs.length > 0 && (
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              {crumbs.map((crumb, i) => (
                <span className={styles.crumbItem} key={`${crumb.label}-${i}`}>
                  <span className={styles.crumbSep} aria-hidden="true">
                    /
                  </span>
                  {crumb.onClick ? (
                    <button
                      type="button"
                      className={styles.crumbLink}
                      onClick={crumb.onClick}
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className={styles.crumbCurrent}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>

        <div className={styles.right}>
          <div className={styles.xp} aria-live="polite">
            <span className={styles.xpValue}>{shownXp}</span>
            <span className={styles.xpLabel}>xp</span>
          </div>

          <button
            type="button"
            className={styles.muteButton}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute sound' : 'Mute sound'}
            onClick={onToggleMute}
          >
            <SpeakerIcon muted={muted} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
