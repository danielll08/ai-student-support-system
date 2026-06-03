export const CATEGORIES = [
  { id: 'study', label: 'Học trên trường', color: 'bg-blue-500' },
  { id: 'kanban', label: 'Deadline Kanban', color: 'bg-rose-500' },
  { id: 'personal', label: 'Cá nhân', color: 'bg-emerald-500' },
  { id: 'group', label: 'Hoạt động nhóm', color: 'bg-purple-500' },
];

export const UNSCHEDULED_TASKS = [
  { id: 't1', title: 'Hoàn thiện UI trang Lịch', priority: 'HIGH', duration: '2h' },
  { id: 't2', title: 'Làm slide Đồ án', priority: 'MEDIUM', duration: '3h' },
  { id: 't3', title: 'Đọc tài liệu React DnD', priority: 'LOW', duration: '1h' },
];

export const WEEK_DAYS = [
  { name: 'T2', date: '01' },
  { name: 'T3', date: '02' },
  { name: 'T4', date: '03', isToday: true },
  { name: 'T5', date: '04' },
  { name: 'T6', date: '05' },
  { name: 'T7', date: '06' },
  { name: 'CN', date: '07' },
];

// Tạo mảng 24 giờ tự động (00:00 đến 23:00)
export const HOURS = Array.from({ length: 24 }).map((_, i) => `${i.toString().padStart(2, '0')}:00`);