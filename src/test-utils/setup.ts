import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { vi } from 'vitest'
import type { Task, TaskInput } from '@/types/task'

const mockPrimeVueComposables = {
  useToast: () => ({
    add: vi.fn(),
  }),
  useConfirm: () => ({
    require: vi.fn(),
  }),
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

export const mockTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Test Task',
  category: 'work',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const mockTaskInput = (overrides: Partial<TaskInput> = {}): TaskInput => ({
  title: 'Test Task',
  category: 'work',
  ...overrides,
})

export const mockTasks = (count: number = 3): Task[] =>
  Array.from({ length: count }, (_, index) =>
    mockTask({
      id: index + 1,
      title: `Task ${index + 1}`,
      category: ['work', 'personal', 'study'][index % 3],
    }),
  )

export const mockTaskService = {
  getAllTasks: vi.fn(),
  createTask: vi.fn(),
  getTaskById: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}

export const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}

export const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0))

export const createWrapper = (component: unknown, options: Record<string, unknown> = {}) => {
  const pinia = createPinia()

  return mount(component, {
    global: {
      plugins: [pinia],
      stubs: {
        'router-link': true,
        'router-view': true,
      },
      provide: {
        ...mockPrimeVueComposables,
      },
      directives: {
        tooltip: {
          beforeMount() {},
          updated() {},
          unmounted() {},
        },
      },
    },
    ...options,
  })
}
