import type { Task, CalendarEvent, StudyGroup, Notification, ChatMessage, PomodoroSession, User, DailyStats, SubjectWorkload } from '../types';

export const mockUser: User = {
  id: 'user-1',
  fullName: 'Nguyễn Văn An',
  email: 'an.nguyen@student.edu.vn',
  university: 'Đại học Công nghệ TP.HCM',
  major: 'Công nghệ thông tin',
  studentId: 'SV2021001',
  avatar: undefined,
  bio: 'Sinh viên năm 3, đam mê lập trình và AI. Đang học ReactJS và Machine Learning.',
  phone: '0901234567',
  dateOfBirth: '2003-05-15',
  joinedAt: '2024-09-01',
  streak: 7,
  totalFocusHours: 142,
};

export const SUBJECTS = [
  'Java', 'Python', 'React', 'Database', 'Math', 'Physics',
  'English', 'Data Structures', 'Algorithms', 'Machine Learning',
  'Web Development', 'Mobile Dev', 'DevOps', 'Software Engineering'
];

export const mockTasks: Task[] = [];

export const mockEvents: CalendarEvent[] = [
  {
    id: 'e1', title: 'Lập trình Java', type: 'class',
    startTime: '07:30', endTime: '09:30', date: '2024-12-09',
    location: 'Phòng A201', description: 'Buổi học Java OOP', reminder: 30
  },
  {
    id: 'e2', title: 'Kỳ thi Giải tích', type: 'exam',
    startTime: '08:00', endTime: '10:00', date: '2024-12-18',
    location: 'Hội trường B', description: 'Thi giữa kỳ môn Giải tích', reminder: 60
  },
  {
    id: 'e3', title: 'Deadline CSDL', type: 'deadline',
    startTime: '23:59', endTime: '23:59', date: '2024-12-12',
    description: 'Nộp báo cáo thiết kế CSDL', reminder: 120
  },
  {
    id: 'e4', title: 'Ôn tập nhóm Python', type: 'study',
    startTime: '14:00', endTime: '17:00', date: '2024-12-10',
    location: 'Thư viện tầng 3', description: 'Ôn tập thuật toán nhóm', reminder: 30
  },
  {
    id: 'e5', title: 'Lập trình Web', type: 'class',
    startTime: '13:00', endTime: '15:00', date: '2024-12-11',
    location: 'Lab máy tính 2', description: 'Học ReactJS hooks', reminder: 30
  },
  {
    id: 'e6', title: 'Deadline Project React', type: 'deadline',
    startTime: '23:59', endTime: '23:59', date: '2024-12-25',
    description: 'Nộp project cuối kỳ môn Web', reminder: 1440
  },
  {
    id: 'e7', title: 'Giải tích nâng cao', type: 'class',
    startTime: '10:00', endTime: '12:00', date: '2024-12-13',
    location: 'Phòng C304', description: 'Buổi học tích phân bội', reminder: 30
  },
];

