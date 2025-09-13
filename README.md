# RocketBot Challenge - Frontend

This is the frontend application for the RocketBot Challenge built with Vue 3, Pinia, and Vite.

## Features

- **Vue 3** with Composition API and `<script setup>` syntax
- **Pinia** for state management
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Axios** for HTTP requests
- **Responsive design** with modern CSS
- **Component-based architecture**

## Task Management Features

- List all tasks from the API
- Add new tasks with title and category
- Edit existing tasks
- Delete tasks with confirmation
- Real-time statistics (total tasks, categories, etc.)
- Error handling and loading states
- Responsive design for mobile and desktop

## Project Structure

```bash
src/
├── api/
│   └── request/
│       └── client.ts
├── components/
│   └── task/
│       ├── TaskForm.vue
│       ├── TaskList.vue
│       └── TaskStats.vue
├── composables/
│   └── useTask.ts
├── router/
│   └── index.ts
├── services/
│   ├── task/
│   │   ├── taskService.ts
│   │   └── index.ts
│   └── index.ts
├── stores/
│   └── taskStore.ts
├── types/
│   └── task.ts
├── views/
│   └── TasksView.vue
├── App.vue
└── main.ts
```

## Requirements

- Node.js 20+ or 22+
- Yarn package manager
- Backend API running on <http://localhost:8000>
- Docker and Docker Compose (for development)

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd rocketbot-challenge-fe
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Set up environment variables**:

   ```bash
   cp env.example .env
   ```

   Edit `.env` if needed:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

## Development

### Option 1: Local Development (Traditional)

#### Start the development server

```bash
yarn dev
```

The application will be available at <http://localhost:5173>

### Option 2: Docker Development

```bash
docker-compose build

docker-compose up
```

**Access the application**: <http://localhost:5173>

**Stop the application**:

```bash
docker-compose down
```

### Build for production

```bash
yarn build
```

### Preview production build

```bash
yarn preview
```

### Run tests

```bash
yarn test:unit
```

### Lint code

```bash
yarn lint
```

### Format code

```bash
yarn format
```

## How Pinia is Used for State Management

This project demonstrates how Pinia is used to manage global state in a Vue 3 application:

### 1. **Store Structure**

```typescript
// stores/taskStore.ts
export const useTaskStore = (taskService: ITaskService) =>
  defineStore('task', () => {
    // Reactive state
    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Computed getters
    const tasksCount = computed(() => tasks.value.length)

    // Actions for state mutations
    const fetchTasks = async () => {
      /* ... */
    }
    const createTask = async (taskInput: TaskInput) => {
      /* ... */
    }

    return { tasks, loading, error, tasksCount, fetchTasks, createTask }
  })
```

### 2. **Composable Pattern**

```typescript
// composables/useTask.ts
export const useTask = () => {
  const taskStore = useTaskStore(services.task)
  return taskStore()
}
```

### 3. **Component Usage**

```vue
<!-- In any component -->
<script setup lang="ts">
import { useTask } from '@/composables/useTask'

const { tasks, loading, fetchTasks, createTask } = useTask()
</script>
```

### 4. **State Sharing Between Components**

The Pinia store automatically shares state across all components that use it:

- **TaskForm.vue**: Uses `createTask` and `updateTask` actions
- **TaskList.vue**: Displays `tasks` state and uses `deleteTask` action
- **TaskStats.vue**: Computes statistics from `tasks` state
- **TasksView.vue**: Coordinates between all components using the shared store

### 5. **Key Benefits Demonstrated**

- **Centralized State**: All task data is stored in one place
- **Reactive Updates**: Changes automatically propagate to all components
- **Type Safety**: Full TypeScript support with interfaces
- **Composability**: Easy to use in any component via composables
- **Separation of Concerns**: Business logic separated from UI components
- **Error Handling**: Centralized error state management
- **Loading States**: Shared loading indicators across the app

## API Integration

The frontend communicates with the backend API through:

1. **HTTP Client**: Axios configured with base URL and interceptors
2. **Service Layer**: `TaskService` class with typed methods
3. **Store Integration**: Pinia store calls service methods
4. **Component Usage**: Components use store actions and state

## Environment Configuration

Create a `.env` file with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `yarn dev`        | Start development server     |
| `yarn build`      | Build for production         |
| `yarn preview`    | Preview production build     |
| `yarn test:unit`  | Run unit tests               |
| `yarn lint`       | Lint and fix code            |
| `yarn format`     | Format code with Prettier    |
| `yarn type-check` | Run TypeScript type checking |

## Docker Commands

```bash
docker-compose build

docker-compose up

docker-compose down

docker-compose logs -f
```

## Technologies Used

- **Vue 3.5+**: Progressive JavaScript framework
- **Pinia 3.0+**: State management for Vue
- **TypeScript 5.8+**: Type-safe JavaScript
- **Vite 7.0+**: Fast build tool and dev server
- **Vue Router 4.5+**: Official router for Vue.js
- **Axios 1.12+**: HTTP client for API requests
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vitest**: Testing framework

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Docker Setup

Simple Docker configuration for development:

- **Base Image**: Node.js 20 Alpine
- **Port**: 5173
- **Hot Reload**: Enabled with volume mounts
- **Environment**: VITE_API_BASE_URL=<http://localhost:8000>

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
