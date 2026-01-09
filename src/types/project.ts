export type ProjectStatus = 'Planned' | 'In Progress' | 'Completed' | 'On Hold';
export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  id?: string;
  name: string;
  description: string;
  assignedUserId: string;
  status: TaskStatus;
}

export interface Reminder {
  id?: string;
  date: string;
  description: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  assigneeIds: string[];
  managerId: string;
  status: ProjectStatus;
  priority: Priority;
  tasks?: Task[];
  reminders: Reminder[];
}