export interface Category {
  label: string
  value: string
}

export const TASK_CATEGORIES: Category[] = [
  { label: 'Work', value: 'work' },
  { label: 'Personal', value: 'personal' },
  { label: 'Study', value: 'study' },
  { label: 'Home', value: 'home' },
  { label: 'Health', value: 'health' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Travel', value: 'travel' },
  { label: 'Finance', value: 'finance' },
  { label: 'Exercise', value: 'exercise' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Others', value: 'others' },
]

export const CATEGORY_LABELS: Record<string, string> = TASK_CATEGORIES.reduce(
  (acc, { value, label }) => {
    acc[value] = label
    return acc
  },
  {} as Record<string, string>,
)

export const getCategoryLabel = (category: string): string => {
  return CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1)
}
