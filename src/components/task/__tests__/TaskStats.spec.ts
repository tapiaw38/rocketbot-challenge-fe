import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createWrapper } from '@/test-utils/setup'
import TaskStats from '../TaskStats.vue'
import { mockTasks, mockTask } from '@/test-utils/setup'
import type { Task } from '@/types/task'

vi.mock('@/constants/categories', () => ({
  getCategoryLabel: (category: string) => category.charAt(0).toUpperCase() + category.slice(1),
}))

vi.mock('@/composables/useTaskCategories', () => ({
  useTaskCategories: () => ({
    groupTasksByCategory: (tasks: Task[]) => {
      return tasks.reduce(
        (acc, task) => {
          if (!acc[task.category]) {
            acc[task.category] = []
          }
          acc[task.category].push(task)
          return acc
        },
        {} as Record<string, Task[]>,
      )
    },
  }),
}))

describe('TaskStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Props', () => {
    it('should render with empty tasks', () => {
      const wrapper = createWrapper(TaskStats, {
        props: { tasks: [] },
      })

      expect(wrapper.find('.p-card').exists()).toBe(true)
      expect(wrapper.text()).toContain('Task Statistics')
      expect(wrapper.text()).toContain('0')
      expect(wrapper.text()).toContain('0')
    })

    it('should render with tasks', () => {
      const tasks = mockTasks(3)
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('Task Statistics')
      expect(wrapper.text()).toContain('3')
    })
  })

  describe('Statistics Calculation', () => {
    it('should calculate total tasks count correctly', () => {
      const tasks = mockTasks(5)
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('5')
      expect(wrapper.text()).toContain('Total Tasks')
    })

    it('should calculate categories count correctly', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
        mockTask({ id: 3, category: 'study' }),
        mockTask({ id: 4, category: 'work' }),
      ]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('4')
      expect(wrapper.text()).toContain('3')
      expect(wrapper.text()).toContain('Categories')
    })

    it('should calculate most active category correctly', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'work' }),
        mockTask({ id: 3, category: 'work' }),
        mockTask({ id: 4, category: 'personal' }),
        mockTask({ id: 5, category: 'personal' }),
      ]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('3')
      expect(wrapper.text()).toContain('Most Active')
    })
  })

  describe('Category Distribution', () => {
    it('should show category distribution when there are categories', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
      ]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('Distribution by Categories')
      expect(wrapper.find('.p-chip').exists()).toBe(true)
    })

    it('should not show category distribution when no categories', () => {
      const wrapper = createWrapper(TaskStats, {
        props: { tasks: [] },
      })

      expect(wrapper.text()).not.toContain('Distribution by Categories')
      expect(wrapper.find('.p-chip').exists()).toBe(false)
    })

    it('should display correct category labels and counts', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'work' }),
        mockTask({ id: 3, category: 'personal' }),
      ]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('Work (2)')
      expect(wrapper.text()).toContain('Personal (1)')
    })

    it('should apply correct color classes to category chips', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
        mockTask({ id: 3, category: 'study' }),
      ]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      const chips = wrapper.findAll('.p-chip')
      expect(chips.length).toBe(3)

      chips.forEach((chip) => {
        const classList = chip.classes()
        expect(classList.some((cls) => cls.startsWith('bg-category-'))).toBe(true)
      })
    })
  })

  describe('Stat Cards', () => {
    it('should render all stat cards', () => {
      const tasks = mockTasks(3)
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      const statCards = wrapper.findAll('.stat-card')
      expect(statCards.length).toBe(3)
    })

    it('should show correct values in stat cards', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'work' }),
        mockTask({ id: 3, category: 'personal' }),
      ]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('3')
      expect(wrapper.text()).toContain('2')
      expect(wrapper.text()).toContain('2')
    })

    it('should have correct styling classes', () => {
      const tasks = mockTasks(1)
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.find('.card-elevated').exists()).toBe(true)
      expect(wrapper.find('.section-spacing').exists()).toBe(true)
    })
  })

  describe('Empty State', () => {
    it('should handle empty tasks array', () => {
      const wrapper = createWrapper(TaskStats, {
        props: { tasks: [] },
      })

      expect(wrapper.text()).toContain('0')
      expect(wrapper.text()).toContain('0')
      expect(wrapper.text()).not.toContain('Most Active')
    })

    it('should not show most active card when no categories', () => {
      const wrapper = createWrapper(TaskStats, {
        props: { tasks: [] },
      })

      expect(wrapper.text()).not.toContain('Most Active')
    })
  })

  describe('Edge Cases', () => {
    it('should handle tasks with same category count', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
        mockTask({ id: 3, category: 'study' }),
      ]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('1')
      expect(wrapper.text()).toContain('1')
    })

    it('should handle single task', () => {
      const tasks = [mockTask({ id: 1, category: 'work' })]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('1')
      expect(wrapper.text()).toContain('1')
      expect(wrapper.text()).toContain('1')
    })

    it('should handle tasks with many categories', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
        mockTask({ id: 3, category: 'study' }),
        mockTask({ id: 4, category: 'health' }),
        mockTask({ id: 5, category: 'finance' }),
      ]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('5')
      expect(wrapper.text()).toContain('5')
      expect(wrapper.text()).toContain('1')
    })
  })

  describe('Color Classes', () => {
    it('should cycle through color classes correctly', () => {
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
        mockTask({ id: 3, category: 'study' }),
        mockTask({ id: 4, category: 'health' }),
        mockTask({ id: 5, category: 'finance' }),
        mockTask({ id: 6, category: 'exercise' }),
        mockTask({ id: 7, category: 'entertainment' }),
        mockTask({ id: 8, category: 'travel' }),
        mockTask({ id: 9, category: 'shopping' }),
        mockTask({ id: 10, category: 'home' }),
        mockTask({ id: 11, category: 'others' }),
      ]
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      const chips = wrapper.findAll('.p-chip')

      for (let i = 0; i < 10; i++) {
        expect(chips[i].classes()).toContain(`bg-category-${i + 1}`)
      }

      expect(chips[10].classes()).toContain('bg-category-1')
    })
  })

  describe('Responsive Layout', () => {
    it('should apply responsive grid classes', () => {
      const tasks = mockTasks(3)
      const wrapper = createWrapper(TaskStats, {
        props: { tasks },
      })

      expect(wrapper.find('.col-12').exists()).toBe(true)
      expect(wrapper.find('.md\\:col-6').exists()).toBe(true)
      expect(wrapper.find('.lg\\:col-4').exists()).toBe(true)
    })
  })
})
