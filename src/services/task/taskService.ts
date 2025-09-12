import type { AxiosInstance } from 'axios'
import type {
  TaskInput,
  TaskOutput,
  DeleteTaskResponse,
  CreateTaskResponse,
  UpdateTaskResponse,
  GetAllTasksResponse,
} from '@/types/task'

export interface ITaskService {
  getAllTasks(): Promise<GetAllTasksResponse>
  createTask(taskInput: TaskInput): Promise<CreateTaskResponse>
  getTaskById(id: number): Promise<TaskOutput>
  updateTask(id: number, taskInput: TaskInput): Promise<UpdateTaskResponse>
  deleteTask(id: number): Promise<DeleteTaskResponse>
}

export class TaskService implements ITaskService {
  constructor(private readonly api: AxiosInstance) {
    this.api = api
  }

  async getAllTasks(): Promise<GetAllTasksResponse> {
    const { data } = await this.api.get<GetAllTasksResponse>('/tasks/')
    return data
  }

  async createTask(taskInput: TaskInput): Promise<CreateTaskResponse> {
    const { data } = await this.api.post<CreateTaskResponse>('/tasks/', taskInput)
    return data
  }

  async getTaskById(id: number): Promise<TaskOutput> {
    const { data } = await this.api.get<TaskOutput>(`/tasks/${id}/`)
    return data
  }

  async updateTask(id: number, taskInput: TaskInput): Promise<UpdateTaskResponse> {
    const { data } = await this.api.put<UpdateTaskResponse>(`/tasks/${id}/`, taskInput)
    return data
  }

  async deleteTask(id: number): Promise<DeleteTaskResponse> {
    const { data } = await this.api.delete<DeleteTaskResponse>(`/tasks/${id}/`)
    return data
  }
}
