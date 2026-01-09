import { Project } from "@/types/project"
import { User } from "@/types/user"

export const projectsData: Project[] = [
  {
    id: '1',
    name: 'Project 1',
    description: 'Sample description',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    assigneeIds: ['1', '2', '3', '4'],
    managerId: '1',
    status: 'In Progress',
    priority: 'High',
    tasks: [
      {
        id: '1',
        name: 'Create UI design',
        description: 'Create UI design for app',
        assignedUserId: '1',
        status: 'Done',
      },
      {
        id: '2',
        name: 'Convert design to code',
        description: 'Create home page for the app',
        assignedUserId: '2',
        status: 'In Progress',
      },
      {
        id: '3',
        name: 'Api Interation',
        description: 'Add API integration',
        assignedUserId: '3',
        status: 'Todo',
      }
    ],
    reminders: [
      {
        id: '1',
        date: '2026-01-15',
        description: 'Design review meeting',
      },
      {
        id: '2',
        date: '2026-02-01',
        description: 'Development milestone checkpoint',
      },
    ],
  }
];

export const userList: User[] = [
  {
    id: '1',
    name: 'Sarath Paul',
    email: 'sarath@mail.com',
    initials: 'SP',
  },
  {
    id: '2',
    name: 'John Michael',
    email: 'john@mail.com',
    initials: 'JM',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@mail.com',
    initials: 'ER',
  },
];
