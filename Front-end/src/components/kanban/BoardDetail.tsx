import { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, GripVertical, Check, MessageCircle, X, Search, Filter, 
  CalendarDays, ChevronDown, Share2, Users, Layout, Zap, MoreHorizontal, Clock, ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';

// Đảm bảo đường dẫn import này đúng với project của bạn
import { TaskDetailModal, KanbanTask, Status, Priority } from './TaskDetailModal'; 

interface DragItem { id: string; status: Status; }

const priorityConfig: Record<Priority, { color: string; border: string }> = {
  HIGH: { color: 'text-rose-500', border: 'border-l-rose-500' },
  MEDIUM: { color: 'text-amber-500', border: 'border-l-amber-500' },
  LOW: { color: 'text-emerald-500', border: 'border-l-emerald-500' },
};

const columnConfig: Record<Status, { label: string; dot: string }> = {
  TODO: { label: 'Cần làm', dot: 'bg-slate-400 dark:bg-slate-500' },
  DOING: { label: 'Đang làm', dot: 'bg-blue-500' },
  DONE: { label: 'Hoàn thành', dot: 'bg-emerald-500' },
};

const nextStatus: Record<Status, Status> = { TODO: 'DOING', DOING: 'DONE', DONE: 'TODO' };
const STORAGE_KEY = 'kanban-board-tasks-v2';
const scrollbarClasses = "[&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200/50 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-[#2a3441]/50 dark:hover:[&::-webkit-scrollbar-thumb]:bg-[#3b4b5e] [&::-webkit-scrollbar-thumb]:rounded-full";

// Mock Data
const loadStoredTasks = (): KanbanTask[] => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as KanbanTask[];
    return parsed.map((task, index) => ({
      ...task,
      order: typeof task.order === 'number' ? task.order : index,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      startDate: task.startDate ? new Date(task.startDate) : null,
    }));
  } catch {
    return [];
  }
};

