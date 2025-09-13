import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from '../taskStore'
import { mockTaskService, mockTasks, mockTask, mockTaskInput } from '@/test-utils/setup'

const mockCreateTaskMutation = {
  isPending: { value: false },
  error: { value: null },
  mutateAsync: vi.fn(),
  reset: vi.fn(),
}

const mockUpdateTaskMutation = {
  isPending: { value: false },
  error: { value: null },
  mutateAsync: vi.fn(),
  reset: vi.fn(),
}

const mockDeleteTaskMutation = {
  isPending: { value: false },
  error: { value: null },
  mutateAsync: vi.fn(),
  reset: vi.fn(),
}

const mockGetAllTasksQuery = {
  data: { value: [] },
  isLoading: { value: false },
  error: { value: null },
  refetch: vi.fn(),
  reset: vi.fn(),
}

vi.mock('@/queries/task', () => ({
  useTaskQueries: vi.fn(() => ({
    getAllTasksQuery: mockGetAllTasksQuery,
    createTaskMutation: mockCreateTaskMutation,
    updateTaskMutation: mockUpdateTaskMutation,
    deleteTaskMutation: mockDeleteTaskMutation,
  })),
}))

describe('TaskStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    mockTaskService.getAllTasks.mockResolvedValue(mockTasks(3))
    mockTaskService.createTask.mockResolvedValue(mockTask({ id: 4 }))
    mockTaskService.updateTask.mockResolvedValue(mockTask({ id: 1, title: 'Updated Task' }))
    mockTaskService.deleteTask.mockResolvedValue({ message: 'Task deleted' })

    mockCreateTaskMutation.mutateAsync.mockResolvedValue(mockTask({ id: 4, title: 'New Task' }))
    mockUpdateTaskMutation.mutateAsync.mockResolvedValue(mockTask({ id: 1, title: 'Updated Task' }))
    mockDeleteTaskMutation.mutateAsync.mockResolvedValue({ message: 'Task deleted' })
  })

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      const store = useTaskStore(mockTaskService)()

      expect(store.tasks).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.tasksCount).toBe(0)
      expect(store.tasksByCategory).toEqual({})
    })
  })

  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      const store = useTaskStore(mockTaskService)()
      const mockTasksData = mockTasks(3)

      mockTaskService.getAllTasks.mockResolvedValue(mockTasksData)

      await store.fetchTasks()

      expect(mockTaskService.getAllTasks).toHaveBeenCalledOnce()
      expect(store.tasks).toEqual(mockTasksData)
      expect(store.loading).toBe(false)
    })

    it('should handle fetch tasks error', async () => {
      const store = useTaskStore(mockTaskService)()
      const error = new Error('Failed to fetch tasks')

      mockTaskService.getAllTasks.mockRejectedValue(error)

      await expect(store.fetchTasks()).rejects.toThrow('Failed to fetch tasks')
      expect(store.loading).toBe(false)
    })

    it('should set loading state during fetch', async () => {
      const store = useTaskStore(mockTaskService)()

      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockTaskService.getAllTasks.mockReturnValue(promise)

      const fetchPromise = store.fetchTasks()

      expect(store.loading).toBe(true)

      resolvePromise!(mockTasks(2))
      await fetchPromise

      expect(store.loading).toBe(false)
    })
  })

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const store = useTaskStore(mockTaskService)()
      const newTask = mockTaskInput({ title: 'New Task' })
      const createdTask = mockTask({ id: 4, title: 'New Task' })

      mockTaskService.createTask.mockResolvedValue(createdTask)
      mockTaskService.getAllTasks.mockResolvedValue([...mockTasks(3), createdTask])

      const result = await store.createTask(newTask)

      expect(mockCreateTaskMutation.mutateAsync).toHaveBeenCalledWith(newTask)
      expect(result).toEqual(createdTask)
      expect(mockTaskService.getAllTasks).toHaveBeenCalled() // fetchTasks is called
    })

    it('should handle create task error', async () => {
      const store = useTaskStore(mockTaskService)()
      const newTask = mockTaskInput()
      const error = new Error('Failed to create task')

      mockCreateTaskMutation.mutateAsync.mockRejectedValue(error)

      await expect(store.createTask(newTask)).rejects.toThrow('Failed to create task')
    })
  })

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const store = useTaskStore(mockTaskService)()
      const taskId = 1
      const updateData = mockTaskInput({ title: 'Updated Task' })
      const updatedTask = mockTask({ id: taskId, title: 'Updated Task' })

      mockTaskService.updateTask.mockResolvedValue(updatedTask)
      mockTaskService.getAllTasks.mockResolvedValue([updatedTask, ...mockTasks(2).slice(1)])

      const result = await store.updateTask(taskId, updateData)

      expect(mockUpdateTaskMutation.mutateAsync).toHaveBeenCalledWith({
        id: taskId,
        taskInput: updateData,
      })
      expect(result).toEqual(updatedTask)
      expect(mockTaskService.getAllTasks).toHaveBeenCalled() // fetchTasks is called
    })

    it('should handle update task error', async () => {
      const store = useTaskStore(mockTaskService)()
      const taskId = 1
      const updateData = mockTaskInput()
      const error = new Error('Failed to update task')

      mockUpdateTaskMutation.mutateAsync.mockRejectedValue(error)

      await expect(store.updateTask(taskId, updateData)).rejects.toThrow('Failed to update task')
    })
  })

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const store = useTaskStore(mockTaskService)()
      const taskId = 1
      const remainingTasks = mockTasks(3).filter((task) => task.id !== taskId)

      mockTaskService.deleteTask.mockResolvedValue({ message: 'Task deleted' })
      mockTaskService.getAllTasks.mockResolvedValue(remainingTasks)

      await store.deleteTask(taskId)

      expect(mockDeleteTaskMutation.mutateAsync).toHaveBeenCalledWith(taskId)
      expect(mockTaskService.getAllTasks).toHaveBeenCalled() // fetchTasks is called
    })

    it('should handle delete task error', async () => {
      const store = useTaskStore(mockTaskService)()
      const taskId = 1
      const error = new Error('Failed to delete task')

      mockDeleteTaskMutation.mutateAsync.mockRejectedValue(error)

      await expect(store.deleteTask(taskId)).rejects.toThrow('Failed to delete task')
    })
  })

  describe('getTaskById', () => {
    it('should return task by id', () => {
      const store = useTaskStore(mockTaskService)()
      const tasks = mockTasks(3)
      store.tasks = tasks

      const task = store.getTaskById(2)

      expect(task).toEqual(tasks[1])
    })

    it('should return undefined for non-existent task', () => {
      const store = useTaskStore(mockTaskService)()
      store.tasks = mockTasks(3)

      const task = store.getTaskById(999)

      expect(task).toBeUndefined()
    })
  })

  describe('clearError', () => {
    it('should clear all mutation errors', () => {
      const store = useTaskStore(mockTaskService)()

      store.clearError()

      expect(mockGetAllTasksQuery.refetch).toHaveBeenCalled()
      expect(mockCreateTaskMutation.reset).toHaveBeenCalled()
      expect(mockUpdateTaskMutation.reset).toHaveBeenCalled()
      expect(mockDeleteTaskMutation.reset).toHaveBeenCalled()
    })
  })

  describe('Computed Properties', () => {
    it('should calculate tasks count correctly', () => {
      const store = useTaskStore(mockTaskService)()
      const tasks = mockTasks(5)
      store.tasks = tasks

      expect(store.tasksCount).toBe(5)
    })

    it('should group tasks by category correctly', () => {
      const store = useTaskStore(mockTaskService)()
      const tasks = [
        mockTask({ id: 1, category: 'work' }),
        mockTask({ id: 2, category: 'personal' }),
        mockTask({ id: 3, category: 'work' }),
        mockTask({ id: 4, category: 'study' }),
      ]
      store.tasks = tasks

      const grouped = store.tasksByCategory

      expect(grouped.work).toHaveLength(2)
      expect(grouped.personal).toHaveLength(1)
      expect(grouped.study).toHaveLength(1)
      expect(grouped.work[0].id).toBe(1)
      expect(grouped.work[1].id).toBe(3)
    })

    it('should handle empty tasks in grouping', () => {
      const store = useTaskStore(mockTaskService)()
      store.tasks = []

      expect(store.tasksByCategory).toEqual({})
    })
  })
})