export const mockGroups: StudyGroup[] = [
  {
    id: 'g1',
    name: 'Nhóm Lập trình Java',
    description: 'Cùng nhau học và giải quyết các bài tập Java OOP, Collections và Concurrency',
    subject: 'Java',
    members: [
      { id: 'gm1', userId: 'user-1', name: 'Nguyễn Văn An', role: 'admin', joinedAt: '2024-11-01' },
      { id: 'gm2', userId: 'user-2', name: 'Trần Thị Bảo', role: 'member', joinedAt: '2024-11-02' },
      { id: 'gm3', userId: 'user-3', name: 'Lê Minh Châu', role: 'member', joinedAt: '2024-11-03' },
      { id: 'gm4', userId: 'user-4', name: 'Phạm Đức Dũng', role: 'member', joinedAt: '2024-11-05' },
      { id: 'gm5', userId: 'user-5', name: 'Hoàng Thị Em', role: 'member', joinedAt: '2024-11-10' },
    ],
    messages: [
      { id: 'msg1', senderId: 'user-2', senderName: 'Trần Thị Bảo', content: 'Mọi người ơi, bài tập số 3 khó quá, ai giải được chưa?', timestamp: '2024-12-10T10:30:00', type: 'text' },
      { id: 'msg2', senderId: 'user-1', senderName: 'Nguyễn Văn An', content: 'Mình giải được rồi, mình sẽ share code lên nhé', timestamp: '2024-12-10T10:35:00', type: 'text' },
      { id: 'msg3', senderId: 'user-3', senderName: 'Lê Minh Châu', content: 'Cảm ơn An! Mình đang bị stuck ở phần inheritance', timestamp: '2024-12-10T10:40:00', type: 'text' },
      { id: 'msg4', senderId: 'user-4', senderName: 'Phạm Đức Dũng', content: 'Chiều nay tụi mình họp nhóm online nhé? 3pm Zoom', timestamp: '2024-12-10T11:00:00', type: 'text' },
    ],
    tasks: [],
    createdAt: '2024-11-01',
    lastActivity: '2024-12-10T11:00:00',
    isPrivate: false,
  },
  {
    id: 'g2',
    name: 'ML & AI Research Group',
    description: 'Nghiên cứu các thuật toán Machine Learning và ứng dụng AI trong thực tế',
    subject: 'Machine Learning',
    members: [
      { id: 'gm6', userId: 'user-1', name: 'Nguyễn Văn An', role: 'member', joinedAt: '2024-10-15' },
      { id: 'gm7', userId: 'user-6', name: 'Vũ Thị Fiona', role: 'admin', joinedAt: '2024-10-01' },
      { id: 'gm8', userId: 'user-7', name: 'Đặng Văn Giang', role: 'member', joinedAt: '2024-10-10' },
    ],
    messages: [
      { id: 'msg5', senderId: 'user-6', senderName: 'Vũ Thị Fiona', content: 'Paper tuần này: "Attention Is All You Need" - ai đọc chưa?', timestamp: '2024-12-09T09:00:00', type: 'text' },
      { id: 'msg6', senderId: 'user-1', senderName: 'Nguyễn Văn An', content: 'Mình đọc rồi! Transformer architecture hay lắm 🔥', timestamp: '2024-12-09T09:15:00', type: 'text' },
    ],
    tasks: [],
    createdAt: '2024-10-01',
    lastActivity: '2024-12-09T09:15:00',
    isPrivate: true,
  },
  {
    id: 'g3',
    name: 'Web Dev Frontend Club',
    description: 'Học ReactJS, NextJS và các công nghệ frontend hiện đại',
    subject: 'React',
    members: [
      { id: 'gm9', userId: 'user-1', name: 'Nguyễn Văn An', role: 'member', joinedAt: '2024-09-20' },
      { id: 'gm10', userId: 'user-8', name: 'Ngô Thị Hoa', role: 'admin', joinedAt: '2024-09-01' },
      { id: 'gm11', userId: 'user-9', name: 'Bùi Văn Inh', role: 'member', joinedAt: '2024-09-15' },
      { id: 'gm12', userId: 'user-10', name: 'Đinh Thị Khánh', role: 'member', joinedAt: '2024-09-22' },
      { id: 'gm13', userId: 'user-11', name: 'Lý Văn Long', role: 'member', joinedAt: '2024-10-01' },
      { id: 'gm14', userId: 'user-12', name: 'Mai Thị My', role: 'member', joinedAt: '2024-10-05' },
    ],
    messages: [
      { id: 'msg7', senderId: 'user-8', senderName: 'Ngô Thị Hoa', content: 'Workshop ReactJS hooks tối nay lúc 7pm nhé mọi người!', timestamp: '2024-12-08T14:00:00', type: 'text' },
      { id: 'msg8', senderId: 'user-9', senderName: 'Bùi Văn Inh', content: 'OK mình sẽ tham gia!', timestamp: '2024-12-08T14:30:00', type: 'text' },
    ],
    tasks: [],
    createdAt: '2024-09-01',
    lastActivity: '2024-12-08T14:30:00',
    isPrivate: false,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1', type: 'deadline', title: 'Deadline sắp đến!',
    message: 'Báo cáo CSDL hạn nộp trong 2 giờ nữa!', isRead: false,
    createdAt: '2024-12-12T22:00:00', priority: 'high', actionUrl: '/tasks'
  },
  {
    id: 'n2', type: 'class', title: 'Nhắc lịch học',
    message: 'Lớp Java OOP bắt đầu sau 30 phút - Phòng A201', isRead: false,
    createdAt: '2024-12-09T07:00:00', priority: 'medium', actionUrl: '/calendar'
  },
  {
    id: 'n3', type: 'group', title: 'Tin nhắn nhóm mới',
    message: 'Trần Thị Bảo đã nhắn tin trong Nhóm Lập trình Java', isRead: false,
    createdAt: '2024-12-10T10:30:00', priority: 'low', actionUrl: '/groups'
  },
  {
    id: 'n4', type: 'ai', title: 'Cảnh báo AI: Quá tải công việc',
    message: 'Bạn có 3 deadline trong 48 giờ tới. Hãy xem kế hoạch được đề xuất!', isRead: false,
    createdAt: '2024-12-10T08:00:00', priority: 'high', actionUrl: '/ai'
  },
  {
    id: 'n5', type: 'achievement', title: '🔥 Streak 7 ngày!',
    message: 'Tuyệt vời! Bạn đã học liên tục 7 ngày. Tiếp tục phát huy!', isRead: true,
    createdAt: '2024-12-10T00:00:00', priority: 'low'
  },
  {
    id: 'n6', type: 'task', title: 'Task hoàn thành',
    message: 'Bạn đã hoàn thành "Đọc tài liệu Data Structures" 🎉', isRead: true,
    createdAt: '2024-12-08T20:00:00', priority: 'low', actionUrl: '/tasks'
  },
  {
    id: 'n7', type: 'deadline', title: 'Nhắc nhở deadline',
    message: 'Thuyết trình KTPM còn 1 ngày nữa - Đã chuẩn bị chưa?', isRead: true,
    createdAt: '2024-12-13T09:00:00', priority: 'high', actionUrl: '/tasks'
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'cm1', role: 'assistant',
    content: 'Xin chào! Tôi là AI Assistant của bạn 🤖 Tôi có thể giúp bạn phân tích workload, lập kế hoạch học tập, ưu tiên công việc và nhiều hơn nữa. Hôm nay bạn cần hỗ trợ gì?',
    timestamp: '2024-12-10T08:00:00', type: 'text'
  },
];