// --- CARD COMPONENT ---
function KanbanTaskCard({ task, moveTask, onSelect, taskComments }: any) {
  const [{ isDragging }, dragRef] = useDrag(() => ({ type: 'TASK', item: { id: task.id, status: task.status }, collect: (m) => ({ isDragging: m.isDragging() }) }), [task.id, task.status]);
  const pc = priorityConfig[task.priority as Priority] || priorityConfig.MEDIUM;

  return (
    <div ref={dragRef} className="pb-2">
      <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} onClick={() => onSelect(task)} 
        className={`relative bg-white dark:bg-[#181e29] rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-200 group border-y border-r border-slate-200 dark:border-[#2a3441] border-l-[4px] ${pc.border} hover:shadow-md hover:-translate-y-0.5 ${isDragging ? 'opacity-50 scale-105 shadow-2xl' : 'shadow-sm'}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className={`text-sm font-semibold leading-snug ${task.status === 'DONE' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-gray-100'}`}>{task.title}</p>
          <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-grab mt-0.5" />
        </div>
        
        <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {task.dueDate && <span className={`flex items-center gap-1.5 ${task.status === 'DONE' ? 'text-emerald-500' : ''}`}><Clock className="w-3.5 h-3.5"/> {format(new Date(task.dueDate), 'MMM d')}</span>}
          {task.checklists && task.checklists.length > 0 && <div className="flex items-center gap-1.5"><Check className={`w-3.5 h-3.5 ${task.checklists.reduce((sum: number, c: any) => sum + c.items.filter((it: any) => it.checked).length, 0) === task.checklists.reduce((sum: number, c: any) => sum + c.items.length, 0) ? 'text-emerald-500' : ''}`} />{task.checklists.reduce((sum: number, c: any) => sum + c.items.filter((it: any) => it.checked).length, 0)}/{task.checklists.reduce((sum: number, c: any) => sum + c.items.length, 0)}</div>}
          {taskComments[task.id] && taskComments[task.id].length > 0 && <div className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> {taskComments[task.id].length}</div>}
        </div>
      </motion.div>
    </div>
  );
}

// --- COLUMN COMPONENT ---
function KanbanColumn({ status, tasks, moveTask, onAdd, onSelect, taskComments }: any) {
  const [{ isOver }, dropRef] = useDrop(() => ({ accept: 'TASK', drop: (item: DragItem) => moveTask(item.id, status), collect: (m) => ({ isOver: m.isOver() }) }), [status]);
  const cfg = columnConfig[status as Status];

  return (
    <div ref={dropRef} className={`w-[320px] sm:w-[340px] flex-shrink-0 flex flex-col h-full rounded-2xl transition-all duration-300 ${isOver ? 'bg-slate-100/80 dark:bg-[#121c2e] ring-1 ring-blue-400' : 'bg-slate-100/50 dark:bg-[#10141f]'}`}>
      <div className="px-4 py-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{cfg.label}</span>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-200/70 dark:bg-[#252d3d] px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
      <div className={`flex-1 overflow-y-auto min-h-0 px-3 ${scrollbarClasses}`}>
        <AnimatePresence>
          {tasks.map((task: KanbanTask) => <KanbanTaskCard key={task.id} task={task} moveTask={moveTask} onSelect={onSelect} taskComments={taskComments} />)}
        </AnimatePresence>
      </div>
      <div className="p-3 shrink-0">
        <button onClick={() => onAdd(status)} className="w-full flex items-center gap-2 rounded-xl text-slate-500 dark:text-slate-400 py-2 text-sm font-medium hover:bg-slate-200/60 dark:hover:bg-[#1c2333] hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <Plus className="w-4 h-4" /> Thêm công việc
        </button>
      </div>
    </div>
  );
}

// --- COMPONENT BẢNG CHI TIẾT ---
interface BoardDetailProps {
  boardName: string;
  onBack: () => void;
}

export function BoardDetail({ boardName, onBack }: BoardDetailProps) {
  const [allTasks, setAllTasks] = useState<KanbanTask[]>(loadStoredTasks());
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Status>('TODO');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');

  const [taskComments, setTaskComments] = useState<{ [key: string]: any[] }>({
    'task-2': [{ author: 'Quản lý', text: 'Nhớ check kỹ responsive nhé!', time: '1 giờ trước', avatar: 'QL' }]
  });

  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(allTasks)); }, [allTasks]);

  const projectTasks = allTasks.filter(t => !t.scope || t.scope === 'PROJECT');
  const filteredTasks = projectTasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  const moveTask = (id: string, newStatus: Status, newPosition?: number) => {
    setAllTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === id);
      if (taskIndex === -1) return prev;
      const task = prev[taskIndex];
      const updatedTask = { ...task, status: newStatus, progress: newStatus === 'DONE' ? 100 : (task.progress === 100 ? 50 : task.progress) };

      let newTasks = [...prev];
      newTasks.splice(taskIndex, 1);
      if (newPosition !== undefined) {
        const tasksInTarget = newTasks.filter(t => t.status === newStatus);
        const targetIndexInFiltered = newPosition - 1; 
        if (targetIndexInFiltered >= tasksInTarget.length) newTasks.push(updatedTask); 
        else {
          const taskAtSlot = tasksInTarget[targetIndexInFiltered];
          const globalInsertIndex = newTasks.findIndex(t => t.id === taskAtSlot.id);
          newTasks.splice(globalInsertIndex, 0, updatedTask);
        }
      } else newTasks.push(updatedTask); 
      return newTasks.map((t, i) => ({ ...t, order: i }));
    });
    if (selectedTask?.id === id) setSelectedTask(prev => prev ? { ...prev, status: newStatus, progress: newStatus === 'DONE' ? 100 : (prev.progress === 100 ? 50 : prev.progress) } : null);
  };

  const openAddModal = (status: Status) => { setNewTaskStatus(status); setNewTitle(''); setNewPriority('MEDIUM'); setShowAddModal(true); };
  
  const addTask = () => {
    if (!newTitle.trim()) return;
    const newTask: KanbanTask = { id: `new-${Date.now()}`, title: newTitle, priority: newPriority, status: newTaskStatus, progress: newTaskStatus === 'DONE' ? 100 : 0, order: projectTasks.length, scope: 'PROJECT', labels: ['Dự án'] };
    setAllTasks(prev => [...prev, newTask]);
    setShowAddModal(false);
  };

  const updateTask = (updated: KanbanTask) => { setAllTasks(prev => prev.map(t => t.id === updated.id ? updated : t)); setSelectedTask(updated); };
  const handleAddComment = (text: string) => {
    if(!selectedTask) return;
    setTaskComments(prev => ({ ...prev, [selectedTask.id]: [{ author: 'Bạn', text, time: 'Vừa xong', avatar: 'ME' }, ...(prev[selectedTask.id] || [])] }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="absolute inset-0 flex flex-col overflow-hidden bg-white dark:bg-[#080c14] font-sans">
        {/* HEADER CHI TIẾT BẢNG */}
        <header className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#1e2532] bg-white dark:bg-[#080c14] z-20">
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            {/* NÚT BACK */}
            <button onClick={onBack} className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-[#1e2532] transition-colors" title="Trở về danh sách dự án">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="hidden sm:block w-[1px] h-5 bg-slate-200 dark:bg-slate-700"></div>
            <h1 className="font-extrabold text-xl lg:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <Layout className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              {boardName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-white dark:ring-[#080c14] z-20">TC</div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-white dark:ring-[#080c14] z-10">NV</div>
              <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-[#151b28] flex items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer transition-colors z-0"><Plus className="w-4 h-4" /></div>
            </div>
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1e2532] dark:hover:bg-[#2a3441] text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"><Share2 className="w-4 h-4" /> <span>Chia sẻ</span></button>
          </div>
        </header>

        {/* TOOLBAR */}
        <div className="shrink-0 px-6 py-3 flex flex-wrap items-center gap-3 z-10">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-[#10141f] border border-transparent rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#151b28] focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>
          <div className="relative w-full sm:w-40 flex-shrink-0">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | 'ALL')} className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-[#10141f] border border-transparent rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#151b28] focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer transition-all">
              <option value="ALL">Mọi ưu tiên</option><option value="HIGH">Ưu tiên Cao</option><option value="MEDIUM">Trung bình</option><option value="LOW">Ưu tiên Thấp</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* BOARD CANVAS */}
        <main className={`flex-1 min-h-0 overflow-x-auto overflow-y-hidden flex gap-5 px-6 pb-6 pt-2 items-start ${scrollbarClasses}`}>
          {(['TODO', 'DOING', 'DONE'] as Status[]).map((colStatus) => (
            <KanbanColumn key={colStatus} status={colStatus} tasks={filteredTasks.filter(t => t.status === colStatus).sort((a, b) => a.order - b.order)} moveTask={moveTask} onAdd={openAddModal} onSelect={setSelectedTask} taskComments={taskComments} />
          ))}
          <div className="w-[320px] sm:w-[340px] flex-shrink-0">
            <button className="w-full flex items-center gap-2 p-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-[#2a3441] text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#10141f] transition-colors"><Plus className="w-4 h-4" /> Thêm danh sách khác</button>
          </div>
        </main>

        {/* MODALS */}
        <AnimatePresence>
          {selectedTask && <TaskDetailModal task={selectedTask} allTasks={allTasks} onClose={() => setSelectedTask(null)} onUpdate={updateTask} onMove={moveTask} taskComments={taskComments[selectedTask.id] || []} onAddComment={handleAddComment}/>}
        </AnimatePresence>
        <AnimatePresence>
          {showAddModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
              <motion.div initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 10, opacity: 0 }} className="bg-white dark:bg-[#181e29] border border-slate-200 dark:border-[#2a3441] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                  <div><h3 className="text-lg font-bold text-slate-900 dark:text-white">Thêm công việc</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cột đích: <strong className="text-blue-600 dark:text-blue-400 uppercase tracking-wider">{columnConfig[newTaskStatus].label}</strong></p></div>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#252d3d] transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-[#9fadbc] mb-2 block uppercase tracking-wider">Tiêu đề công việc <span className="text-rose-500">*</span></label>
                    <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} autoFocus placeholder="VD: Khắc phục lỗi hiển thị..." className="w-full bg-slate-50 dark:bg-[#0b111a] border border-slate-200 dark:border-[#2a3441] rounded-lg px-4 py-2.5 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-[#2a3441] text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1c2333] transition-colors">Hủy</button>
                  <button onClick={addTask} disabled={!newTitle.trim()} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">Thêm công việc</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
}