import { describe, it, expect } from 'vitest'
import { createWrapper, mockTask } from '@/test-utils/setup'
import TaskList from '../TaskList.vue'

describe('TaskList Debug', () => {
  it('should render buttons', () => {
    const tasks = [mockTask({ id: 1, title: 'Test Task' })]
    const wrapper = createWrapper(TaskList, {
      props: { tasks },
    })
    
    console.log('HTML Output:', wrapper.html())
    console.log('Find buttons:', wrapper.findAll('button').length)
    console.log('Find dataview:', wrapper.find('.p-dataview').exists())
    
    expect(wrapper.vm).toBeTruthy()
  })
})
