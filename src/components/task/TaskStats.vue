<script setup lang="ts">
import Card from 'primevue/card'
import Chip from 'primevue/chip'
import type { Task } from '@/types/task'
import { computed } from 'vue'
import { getCategoryLabel } from '@/constants/categories'
import { useTaskCategories } from '@/composables/useTaskCategories'

interface Props {
  tasks: Task[]
}

const props = defineProps<Props>()

const { groupTasksByCategory } = useTaskCategories()

const tasksCount = computed(() => props.tasks.length)

const tasksByCategory = computed(() => {
  return groupTasksByCategory(props.tasks)
})

const categoriesCount = computed(() => Object.keys(tasksByCategory.value).length)

const mostActiveCategory = computed(() => {
  if (categoriesCount.value === 0) return 0
  return Math.max(...Object.values(tasksByCategory.value).map((tasks) => tasks.length))
})

const getCategoryColorClass = (index: number) => {
  const colorNumber = (index % 10) + 1
  return `bg-category-${colorNumber}`
}
</script>

<template>
  <Card class="section-spacing">
    <template #title>
      <div class="flex align-items-center gap-2 text-gray-800">
        <i class="pi pi-chart-bar text-primary"></i>
        Task Statistics
      </div>
    </template>
    <template #content>
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-4">
          <Card class="stat-card card-elevated">
            <template #content>
              <div class="text-center">
                <div class="text-4xl font-bold text-primary mb-3">{{ tasksCount }}</div>
                <div class="text-gray-600 font-medium">Total Tasks</div>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-6 lg:col-4">
          <Card class="stat-card card-elevated">
            <template #content>
              <div class="text-center">
                <div class="text-4xl font-bold text-warning mb-3">{{ categoriesCount }}</div>
                <div class="text-gray-600 font-medium">Categories</div>
              </div>
            </template>
          </Card>
        </div>
        <div class="col-12 md:col-6 lg:col-4" v-if="categoriesCount > 0">
          <Card class="stat-card card-elevated">
            <template #content>
              <div class="text-center">
                <div class="text-4xl font-bold text-success mb-3">
                  {{ mostActiveCategory }}
                </div>
                <div class="text-gray-600 font-medium">Most Active</div>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12" v-if="categoriesCount > 0">
          <Card class="card-elevated">
            <template #title>
              <div class="flex align-items-center gap-2 text-gray-800">
                <i class="pi pi-tags text-primary"></i>
                Distribution by Categories
              </div>
            </template>
            <template #content>
              <div class="flex flex-wrap gap-3">
                <Chip
                  v-for="(tasks, category, index) in tasksByCategory"
                  :key="category"
                  :label="`${getCategoryLabel(category)} (${tasks.length})`"
                  :class="getCategoryColorClass(index)"
                  class="text-white font-medium shadow-sm"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.stat-card {
  margin-bottom: var(--space-4);
  transition: var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-1px);
}
</style>