export const mockPomodoroSessions: PomodoroSession[] = [
  { id: 'ps1', date: '2024-12-10', duration: 25, subject: 'Java', completed: true },
  { id: 'ps2', date: '2024-12-10', duration: 25, subject: 'Java', completed: true },
  { id: 'ps3', date: '2024-12-10', duration: 25, subject: 'React', completed: true },
  { id: 'ps4', date: '2024-12-09', duration: 25, subject: 'Math', completed: true },
  { id: 'ps5', date: '2024-12-09', duration: 25, subject: 'Math', completed: true },
  { id: 'ps6', date: '2024-12-09', duration: 25, subject: 'Database', completed: true },
  { id: 'ps7', date: '2024-12-08', duration: 25, subject: 'Python', completed: true },
  { id: 'ps8', date: '2024-12-08', duration: 25, subject: 'Algorithms', completed: true },
];

export const mockDailyStats: DailyStats[] = [
  { date: '2024-12-04', hoursStudied: 3.5, tasksCompleted: 2, focusSessions: 4 },
  { date: '2024-12-05', hoursStudied: 4.0, tasksCompleted: 3, focusSessions: 5 },
  { date: '2024-12-06', hoursStudied: 2.5, tasksCompleted: 1, focusSessions: 3 },
  { date: '2024-12-07', hoursStudied: 5.0, tasksCompleted: 4, focusSessions: 6 },
  { date: '2024-12-08', hoursStudied: 3.0, tasksCompleted: 2, focusSessions: 4 },
  { date: '2024-12-09', hoursStudied: 4.5, tasksCompleted: 3, focusSessions: 5 },
  { date: '2024-12-10', hoursStudied: 2.0, tasksCompleted: 1, focusSessions: 3 },
];

