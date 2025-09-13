import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { useTaskQueries } from '../task'
import { mockTaskService } from '@/test-utils/setup'

const TestComponent = {
  template: '<div></div>',
  setup() {
    const queries = useTaskQueries(mockTaskService)
    console.log('Queries returned:', Object.keys(queries))
    console.log('getAllTasksQuery:', queries.getAllTasksQuery)
    return queries
  },
}

describe('useTaskQueries Debug', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    setActivePinia(createPinia())
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  it('should debug queries', () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const vm = wrapper.vm as any
    console.log('VM keys:', Object.keys(vm))
    console.log('getAllTasksQuery:', vm.getAllTasksQuery)

    expect(vm).toBeTruthy()
  })
})
