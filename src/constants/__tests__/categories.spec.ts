import { describe, it, expect } from 'vitest'
import { TASK_CATEGORIES, CATEGORY_LABELS, getCategoryLabel } from '../categories'

describe('categories', () => {
  describe('TASK_CATEGORIES', () => {
    it('should contain all expected categories', () => {
      const expectedCategories = [
        'work',
        'personal',
        'study',
        'home',
        'health',
        'shopping',
        'travel',
        'finance',
        'exercise',
        'entertainment',
        'others',
      ]

      expectedCategories.forEach((category) => {
        const found = TASK_CATEGORIES.find((cat) => cat.value === category)
        expect(found).toBeDefined()
        expect(found?.label).toBeDefined()
        expect(typeof found?.label).toBe('string')
      })
    })

    it('should have correct structure for each category', () => {
      TASK_CATEGORIES.forEach((category) => {
        expect(category).toHaveProperty('label')
        expect(category).toHaveProperty('value')
        expect(typeof category.label).toBe('string')
        expect(typeof category.value).toBe('string')
        expect(category.label.length).toBeGreaterThan(0)
        expect(category.value.length).toBeGreaterThan(0)
      })
    })

    it('should have unique values', () => {
      const values = TASK_CATEGORIES.map((cat) => cat.value)
      const uniqueValues = new Set(values)

      expect(uniqueValues.size).toBe(values.length)
    })

    it('should have unique labels', () => {
      const labels = TASK_CATEGORIES.map((cat) => cat.label)
      const uniqueLabels = new Set(labels)

      expect(uniqueLabels.size).toBe(labels.length)
    })
  })

  describe('CATEGORY_LABELS', () => {
    it('should map all category values to labels', () => {
      TASK_CATEGORIES.forEach((category) => {
        expect(CATEGORY_LABELS[category.value]).toBe(category.label)
      })
    })

    it('should have same number of entries as TASK_CATEGORIES', () => {
      expect(Object.keys(CATEGORY_LABELS).length).toBe(TASK_CATEGORIES.length)
    })

    it('should contain all category values as keys', () => {
      TASK_CATEGORIES.forEach((category) => {
        expect(CATEGORY_LABELS).toHaveProperty(category.value)
      })
    })
  })

  describe('getCategoryLabel', () => {
    it('should return correct label for known categories', () => {
      TASK_CATEGORIES.forEach((category) => {
        expect(getCategoryLabel(category.value)).toBe(category.label)
      })
    })

    it('should handle unknown categories gracefully', () => {
      expect(getCategoryLabel('unknown')).toBe('Unknown')
      expect(getCategoryLabel('')).toBe('')
      expect(getCategoryLabel('test')).toBe('Test')
    })

    it('should capitalize single character categories', () => {
      expect(getCategoryLabel('a')).toBe('A')
      expect(getCategoryLabel('z')).toBe('Z')
    })

    it('should handle mixed case categories', () => {
      expect(getCategoryLabel('WORK')).toBe('WORK') // Only capitalizes first letter
      expect(getCategoryLabel('PeRsOnAl')).toBe('PeRsOnAl') // Only capitalizes first letter
      expect(getCategoryLabel('sTuDy')).toBe('STuDy') // Only capitalizes first letter
    })

    it('should handle categories with numbers', () => {
      expect(getCategoryLabel('work2')).toBe('Work2')
      expect(getCategoryLabel('3test')).toBe('3test')
    })

    it('should handle special characters', () => {
      expect(getCategoryLabel('work-task')).toBe('Work-task')
      expect(getCategoryLabel('work_task')).toBe('Work_task')
      expect(getCategoryLabel('work.task')).toBe('Work.task')
    })
  })
})
