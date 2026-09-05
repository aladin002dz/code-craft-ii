import { useCallback, useMemo, useState } from 'react'
import { sections } from './data/courseData.js'
import { deriveProgress } from './lib/progress.js'
import Header from './components/Header.jsx'
import Roadmap from './components/Roadmap.jsx'
import SectionView from './components/SectionView.jsx'
import LessonView from './components/LessonView.jsx'

const HOME = { name: 'home' }

export default function App() {
  const [view, setView] = useState(HOME)
  const [completedIds, setCompletedIds] = useState([])
  const [xp, setXp] = useState(0)
  const [muted, setMuted] = useState(false)

  const progress = useMemo(
    () => deriveProgress(sections, completedIds),
    [completedIds]
  )

  const section = useMemo(
    () => sections.find((s) => s.id === view.sectionId) ?? null,
    [view.sectionId]
  )

  const lesson = useMemo(
    () => section?.lessons.find((l) => l.id === view.lessonId) ?? null,
    [section, view.lessonId]
  )

  const goHome = useCallback(() => setView(HOME), [])

  const openSection = useCallback(
    (sectionId) => setView({ name: 'section', sectionId }),
    []
  )

  const openLesson = useCallback(
    (lessonId) =>
      setView((v) => ({ name: 'lesson', sectionId: v.sectionId, lessonId })),
    []
  )

  const backToSection = useCallback(
    () => setView((v) => ({ name: 'section', sectionId: v.sectionId })),
    []
  )

  // Fired once per lesson by LessonView, on the first correct solve.
  const handleComplete = useCallback(
    (xpAwarded) => {
      const solvedId = view.lessonId
      if (!solvedId) return
      setCompletedIds((prev) =>
        prev.includes(solvedId) ? prev : [...prev, solvedId]
      )
      setXp((prev) => prev + xpAwarded)
    },
    [view.lessonId]
  )

  // null on the last lesson of a section — LessonView renders "back" instead.
  const nextLesson = useMemo(() => {
    if (!section || !lesson) return null
    const i = section.lessons.findIndex((l) => l.id === lesson.id)
    return section.lessons[i + 1] ?? null
  }, [section, lesson])

  const crumbs = useMemo(() => {
    if (view.name === 'section' && section) {
      return [{ label: section.title, onClick: null }]
    }
    if (view.name === 'lesson' && section && lesson) {
      return [
        { label: section.title, onClick: backToSection },
        { label: lesson.title, onClick: null },
      ]
    }
    return []
  }, [view.name, section, lesson, backToSection])

  return (
    <>
      <Header
        xp={xp}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onHome={goHome}
        crumbs={crumbs}
      />
      <main className="cc-container">
        {view.name === 'home' && (
          <Roadmap
            sections={sections}
            progress={progress}
            onOpenSection={openSection}
          />
        )}

        {view.name === 'section' && section && (
          <SectionView
            section={section}
            completedIds={completedIds}
            onOpenLesson={openLesson}
            onBack={goHome}
          />
        )}

        {view.name === 'lesson' && section && lesson && (
          <LessonView
            key={lesson.id}
            section={section}
            lesson={lesson}
            isCompleted={completedIds.includes(lesson.id)}
            muted={muted}
            onComplete={handleComplete}
            onBack={backToSection}
            onNext={nextLesson ? () => openLesson(nextLesson.id) : null}
          />
        )}
      </main>
    </>
  )
}
