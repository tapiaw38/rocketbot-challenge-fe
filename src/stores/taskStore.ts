import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ITaskService } from '@/services/task/taskService'
import type { Task, TaskInput } from '@/types/task'
import { useTaskQueries } from '@/queries/task'

export const useTaskStore = (taskService: ITaskService) =>
  defineStore('task', () => {
    const { getAllTasksQuery, createTaskMutation, updateTaskMutation, deleteTaskMutation } =
      useTaskQueries(taskService)

    const loading = ref(false)
    const tasks = ref<Task[]>([])
    const error = computed(
      () =>
        getAllTasksQuery.error.value?.message ||
        createTaskMutation.error.value?.message ||
        updateTaskMutation.error.value?.message ||
        deleteTaskMutation.error.value?.message ||
        null,
    )

    const tasksCount = computed(() => tasks.value.length)
    const tasksByCategory = computed(() => {
      const grouped = tasks.value.reduce(
        (acc, task) => {
          if (!acc[task.category]) {
            acc[task.category] = []
          }
          acc[task.category].push(task)
          return acc
        },
        {} as Record<string, Task[]>,
      )
      return grouped
    })

    const fetchTasks = async () => {
      loading.value = true
      try {
        const result = await taskService.getAllTasks()
        tasks.value = result

        await getAllTasksQuery.refetch()
      } catch (error) {
        console.error('fetchTasks error:', error)
        throw error
      } finally {
        loading.value = false
      }
    }

    const createTask = async (taskInput: TaskInput) => {
      const result = await createTaskMutation.mutateAsync(taskInput)
      await fetchTasks()
      return result
    }

    const updateTask = async (id: number, taskInput: TaskInput) => {
      const result = await updateTaskMutation.mutateAsync({ id, taskInput })
      await fetchTasks()
      return result
    }

    const deleteTask = async (id: number) => {
      await deleteTaskMutation.mutateAsync(id)
      await fetchTasks()
    }

    const getTaskById = (id: number) => {
      return tasks.value.find((task) => task.id === id)
    }

    const clearError = () => {
      createTaskMutation.reset()
      updateTaskMutation.reset()
      deleteTaskMutation.reset()
    }

    return {
      // State
      tasks,
      loading,
      error,

      // Getters
      tasksCount,
      tasksByCategory,

      // TanStack Query objects for composable
      getAllTasksQuery,
      createTaskMutation,
      updateTaskMutation,
      deleteTaskMutation,

      // Actions
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      getTaskById,
      clearError,
    }
  })
