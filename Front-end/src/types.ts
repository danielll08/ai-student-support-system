// src/types.ts
export type Page = 'dashboard' | 'tasks' | 'kanban' | 'schedule' | 'pomodoro' | 'groups' | 'profile';
export type PriorityType = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: PriorityType;
  status: TaskStatus;
  deadline: string;
  subject: string;
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'class' | 'exam' | 'deadline' | 'study' | 'meeting';
  startTime: string;
  endTime: string;
  date: string;
  location?: string;
  description: string;
  reminder: number;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'link';
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  members: Array<{ id: string; userId: string; name: string; role: 'admin' | 'member'; joinedAt: string }>;
  messages: GroupMessage[];
  tasks: string[];
  createdAt: string;
  lastActivity: string;
  isPrivate: boolean;
}

export interface Notification {
  id: string;
  type: 'deadline' | 'class' | 'group' | 'ai' | 'achievement' | 'task';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'link';
}

export interface PomodoroSession {
  id: string;
  date: string;
  duration: number;
  subject: string;
  completed: boolean;
}

export interface DailyStats {
  date: string;
  hoursStudied: number;
  tasksCompleted: number;
  focusSessions: number;
}

export interface SubjectWorkload {
  subject: string;
  hours: number;
  color: string;
  taskCount: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  university: string;
  major: string;
  studentId: string;
  avatar?: string | undefined;
  bio: string;
  phone: string;
  dateOfBirth: string;
  joinedAt: string;
  streak: number;
  totalFocusHours: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  tasks: Task[];
  events: CalendarEvent[];
  groups: StudyGroup[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  pomodoroSessions: PomodoroSession[];
}

export type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_POMODORO_SESSION'; payload: PomodoroSession }
  | { type: 'JOIN_GROUP'; payload: { groupId: string; userId: string } }
  | { type: 'LEAVE_GROUP'; payload: { groupId: string; userId: string } }
  | { type: 'ADD_GROUP'; payload: StudyGroup }
  | { type: 'ADD_GROUP_MESSAGE'; payload: { groupId: string; message: GroupMessage } };
