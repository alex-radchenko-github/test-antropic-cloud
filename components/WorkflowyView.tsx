'use client';

import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import useTodoStore from '@/store/todoStore';
import { Task } from '@/types/todo';

interface TreeNodeProps {
  task: Task;
  level: number;
}

function TreeNode({ task, level }: TreeNodeProps) {
  const { tasks, toggleTaskStatus, deleteTask, updateTask, addTask, toggleCollapsed } =
    useTodoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildText, setNewChildText] = useState('');

  const children = tasks
    .filter((t) => t.parentId === task.id)
    .sort((a, b) => a.order - b.order);
  const hasChildren = children.length > 0;

  const startEdit = () => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      updateTask(task.id, { title: editText.trim() });
    }
    setEditingId(null);
  };

  const addChild = () => {
    if (newChildText.trim()) {
      addTask({
        title: newChildText.trim(),
        parentId: task.id,
        priority: task.priority,
      });
      setNewChildText('');
      setShowAddChild(false);
      updateTask(task.id, { collapsed: false });
    }
  };

  return (
    <div className="group">
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
        style={{ marginLeft: `${level * 24}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => toggleCollapsed(task.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {task.collapsed ? (
              <ChevronRight size={16} className="text-gray-600" />
            ) : (
              <ChevronDown size={16} className="text-gray-600" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <input
          type="checkbox"
          checked={task.status === 'done'}
          onChange={() => toggleTaskStatus(task.id)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />

        {editingId === task.id ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') setEditingId(null);
              }}
              className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={saveEdit}
              className="p-1 text-green-600 hover:bg-green-100 rounded"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <span
              className={`flex-1 ${
                task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'
              }`}
            >
              {task.title}
            </span>
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <button
                onClick={() => setShowAddChild(true)}
                className="p-1 text-green-600 hover:bg-green-100 rounded"
                title="Добавить подзадачу"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={startEdit}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {showAddChild && (
        <div
          className="flex gap-2 py-2 px-3"
          style={{ marginLeft: `${(level + 1) * 24}px` }}
        >
          <div className="w-6" />
          <input
            type="text"
            value={newChildText}
            onChange={(e) => setNewChildText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addChild();
              if (e.key === 'Escape') {
                setShowAddChild(false);
                setNewChildText('');
              }
            }}
            placeholder="Новая подзадача..."
            className="flex-1 px-2 py-1 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            autoFocus
          />
          <button
            onClick={addChild}
            className="p-1 text-green-600 hover:bg-green-100 rounded"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => {
              setShowAddChild(false);
              setNewChildText('');
            }}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!task.collapsed &&
        children.map((child) => (
          <TreeNode key={child.id} task={child} level={level + 1} />
        ))}
    </div>
  );
}

export default function WorkflowyView() {
  const { tasks } = useTodoStore();
  const rootTasks = tasks
    .filter((t) => !t.parentId)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-1">
      {rootTasks.map((task) => (
        <TreeNode key={task.id} task={task} level={0} />
      ))}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Нет задач</p>
          <p className="text-sm mt-2">Добавьте свою первую задачу выше</p>
        </div>
      )}
    </div>
  );
}
