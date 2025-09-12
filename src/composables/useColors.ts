import { computed } from 'vue'

export const useCategoryColors = () => {
  const categoryColorMap = new Map<string, number>()
  let colorIndex = 0

  const getCategoryColorIndex = (category: string): number => {
    if (!categoryColorMap.has(category)) {
      categoryColorMap.set(category, (colorIndex % 10) + 1)
      colorIndex++
    }
    return categoryColorMap.get(category)!
  }

  const getCategoryBackgroundClass = (category: string): string => {
    const index = getCategoryColorIndex(category)
    return `bg-category-${index}`
  }

  const getCategoryTextClass = (category: string): string => {
    const index = getCategoryColorIndex(category)
    return `text-category-${index}`
  }

  const getCategoryColorVariable = (category: string): string => {
    const index = getCategoryColorIndex(category)
    return `var(--color-category-${index})`
  }

  const getCategoryStyles = (category: string) => {
    return {
      backgroundClass: getCategoryBackgroundClass(category),
      textClass: getCategoryTextClass(category),
      colorVariable: getCategoryColorVariable(category),
    }
  }

  const getCategorySeverity = (category: string): string => {
    const severityMap: Record<string, string> = {
      work: 'info',
      personal: 'success',
      shopping: 'warning',
      health: 'danger',
      education: 'secondary',
      travel: 'info',
      finance: 'warning',
      entertainment: 'success',
      family: 'secondary',
      other: 'contrast',
    }

    return severityMap[category.toLowerCase()] || 'info'
  }

  const resetColorMapping = () => {
    categoryColorMap.clear()
    colorIndex = 0
  }

  return {
    getCategoryColorIndex,
    getCategoryBackgroundClass,
    getCategoryTextClass,
    getCategoryColorVariable,
    getCategoryStyles,
    getCategorySeverity,
    resetColorMapping,
  }
}

export function useSemanticColors() {
  const colors = computed(() => ({
    primary: {
      50: 'var(--color-primary-50)',
      100: 'var(--color-primary-100)',
      500: 'var(--color-primary-500)',
      600: 'var(--color-primary-600)',
      class: 'text-primary',
      bgClass: 'bg-primary',
    },
    secondary: {
      50: 'var(--color-secondary-50)',
      100: 'var(--color-secondary-100)',
      500: 'var(--color-secondary-500)',
      600: 'var(--color-secondary-600)',
      class: 'text-secondary',
      bgClass: 'bg-secondary',
    },
    success: {
      50: 'var(--color-success-50)',
      100: 'var(--color-success-100)',
      500: 'var(--color-success-500)',
      600: 'var(--color-success-600)',
      class: 'text-success',
      bgClass: 'bg-success',
    },
    error: {
      50: 'var(--color-error-50)',
      100: 'var(--color-error-100)',
      500: 'var(--color-error-500)',
      600: 'var(--color-error-600)',
      class: 'text-error',
      bgClass: 'bg-error',
    },
    warning: {
      50: 'var(--color-warning-50)',
      100: 'var(--color-warning-100)',
      500: 'var(--color-warning-500)',
      600: 'var(--color-warning-600)',
      class: 'text-warning',
      bgClass: 'bg-warning',
    },
    info: {
      50: 'var(--color-info-50)',
      100: 'var(--color-info-100)',
      500: 'var(--color-info-500)',
      600: 'var(--color-info-600)',
      class: 'text-info',
      bgClass: 'bg-info',
    },
  }))

  const getStatusColor = (status: 'success' | 'error' | 'warning' | 'info') => {
    return colors.value[status]
  }

  return {
    colors,
    getStatusColor,
  }
}
