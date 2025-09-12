import { computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { services } from '@/services'

export const useTask = () => {
  const taskStore = useTaskStore(services.task)
  const store = taskStore()

  // Computed properties
  const tasks = computed(() => {
    const tanstackData = store.getAllTasksQuery.data
    return store.tasks.length > 0 ? store.tasks : Array.isArray(tanstackData) ? tanstackData : []
  })

  const loading = computed(
    () =>
      store.loading ||
      store.getAllTasksQuery.isLoading ||
      store.createTaskMutation.isPending ||
      store.updateTaskMutation.isPending ||
      store.deleteTaskMutation.isPending,
  )

  const error = computed(
    () =>
      store.error ||
      store.getAllTasksQuery.error?.message ||
      store.createTaskMutation.error?.message ||
      store.updateTaskMutation.error?.message ||
      store.deleteTaskMutation.error?.message ||
      null,
  )

  return {
    // Computed state
    tasks,
    loading,
    error,

    // Getters
    tasksCount: store.tasksCount,
    tasksByCategory: store.tasksByCategory,

    // TanStack Query states
    isGetAllTasksPending: store.getAllTasksQuery.isPending,
    isGetAllTasksSuccess: store.getAllTasksQuery.isSuccess,
    isGetAllTasksError: store.getAllTasksQuery.isError,
    getAllTasksError: store.getAllTasksQuery.error,
    isCreateTaskPending: store.createTaskMutation.isPending,
    isCreateTaskSuccess: store.createTaskMutation.isSuccess,
    isCreateTaskError: store.createTaskMutation.isError,
    createTaskError: store.createTaskMutation.error,
    isUpdateTaskPending: store.updateTaskMutation.isPending,
    isUpdateTaskSuccess: store.updateTaskMutation.isSuccess,
    isUpdateTaskError: store.updateTaskMutation.isError,
    updateTaskError: store.updateTaskMutation.error,
    isDeleteTaskPending: store.deleteTaskMutation.isPending,
    isDeleteTaskSuccess: store.deleteTaskMutation.isSuccess,
    isDeleteTaskError: store.deleteTaskMutation.isError,
    deleteTaskError: store.deleteTaskMutation.error,

    // Actions
    fetchTasks: store.fetchTasks,
    createTask: store.createTask,
    updateTask: store.updateTask,
    deleteTask: store.deleteTask,
    getTaskById: store.getTaskById,
    clearError: store.clearError,

    // Raw store for advanced usage
    store,
  }
}