export const mockSubjectWorkload: SubjectWorkload[] = [
  { subject: 'Java', hours: 45, color: '#EF4444', taskCount: 3 },
  { subject: 'React', hours: 32, color: '#3B82F6', taskCount: 2 },
  { subject: 'Machine Learning', hours: 28, color: '#8B5CF6', taskCount: 2 },
  { subject: 'Database', hours: 20, color: '#F59E0B', taskCount: 1 },
  { subject: 'Math', hours: 18, color: '#10B981', taskCount: 1 },
  { subject: 'Algorithms', hours: 15, color: '#F97316', taskCount: 1 },
  { subject: 'English', hours: 10, color: '#06B6D4', taskCount: 1 },
];

export const AI_SUGGESTIONS = [
  '📊 Phân tích workload tuần này',
  '🎯 Tôi nên ưu tiên việc gì?',
  '📅 Tạo lịch học Java 7 ngày',
  '⚠️ Task nào có nguy cơ trễ deadline?',
  '🔥 Cách tăng hiệu suất học tập',
  '📈 Phân tích tiến độ học tập',
];

export const AI_RESPONSES: Record<string, string> = {
  default: 'Tôi hiểu câu hỏi của bạn. Dựa trên dữ liệu học tập hiện tại, để tôi phân tích và đưa ra gợi ý phù hợp nhất cho bạn...',
  workload: `📊 **Phân tích Workload tuần này:**\n\nBạn đang có **10 tasks** với tổng khối lượng ước tính ~**42 giờ**:\n\n🔴 **Ưu tiên cao (cần làm ngay):**\n• Báo cáo CSDL - Deadline: **12/12 (2 ngày nữa!)**\n• Thuyết trình KTPM - Deadline: **14/12 (4 ngày)**\n• Java OOP - Đang làm, 40% còn lại\n\n🟡 **Ưu tiên trung bình:**\n• Cài đặt thuật toán sắp xếp - 70% hoàn thành\n• Ôn tập Giải tích - Thi 18/12\n\n⚠️ **Cảnh báo:** Tuần này bạn có nguy cơ **overload**. Tôi gợi ý nên tập trung vào CSDL hôm nay.`,
  priority: `🎯 **Top 3 ưu tiên hôm nay:**\n\n1. **🔴 Báo cáo CSDL** (KHẨN CẤP)\n   → Deadline 12/12, chỉ còn 10% đã làm\n   → Ước tính: cần 4-5 giờ\n\n2. **🔴 Thuyết trình KTPM**\n   → Deadline 14/12, 25% hoàn thành\n   → Cần chuẩn bị slides và nội dung\n\n3. **🟡 Java OOP Project**\n   → Đang trong tiến trình (60%), deadline 15/12\n   → Tiếp tục momentum hiện tại\n\n💡 *Gợi ý:* Dùng Pomodoro 4x25min cho CSDL ngay hôm nay!`,
  plan: `📅 **Kế hoạch học Java trong 7 ngày:**\n\n**Ngày 1-2:** Ôn tập OOP cơ bản\n• Classes, Objects, Inheritance\n• Polymorphism, Encapsulation\n• ⏱️ 3 giờ/ngày\n\n**Ngày 3-4:** Collections & Generics\n• ArrayList, HashMap, LinkedList\n• Generic types\n• ⏱️ 3 giờ/ngày\n\n**Ngày 5:** Exception Handling & I/O\n• Try-catch, Custom exceptions\n• File I/O operations\n• ⏱️ 3 giờ\n\n**Ngày 6:** Multi-threading\n• Thread, Runnable\n• Synchronization\n• ⏱️ 4 giờ\n\n**Ngày 7:** Review & Practice\n• Làm bài tập tổng hợp\n• Code review với nhóm\n• ⏱️ 4 giờ\n\n✅ Tổng: ~23 giờ | Mỗi ngày ~3-4 giờ`,
  pomodoro: `🍅 **Chiến lược Pomodoro học tập:**

- Học 25 phút tập trung, nghỉ 5 phút
- Sau 4 phiên: nghỉ dài 15-30 phút
- Ưu tiên task quan trọng trước, tránh phân tâm

📌 Gợi ý: vào sáng hoặc chiều, bắt đầu với task deadline gần nhất.

Bạn đã hoàn thành 8 phiên Pomodoro. Tiếp tục duy trì nhịp độ này để tăng hiệu suất!`,
};
