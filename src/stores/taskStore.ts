import { computed } from 'vue'
import { defineStore } from 'pinia'
import type { ITaskService } from '@/services/task/taskService'
import type { TaskInput } from '@/types/task'
import { useTaskQueries } from '@/queries/task'
import { useTaskCategories } from '@/composables/useTaskCategories'

export const useTaskStore = (taskService: ITaskService) =>
  defineStore('task', () => {
    const {
      getAllTasksQuery,
      getTaskByIdQuery,
      createTaskMutation,
      updateTaskMutation,
      deleteTaskMutation,
    } = useTaskQueries(taskService)

    const { groupTasksByCategory } = useTaskCategories()

    const createTask = async (taskInput: TaskInput) => {
      return await createTaskMutation.mutateAsync(taskInput)
    }

    const updateTask = async (id: number, taskInput: TaskInput) => {
      return await updateTaskMutation.mutateAsync({ id, taskInput })
    }

    const deleteTask = async (id: number) => {
      return await deleteTaskMutation.mutateAsync(id)
    }

    const getTaskById = (id: number) => {
      return getTaskByIdQuery(id)
    }

    const fetchTasks = async () => {
      return await getAllTasksQuery.refetch()
    }

    const tasks = computed(() => getAllTasksQuery.data.value || [])
    const tasksCount = computed(() => tasks.value.length)
    const tasksByCategory = computed(() => {
      return groupTasksByCategory(tasks.value)
    })

    const clearError = () => {
      createTaskMutation.reset()
      updateTaskMutation.reset()
      deleteTaskMutation.reset()
    }

    return {
      // State
      tasks,
      tasksCount,
      tasksByCategory,

      // Loading states
      isGetAllTasksPending: getAllTasksQuery.isPending,
      isGetAllTasksSuccess: getAllTasksQuery.isSuccess,
      isGetAllTasksError: getAllTasksQuery.isError,
      getAllTasksError: getAllTasksQuery.error,

      isCreateTaskPending: createTaskMutation.isPending,
      isCreateTaskSuccess: createTaskMutation.isSuccess,
      isCreateTaskError: createTaskMutation.isError,
      createTaskError: createTaskMutation.error,

      isUpdateTaskPending: updateTaskMutation.isPending,
      isUpdateTaskSuccess: updateTaskMutation.isSuccess,
      isUpdateTaskError: updateTaskMutation.isError,
      updateTaskError: updateTaskMutation.error,

      isDeleteTaskPending: deleteTaskMutation.isPending,
      isDeleteTaskSuccess: deleteTaskMutation.isSuccess,
      isDeleteTaskError: deleteTaskMutation.isError,
      deleteTaskError: deleteTaskMutation.error,

      // Actions
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      getTaskById,
      clearError,

      // Raw queries for advanced usage
      queries: {
        getAllTasksQuery,
        getTaskByIdQuery,
        createTaskMutation,
        updateTaskMutation,
        deleteTaskMutation,
      },
    }
  })
