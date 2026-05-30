import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, ChevronDown, Pencil, RefreshCw, Trash2, CheckCircle2, Clock, ListTodo, X } from 'lucide-react';
import { mockTasks } from '@/data/mockData';

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type Status = 'TODO' | 'DOING' | 'DONE';

interface Task {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  priority: Priority;
  status: Status;
  progress: number;
  description: string;
  tags: string[];
}

const initialTasks: Task[] = mockTasks.map((item) => ({
  id: Number(item.id),
  title: item.title,
  subject: item.subject,
  deadline: new Date(item.deadline).toLocaleDateString('vi-VN'),
  priority: item.priority.toUpperCase() as Priority,
  status: item.status.toUpperCase() as Status,
  progress: item.progress,
  description: item.description,
  tags: item.tags,
}));

const priorityColors: Record<Priority, { text: string; bg: string; border: string }> = {
  HIGH: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  MEDIUM: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  LOW: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
};

const statusConfig: Record<Status, { label: string; text: string; bg: string; bar: string }> = {
  TODO: { label: 'TODO', text: 'text-gray-400', bg: 'bg-gray-500/10', bar: 'from-gray-500 to-gray-400' },
  DOING: { label: 'DOING', text: 'text-blue-400', bg: 'bg-blue-500/10', bar: 'from-blue-500 to-purple-500' },
  DONE: { label: 'DONE', text: 'text-green-400', bg: 'bg-green-500/10', bar: 'from-green-500 to-emerald-400' },
};

const nextStatus: Record<Status, Status> = {
  TODO: 'DOING',
  DOING: 'DONE',
  DONE: 'TODO',
};

