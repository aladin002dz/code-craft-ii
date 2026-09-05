import { useCallback, useRef, useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import SortableLine from './SortableLine'
import { useAudio } from '../hooks/useAudio'
import styles from './ReorderExercise.module.css'

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// Fisher-Yates shuffle, retried until it differs from the identity
// (correct) order. With 5 items this resolves in at most a handful of
// iterations and is guaranteed to terminate (a 5-element identity is only
// one of 120 permutations).
function shuffledOrder(length) {
  const identity = Array.from({ length }, (_, i) => i)
  if (length < 2) return identity
  let arr = identity
  do {
    arr = [...identity]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  } while (arr.every((v, i) => v === i))
  return arr
}

export default function ReorderExercise({ lesson, isCompleted, muted, onComplete, onNext, onBack }) {
  const codeLines = lesson.codeLines
  const identity = Array.from({ length: codeLines.length }, (_, i) => i)

  const [order, setOrder] = useState(() => (isCompleted ? identity : shuffledOrder(codeLines.length)))
  const [solved, setSolved] = useState(isCompleted)
  const [wrongIds, setWrongIds] = useState(() => new Set())
  const [flashing, setFlashing] = useState(false)
  const [message, setMessage] = useState('')
  // Tracks an in-progress pointer/keyboard drag so text selection can be
  // suppressed only while dragging, keeping code text selectable otherwise.
  const [isDragging, setIsDragging] = useState(false)

  const solvedOnceRef = useRef(isCompleted) // guards this component's own check handler
  const reducedMotion = prefersReducedMotion()

  const { playCorrect, playIncorrect } = useAudio(muted)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const triggerShake = useCallback((ids) => {
    // Clear first, then re-apply on the next frame so the shake replays
    // even if the same lines were already flagged wrong a moment ago.
    setWrongIds(new Set())
    requestAnimationFrame(() => {
      setWrongIds(ids)
    })
  }, [])

  const handleLineAnimationEnd = useCallback((id) => {
    setWrongIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const handleCheck = useCallback(() => {
    if (solvedOnceRef.current) return

    const isCorrect = order.every((id, i) => id === i)

    if (isCorrect) {
      solvedOnceRef.current = true
      setSolved(true)
      setWrongIds(new Set())
      setMessage('Correct. All 5 lines are in the right order.')
      if (!reducedMotion) {
        setFlashing(true)
      }
      playCorrect()
      onComplete(lesson.xp)
    } else {
      const correctCount = order.filter((id, i) => id === i).length
      const wrong = new Set(order.filter((id, i) => id !== i))
      if (reducedMotion) {
        setWrongIds(wrong)
      } else {
        triggerShake(wrong)
      }
      setMessage(`${correctCount} of ${order.length} lines are in the right position. Try again.`)
      playIncorrect()
    }
  }, [order, reducedMotion, triggerShake, playCorrect, playIncorrect, onComplete, lesson.xp])

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback((event) => {
    setIsDragging(false)
    const { active, over } = event
    if (!over || active.id === over.id) return
    setOrder((items) => {
      const oldIndex = items.indexOf(active.id)
      const newIndex = items.indexOf(over.id)
      if (oldIndex === -1 || newIndex === -1) return items
      return arrayMove(items, oldIndex, newIndex)
    })
  }, [])

  const handleDragCancel = useCallback(() => {
    setIsDragging(false)
  }, [])

  const containerClassName = [
    styles.exercise,
    solved ? styles.solved : '',
    flashing ? styles.flash : '',
    isDragging ? styles.dragging : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleContainerAnimationEnd = useCallback((event) => {
    // animationend bubbles from child rows (their shake animation) — only
    // react to the container's own flash animation ending.
    if (event.target === event.currentTarget) {
      setFlashing(false)
    }
  }, [])

  return (
    <div className={containerClassName} onAnimationEnd={handleContainerAnimationEnd}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ol className={styles.list}>
            {order.map((lineId, index) => (
              <SortableLine
                key={lineId}
                id={lineId}
                text={codeLines[lineId]}
                index={index}
                wrong={wrongIds.has(lineId)}
                locked={solved}
                onAnimationEnd={() => handleLineAnimationEnd(lineId)}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      <div className={styles.footer}>
        <p className={styles.message} aria-live="polite">
          {message}
        </p>
        {solved ? (
          <button type="button" className={styles.primaryButton} onClick={onNext ?? onBack}>
            {onNext ? 'Next lesson' : 'Back to section'}
          </button>
        ) : (
          <button type="button" className={styles.primaryButton} onClick={handleCheck}>
            Check
          </button>
        )}
      </div>
    </div>
  )
}
