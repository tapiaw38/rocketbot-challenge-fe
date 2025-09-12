<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useTask } from '@/composables/useTask'
import TaskForm from '@/components/task/TaskForm.vue'
import TaskList from '@/components/task/TaskList.vue'
import TaskStats from '@/components/task/TaskStats.vue'
import Toast from 'primevue/toast'
import type { Task, TaskInput } from '@/types/task'

const {
  tasks,
  isGetAllTasksPending,
  isCreateTaskPending,
  isUpdateTaskPending,
  isDeleteTaskPending,
  getAllTasksError,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  clearError,
} = useTask()

const loading = computed(
  () =>
    isGetAllTasksPending.value ||
    isCreateTaskPending.value ||
    isUpdateTaskPending.value ||
    isDeleteTaskPending.value,
)

const editingTask = ref<Task | null>(null)
const toast = useToast()

onMounted(async () => {
  await fetchTasks()
})

const handleTaskSubmit = async (taskInput: TaskInput) => {
  try {
    if (editingTask.value) {
      await updateTask(editingTask.value.id, taskInput)
      editingTask.value = null
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Task updated successfully',
        life: 3000,
      })
      return
    }
    await createTask(taskInput)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Task created successfully',
      life: 3000,
    })
  } catch (err) {
    console.error('Error handling task submit:', err)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save task',
      life: 3000,
    })
  }
}

const handleTaskEdit = (task: Task) => {
  editingTask.value = task
}

const handleTaskCancel = () => {
  editingTask.value = null
}

const handleTaskDelete = async (id: number) => {
  try {
    await deleteTask(id)
    if (editingTask.value?.id === id) {
      editingTask.value = null
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Task deleted successfully',
      life: 3000,
    })
  } catch (err) {
    console.error('Error deleting task:', err)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete task',
      life: 3000,
    })
  }
}
</script>

<template>
  <div class="tasks-view">
    <Toast />

    <div class="app-container">
      <div class="page-header text-center">
        <h1 class="text-5xl font-bold text-white mb-4">Task Manager</h1>
        <p class="text-xl text-white leading-relaxed">
          Manage your tasks with ease using Vue 3, Pinia, and TanStack Query
        </p>
      </div>

      <div class="grid">
        <div class="col-12">
          <TaskStats :tasks="tasks" />
        </div>

        <div class="col-12">
          <TaskForm
            :editing-task="editingTask"
            :loading="loading"
            @submit="handleTaskSubmit"
            @cancel="handleTaskCancel"
          />
        </div>

        <div class="col-12">
          <TaskList
            :tasks="tasks"
            :loading="loading"
            :error="getAllTasksError?.message || null"
            @edit="handleTaskEdit"
            @delete="handleTaskDelete"
            @clear-error="clearError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tasks-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-secondary-700) 100%);
  padding: var(--space-8) 0;
}
</style>
