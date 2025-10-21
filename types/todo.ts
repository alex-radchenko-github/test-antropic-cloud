export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type ViewMode = 'classic' | 'workflowy' | 'kanban' | 'calendar';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // For hierarchical structure
  order: number;
  collapsed?: boolean; // For workflowy view
  tags?: string[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  parentId?: string;
  tags?: string[];
}
