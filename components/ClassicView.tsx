'use client';

import { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import useTodoStore from '@/store/todoStore';
import { Task } from '@/types/todo';

export default function ClassicView() {
  const { tasks, toggleTaskStatus, deleteTask, updateTask } = useTodoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      updateTask(id, { title: editText.trim() });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
      default:
        return 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className={`border-l-4 ${getPriorityColor(
            task.priority
          )} ${getStatusColor(task.status)} rounded-lg p-4 shadow-sm transition-all hover:shadow-md`}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.status === 'done'}
              onChange={() => toggleTaskStatus(task.id)}
              className="mt-1 h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />

            <div className="flex-1 min-w-0">
              {editingId === task.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(task.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <h3
                    className={`text-lg font-medium ${
                      task.status === 'done'
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                      {task.priority}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                      {task.status}
                    </span>
                    {task.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {editingId !== task.id && (
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(task)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-lg">Нет задач</p>
          <p className="text-sm mt-2">Добавьте свою первую задачу выше</p>
        </div>
      )}
    </div>
  );
}
