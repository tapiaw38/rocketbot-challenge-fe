import type { Task } from '@/types/task'

export const groupTasksByCategory = (tasks: Task[]): Record<string, Task[]> => {
  return tasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = []
      }
      acc[task.category].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )
}

export const useTaskCategories = () => {
  return {
    groupTasksByCategory,
  }
}
