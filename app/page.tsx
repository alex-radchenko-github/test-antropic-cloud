'use client';

import { List, Network, LayoutGrid, CalendarDays, Trash2 } from 'lucide-react';
import useTodoStore from '@/store/todoStore';
import { ViewMode } from '@/types/todo';
import AddTaskForm from '@/components/AddTaskForm';
import ClassicView from '@/components/ClassicView';
import WorkflowyView from '@/components/WorkflowyView';
import KanbanView from '@/components/KanbanView';
import CalendarView from '@/components/CalendarView';
import ThemeToggle from '@/components/ThemeToggle';
import type { LucideIcon } from 'lucide-react';

export default function Home() {
  const { viewMode, setViewMode, tasks, clearCompleted } = useTodoStore();

  const views: { mode: ViewMode; icon: LucideIcon; label: string; description: string }[] = [
    {
      mode: 'classic',
      icon: List,
      label: 'Классический',
      description: 'Простой список задач',
    },
    {
      mode: 'workflowy',
      icon: Network,
      label: 'Иерархия',
      description: 'Древовидная структура с подзадачами',
    },
    {
      mode: 'kanban',
      icon: LayoutGrid,
      label: 'Канбан',
      description: 'Доска с колонками',
    },
    {
      mode: 'calendar',
      icon: CalendarDays,
      label: 'Календарь',
      description: 'Задачи по датам',
    },
  ];

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const totalCount = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            📝 Todo Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Управляйте задачами так, как вам удобно
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 dark:text-gray-400">Всего задач</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="text-sm text-gray-600 dark:text-gray-400">В процессе</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{inProgressCount}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 dark:text-gray-400">Выполнено</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="text-sm text-gray-600 dark:text-gray-400">Прогресс</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <AddTaskForm />

        {/* View Switcher */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Режим просмотра</h2>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Очистить выполненные
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {views.map((view) => {
              const Icon = view.icon;
              const isActive = viewMode === view.mode;
              return (
                <button
                  key={view.mode}
                  onClick={() => setViewMode(view.mode)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className={`mx-auto mb-2 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    }`}
                    size={24}
                  />
                  <div
                    className={`font-semibold ${
                      isActive ? 'text-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {view.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {view.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Task Views */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {viewMode === 'classic' && <ClassicView />}
          {viewMode === 'workflowy' && <WorkflowyView />}
          {viewMode === 'kanban' && <KanbanView />}
          {viewMode === 'calendar' && <CalendarView />}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Сделано с использованием Next.js 15 + Zustand + TypeScript + Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
