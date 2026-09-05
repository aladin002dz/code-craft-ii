// Pure progress-derivation logic for CodeCraft. No React, no imports from
// courseData.js, no side effects. See
// .claude/skills/codecraft-contracts/SKILL.md for the frozen signatures.

/**
 * @param {Array} sections
 * @param {string[]} completedLessonIds
 * @returns {{
 *   sections: Array<{
 *     id: string, completed: number, total: number,
 *     ratio: number,
 *     status: 'completed'|'current'|'locked'
 *   }>,
 *   completedCount: number, totalCount: number
 * }}
 */
export function deriveProgress(sections, completedLessonIds) {
  const completedSet = new Set(completedLessonIds)

  // First pass: how complete is each section, independent of locking.
  const stats = sections.map((section) => {
    const total = section.lessons.length
    const completed = section.lessons.filter((lesson) =>
      completedSet.has(lesson.id)
    ).length
    const isComplete = total > 0 && completed === total
    return { total, completed, isComplete }
  })

  // Second pass: section 0 is never locked; section n is locked unless
  // section n-1 is fully complete.
  const sectionResults = sections.map((section, index) => {
    const { total, completed, isComplete } = stats[index]
    const ratio = total === 0 ? 0 : completed / total
    const locked = index > 0 && !stats[index - 1].isComplete

    let status
    if (locked) {
      status = 'locked'
    } else if (isComplete) {
      status = 'completed'
    } else {
      status = 'current'
    }

    return { id: section.id, completed, total, ratio, status }
  })

  const completedCount = stats.reduce((sum, s) => sum + s.completed, 0)
  const totalCount = stats.reduce((sum, s) => sum + s.total, 0)

  return { sections: sectionResults, completedCount, totalCount }
}

/**
 * @param {Object} section
 * @param {Object} lesson
 * @param {string[]} completedLessonIds
 * @returns {boolean}
 */
export function isLessonUnlocked(section, lesson, completedLessonIds) {
  const completedSet = new Set(completedLessonIds)
  const index = section.lessons.findIndex((l) => l.id === lesson.id)

  if (index <= 0) return true

  const previousLesson = section.lessons[index - 1]
  return completedSet.has(previousLesson.id)
}
