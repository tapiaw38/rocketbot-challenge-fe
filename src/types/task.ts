export interface Task {
  id: number
  title: string
  category: string
  created_at?: string
  updated_at?: string
}

export interface TaskInput {
  title: string
  category: string
}

export interface TaskOutput {
  id: number
  title: string
  category: string
  created_at?: string
  updated_at?: string
}

export interface DeleteTaskResponse {
  message: string
}

export type CreateTaskResponse = TaskOutput

export type UpdateTaskResponse = TaskOutput

export type GetAllTasksResponse = TaskOutput[]
