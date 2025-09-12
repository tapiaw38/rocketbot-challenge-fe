import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/taskStore'
import type { ITaskService } from '@/services/task/taskService'

export const useTask = () => {
  const services = inject<{ task: ITaskService }>('services')
  if (!services) throw new Error('Services not provided')

  const taskService = services.task

  const store = useTaskStore(taskService)
  const taskStore = store()

  const {
    tasks,
    tasksCount,
    tasksByCategory,
    isGetAllTasksPending,
    isGetAllTasksSuccess,
    isGetAllTasksError,
    getAllTasksError,
    isCreateTaskPending,
    isCreateTaskSuccess,
    isCreateTaskError,
    createTaskError,
    isUpdateTaskPending,
    isUpdateTaskSuccess,
    isUpdateTaskError,
    updateTaskError,
    isDeleteTaskPending,
    isDeleteTaskSuccess,
    isDeleteTaskError,
    deleteTaskError,
  } = storeToRefs(taskStore)

  return {
    // State
    tasks,
    tasksCount,
    tasksByCategory,

    // Loading states
    isGetAllTasksPending,
    isGetAllTasksSuccess,
    isGetAllTasksError,
    getAllTasksError,
    isCreateTaskPending,
    isCreateTaskSuccess,
    isCreateTaskError,
    createTaskError,
    isUpdateTaskPending,
    isUpdateTaskSuccess,
    isUpdateTaskError,
    updateTaskError,
    isDeleteTaskPending,
    isDeleteTaskSuccess,
    isDeleteTaskError,
    deleteTaskError,

    // Actions
    fetchTasks: taskStore.fetchTasks,
    createTask: taskStore.createTask,
    updateTask: taskStore.updateTask,
    deleteTask: taskStore.deleteTask,
    getTaskById: taskStore.getTaskById,
    clearError: taskStore.clearError,

    // Raw store for advanced usage
    store: taskStore,
  }
}