const subjects = ['Tất cả', 'Java', 'Machine Learning', 'Database', 'Math', 'React', 'Algorithms', 'English', 'Data Structures', 'Software Engineering'];
const sortOptions = ['Deadline', 'Ưu tiên', 'Tiến độ', 'Môn học'];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'Tất cả'>('Tất cả');
  const [subjectFilter, setSubjectFilter] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('Deadline');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Java');
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');
  const [newDeadline, setNewDeadline] = useState('');

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'Tất cả' || t.status === statusFilter;
    const matchSubject = subjectFilter === 'Tất cả' || t.subject === subjectFilter;
    return matchSearch && matchStatus && matchSubject;
  }).sort((a, b) => {
    if (sortBy === 'Ưu tiên') {
      const order: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === 'Tiến độ') return b.progress - a.progress;
    if (sortBy === 'Môn học') return a.subject.localeCompare(b.subject);
    return a.deadline.localeCompare(b.deadline);
  });

  const counts = {
    TODO: tasks.filter(t => t.status === 'TODO').length,
    DOING: tasks.filter(t => t.status === 'DOING').length,
    DONE: tasks.filter(t => t.status === 'DONE').length,
  };

  const moveStatus = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next = nextStatus[t.status];
      return { ...t, status: next, progress: next === 'DONE' ? 100 : t.progress };
    }));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Date.now(),
      title: newTitle,
      subject: newSubject,
      deadline: newDeadline || '31/12/2024',
      priority: newPriority,
      status: 'TODO',
      progress: 0,
      description: '',
      tags: [newSubject],
    };
    setTasks(prev => [task, ...prev]);
    setNewTitle('');
    setNewSubject('Java');
    setNewPriority('MEDIUM');
    setNewDeadline('');
    setShowAddModal(false);
  };

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-950 dark:text-white">Quản lý công việc</h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Tạo, sửa, xóa, lọc và sắp xếp task học tập hiệu quả.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-purple-500/30"
        >
          <Plus className="w-4 h-4" />
          + Tạo Task
        </button>
      </div>

      {/* Quick dashboard */}
      <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-[#252d3d] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-1">Bảng điều khiển nhanh</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">Theo dõi số lượng task theo trạng thái và tìm kiếm nhanh.</p>

        {/* Filters */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="relative col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 dark:text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tiêu đề, môn, tag..."
              className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#252d3d] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-950 dark:text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as Status | 'Tất cả')}
              className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="TODO">TODO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
            >
              {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-3 gap-3">
          {(['TODO', 'DOING', 'DONE'] as Status[]).map(s => {
            const cfg = statusConfig[s];
            const icons = { TODO: ListTodo, DOING: Clock, DONE: CheckCircle2 };
            const Icon = icons[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? 'Tất cả' : s)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  statusFilter === s
                    ? 'bg-white dark:bg-[#1e2534] border-blue-500/30'
                    : 'bg-white dark:bg-[#1a2030] border-slate-200 dark:border-[#252d3d] hover:dark:border-[#3a4455]'
                }`}
              >
                <div className={`w-9 h-9 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${cfg.text} dark:${cfg.text}`} />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-slate-950 dark:text-white">{counts[s]}</div>
                  <div className={`text-xs ${cfg.text} font-medium dark:${cfg.text}`}>{s}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map(task => {
            const sc = statusConfig[task.status];
            const pc = priorityColors[task.priority];
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className={`bg-white dark:bg-[#161b27] border rounded-2xl p-4 transition-all ${
                  task.status === 'DONE' ? 'border-slate-200 dark:border-[#1e2a1e]' : 'border-slate-200 dark:border-[#252d3d]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-sm font-medium ${task.status === 'DONE' ? 'line-through text-slate-500 dark:text-gray-400' : 'text-slate-950 dark:text-white'}`}>
                        {task.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${sc.bg} ${sc.text}`}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-[11px] text-slate-500 dark:text-gray-400">
                      <span>{task.subject}</span>
                      <span>·</span>
                      <span>{task.deadline}</span>
                      <span className={`font-medium px-2 py-0.5 rounded-md ${pc.bg} ${pc.text} border ${pc.border}`}>
                        {task.priority === 'HIGH' ? 'Cao' : task.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 mb-2 line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-[#1e2534] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${sc.bar} rounded-full transition-all duration-500`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 w-8 text-right">{task.progress}%</span>
                    </div>
                    {task.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {task.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-50 dark:bg-[#1e2534] text-blue-400 rounded-md border border-blue-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#1e2534] hover:bg-slate-100 dark:hover:bg-[#252d3d] text-slate-700 dark:text-gray-400 hover:text-white transition-all text-xs border border-slate-200 dark:border-[#252d3d]">
                      <Pencil className="w-3 h-3" />
                      Sửa
                    </button>
                    <button
                      onClick={() => moveStatus(task.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#1e2534] hover:bg-slate-100 dark:hover:bg-[#252d3d] text-slate-700 dark:text-gray-400 hover:text-blue-400 transition-all text-xs border border-slate-200 dark:border-[#252d3d]"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Chuyển {nextStatus[task.status]}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-xs border border-red-500/20"
                    >
                      <Trash2 className="w-3 h-3" />
                      Xóa
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            Không có task nào phù hợp với bộ lọc.
          </div>
        )}
      </div>

      {/* Add task modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-[#252d3d] rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-slate-950 dark:text-white">Tạo task mới</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-500 dark:text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 dark:text-gray-400 mb-1.5 block">Tiêu đề *</label>
                  <input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Nhập tiêu đề task..."
                    className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 text-sm text-slate-950 dark:text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-gray-400 mb-1.5 block">Môn học</label>
                    <select
                      value={newSubject}
                      onChange={e => setNewSubject(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 text-sm text-slate-950 dark:text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                    >
                      {subjects.filter(s => s !== 'Tất cả').map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-gray-400 mb-1.5 block">Ưu tiên</label>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as Priority)}
                      className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 text-sm text-slate-950 dark:text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                    >
                      <option value="HIGH">Cao</option>
                      <option value="MEDIUM">Trung bình</option>
                      <option value="LOW">Thấp</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#252d3d] rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#252d3d] text-sm text-gray-400 hover:text-white hover:bg-[#1e2534] transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={addTask}
                  disabled={!newTitle.trim()}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tạo task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
