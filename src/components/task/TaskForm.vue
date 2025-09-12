<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import type { Task, TaskInput } from '@/types/task'
import { TASK_CATEGORIES } from '@/constants/categories'

interface Props {
  editingTask?: Task | null
  loading?: boolean
}

interface Emits {
  (e: 'submit', task: TaskInput): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  editingTask: null,
  loading: false,
})

const emit = defineEmits<Emits>()

const form = ref<TaskInput>({
  title: '',
  category: '',
})

const isEditing = computed(() => !!props.editingTask)

const resetForm = () => {
  form.value = {
    title: '',
    category: '',
  }
}

watch(
  () => props.editingTask,
  (newTask) => {
    if (!newTask) {
      resetForm()
      return
    }
    form.value = {
      title: newTask.title,
      category: newTask.category,
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  if (!form.value.title.trim() || !form.value.category.trim()) return
  emit('submit', { ...form.value })
  if (!isEditing.value) {
    resetForm()
  }
}

const cancelEdit = () => {
  emit('cancel')
  resetForm()
}
</script>

<template>
  <Card class="task-form card-elevated">
    <template #title>
      <div class="flex align-items-center gap-2 text-gray-800">
        <i :class="isEditing ? 'pi pi-pencil' : 'pi pi-plus'" class="text-primary"></i>
        {{ isEditing ? 'Edit Task' : 'Add New Task' }}
      </div>
    </template>

    <template #content>
      <form @submit.prevent="handleSubmit" class="flex flex-column gap-3">
        <div class="field">
          <label for="title" class="block text-gray-800 font-medium mb-2">Title</label>
          <InputText
            id="title"
            v-model="form.title"
            placeholder="Enter task title"
            class="w-full focus-ring"
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label for="category" class="block text-gray-800 font-medium mb-2">Category</label>
          <Select
            id="category"
            v-model="form.category"
            :options="TASK_CATEGORIES"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a category"
            class="w-full focus-ring"
            :disabled="loading"
          />
        </div>

        <div class="flex gap-2 justify-content-end">
          <Button
            v-if="isEditing"
            type="button"
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            @click="cancelEdit"
            :disabled="loading"
          />

          <Button
            type="submit"
            :label="isEditing ? 'Update Task' : 'Add Task'"
            :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'"
            :loading="loading"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<style scoped>
.task-form {
  margin-bottom: var(--space-8);
}

.field {
  margin-bottom: var(--space-4);
}
</style>
