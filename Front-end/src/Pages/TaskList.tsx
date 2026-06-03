import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, ChevronDown, Pencil, RefreshCw, Trash2, CheckCircle2, Clock, ListTodo, X, User, Users, CheckSquare, Square, CalendarDays, Lock, AlignLeft, Paperclip, Eye, Image as ImageIcon } from 'lucide-react';

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type Status = 'TODO' | 'DOING' | 'DONE';
type Scope = 'PERSONAL' | 'PROJECT';

// ĐỒNG BỘ CẤU TRÚC VỚI KANBAN BOARD
export type ChecklistItem = { id: string; text: string; checked: boolean; };
export type Checklist = { id: string; title: string; items: ChecklistItem[]; };

interface Task {
  id: string;
  title: string;
  subject?: string;
  startDate?: string | null; 
  dueDate?: string | null;   
  priority: Priority;
  status: Status;
  progress?: number;
  description?: string;
  tags?: string[];
  labels?: string[];
  scope?: Scope; 
  assignees?: string[]; 
  checklists?: Checklist[]; // Thay thế subtasks
  attachments?: string[]; // Chứa URL hình ảnh đính kèm
}

const CURRENT_USER = 'Nguyễn Văn An';

const priorityColors: Record<Priority, { text: string; bg: string }> = {
  HIGH: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  MEDIUM: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  LOW: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
};

