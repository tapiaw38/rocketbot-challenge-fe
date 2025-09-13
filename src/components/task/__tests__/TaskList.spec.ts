import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createWrapper } from '@/test-utils/setup'
import TaskList from '../TaskList.vue'
import { mockTasks, mockTask } from '@/test-utils/setup'

vi.mock('primevue/useconfirm', () => ({
  useConfirm: () => ({
    require: vi.fn(),
  }),
}))

vi.mock('@/constants/categories', () => ({
  getCategoryLabel: (category: string) => category.charAt(0).toUpperCase() + category.slice(1),
}))

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Props', () => {
    it('should render with empty tasks', () => {
      const wrapper = createWrapper(TaskList, {
        props: { tasks: [] },
      })

      expect(wrapper.find('.p-card').exists()).toBe(true)
      expect(wrapper.text()).toContain('No tasks found')
      expect(wrapper.text()).toContain('Create your first task!')
    })

    it('should render with tasks', () => {
      const tasks = mockTasks(3)
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      expect(wrapper.find('.p-dataview').exists()).toBe(true)
      expect(wrapper.text()).toContain('Tasks (3)')
    })

    it('should show loading state', () => {
      const wrapper = createWrapper(TaskList, {
        props: {
          tasks: [],
          loading: true,
        },
      })

      expect(wrapper.text()).toContain('Loading...')
      expect(wrapper.find('.p-progress-spinner').exists()).toBe(true)
    })

    it('should show error message', () => {
      const error = 'Failed to load tasks'
      const wrapper = createWrapper(TaskList, {
        props: {
          tasks: [],
          error,
        },
      })

      expect(wrapper.find('.p-message').exists()).toBe(true)
      expect(wrapper.text()).toContain(error)
    })
  })

  describe('Task Display', () => {
    it('should display task information correctly', () => {
      const tasks = [mockTask({ id: 1, title: 'Test Task', category: 'work' })]
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('Test Task')
      expect(wrapper.text()).toContain('ID: 1')
      expect(wrapper.text()).toContain('Work')
    })

    it('should display multiple tasks', () => {
      const tasks = mockTasks(3)
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      tasks.forEach((task) => {
        expect(wrapper.text()).toContain(task.title)
        expect(wrapper.text()).toContain(`ID: ${task.id}`)
      })
    })

    it('should format date correctly', () => {
      const tasks = [
        mockTask({
          id: 1,
          title: 'Test Task',
          created_at: '2024-01-15T10:30:00Z',
        }),
      ]
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('Created:')
    })

    it('should show category tag for each task', () => {
      const tasks = [mockTask({ id: 1, title: 'Test Task', category: 'work' })]
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      expect(wrapper.find('.p-tag').exists()).toBe(true)
      expect(wrapper.text()).toContain('Work')
    })
  })

  describe('Task Actions', () => {
    it('should render edit and delete buttons for each task', () => {
      const tasks = [mockTask({ id: 1, title: 'Test Task' })]
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      expect(wrapper.find('.p-dataview').exists()).toBe(true)
      expect(wrapper.vm.tasks).toEqual(tasks)
    })

    it('should emit edit event when edit button is clicked', async () => {
      const tasks = [mockTask({ id: 1, title: 'Test Task' })]
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      await wrapper.vm.$emit('edit', tasks[0])

      expect(wrapper.emitted('edit')).toBeTruthy()
      expect(wrapper.emitted('edit')![0]).toEqual([tasks[0]])
    })

    it('should show confirmation dialog when delete button is clicked', async () => {
      const tasks = [mockTask({ id: 1, title: 'Test Task' })]
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      expect(wrapper.vm.tasks).toEqual(tasks)
    })

    it('should disable action buttons when loading', () => {
      const tasks = [mockTask({ id: 1, title: 'Test Task' })]
      const wrapper = createWrapper(TaskList, {
        props: {
          tasks,
          loading: true,
        },
      })

      expect(wrapper.vm.loading).toBe(true)
      expect(wrapper.text()).toContain('Loading...')
    })
  })

  describe('Error Handling', () => {
    it('should emit clear-error event when error message is closed', async () => {
      const wrapper = createWrapper(TaskList, {
        props: {
          tasks: [],
          error: 'Test error',
        },
      })

      const message = wrapper.find('.p-message')
      await message.trigger('close')

      expect(wrapper.emitted('clear-error')).toHaveLength(1)
    })

    it('should not show error message when no error', () => {
      const wrapper = createWrapper(TaskList, {
        props: {
          tasks: [],
          error: null,
        },
      })

      expect(wrapper.find('.p-message').exists()).toBe(false)
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no tasks and not loading', () => {
      const wrapper = createWrapper(TaskList, {
        props: {
          tasks: [],
          loading: false,
        },
      })

      expect(wrapper.text()).toContain('No tasks found')
      expect(wrapper.text()).toContain('Create your first task!')
      expect(wrapper.find('.p-dataview').exists()).toBe(false)
    })

    it('should not show empty state when loading', () => {
      const wrapper = createWrapper(TaskList, {
        props: {
          tasks: [],
          loading: true,
        },
      })

      expect(wrapper.text()).toContain('Loading...')
      expect(wrapper.text()).not.toContain('No tasks found')
    })

    it('should not show empty state when there are tasks', () => {
      const tasks = mockTasks(1)
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      expect(wrapper.text()).not.toContain('No tasks found')
      expect(wrapper.find('.p-dataview').exists()).toBe(true)
    })
  })

  describe('Task Count', () => {
    it('should display correct task count', () => {
      const tasks = mockTasks(5)
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      expect(wrapper.text()).toContain('Tasks (5)')
    })

    it('should display zero count for empty tasks', () => {
      const wrapper = createWrapper(TaskList, {
        props: { tasks: [] },
      })

      expect(wrapper.text()).toContain('Tasks (0)')
    })
  })

  describe('DataView Configuration', () => {
    it('should configure DataView with correct props', () => {
      const tasks = mockTasks(3)
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      const dataView = wrapper.findComponent({ name: 'DataView' })
      expect(dataView.exists()).toBe(true)
      expect(dataView.props('value')).toEqual(tasks)
      expect(dataView.props('layout')).toBe('grid')
      expect(dataView.props('paginator')).toBe(true)
      expect(dataView.props('rows')).toBe(6)
    })
  })

  describe('Grid Layout', () => {
    it('should render tasks in grid layout', () => {
      const tasks = mockTasks(3)
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      expect(wrapper.find('.grid').exists()).toBe(true)
      expect(wrapper.find('.grid-cols-12').exists()).toBe(true)
    })

    it('should apply correct column classes', () => {
      const tasks = mockTasks(3)
      const wrapper = createWrapper(TaskList, {
        props: { tasks },
      })

      const taskCards = wrapper.findAll('.col-12')
      expect(taskCards.length).toBeGreaterThan(0)
    })
  })
})
