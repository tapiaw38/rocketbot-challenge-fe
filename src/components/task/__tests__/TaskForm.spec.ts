/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createWrapper } from '@/test-utils/setup'
import TaskForm from '../TaskForm.vue'
import { mockTask } from '@/test-utils/setup'

vi.mock('@/constants/categories', () => ({
  TASK_CATEGORIES: [
    { label: 'Work', value: 'work' },
    { label: 'Personal', value: 'personal' },
    { label: 'Study', value: 'study' },
  ],
}))

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Props', () => {
    it('should render with default props', () => {
      const wrapper = createWrapper(TaskForm)

      expect(wrapper.find('.p-card').exists()).toBe(true)
      expect(wrapper.find('input[id="title"]').exists()).toBe(true)
      expect(wrapper.find('select[id="category"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('should render with editing task prop', () => {
      const editingTask = mockTask({ title: 'Edit Task', category: 'work' })
      const wrapper = createWrapper(TaskForm, {
        props: { editingTask },
      })

      const titleInput = wrapper.find('input[id="title"]')
      const categorySelect = wrapper.find('select[id="category"]')

      expect((titleInput.element as HTMLInputElement).value).toBe('Edit Task')
      expect((categorySelect.element as HTMLSelectElement).value).toBe('work')
    })

    it('should show loading state', () => {
      const wrapper = createWrapper(TaskForm, {
        props: { loading: true },
      })

      const submitButton = wrapper.find('button[type="submit"]')
      const titleInput = wrapper.find('input[id="title"]')
      const categorySelect = wrapper.find('select[id="category"]')

      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(titleInput.attributes('disabled')).toBeDefined()
      expect(categorySelect.attributes('disabled')).toBeDefined()
    })
  })

  describe('Form Initialization', () => {
    it('should initialize with empty form when no editing task', () => {
      const wrapper = createWrapper(TaskForm)

      const titleInput = wrapper.find('input[id="title"]')
      const categorySelect = wrapper.find('select[id="category"]')

      expect((titleInput.element as HTMLInputElement).value).toBe('')
      expect((categorySelect.element as HTMLSelectElement).value).toBe('')
    })

    it('should populate form when editing task is provided', () => {
      const editingTask = mockTask({ title: 'Test Task', category: 'personal' })
      const wrapper = createWrapper(TaskForm, {
        props: { editingTask },
      })

      const titleInput = wrapper.find('input[id="title"]')
      const categorySelect = wrapper.find('select[id="category"]')

      expect((titleInput.element as HTMLInputElement).value).toBe('Test Task')
      expect((categorySelect.element as HTMLSelectElement).value).toBe('personal')
    })

    it('should reset form when editing task changes to null', async () => {
      const editingTask = mockTask({ title: 'Test Task', category: 'personal' })
      const wrapper = createWrapper(TaskForm, {
        props: { editingTask },
      })

      expect((wrapper.find('input[id="title"]').element as HTMLInputElement).value).toBe(
        'Test Task',
      )

      await wrapper.setProps({ editingTask: null } as any)

      expect((wrapper.find('input[id="title"]').element as HTMLInputElement).value).toBe('')
      expect((wrapper.find('select[id="category"]').element as HTMLSelectElement).value).toBe('')
    })
  })

  describe('Form Submission', () => {
    it('should emit submit event with form data', async () => {
      const wrapper = createWrapper(TaskForm)

      const titleInput = wrapper.find('input[id="title"]')
      const categorySelect = wrapper.find('select[id="category"]')
      const form = wrapper.find('form')

      await titleInput.setValue('New Task')
      await categorySelect.setValue('work')

      await form.trigger('submit')

      const emittedEvents = wrapper.emitted('submit')
      expect(emittedEvents).toHaveLength(1)
      expect(emittedEvents![0][0]).toEqual({
        title: 'New Task',
        category: 'work',
      })
    })

    it('should not emit submit event with empty form', async () => {
      const wrapper = createWrapper(TaskForm)

      const form = wrapper.find('form')
      await form.trigger('submit')

      expect(wrapper.emitted('submit')).toBeUndefined()
    })

    it('should not emit submit event with empty title', async () => {
      const wrapper = createWrapper(TaskForm)

      const categorySelect = wrapper.find('select[id="category"]')
      const form = wrapper.find('form')

      await categorySelect.setValue('work')
      await form.trigger('submit')

      expect(wrapper.emitted('submit')).toBeUndefined()
    })

    it('should not emit submit event with empty category', async () => {
      const wrapper = createWrapper(TaskForm)

      const titleInput = wrapper.find('input[id="title"]')
      const form = wrapper.find('form')

      await titleInput.setValue('New Task')
      await form.trigger('submit')

      expect(wrapper.emitted('submit')).toBeUndefined()
    })

    it('should reset form after successful submission when not editing', async () => {
      const wrapper = createWrapper(TaskForm)

      const titleInput = wrapper.find('input[id="title"]')
      const categorySelect = wrapper.find('select[id="category"]')
      const form = wrapper.find('form')

      await titleInput.setValue('New Task')
      await categorySelect.setValue('work')

      await form.trigger('submit')

      expect((titleInput.element as HTMLInputElement).value).toBe('')
      expect((categorySelect.element as HTMLSelectElement).value).toBe('')
    })

    it('should not reset form after submission when editing', async () => {
      const editingTask = mockTask({ title: 'Original Task', category: 'work' })
      const wrapper = createWrapper(TaskForm, {
        props: { editingTask },
      })

      const titleInput = wrapper.find('input[id="title"]')
      const form = wrapper.find('form')

      await titleInput.setValue('Updated Task')

      await form.trigger('submit')

      expect((titleInput.element as HTMLInputElement).value).toBe('Updated Task')
    })
  })

  describe('Cancel Functionality', () => {
    it('should show cancel button when editing', () => {
      const editingTask = mockTask()
      const wrapper = createWrapper(TaskForm, {
        props: { editingTask },
      })

      const cancelButton = wrapper.find('button[type="button"]')
      expect(cancelButton.exists()).toBe(true)
      expect(cancelButton.text()).toContain('Cancel')
    })

    it('should not show cancel button when not editing', () => {
      const wrapper = createWrapper(TaskForm)

      const cancelButton = wrapper.find('button[type="button"]')
      expect(cancelButton.exists()).toBe(false)
    })

    it('should emit cancel event when cancel button is clicked', async () => {
      const editingTask = mockTask()
      const wrapper = createWrapper(TaskForm, {
        props: { editingTask },
      })

      const cancelButton = wrapper.find('button[type="button"]')
      await cancelButton.trigger('click')

      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('should reset form when cancel button is clicked', async () => {
      const editingTask = mockTask({ title: 'Original Task', category: 'work' })
      const wrapper = createWrapper(TaskForm, {
        props: { editingTask },
      })

      const titleInput = wrapper.find('input[id="title"]')
      const cancelButton = wrapper.find('button[type="button"]')

      await titleInput.setValue('Modified Task')

      await cancelButton.trigger('click')

      expect((titleInput.element as HTMLInputElement).value).toBe('')
    })
  })

  describe('UI State', () => {
    it('should show correct title when not editing', () => {
      const wrapper = createWrapper(TaskForm)

      const titleElement = wrapper.find('.p-card').text()
      expect(titleElement).toContain('Add New Task')
    })

    it('should show correct title when editing', () => {
      const editingTask = mockTask()
      const wrapper = createWrapper(TaskForm, {
        props: { editingTask },
      })

      const titleElement = wrapper.find('.p-card').text()
      expect(titleElement).toContain('Edit Task')
    })

    it('should show correct submit button text when not editing', () => {
      const wrapper = createWrapper(TaskForm)

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toContain('Add Task')
    })

    it('should show correct submit button text when editing', () => {
      const editingTask = mockTask()
      const wrapper = createWrapper(TaskForm, {
        props: { editingTask },
      })

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.text()).toContain('Update Task')
    })

    it('should disable form elements when loading', () => {
      const editingTask = mockTask()
      const wrapper = createWrapper(TaskForm, {
        props: { loading: true, editingTask },
      })

      const titleInput = wrapper.find('input[id="title"]')
      const categorySelect = wrapper.find('select[id="category"]')
      const submitButton = wrapper.find('button[type="submit"]')
      const cancelButton = wrapper.find('button[type="button"]')

      expect(titleInput.attributes('disabled')).toBeDefined()
      expect(categorySelect.attributes('disabled')).toBeDefined()
      expect(submitButton.attributes('disabled')).toBeDefined()
      expect(cancelButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Form Validation', () => {
    it('should trim whitespace from title before submission', async () => {
      const wrapper = createWrapper(TaskForm)

      const titleInput = wrapper.find('input[id="title"]')
      const categorySelect = wrapper.find('select[id="category"]')
      const form = wrapper.find('form')

      await titleInput.setValue('  Test Task  ')
      await categorySelect.setValue('work')

      await form.trigger('submit')

      const emittedEvents = wrapper.emitted('submit')
      expect(emittedEvents![0][0]).toEqual({
        title: 'Test Task',
        category: 'work',
      })
    })

    it('should not submit if title is only whitespace', async () => {
      const wrapper = createWrapper(TaskForm)

      const titleInput = wrapper.find('input[id="title"]')
      const categorySelect = wrapper.find('select[id="category"]')
      const form = wrapper.find('form')

      await titleInput.setValue('   ')
      await categorySelect.setValue('work')

      await form.trigger('submit')

      expect(wrapper.emitted('submit')).toBeUndefined()
    })
  })
})
