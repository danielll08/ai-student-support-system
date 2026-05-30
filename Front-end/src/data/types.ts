export interface User { id: string; fullName: string; email: string; university: string; major: string; studentId: string; avatar?: string; bio: string; phone: string; dateOfBirth: string; joinedAt: string; streak: number; totalFocusHours: number; }
export interface Task { id: string; title: string; description: string; priority: string; status: string; deadline: string; subject: string; tags: string[]; progress: number; createdAt: string; updatedAt: string; userId: string; }
export interface CalendarEvent { id: string; title: string; type: string; startTime: string; endTime: string; date: string; location?: string; description: string; reminder: number; }
export interface StudyGroup { id: string; name: string; description: string; subject: string; members: any[]; messages: any[]; tasks: any[]; createdAt: string; lastActivity: string; isPrivate: boolean; }
export interface Notification { id: string; type: string; title: string; message: string; isRead: boolean; createdAt: string; priority: string; actionUrl?: string; }
export interface ChatMessage { id: string; role: string; content: string; timestamp: string; type: string; }
export interface PomodoroSession { id: string; date: string; duration: number; subject: string; completed: boolean; }
export interface DailyStats { date: string; hoursStudied: number; tasksCompleted: number; focusSessions: number; }
export interface SubjectWorkload { subject: string; hours: number; color: string; taskCount: number; }