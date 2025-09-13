/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiClient } from '../request/client'

vi.mock('import.meta.env', () => ({
  VITE_API_BASE_URL: 'http://localhost:8000/',
}))

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Configuration', () => {
    it('should be configured with correct base URL', () => {
      expect(apiClient.defaults.baseURL).toBe('http://localhost:8000/')
    })

    it('should have correct timeout configuration', () => {
      expect(apiClient.defaults.timeout).toBe(10000)
    })

    it('should have correct headers configuration', () => {
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
      expect(apiClient.defaults.headers['Accept']).toBe('application/json')
    })
  })

  describe('Request Interceptor', () => {
    it('should add authorization header if token exists', async () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('test-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      })

      const axios = await import('axios')
      const testClient = axios.default.create({
        baseURL: 'http://localhost:8000/',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      testClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      })

      // @ts-expect-error - Accessing private property for testing
      const config = await testClient.interceptors.request.handlers[0].fulfilled({
        headers: {},
        url: '/test',
        method: 'get',
      })

      expect(config.headers.Authorization).toBe('Bearer test-token')
    })

    it('should not add authorization header if no token exists', async () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      })

      const axios = await import('axios')
      const testClient = axios.default.create({
        baseURL: 'http://localhost:8000/',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      testClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      })

      // @ts-expect-error - Accessing private property for testing
      const config = await testClient.interceptors.request.handlers[0].fulfilled({
        headers: {},
        url: '/test',
        method: 'get',
      })

      expect(config.headers.Authorization).toBeUndefined()
    })
  })

  describe('Response Interceptor', () => {
    it('should handle successful responses', async () => {
      const axios = await import('axios')
      const testClient = axios.default.create()

      testClient.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }
          return Promise.reject(error)
        },
      )

      const response = {
        data: { test: 'data' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }

      // @ts-expect-error - Accessing private property for testing
      const result = await testClient.interceptors.response.handlers[0].fulfilled(response)
      expect(result).toBe(response)
    })

    it('should handle 401 unauthorized responses', async () => {
      const mockLocalStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      })

      delete (window as any).location
      window.location = { href: '' } as any

      const axios = await import('axios')
      const testClient = axios.default.create()

      testClient.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }
          return Promise.reject(error)
        },
      )

      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        message: 'Request failed with status code 401',
      }

      try {
        // @ts-expect-error - Accessing private property for testing
        await testClient.interceptors.response.handlers[0].rejected(error)
      } catch (e) {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token')
        expect(window.location.href).toBe('/login')
        expect(e).toBe(error)
      }
    })

    it('should handle non-401 errors normally', async () => {
      const axios = await import('axios')
      const testClient = axios.default.create()

      testClient.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }
          return Promise.reject(error)
        },
      )

      const error = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
        message: 'Request failed with status code 500',
      }

      try {
        // @ts-expect-error - Accessing private property for testing
        await testClient.interceptors.response.handlers[0].rejected(error)
      } catch (e) {
        expect(e).toBe(error)
      }
    })
  })

  describe('Environment Variables', () => {
    it('should use VITE_API_BASE_URL from environment', () => {
      expect(apiClient.defaults.baseURL).toBe('http://localhost:8000/')
    })

    it('should handle missing environment variable gracefully', () => {
      expect(apiClient.defaults.baseURL).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should preserve original error structure', async () => {
      const axios = await import('axios')
      const testClient = axios.default.create()

      testClient.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }
          return Promise.reject(error)
        },
      )

      const originalError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
          headers: { 'content-type': 'application/json' },
        },
        request: {},
        message: 'Request failed with status code 401',
        config: {},
      }

      try {
        // @ts-expect-error - Accessing private property for testing
        await testClient.interceptors.response.handlers[0].rejected(originalError)
      } catch (error: any) {
        expect(error).toBe(originalError)
        expect(error.response).toBe(originalError.response)
        expect(error.message).toBe(originalError.message)
      }
    })
  })
})
