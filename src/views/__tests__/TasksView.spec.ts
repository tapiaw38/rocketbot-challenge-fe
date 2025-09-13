/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createWrapper } from '@/test-utils/setup'
import TasksView from '../TasksView.vue'
import { mockTasks, mockTask, mockTaskInput } from '@/test-utils/setup'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
  }),
}))

import { ref } from 'vue'

const mockUseTask = {
  tasks: ref(mockTasks(3)),
  loading: ref(false),
  error: ref(null),
  fetchTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  clearError: vi.fn(),
}

vi.mock('@/composables/useTask', () => ({
  useTask: () => mockUseTask,
}))

describe('TasksView', () => {
  beforeEach(() => {
    // Only clear specific mocks that need to be reset, not fetchTasks
    mockUseTask.createTask.mockClear()
    mockUseTask.updateTask.mockClear()
    mockUseTask.deleteTask.mockClear()
    mockUseTask.clearError.mockClear()
  })

  describe('Component Mounting', () => {
    it('should render the main view structure', () => {
      const wrapper = createWrapper(TasksView)

      expect(wrapper.find('.tasks-view').exists()).toBe(true)
      expect(wrapper.find('.app-container').exists()).toBe(true)
      expect(wrapper.text()).toContain('Task Manager')
      expect(wrapper.text()).toContain('Manage your tasks with ease')
    })

    it('should call fetchTasks on mount', async () => {
      // Ensure fetchTasks is a fresh mock for this test
      mockUseTask.fetchTasks = vi.fn()

      const wrapper = createWrapper(TasksView)

      // Wait for nextTick to ensure onMounted has been called
      await wrapper.vm.$nextTick()

      expect(mockUseTask.fetchTasks).toHaveBeenCalled()
    })

    it('should render all child components', () => {
      const wrapper = createWrapper(TasksView)

      expect(wrapper.findComponent({ name: 'Toast' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TaskStats' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TaskForm' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'TaskList' }).exists()).toBe(true)
    })
  })

  describe('Component Props', () => {
    it('should pass correct props to TaskStats', () => {
      const wrapper = createWrapper(TasksView)
      const taskStats = wrapper.findComponent({ name: 'TaskStats' })

      expect(taskStats.props('tasks')).toEqual(mockUseTask.tasks.value)
    })

    it('should pass correct props to TaskForm', () => {
      const wrapper = createWrapper(TasksView)
      const taskForm = wrapper.findComponent({ name: 'TaskForm' })

      expect(taskForm.props('editingTask')).toBe(null)
      expect(taskForm.props('loading')).toBe(mockUseTask.loading.value)
    })

    it('should pass correct props to TaskList', () => {
      const wrapper = createWrapper(TasksView)
      const taskList = wrapper.findComponent({ name: 'TaskList' })

      expect(taskList.props('tasks')).toEqual(mockUseTask.tasks.value)
      expect(taskList.props('loading')).toBe(mockUseTask.loading.value)
      expect(taskList.props('error')).toBe(mockUseTask.error.value)
    })
  })

  describe('Task Submission', () => {
    it('should handle task creation successfully', async () => {
      const wrapper = createWrapper(TasksView)
      const taskInput = mockTaskInput({ title: 'New Task' })

      mockUseTask.createTask.mockResolvedValue(mockTask({ id: 4, title: 'New Task' }))

      await (wrapper.vm as any).handleTaskSubmit(taskInput)

      expect(mockUseTask.createTask).toHaveBeenCalledWith(taskInput)
    })

    it('should handle task update successfully', async () => {
      const wrapper = createWrapper(TasksView)
      const editingTask = mockTask({ id: 1, title: 'Original Task' })
      const taskInput = mockTaskInput({ title: 'Updated Task' })

      ;(wrapper.vm as any).editingTask = editingTask

      mockUseTask.updateTask.mockResolvedValue(mockTask({ id: 1, title: 'Updated Task' }))

      await (wrapper.vm as any).handleTaskSubmit(taskInput)

      expect(mockUseTask.updateTask).toHaveBeenCalledWith(1, taskInput)
      expect((wrapper.vm as any).editingTask).toBe(null)
    })

    it('should handle task submission error', async () => {
      const wrapper = createWrapper(TasksView)
      const taskInput = mockTaskInput()
      const error = new Error('Submission failed')

      mockUseTask.createTask.mockRejectedValue(error)

      await (wrapper.vm as any).handleTaskSubmit(taskInput)

      expect(mockUseTask.createTask).toHaveBeenCalledWith(taskInput)
    })
  })

  describe('Task Editing', () => {
    it('should set editing task when handleTaskEdit is called', () => {
      const wrapper = createWrapper(TasksView)
      const task = mockTask({ id: 1, title: 'Test Task' })

      ;(wrapper.vm as any).handleTaskEdit(task)

      expect((wrapper.vm as any).editingTask).toEqual(task)
    })

    it('should clear editing task when handleTaskCancel is called', () => {
      const wrapper = createWrapper(TasksView)
      const task = mockTask({ id: 1, title: 'Test Task' })

      ;(wrapper.vm as any).editingTask = task
      ;(wrapper.vm as any).handleTaskCancel()

      expect((wrapper.vm as any).editingTask).toBe(null)
    })

    it('should pass editing task to TaskForm', async () => {
      const wrapper = createWrapper(TasksView)
      const task = mockTask({ id: 1, title: 'Test Task' })

      ;(wrapper.vm as any).editingTask = task
      await (wrapper.vm as any).$nextTick()

      const taskForm = wrapper.findComponent({ name: 'TaskForm' })
      expect(taskForm.props('editingTask')).toEqual(task)
    })
  })

  describe('Task Deletion', () => {
    it('should handle task deletion successfully', async () => {
      const wrapper = createWrapper(TasksView)
      const taskId = 1

      mockUseTask.deleteTask.mockResolvedValue(undefined)

      await (wrapper.vm as any).handleTaskDelete(taskId)

      expect(mockUseTask.deleteTask).toHaveBeenCalledWith(taskId)
    })

    it('should clear editing task if deleted task is being edited', async () => {
      const wrapper = createWrapper(TasksView)
      const task = mockTask({ id: 1, title: 'Test Task' })

      ;(wrapper.vm as any).editingTask = task

      mockUseTask.deleteTask.mockResolvedValue(undefined)

      await (wrapper.vm as any).handleTaskDelete(1)

      expect((wrapper.vm as any).editingTask).toBe(null)
    })

    it('should not clear editing task if different task is deleted', async () => {
      const wrapper = createWrapper(TasksView)
      const task = mockTask({ id: 1, title: 'Test Task' })

      ;(wrapper.vm as any).editingTask = task

      mockUseTask.deleteTask.mockResolvedValue(undefined)

      await (wrapper.vm as any).handleTaskDelete(2)

      expect((wrapper.vm as any).editingTask).toEqual(task)
    })

    it('should handle deletion error', async () => {
      const wrapper = createWrapper(TasksView)
      const taskId = 1
      const error = new Error('Deletion failed')

      mockUseTask.deleteTask.mockRejectedValue(error)

      await (wrapper.vm as any).handleTaskDelete(taskId)

      expect(mockUseTask.deleteTask).toHaveBeenCalledWith(taskId)
    })
  })

  describe('Event Handling', () => {
    it('should handle TaskForm submit event', async () => {
      const wrapper = createWrapper(TasksView)
      const taskInput = mockTaskInput()

      const taskForm = wrapper.findComponent({ name: 'TaskForm' })
      await taskForm.vm.$emit('submit', taskInput)

      expect(mockUseTask.createTask).toHaveBeenCalledWith(taskInput)
    })

    it('should handle TaskForm cancel event', async () => {
      const wrapper = createWrapper(TasksView)
      const task = mockTask({ id: 1, title: 'Test Task' })

      ;(wrapper.vm as any).editingTask = task

      const taskForm = wrapper.findComponent({ name: 'TaskForm' })
      await taskForm.vm.$emit('cancel')

      expect((wrapper.vm as any).editingTask).toBe(null)
    })

    it('should handle TaskList edit event', async () => {
      const wrapper = createWrapper(TasksView)
      const task = mockTask({ id: 1, title: 'Test Task' })

      const taskList = wrapper.findComponent({ name: 'TaskList' })
      await taskList.vm.$emit('edit', task)

      expect((wrapper.vm as any).editingTask).toEqual(task)
    })

    it('should handle TaskList delete event', async () => {
      const wrapper = createWrapper(TasksView)
      const taskId = 1

      const taskList = wrapper.findComponent({ name: 'TaskList' })
      await taskList.vm.$emit('delete', taskId)

      expect(mockUseTask.deleteTask).toHaveBeenCalledWith(taskId)
    })

    it('should handle TaskList clear-error event', async () => {
      const wrapper = createWrapper(TasksView)

      const taskList = wrapper.findComponent({ name: 'TaskList' })
      await taskList.vm.$emit('clear-error')

      expect(mockUseTask.clearError).toHaveBeenCalled()
    })
  })

  describe('Reactive State', () => {
    it('should update props when useTask state changes', async () => {
      const wrapper = createWrapper(TasksView)

      mockUseTask.loading.value = true
      mockUseTask.error.value = 'Test error'

      await (wrapper.vm as any).$nextTick()

      const taskForm = wrapper.findComponent({ name: 'TaskForm' })
      const taskList = wrapper.findComponent({ name: 'TaskList' })

      expect(taskForm.props('loading')).toBe(true)
      expect(taskList.props('loading')).toBe(true)
      expect(taskList.props('error')).toBe('Test error')
    })
  })

  describe('Toast Integration', () => {
    it('should show success toast on task creation', async () => {
      const wrapper = createWrapper(TasksView)
      const taskInput = mockTaskInput()

      mockUseTask.createTask.mockResolvedValue(mockTask({ id: 4 }))

      await (wrapper.vm as any).handleTaskSubmit(taskInput)

      expect(mockUseTask.createTask).toHaveBeenCalled()
    })

    it('should show success toast on task update', async () => {
      const wrapper = createWrapper(TasksView)
      const editingTask = mockTask({ id: 1 })
      const taskInput = mockTaskInput()

      ;(wrapper.vm as any).editingTask = editingTask
      mockUseTask.updateTask.mockResolvedValue(mockTask({ id: 1 }))

      await (wrapper.vm as any).handleTaskSubmit(taskInput)

      expect(mockUseTask.updateTask).toHaveBeenCalled()
    })

    it('should show success toast on task deletion', async () => {
      const wrapper = createWrapper(TasksView)

      mockUseTask.deleteTask.mockResolvedValue(undefined)

      await (wrapper.vm as any).handleTaskDelete(1)

      expect(mockUseTask.deleteTask).toHaveBeenCalled()
    })

    it('should show error toast on submission failure', async () => {
      const wrapper = createWrapper(TasksView)
      const taskInput = mockTaskInput()

      mockUseTask.createTask.mockRejectedValue(new Error('Failed'))

      await (wrapper.vm as any).handleTaskSubmit(taskInput)

      expect(mockUseTask.createTask).toHaveBeenCalled()
    })

    it('should show error toast on deletion failure', async () => {
      const wrapper = createWrapper(TasksView)

      mockUseTask.deleteTask.mockRejectedValue(new Error('Failed'))

      await (wrapper.vm as any).handleTaskDelete(1)

      expect(mockUseTask.deleteTask).toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should pass loading state to child components', async () => {
      mockUseTask.loading.value = true
      const wrapper = createWrapper(TasksView)

      const taskForm = wrapper.findComponent({ name: 'TaskForm' })
      const taskList = wrapper.findComponent({ name: 'TaskList' })

      expect(taskForm.props('loading')).toBe(true)
      expect(taskList.props('loading')).toBe(true)
    })
  })

  describe('Error State', () => {
    it('should pass error state to TaskList', async () => {
      mockUseTask.error.value = 'Test error message'
      const wrapper = createWrapper(TasksView)

      const taskList = wrapper.findComponent({ name: 'TaskList' })
      expect(taskList.props('error')).toBe('Test error message')
    })
  })

  describe('Styling', () => {
    it('should apply correct CSS classes', () => {
      const wrapper = createWrapper(TasksView)

      expect(wrapper.find('.tasks-view').exists()).toBe(true)
      expect(wrapper.find('.app-container').exists()).toBe(true)
      expect(wrapper.find('.page-header').exists()).toBe(true)
      expect(wrapper.find('.text-center').exists()).toBe(true)
    })

    it('should have correct heading structure', () => {
      const wrapper = createWrapper(TasksView)

      const heading = wrapper.find('h1')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBe('Task Manager')
      expect(heading.classes()).toContain('text-5xl')
      expect(heading.classes()).toContain('font-bold')
    })
  })
})
