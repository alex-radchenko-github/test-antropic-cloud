'use client';

import { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import useTodoStore from '@/store/todoStore';
import { Task, TaskStatus } from '@/types/todo';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  color: string;
}

function KanbanColumn({ title, status, tasks, color }: KanbanColumnProps) {
  const { updateTask, deleteTask } = useTodoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

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

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTask(taskId, { status });
    }
  };

  return (
    <div className="flex-1 min-w-[300px]">
      <div className={`${color} text-white rounded-t-lg px-4 py-3`}>
        <h2 className="font-semibold text-lg flex items-center justify-between">
          {title}
          <span className="bg-white/30 px-2 py-1 rounded-full text-sm">
            {tasks.length}
          </span>
        </h2>
      </div>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="bg-gray-50 rounded-b-lg p-4 min-h-[500px] space-y-3"
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-move border-l-4 border-transparent hover:border-blue-500"
          >
            {editingId === task.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(task.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="flex-1 py-1 text-green-600 hover:bg-green-50 rounded font-medium"
                  >
                    <Check size={16} className="inline" /> Сохранить
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-1 text-red-600 hover:bg-red-50 rounded font-medium"
                  >
                    <X size={16} className="inline" /> Отмена
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.priority}
                  </span>
                  {task.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <button
                    onClick={() => startEdit(task)}
                    className="flex-1 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium"
                  >
                    <Edit2 size={14} className="inline mr-1" />
                    Изменить
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-1 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                  >
                    <Trash2 size={14} className="inline mr-1" />
                    Удалить
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Перетащите задачу сюда</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanView() {
  const { tasks } = useTodoStore();

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <KanbanColumn
        title="К выполнению"
        status="todo"
        tasks={todoTasks}
        color="bg-gray-600"
      />
      <KanbanColumn
        title="В процессе"
        status="in-progress"
        tasks={inProgressTasks}
        color="bg-blue-600"
      />
      <KanbanColumn
        title="Выполнено"
        status="done"
        tasks={doneTasks}
        color="bg-green-600"
      />
    </div>
  );
}
