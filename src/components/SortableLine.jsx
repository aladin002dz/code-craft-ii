import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styles from './ReorderExercise.module.css'

/**
 * One draggable code line inside ReorderExercise.
 *
 * Props:
 * - id: stable identity for the sortable line
 * - text: the code text to display
 * - index: current position (0-based) — drives the mono line-number gutter
 * - wrong: true when this line is in the wrong slot after an incorrect check
 * - locked: true once the exercise is solved — disables drag entirely
 */
export default function SortableLine({ id, text, index, wrong, locked, onAnimationEnd }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: locked })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const rowClassName = [
    styles.line,
    isDragging ? styles.lineDragging : '',
    wrong ? styles.lineWrong : '',
    locked ? styles.lineLocked : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleAnimationEnd = (event) => {
    // Only react to this row's own shake animation, not anything bubbling
    // up from further down the tree.
    if (event.target === event.currentTarget && onAnimationEnd) {
      onAnimationEnd()
    }
  }

  return (
    <li ref={setNodeRef} style={style} className={rowClassName} onAnimationEnd={handleAnimationEnd}>
      <span className={styles.gutter}>{String(index + 1).padStart(2, '0')}</span>
      <button
        type="button"
        className={styles.handle}
        aria-label="Drag to reorder line"
        disabled={locked}
        {...attributes}
        {...listeners}
      >
        <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true" focusable="false">
          <circle cx="2.5" cy="2.5" r="1.4" fill="currentColor" />
          <circle cx="7.5" cy="2.5" r="1.4" fill="currentColor" />
          <circle cx="2.5" cy="8" r="1.4" fill="currentColor" />
          <circle cx="7.5" cy="8" r="1.4" fill="currentColor" />
          <circle cx="2.5" cy="13.5" r="1.4" fill="currentColor" />
          <circle cx="7.5" cy="13.5" r="1.4" fill="currentColor" />
        </svg>
      </button>
      <code className={styles.code}>{text}</code>
    </li>
  )
}
