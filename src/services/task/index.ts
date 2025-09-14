import { apiClient } from '@/api/request/client'
import { TaskService } from './taskService'

export const taskService = new TaskService(apiClient)
