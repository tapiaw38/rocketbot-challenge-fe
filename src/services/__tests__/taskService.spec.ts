/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TaskService } from '../task/taskService'
import { mockTasks, mockTask, mockTaskInput, mockApiClient } from '@/test-utils/setup'

describe('TaskService', () => {
  let taskService: TaskService
  let mockAxios: any

  beforeEach(() => {
    mockAxios = mockApiClient as any
    taskService = new TaskService(mockAxios)
    vi.clearAllMocks()
  })

  describe('getAllTasks', () => {
    it('should fetch all tasks successfully', async () => {
      const mockTasksData = mockTasks(3)
      mockAxios.get.mockResolvedValue({ data: mockTasksData })

      const result = await taskService.getAllTasks()

      expect(mockAxios.get).toHaveBeenCalledWith('/tasks/')
      expect(result).toEqual(mockTasksData)
    })

    it('should handle API error when fetching tasks', async () => {
      const error = new Error('Network error')
      mockAxios.get.mockRejectedValue(error)

      await expect(taskService.getAllTasks()).rejects.toThrow('Network error')
      expect(mockAxios.get).toHaveBeenCalledWith('/tasks/')
    })

    it('should handle empty response', async () => {
      mockAxios.get.mockResolvedValue({ data: [] })

      const result = await taskService.getAllTasks()

      expect(result).toEqual([])
      expect(mockAxios.get).toHaveBeenCalledWith('/tasks/')
    })
  })

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskInput = mockTaskInput({ title: 'New Task' })
      const createdTask = mockTask({ id: 4, title: 'New Task' })
      mockAxios.post.mockResolvedValue({ data: createdTask })

      const result = await taskService.createTask(taskInput)

      expect(mockAxios.post).toHaveBeenCalledWith('/tasks/', taskInput)
      expect(result).toEqual(createdTask)
    })

    it('should handle API error when creating task', async () => {
      const taskInput = mockTaskInput()
      const error = new Error('Validation error')
      mockAxios.post.mockRejectedValue(error)

      await expect(taskService.createTask(taskInput)).rejects.toThrow('Validation error')
      expect(mockAxios.post).toHaveBeenCalledWith('/tasks/', taskInput)
    })

    it('should handle server validation errors', async () => {
      const taskInput = mockTaskInput({ title: '' }) // Invalid input
      const error = {
        response: {
          status: 400,
          data: { title: ['This field is required.'] },
        },
      }
      mockAxios.post.mockRejectedValue(error)

      await expect(taskService.createTask(taskInput)).rejects.toEqual(error)
    })
  })

  describe('getTaskById', () => {
    it('should fetch task by id successfully', async () => {
      const taskId = 1
      const task = mockTask({ id: taskId })
      mockAxios.get.mockResolvedValue({ data: task })

      const result = await taskService.getTaskById(taskId)

      expect(mockAxios.get).toHaveBeenCalledWith('/tasks/1/')
      expect(result).toEqual(task)
    })

    it('should handle API error when fetching task by id', async () => {
      const taskId = 999
      const error = new Error('Task not found')
      mockAxios.get.mockRejectedValue(error)

      await expect(taskService.getTaskById(taskId)).rejects.toThrow('Task not found')
      expect(mockAxios.get).toHaveBeenCalledWith('/tasks/999/')
    })

    it('should handle 404 error for non-existent task', async () => {
      const taskId = 999
      const error = {
        response: {
          status: 404,
          data: { message: 'Task not found' },
        },
      }
      mockAxios.get.mockRejectedValue(error)

      await expect(taskService.getTaskById(taskId)).rejects.toEqual(error)
    })
  })

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskId = 1
      const taskInput = mockTaskInput({ title: 'Updated Task' })
      const updatedTask = mockTask({ id: taskId, title: 'Updated Task' })
      mockAxios.put.mockResolvedValue({ data: updatedTask })

      const result = await taskService.updateTask(taskId, taskInput)

      expect(mockAxios.put).toHaveBeenCalledWith('/tasks/1/', taskInput)
      expect(result).toEqual(updatedTask)
    })

    it('should handle API error when updating task', async () => {
      const taskId = 1
      const taskInput = mockTaskInput()
      const error = new Error('Update failed')
      mockAxios.put.mockRejectedValue(error)

      await expect(taskService.updateTask(taskId, taskInput)).rejects.toThrow('Update failed')
      expect(mockAxios.put).toHaveBeenCalledWith('/tasks/1/', taskInput)
    })

    it('should handle validation errors during update', async () => {
      const taskId = 1
      const taskInput = mockTaskInput({ title: '' }) // Invalid input
      const error = {
        response: {
          status: 400,
          data: { title: ['This field cannot be blank.'] },
        },
      }
      mockAxios.put.mockRejectedValue(error)

      await expect(taskService.updateTask(taskId, taskInput)).rejects.toEqual(error)
    })

    it('should handle update of non-existent task', async () => {
      const taskId = 999
      const taskInput = mockTaskInput()
      const error = {
        response: {
          status: 404,
          data: { message: 'Task not found' },
        },
      }
      mockAxios.put.mockRejectedValue(error)

      await expect(taskService.updateTask(taskId, taskInput)).rejects.toEqual(error)
    })
  })

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const taskId = 1
      const deleteResponse = { message: 'Task deleted successfully' }
      mockAxios.delete.mockResolvedValue({ data: deleteResponse })

      const result = await taskService.deleteTask(taskId)

      expect(mockAxios.delete).toHaveBeenCalledWith('/tasks/1/')
      expect(result).toEqual(deleteResponse)
    })

    it('should handle API error when deleting task', async () => {
      const taskId = 1
      const error = new Error('Delete failed')
      mockAxios.delete.mockRejectedValue(error)

      await expect(taskService.deleteTask(taskId)).rejects.toThrow('Delete failed')
      expect(mockAxios.delete).toHaveBeenCalledWith('/tasks/1/')
    })

    it('should handle deletion of non-existent task', async () => {
      const taskId = 999
      const error = {
        response: {
          status: 404,
          data: { message: 'Task not found' },
        },
      }
      mockAxios.delete.mockRejectedValue(error)

      await expect(taskService.deleteTask(taskId)).rejects.toEqual(error)
    })

    it('should handle permission errors during deletion', async () => {
      const taskId = 1
      const error = {
        response: {
          status: 403,
          data: { message: 'Permission denied' },
        },
      }
      mockAxios.delete.mockRejectedValue(error)

      await expect(taskService.deleteTask(taskId)).rejects.toEqual(error)
    })
  })

  describe('API URL Construction', () => {
    it('should use correct URLs for all endpoints', async () => {
      const taskInput = mockTaskInput()
      const task = mockTask()

      mockAxios.get.mockResolvedValue({ data: [] })
      mockAxios.post.mockResolvedValue({ data: task })
      mockAxios.put.mockResolvedValue({ data: task })
      mockAxios.delete.mockResolvedValue({ data: { message: 'Deleted' } })

      await taskService.getAllTasks()
      await taskService.createTask(taskInput)
      await taskService.getTaskById(1)
      await taskService.updateTask(1, taskInput)
      await taskService.deleteTask(1)

      expect(mockAxios.get).toHaveBeenCalledWith('/tasks/')
      expect(mockAxios.post).toHaveBeenCalledWith('/tasks/', taskInput)
      expect(mockAxios.get).toHaveBeenCalledWith('/tasks/1/')
      expect(mockAxios.put).toHaveBeenCalledWith('/tasks/1/', taskInput)
      expect(mockAxios.delete).toHaveBeenCalledWith('/tasks/1/')
    })
  })

  describe('Error Handling', () => {
    it('should preserve axios error structure', async () => {
      const axiosError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
        request: {},
        message: 'Request failed with status code 500',
      }
      mockAxios.get.mockRejectedValue(axiosError)

      try {
        await taskService.getAllTasks()
      } catch (error) {
        expect(error).toEqual(axiosError)
      }
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error')
      mockAxios.get.mockRejectedValue(networkError)

      await expect(taskService.getAllTasks()).rejects.toThrow('Network Error')
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded')
      mockAxios.get.mockRejectedValue(timeoutError)

      await expect(taskService.getAllTasks()).rejects.toThrow('timeout of 5000ms exceeded')
    })
  })
})