const statusConfig: Record<Status, { label: string; text: string; bg: string; bar: string }> = {
  TODO: { label: 'CẦN LÀM', text: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', bar: 'bg-slate-300 dark:bg-slate-600' },
  DOING: { label: 'ĐANG LÀM', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', bar: 'bg-blue-500' },
  DONE: { label: 'HOÀN THÀNH', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', bar: 'bg-emerald-500' },
};

const nextStatus: Record<Status, Status> = { TODO: 'DOING', DOING: 'DONE', DONE: 'TODO' };
const subjects = ['Tất cả', 'Chung', 'Java', 'Machine Learning', 'Database', 'Math', 'React', 'Algorithms', 'English'];
const sortOptions = ['Deadline', 'Ưu tiên', 'Tiến độ', 'Môn học'];

// --- DỮ LIỆU GIẢ CÓ ĐẦY ĐỦ CHECKLIST & ẢNH ---
const getDummyTasks = (): Task[] => [
  {
    id: 'dummy-1',
    title: 'Thiết kế UI/UX cho màn hình Dashboard',
    subject: 'Chung',
    priority: 'HIGH',
    status: 'DOING',
    startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),  
    scope: 'PROJECT',
    assignees: [CURRENT_USER],
    description: 'Cần thiết kế dựa trên phong cách flat design, sử dụng màu chủ đạo là xanh dương.',
    attachments: [
      'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800'
    ],
    checklists: [
      {
        id: 'chk-1', title: 'Thiết kế Figma', items: [
          { id: 'it-1', text: 'Vẽ Wireframe', checked: true },
          { id: 'it-2', text: 'Lên màu và Typography', checked: true },
          { id: 'it-3', text: 'Xuất Assets cho Dev', checked: false }
        ]
      }
    ]
  },
  {
    id: 'dummy-2',
    title: 'Ôn tập lại thuật toán Quy hoạch động',
    subject: 'Algorithms',
    priority: 'MEDIUM',
    status: 'TODO',
    startDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    scope: 'PERSONAL',
    assignees: [CURRENT_USER],
    description: 'Tập trung vào dạng bài cái túi (Knapsack) và Chuỗi con chung dài nhất.',
    checklists: [
      {
        id: 'chk-2', title: 'Danh sách bài tập', items: [
          { id: 'it-4', text: 'Knapsack 0/1', checked: false },
          { id: 'it-5', text: 'Longest Common Subsequence', checked: false }
        ]
      }
    ]
  },
  {
    id: 'dummy-3',
    title: 'Review source code nhánh Feature/Auth',
    subject: 'Java',
    priority: 'HIGH',
    status: 'DONE',
    startDate: null, 
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Đã trễ/hoàn thành
    scope: 'PROJECT',
    assignees: [CURRENT_USER],
    attachments: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'
    ],
    checklists: [
      {
        id: 'chk-3', title: 'Các mục cần kiểm tra', items: [
          { id: 'it-6', text: 'Bảo mật JWT', checked: true },
          { id: 'it-7', text: 'Xử lý lỗi Exception', checked: true }
        ]
      }
    ]
  }
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'Tất cả'>('Tất cả');
  const [subjectFilter, setSubjectFilter] = useState('Tất cả');
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'PERSONAL' | 'PROJECT'>('ALL');
  const [sortBy, setSortBy] = useState('Deadline');
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isReadOnlyModal, setIsReadOnlyModal] = useState(false); // Trạng thái xem chi tiết
  
  // Form States cho việc tạo/sửa Task (Đơn giản hóa cho Personal Task)
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Chung');
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');
  const [newStartDate, setNewStartDate] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newChecklistItems, setNewChecklistItems] = useState<ChecklistItem[]>([]); // Tạo 1 checklist mặc định cho task cá nhân
  const [subtaskInput, setSubtaskInput] = useState('');

  // 1. INIT LẤY DỮ LIỆU
  useEffect(() => {
    const storedTasks = window.localStorage.getItem('kanban-board-tasks-v3');
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks) as Task[];
        if (parsed.length === 0) setTasks(getDummyTasks());
        else setTasks(parsed.map(t => ({ ...t, scope: t.scope || 'PROJECT', checklists: t.checklists || [] })));
      } catch (e) {
        setTasks(getDummyTasks());
      }
    } else setTasks(getDummyTasks());
  }, []);

  // 2. LƯU DỮ LIỆU
  useEffect(() => {
    if (tasks.length > 0) window.localStorage.setItem('kanban-board-tasks-v3', JSON.stringify(tasks));
  }, [tasks]);

  // 3. XỬ LÝ LỌC
  const filtered = tasks.filter(t => {
    if (scopeFilter !== 'ALL' && t.scope !== scopeFilter) return false;
    const isAssignedToMe = !t.assignees || t.assignees.length === 0 || t.assignees.includes(CURRENT_USER);
    if (!isAssignedToMe) return false;

    const taskSubject = t.subject || (t.labels && t.labels[0]) || 'Chung';
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || taskSubject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Tất cả' || t.status === statusFilter;
    const matchSubject = subjectFilter === 'Tất cả' || taskSubject === subjectFilter;
    
    return matchSearch && matchStatus && matchSubject;
  }).sort((a, b) => {
    if (sortBy === 'Ưu tiên') {
      const order: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === 'Tiến độ') return (b.progress || 0) - (a.progress || 0);
    if (sortBy === 'Môn học') {
      const subA = a.subject || (a.labels && a.labels[0]) || '';
      const subB = b.subject || (b.labels && b.labels[0]) || '';
      return subA.localeCompare(subB);
    }
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return dateA - dateB;
  });

  const counts = {
    TODO: filtered.filter(t => t.status === 'TODO').length,
    DOING: filtered.filter(t => t.status === 'DOING').length,
    DONE: filtered.filter(t => t.status === 'DONE').length,
  };

  // 4. ACTION HANDLERS
  const moveStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetTask = tasks.find(t => t.id === id);
    if (targetTask?.scope === 'PROJECT') return; 

    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next = nextStatus[t.status];
      let updatedChecklists = t.checklists;
      if (next === 'DONE' && updatedChecklists) {
        updatedChecklists = updatedChecklists.map(c => ({ ...c, items: c.items.map(it => ({...it, checked: true})) }));
      }
      return { ...t, status: next, progress: next === 'DONE' ? 100 : next === 'DOING' ? 50 : 0, checklists: updatedChecklists };
    }));
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetTask = tasks.find(t => t.id === id);
    if (targetTask?.scope === 'PROJECT') return; 

    if(window.confirm('Bạn có chắc muốn xóa công việc cá nhân này?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  // Tính toán tổng số lượng checklist items và số lượng đã check
  const getChecklistStats = (checklists?: Checklist[]) => {
    if (!checklists || checklists.length === 0) return { total: 0, checked: 0 };
    let total = 0;
    let checked = 0;
    checklists.forEach(c => {
      total += c.items.length;
      checked += c.items.filter(i => i.checked).length;
    });
    return { total, checked };
  };

  // 5. QUẢN LÝ MODAL (Tạo mới & Xem/Sửa)
  const openAddModal = () => {
    setEditingTask(null);
    setIsReadOnlyModal(false);
    setNewTitle('');
    setNewSubject('Chung');
    setNewPriority('MEDIUM');
    setNewStartDate('');
    setNewDeadline('');
    setNewDescription('');
    setNewChecklistItems([]);
    setShowAddModal(true);
  };

  const openTaskModal = (task: Task) => {
    setEditingTask(task);
    
    // Nếu là task dự án thì khóa lại (Chỉ xem)
    if (task.scope === 'PROJECT') {
      setIsReadOnlyModal(true);
      setShowAddModal(true);
      return;
    }

    // Nếu là task cá nhân thì nạp dữ liệu để sửa
    setIsReadOnlyModal(false);
    setNewTitle(task.title);
    setNewSubject(task.subject || (task.labels && task.labels[0]) || 'Chung');
    setNewPriority(task.priority);
    setNewDescription(task.description || '');
    setNewStartDate(task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '');
    setNewDeadline(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    
    // Lấy checklist đầu tiên ra làm mặc định cho Task cá nhân (để UI đơn giản)
    if (task.checklists && task.checklists.length > 0) {
      setNewChecklistItems(task.checklists[0].items);
    } else {
      setNewChecklistItems([]);
    }
    
    setShowAddModal(true);
  };

  const handleSubtaskActions = {
    add: () => {
      if (!subtaskInput.trim()) return;
      setNewChecklistItems([...newChecklistItems, { id: Date.now().toString(), text: subtaskInput, checked: false }]);
      setSubtaskInput('');
    },
    toggle: (id: string) => {
      setNewChecklistItems(prev => prev.map(st => st.id === id ? { ...st, checked: !st.checked } : st));
    },
    remove: (id: string) => {
      setNewChecklistItems(prev => prev.filter(st => st.id !== id));
    }
  };

  const handleSaveTask = () => {
    if (!newTitle.trim()) return;

    let calculatedProgress = 0;
    if (newChecklistItems.length > 0) {
      const completedCount = newChecklistItems.filter(st => st.checked).length;
      calculatedProgress = Math.round((completedCount / newChecklistItems.length) * 100);
    }

    let finalStatus: Status = 'TODO';
    if (calculatedProgress === 100) finalStatus = 'DONE';
    else if (calculatedProgress > 0) finalStatus = 'DOING';

    const finalChecklists: Checklist[] = newChecklistItems.length > 0 
      ? [{ id: `chk-${Date.now()}`, title: 'Việc cần làm', items: newChecklistItems }] 
      : [];

    const taskData: Partial<Task> = {
      title: newTitle,
      subject: newSubject,
      description: newDescription,
      labels: [newSubject],
      priority: newPriority,
      startDate: newStartDate ? new Date(newStartDate).toISOString() : null,
      dueDate: newDeadline ? new Date(newDeadline).toISOString() : null,
      scope: 'PERSONAL',
      checklists: finalChecklists,
      progress: calculatedProgress,
    };

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData, status: newChecklistItems.length > 0 ? finalStatus : t.status } : t));
    } else {
      setTasks(prev => [{ ...taskData, id: Date.now().toString(), status: finalStatus, assignees: [CURRENT_USER], tags: [newSubject] } as Task, ...prev]);
    }
    setShowAddModal(false);
  };

  const formatDateRange = (start?: string | null, end?: string | null) => {
    if (!start && !end) return 'Không có hạn';
    const s = start ? new Date(start).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '';
    const e = end ? new Date(end).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '';
    if (start && end) return `${s} - ${e}`;
    if (start) return `Từ ${s}`;
    return `Hạn: ${e}`;
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 h-full flex flex-col bg-[#F8FAFC] dark:bg-[#0B1121] transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Công việc của tôi</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý nhiệm vụ cá nhân và theo dõi dự án chung.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-lg">
            <button onClick={() => setScopeFilter('ALL')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${scopeFilter === 'ALL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Tất cả</button>
            <button onClick={() => setScopeFilter('PERSONAL')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${scopeFilter === 'PERSONAL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}><User size={14}/> Cá nhân</button>
            <button onClick={() => setScopeFilter('PROJECT')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${scopeFilter === 'PROJECT' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}><Users size={14}/> Dự án</button>
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg text-sm font-medium text-white transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Tạo việc mới
          </button>
        </div>
      </div>

      {/* THANH CÔNG CỤ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 flex flex-wrap sm:flex-nowrap gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Tìm kiếm..." 
              className="w-full bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" 
            />
          </div>
          <div className="relative w-full sm:w-40 flex-shrink-0">
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value as Status | 'Tất cả')} 
              className="w-full bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none shadow-sm cursor-pointer transition-all"
            >
              <option value="Tất cả">Mọi trạng thái</option>
              <option value="TODO">Cần làm</option>
              <option value="DOING">Đang làm</option>
              <option value="DONE">Hoàn thành</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative w-full sm:w-40 flex-shrink-0">
            <select 
              value={subjectFilter} 
              onChange={e => setSubjectFilter(e.target.value)} 
              className="w-full bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none shadow-sm cursor-pointer transition-all"
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* THỐNG KÊ GỌN GÀNG BÊN PHẢI */}
        <div className="lg:col-span-4 flex gap-2 justify-end">
          {(['TODO', 'DOING', 'DONE'] as Status[]).map(s => {
            const cfg = statusConfig[s];
            return (
              <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'Tất cả' : s)} className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${statusFilter === s ? 'bg-white dark:bg-[#121826] border-blue-500 shadow-sm ring-1 ring-blue-500' : 'bg-transparent border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'}`}>
                <span className="text-lg font-semibold text-slate-900 dark:text-white leading-none">{counts[s]}</span>
                <span className="text-[10px] font-medium uppercase tracking-wide mt-1">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DANH SÁCH TASK - HIỂN THỊ DỮ LIỆU PHONG PHÚ HƠN */}
      <div className="flex-1 overflow-y-auto pr-1 pb-10 custom-scrollbar space-y-3 cursor-pointer">
        <AnimatePresence>
          {filtered.map(task => {
            const sc = statusConfig[task.status];
            const pc = priorityColors[task.priority];
            const taskSubject = task.subject || (task.labels && task.labels[0]) || 'Chung';
            const isPersonal = task.scope === 'PERSONAL';
            const hasAttachments = task.attachments && task.attachments.length > 0;
            
            // Xử lý checklist
            const { total: totalChecklist, checked: checkedChecklist } = getChecklistStats(task.checklists);
            // Tính toán tiến độ dựa trên checklist hoặc progress thủ công
            const progress = totalChecklist > 0 
              ? Math.round((checkedChecklist / totalChecklist) * 100) 
              : (task.progress || (task.status === 'DONE' ? 100 : task.status === 'DOING' ? 50 : 0));

            return (
              <motion.div
                key={task.id}
                onClick={() => openTaskModal(task)}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                className={`group flex flex-col bg-white dark:bg-[#121826] rounded-xl shadow-sm ring-1 transition-all duration-200 overflow-hidden ${
                  task.status === 'DONE' ? 'ring-slate-200 dark:ring-slate-800/50 opacity-70' : 'ring-slate-200/70 hover:shadow-md hover:ring-slate-300 dark:ring-slate-700'
                }`}
              >
                {/* ẢNH COVER (NẾU CÓ) - Tính năng giống Trello */}
                {hasAttachments && (
                  <div className="w-full h-24 sm:h-32 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={task.attachments![0]} alt="Task cover" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}

                <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    {/* HÀNG 1: LABEL & TIÊU ĐỀ */}
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                      <h3 className={`text-[15px] font-medium truncate ${task.status === 'DONE' ? 'line-through text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                        {task.title}
                      </h3>
                    </div>

                    {/* HÀNG 2: THÔNG TIN CƠ BẢN */}
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2.5 font-medium">
                      <span className="flex items-center gap-1.5">
                        {isPersonal ? <User className="w-3.5 h-3.5 text-indigo-500" /> : <Users className="w-3.5 h-3.5 text-emerald-500" />}
                        {isPersonal ? 'Cá nhân' : 'Dự án'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className="flex items-center gap-1.5">
                        <ListTodo className="w-3.5 h-3.5" /> {taskSubject}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" /> {formatDateRange(task.startDate, task.dueDate)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className={`px-1.5 py-0.5 rounded ${pc.bg} ${pc.text}`}>
                        {task.priority === 'HIGH' ? 'Ưu tiên Cao' : task.priority === 'MEDIUM' ? 'TB' : 'Thấp'}
                      </span>
                    </div>

                    {/* HÀNG 3: INDICATORS (Mô tả, Đính kèm, Checklist) */}
                    {(task.description || hasAttachments || totalChecklist > 0) && (
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {task.description && (
                          <div className="flex items-center gap-1.5" title="Có mô tả chi tiết"><AlignLeft className="w-3.5 h-3.5" /></div>
                        )}
                        {hasAttachments && (
                          <div className="flex items-center gap-1.5" title="Có đính kèm"><Paperclip className="w-3.5 h-3.5" /> {task.attachments!.length}</div>
                        )}
                        {totalChecklist > 0 && (
                          <div className={`flex items-center gap-1.5 ${checkedChecklist === totalChecklist ? 'text-emerald-500' : ''}`} title="Checklist">
                            <CheckSquare className="w-3.5 h-3.5" /> {checkedChecklist}/{totalChecklist}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* GIỮA: PROGRESS BAR */}
                  <div className="w-full md:w-32 flex-shrink-0 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${sc.bar}`} style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 w-8 text-right">{progress}%</span>
                  </div>

                  {/* PHẢI: NÚT THAO TÁC */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isPersonal ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); openTaskModal(task); }} className="p-2 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Chỉnh sửa">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => moveStatus(task.id, e)} className="p-2 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors" title="Chuyển trạng thái">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => deleteTask(task.id, e)} className="p-2 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors" title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); openTaskModal(task); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-medium transition-colors border border-slate-200 dark:border-slate-700">
                        <Eye className="w-3.5 h-3.5" /> Xem
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-white dark:bg-[#121826] rounded-full flex items-center justify-center mb-4 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <CheckSquare className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Không tìm thấy công việc nào.</p>
          </div>
        )}
      </div>

      {/* MODAL THÊM / SỬA / XEM TASK */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-[#121826] rounded-2xl w-full ${isReadOnlyModal ? 'max-w-2xl' : 'max-w-lg'} shadow-2xl flex flex-col max-h-[90vh] ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden`}
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-[#0B1120]">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {isReadOnlyModal ? <><Eye className="w-4 h-4 text-blue-500" /> Chi tiết công việc dự án</> : editingTask ? 'Cập nhật việc cá nhân' : 'Tạo việc cá nhân mới'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Body Modal */}
              <div className="px-6 py-5 space-y-6 overflow-y-auto custom-scrollbar">
                
                {/* ẢNH ĐÍNH KÈM NẾU LÀ VIEW CHI TIẾT KANBAN */}
                {isReadOnlyModal && editingTask?.attachments && editingTask.attachments.length > 0 && (
                   <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5"/> Hình ảnh đính kèm</label>
                     <div className="flex flex-wrap gap-2">
                        {editingTask.attachments.map((url, i) => (
                          <div key={i} className="w-32 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                             <img src={url} alt="attachment" className="w-full h-full object-cover"/>
                          </div>
                        ))}
                     </div>
                   </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Tiêu đề công việc</label>
                  {isReadOnlyModal ? (
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">{editingTask?.title}</div>
                  ) : (
                    <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="VD: Hoàn thành thiết kế UI..." className="w-full bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  )}
                </div>

                {/* MÔ TẢ (Dành cho view Kanban) */}
                {isReadOnlyModal && editingTask?.description && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5"/> Mô tả chi tiết</label>
                    <div className="bg-slate-50 dark:bg-[#0B1120] rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800/50 whitespace-pre-wrap">
                      {editingTask.description}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Phân loại</label>
                    {isReadOnlyModal ? (
                      <div className="text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2"><ListTodo className="w-4 h-4 text-slate-400"/> {editingTask?.subject || 'Chung'}</div>
                    ) : (
                      <div className="relative">
                        <select value={newSubject} onChange={e => setNewSubject(e.target.value)} className="w-full bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer">
                          {subjects.filter(s => s !== 'Tất cả').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Độ ưu tiên</label>
                    {isReadOnlyModal ? (
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {editingTask?.priority === 'HIGH' ? '🔥 Cao' : editingTask?.priority === 'MEDIUM' ? '⚡ Trung bình' : '🌱 Thấp'}
                      </div>
                    ) : (
                      <div className="relative">
                        <select value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)} className="w-full bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer">
                          <option value="HIGH">🔥 Cao</option>
                          <option value="MEDIUM">⚡ Trung bình</option>
                          <option value="LOW">🌱 Thấp</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Ngày bắt đầu</label>
                    {isReadOnlyModal ? (
                      <div className="text-sm text-slate-800 dark:text-slate-200">{formatDateRange(editingTask?.startDate, null).replace('Từ ', '') || '--'}</div>
                    ) : (
                      <input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className="w-full bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer" />
                    )}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Hạn chót</label>
                    {isReadOnlyModal ? (
                       <div className="text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400"/> {formatDateRange(null, editingTask?.dueDate).replace('Hạn: ', '') || '--'}</div>
                    ) : (
                      <input type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} className="w-full bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer" />
                    )}
                  </div>
                </div>

                {/* CHECKLIST */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-3 block uppercase tracking-wider flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5"/> Chia nhỏ công việc (Checklists)</label>
                  
                  {isReadOnlyModal ? (
                    // VIEW CHECKLIST KANBAN (Dự án có thể có nhiều checklists lồng nhau)
                    <div className="space-y-6">
                      {editingTask?.checklists?.map(chk => {
                        const total = chk.items.length;
                        const checked = chk.items.filter(i => i.checked).length;
                        const pct = total === 0 ? 0 : Math.round((checked / total) * 100);
                        return (
                          <div key={chk.id}>
                             <div className="flex items-center justify-between mb-2">
                               <span className="text-sm font-semibold text-slate-800 dark:text-white">{chk.title}</span>
                               <span className="text-xs font-medium text-slate-500">{pct}%</span>
                             </div>
                             <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }}></div>
                             </div>
                             <div className="space-y-2">
                               {chk.items.map(it => (
                                 <div key={it.id} className="flex items-start gap-2.5">
                                    <div className="mt-0.5">{it.checked ? <CheckSquare size={16} className="text-blue-500" /> : <Square size={16} className="text-slate-300 dark:text-slate-600" />}</div>
                                    <span className={`text-sm ${it.checked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{it.text}</span>
                                 </div>
                               ))}
                             </div>
                          </div>
                        )
                      })}
                      {(!editingTask?.checklists || editingTask.checklists.length === 0) && (
                        <p className="text-sm text-slate-400 italic">Không có checklist nào.</p>
                      )}
                    </div>
                  ) : (
                    // EDIT CHECKLIST PERSONAL (Đơn giản 1 list)
                    <>
                      <div className="space-y-2 mb-4">
                        {newChecklistItems.map(st => (
                          <div key={st.id} className="flex items-center justify-between group p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/80 transition-colors">
                            <button onClick={() => handleSubtaskActions.toggle(st.id)} className="flex items-center gap-3 flex-1 text-left">
                              {st.checked ? <CheckSquare size={16} className="text-blue-500 flex-shrink-0" /> : <Square size={16} className="text-slate-400 flex-shrink-0" />}
                              <span className={`text-sm ${st.checked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{st.text}</span>
                            </button>
                            <button onClick={() => handleSubtaskActions.remove(st.id)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                              <X size={14}/>
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          value={subtaskInput} onChange={e => setSubtaskInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubtaskActions.add()}
                          placeholder="Nhập nhiệm vụ con..." 
                          className="flex-1 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                        />
                        <button onClick={handleSubtaskActions.add} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                          Thêm
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Footer Modal */}
              <div className="flex gap-3 px-6 py-4 bg-slate-50 dark:bg-[#0B1120] border-t border-slate-100 dark:border-slate-800/50">
                {isReadOnlyModal ? (
                  <button onClick={() => setShowAddModal(false)} className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all shadow-sm">
                    Đóng
                  </button>
                ) : (
                  <>
                    <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                      Hủy bỏ
                    </button>
                    <button onClick={handleSaveTask} disabled={!newTitle.trim()} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      {editingTask ? 'Lưu thay đổi' : 'Tạo nhiệm vụ'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}