import { describe, it, expect } from 'vitest'
import { createWrapper } from '@/test-utils/setup'
import TaskForm from '../TaskForm.vue'

describe('TaskForm Debug', () => {
  it('should render something', () => {
    const wrapper = createWrapper(TaskForm)

    console.log('HTML Output:', wrapper.html())
    console.log('Find .p-card:', wrapper.find('.p-card').exists())
    console.log('Find input:', wrapper.find('input').exists())
    console.log('Find select:', wrapper.find('select').exists())
    console.log('Find button:', wrapper.find('button').exists())

    expect(wrapper.find('.p-card').exists()).toBe(true)
  })
})
