import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, CreateTaskInput, TaskStatus, ViewMode } from '@/types/todo';

interface TodoState {
  tasks: Task[];
  viewMode: ViewMode;
  searchQuery: string;
  selectedTags: string[];

  // Actions
  addTask: (input: CreateTaskInput) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  reorderTasks: (taskId: string, newOrder: number) => void;
  toggleCollapsed: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  clearCompleted: () => void;
}

const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      tasks: [],
      viewMode: 'classic',
      searchQuery: '',
      selectedTags: [],

      addTask: (input) =>
        set((state) => {
          const newTask: Task = {
            id: crypto.randomUUID(),
            title: input.title,
            description: input.description,
            status: input.status || 'todo',
            priority: input.priority || 'medium',
            dueDate: input.dueDate,
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: input.parentId,
            order: state.tasks.length,
            tags: input.tags || [],
          };
          return { tasks: [...state.tasks, newTask] };
        }),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => {
          // Also delete all children
          const deleteRecursive = (taskId: string): string[] => {
            const children = state.tasks.filter(t => t.parentId === taskId);
            return [
              taskId,
              ...children.flatMap(child => deleteRecursive(child.id))
            ];
          };

          const idsToDelete = deleteRecursive(id);
          return {
            tasks: state.tasks.filter((task) => !idsToDelete.includes(task.id)),
          };
        }),

      toggleTaskStatus: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === 'done' ? 'todo' : 'done',
                  updatedAt: new Date(),
                }
              : task
          ),
        })),

      reorderTasks: (taskId, newOrder) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, order: newOrder } : task
          ),
        })),

      toggleCollapsed: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, collapsed: !task.collapsed } : task
          ),
        })),

      setViewMode: (mode) => set({ viewMode: mode }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),

      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== 'done'),
        })),
    }),
    {
      name: 'todo-storage',
    }
  )
);

export default useTodoStore;
