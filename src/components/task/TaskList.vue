<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import DataView from 'primevue/dataview'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmDialog from 'primevue/confirmdialog'
import type { Task } from '@/types/task'
import { computed } from 'vue'
import { getCategoryLabel } from '@/constants/categories'

interface Props {
  tasks: Task[]
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'edit', task: Task): void
  (e: 'delete', id: number): void
  (e: 'clear-error'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const confirm = useConfirm()

const tasksCount = computed(() => props.tasks.length)

const confirmDelete = (id: number) => {
  confirm.require({
    message: 'Are you sure you want to delete this task?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      emit('delete', id)
    },
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="task-list">
    <Card class="section-spacing">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center gap-2 text-gray-800">
            <i class="pi pi-list text-primary"></i>
            Tasks ({{ tasksCount }})
          </div>
          <div v-if="loading" class="flex align-items-center gap-2 text-primary">
            <ProgressSpinner style="width: 20px; height: 20px" />
            Loading...
          </div>
        </div>
      </template>

      <template #content>
        <Message v-if="error" severity="error" :closable="true" @close="emit('clear-error')">
          {{ error }}
        </Message>

        <div v-if="tasks.length === 0 && !loading" class="text-center py-6">
          <i class="pi pi-inbox text-4xl text-gray-400 mb-3"></i>
          <p class="text-gray-600">No tasks found. Create your first task!</p>
        </div>

        <DataView v-else :value="tasks" :layout="'grid'" :paginator="true" :rows="6">
          <template #grid="slotProps">
            <div class="grid grid-cols-12 gap-4">
              <div
                v-for="(task, index) in slotProps.items"
                :key="task.id || index"
                class="col-12 md:col-6 lg:col-4"
              >
                <Card class="task-card card-elevated hover-lift">
                  <template #title>
                    <div class="flex align-items-center justify-content-between">
                      <span class="text-lg font-semibold text-gray-800">{{ task.title }}</span>
                      <Tag :value="getCategoryLabel(task.category)" severity="success" />
                    </div>
                  </template>

                  <template #content>
                    <div class="flex flex-column gap-3">
                      <div class="flex align-items-center gap-2 text-sm text-gray-600">
                        <i class="pi pi-hashtag text-primary"></i>
                        <strong>ID:</strong> {{ task.id }}
                      </div>
                      <div
                        v-if="task.created_at"
                        class="flex align-items-center gap-2 text-sm text-gray-600"
                      >
                        <i class="pi pi-calendar text-primary"></i>
                        <strong>Created:</strong> {{ formatDate(task.created_at) }}
                      </div>
                      <div class="flex align-items-center gap-2 text-sm text-gray-600">
                        <i class="pi pi-tag text-primary"></i>
                        <strong>Category:</strong> {{ getCategoryLabel(task.category) }}
                      </div>
                    </div>
                  </template>

                  <template #footer>
                    <div class="flex gap-2 justify-content-end">
                      <Button
                        icon="pi pi-pencil"
                        size="small"
                        severity="info"
                        @click="$emit('edit', task)"
                        :disabled="loading"
                        v-tooltip="'Edit task'"
                      />
                      <Button
                        icon="pi pi-trash"
                        size="small"
                        severity="danger"
                        @click="confirmDelete(task.id)"
                        :disabled="loading"
                        v-tooltip="'Delete task'"
                      />
                    </div>
                  </template>
                </Card>
              </div>
            </div>
          </template>
        </DataView>
      </template>
    </Card>

    <ConfirmDialog />
  </div>
</template>

<style scoped>
.task-list {
  max-width: 1200px;
  margin: 0 auto;
}

.task-card {
  height: 100%;
  transition: var(--transition-base);
}

.task-card .p-card-title {
  color: var(--color-text-primary) !important;
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-2);
}

.task-card .p-card-content {
  color: var(--color-text-secondary) !important;
  padding: var(--space-4);
}

.task-card .p-card-footer {
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border);
}
</style>
