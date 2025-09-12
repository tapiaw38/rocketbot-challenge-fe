import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ITaskService } from '@/services/task/taskService'
import type {
  TaskInput,
  TaskOutput,
  CreateTaskResponse,
  UpdateTaskResponse,
  DeleteTaskResponse,
  GetAllTasksResponse,
} from '@/types/task'

export const useTaskQueries = (taskService: ITaskService) => {
  const queryClient = useQueryClient()

  const getAllTasksQuery = useQuery<GetAllTasksResponse, Error>({
    queryKey: ['tasks'],
    queryFn: taskService.getAllTasks.bind(taskService),
    staleTime: 1000 * 60 * 5,
  })

  const getTaskByIdQuery = (id: number) =>
    useQuery<TaskOutput, Error>({
      queryKey: ['tasks', id],
      queryFn: () => taskService.getTaskById(id),
      enabled: !!id,
    })

  const createTaskMutation = useMutation<CreateTaskResponse, Error, TaskInput>({
    mutationFn: taskService.createTask.bind(taskService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateTaskMutation = useMutation<
    UpdateTaskResponse,
    Error,
    { id: number; taskInput: TaskInput }
  >({
    mutationFn: ({ id, taskInput }) => taskService.updateTask(id, taskInput),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['tasks', variables.id], data)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteTaskMutation = useMutation<DeleteTaskResponse, Error, number>({
    mutationFn: taskService.deleteTask.bind(taskService),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['tasks', id] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    getAllTasksQuery,
    getTaskByIdQuery,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  }
}
