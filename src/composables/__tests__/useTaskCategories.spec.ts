import { describe, it, expect } from 'vitest'
import { useTaskCategories, groupTasksByCategory } from '../useTaskCategories'
import { mockTask } from '@/test-utils/setup'

describe('useTaskCategories', () => {
  describe('groupTasksByCategory', () => {
    it('should group tasks by category correctly', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
        mockTask({ id: 3, category: 'work' }),
        mockTask({ id: 4, category: 'study' }),
        mockTask({ id: 5, category: 'personal' }),
      ]

      const result = groupTasksByCategory(tasks)

      expect(result).toEqual({
        work: [tasks[0], tasks[2]],
        personal: [tasks[1], tasks[4]],
        study: [tasks[3]],
      })
    })

    it('should handle empty tasks array', () => {
      const result = groupTasksByCategory([])

      expect(result).toEqual({})
    })

    it('should handle single task', () => {
      const tasks = [mockTask({ id: 1, category: 'work' })]
      const result = groupTasksByCategory(tasks)

      expect(result).toEqual({
        work: [tasks[0]],
      })
    })

    it('should handle tasks with same category', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'work' }),
        mockTask({ id: 3, category: 'work' }),
      ]

      const result = groupTasksByCategory(tasks)

      expect(result).toEqual({
        work: tasks,
      })
    })

    it('should preserve task order within categories', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
        mockTask({ id: 3, category: 'work' }),
        mockTask({ id: 4, category: 'personal' }),
      ]

      const result = groupTasksByCategory(tasks)

      expect(result.work).toEqual([tasks[0], tasks[2]])
      expect(result.personal).toEqual([tasks[1], tasks[3]])
    })
  })

  describe('useTaskCategories composable', () => {
    it('should return groupTasksByCategory function', () => {
      const { groupTasksByCategory } = useTaskCategories()

      expect(typeof groupTasksByCategory).toBe('function')
    })

    it('should work correctly when called from composable', () => {
      const { groupTasksByCategory } = useTaskCategories()
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
      ]

      const result = groupTasksByCategory(tasks)

      expect(result).toEqual({
        work: [tasks[0]],
        personal: [tasks[1]],
      })
    })
  })
})
