import { vi, beforeEach } from 'vitest'

vi.mock('primevue/card', () => ({
  default: {
    name: 'Card',
    template:
      '<div class="p-card"><template v-if="$slots.title"><div class="p-card-title"><slot name="title" /></div></template><div class="p-card-content"><slot name="content" /></div></div>',
  },
}))
vi.mock('primevue/inputtext', () => ({
  default: {
    name: 'InputText',
    template:
      '<input v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue'],
    emits: ['update:modelValue'],
  },
}))
vi.mock('primevue/select', () => ({
  default: {
    name: 'Select',
    template: `
      <select
        v-bind="$attrs"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option value="">{{ placeholder || 'Select an option' }}</option>
        <option
          v-for="option in options"
          :key="option[optionValue] || option.value"
          :value="option[optionValue] || option.value"
        >
          {{ option[optionLabel] || option.label }}
        </option>
      </select>
    `,
    props: ['modelValue', 'options', 'optionLabel', 'optionValue', 'placeholder'],
    emits: ['update:modelValue'],
  },
}))
vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template:
      '<button v-bind="$attrs" :disabled="disabled || loading" :type="type || \'button\'" :class="[icon, severity]">{{ label }}<slot /></button>',
    props: ['disabled', 'loading', 'type', 'label', 'icon', 'severity', 'size'],
  },
}))
vi.mock('primevue/dataview', () => ({
  default: {
    name: 'DataView',
    template:
      '<div class="p-dataview"><slot name="grid" :items="value" v-if="value && value.length > 0" /></div>',
    props: ['value', 'layout', 'paginator', 'rows'],
  },
}))
vi.mock('primevue/tag', () => ({
  default: {
    name: 'Tag',
    template: '<span class="p-tag"><slot /></span>',
    props: ['value'],
  },
}))
vi.mock('primevue/message', () => ({
  default: {
    name: 'Message',
    template: '<div class="p-message"><slot /></div>',
    props: ['severity'],
  },
}))
vi.mock('primevue/progressspinner', () => ({
  default: {
    name: 'ProgressSpinner',
    template: '<div class="p-progress-spinner">Loading...</div>',
  },
}))
vi.mock('primevue/confirmdialog', () => ({
  default: {
    name: 'ConfirmDialog',
    template: '<div class="p-confirm-dialog" />',
  },
}))
vi.mock('primevue/toast', () => ({
  default: {
    name: 'Toast',
    template: '<div class="p-toast" />',
  },
}))
vi.mock('primevue/chip', () => ({
  default: {
    name: 'Chip',
    template: '<div class="p-chip">{{ label }}<slot /></div>',
    props: ['label'],
  },
}))
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn(),
  }),
}))
vi.mock('primevue/useconfirm', () => ({
  useConfirm: () => ({
    require: vi.fn(),
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()

  document.body.innerHTML = ''

  localStorage.clear()

  sessionStorage.clear()
})

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

Object.defineProperty(window, 'getComputedStyle', {
  value: vi.fn(() => ({
    getPropertyValue: vi.fn(),
  })),
})

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
})

global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
}
