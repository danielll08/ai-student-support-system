import { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, GripVertical, Check, MessageCircle, X, Search, Filter, 
  ChevronDown, Share2, Layout, MoreHorizontal, Clock, ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';

import { TaskDetailModal, KanbanTask, Status, Priority } from './TaskDetailModal'; 

interface DragItem { id: string; status: string; }

const priorityConfig: Record<string, { color: string; border: string; glow: string; badge: string }> = {
  HIGH: { color: 'text-rose-500', border: 'border-l-rose-500', glow: 'hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]', badge: 'bg-rose-500/10 text-rose-500' },
  MEDIUM: { color: 'text-amber-500', border: 'border-l-amber-500', glow: 'hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]', badge: 'bg-amber-500/10 text-amber-500' },
  LOW: { color: 'text-emerald-500', border: 'border-l-emerald-500', glow: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]', badge: 'bg-emerald-500/10 text-emerald-500' },
  NONE: { color: 'text-slate-400', border: 'border-l-slate-300 dark:border-l-slate-700', glow: 'hover:shadow-md', badge: '' },
};

const STORAGE_KEY = 'kanban-board-tasks-v5';
const scrollbarClasses = "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:h-[8px] [&::-webkit-scrollbar-track]:bg-black/10 [&::-webkit-scrollbar-thumb]:bg-white/30 hover:[&::-webkit-scrollbar-thumb]:bg-white/50 dark:[&::-webkit-scrollbar-thumb]:bg-white/20 dark:hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500/50 [&::-webkit-scrollbar-thumb]:rounded transition-colors";

const loadStoredTasks = (): KanbanTask[] => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return (JSON.parse(stored) as KanbanTask[]).map((task, index) => ({
      ...task,
      order: typeof task.order === 'number' ? task.order : index,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      startDate: task.startDate ? new Date(task.startDate) : null,
    }));
  } catch { return []; }
};

// --- CARD COMPONENT ---
function KanbanTaskCard({ task, moveTask, onSelect, taskComments }: any) {
  const [{ isDragging }, dragRef] = useDrag(() => ({ 
    type: 'TASK', 
    item: { id: task.id, status: task.status }, 
    collect: (m) => ({ isDragging: m.isDragging() }) 
  }), [task.id, task.status]);
  
  const pc = priorityConfig[task.priority as string] || priorityConfig.NONE;
  const isDone = task.status === 'DONE';

  return (
    // [ĐÃ SỬA LỖI TYPESCRIPT Ở ĐÂY]
    <div ref={(node) => { dragRef(node); }} onClick={() => onSelect(task)} className="pb-2.5 relative group cursor-pointer">
      <motion.div 
        layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} 
        className={`relative bg-white dark:bg-[#22272b] rounded-md p-3 transition-all duration-300 border border-slate-200 dark:border-[#384148] border-l-[3px] ${pc.border} ${pc.glow} hover:-translate-y-0.5 ${isDragging ? 'opacity-40 scale-[1.02] shadow-xl z-50' : 'shadow-sm'}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col gap-1.5">
            {task.priority && task.priority !== 'NONE' && (
              <span className={`w-max text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm tracking-wider ${pc.badge}`}>{task.priority}</span>
            )}
            <p className={`text-[13px] font-medium leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-[#b6c2cf]'}`}>{task.title}</p>
          </div>
          <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-grab mt-0.5" />
        </div>
        
        {(task.dueDate || task.checklists?.length > 0 || taskComments[task.id]?.length > 0) && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-[#8c9bab] font-medium">
              {task.dueDate && (
                <span className={`flex items-center gap-1 p-1 rounded-sm ${isDone ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-black/20'}`}>
                  <Clock className="w-3 h-3"/> {format(new Date(task.dueDate), 'MMM d')}
                </span>
              )}
              {task.checklists?.length > 0 && (
                <div className="flex items-center gap-1 hover:text-cyan-400">
                  <Check className="w-3.5 h-3.5" />
                  {task.checklists.reduce((sum: number, c: any) => sum + c.items.filter((it: any) => it.checked).length, 0)}/{task.checklists.reduce((sum: number, c: any) => sum + c.items.length, 0)}
                </div>
              )}
              {taskComments[task.id]?.length > 0 && (
                <div className="flex items-center gap-1 hover:text-cyan-400"><MessageCircle className="w-3.5 h-3.5" /> {taskComments[task.id].length}</div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// --- COLUMN COMPONENT (Cột động - Xử lý Inline Input) ---
function KanbanColumn({ status, colConfig, tasks, moveTask, addingTaskToCol, setAddingTaskToCol, newTitle, setNewTitle, newPriority, setNewPriority, onSaveTask, onSelect, taskComments }: any) {
  const [{ isOver }, dropRef] = useDrop(() => ({ 
    accept: 'TASK', 
    drop: (item: DragItem) => moveTask(item.id, status), 
    collect: (m) => ({ isOver: m.isOver() }) 
  }), [status]);

  const isAddingHere = addingTaskToCol === status;

  return (
    <div 
      // [ĐÃ SỬA LỖI TYPESCRIPT Ở ĐÂY]
      ref={(node) => { dropRef(node); }} 
      className={`w-[280px] sm:w-[300px] flex-shrink-0 flex flex-col max-h-full h-fit rounded-md transition-all duration-300 border-t-[3px] ${colConfig.border} bg-slate-100/90 dark:bg-[#101204] backdrop-blur-md shadow-md border-x border-b border-transparent dark:border-white/10 ${isOver ? 'ring-1 ring-cyan-500/50' : ''}`}
    >
      <div className="px-3 py-2.5 shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-sm ${colConfig.dot}`} />
          <span className="text-[14px] font-bold text-slate-800 dark:text-[#b6c2cf]">{colConfig.label}</span>
          <span className="text-xs font-semibold text-slate-500 bg-black/5 dark:bg-[#22272b] px-2 py-0.5 rounded-sm shadow-inner">{tasks.length}</span>
        </div>
        <button className="text-slate-400 hover:text-cyan-500 transition-colors p-1 rounded-sm hover:bg-slate-200 dark:hover:bg-[#2a3441]"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
      
      <div className={`flex-1 overflow-y-auto min-h-0 px-2.5 pt-2.5 ${scrollbarClasses}`}>
        <AnimatePresence>
          {tasks.map((task: KanbanTask) => (
            <KanbanTaskCard key={task.id} task={task} moveTask={moveTask} onSelect={onSelect} taskComments={taskComments} />
          ))}
        </AnimatePresence>
      </div>
      
      {isAddingHere ? (
        <div className="p-2 shrink-0 bg-slate-200/50 dark:bg-[#1c2126] rounded-b-md border-t border-slate-200 dark:border-white/5">
          <textarea
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSaveTask(); }
              if (e.key === 'Escape') setAddingTaskToCol(null);
            }}
            placeholder="Nhập tiêu đề cho thẻ này..."
            className="w-full p-2 text-[13px] bg-white dark:bg-[#22272b] border border-slate-300 dark:border-[#384148] rounded-md shadow-sm resize-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:text-[#b6c2cf] mb-2"
            rows={2}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button onClick={onSaveTask} disabled={!newTitle.trim()} className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 disabled:dark:bg-[#2a3441] disabled:text-slate-500 text-white px-3 py-1.5 rounded text-[13px] font-semibold transition-colors">
                Thêm thẻ
              </button>
              <button onClick={() => setAddingTaskToCol(null)} className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-[#b6c2cf] transition-colors rounded hover:bg-slate-300 dark:hover:bg-[#2a3441]">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} className="bg-white dark:bg-[#22272b] border border-slate-300 dark:border-[#384148] text-slate-600 dark:text-[#b6c2cf] text-[11px] font-semibold rounded px-1.5 py-1 focus:outline-none focus:border-cyan-500 shadow-sm cursor-pointer">
              <option value="NONE">Không ưu tiên</option>
              <option value="HIGH">Độ ưu tiên: Cao</option>
              <option value="MEDIUM">Độ ưu tiên: Vừa</option>
              <option value="LOW">Độ ưu tiên: Thấp</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="p-2 shrink-0">
          <button 
            onClick={() => {
              setAddingTaskToCol(status);
              setNewTitle('');
              setNewPriority('NONE');
            }} 
            className="w-full flex items-center gap-2 rounded-md text-slate-500 dark:text-[#8c9bab] py-1.5 px-2 text-[13px] font-semibold hover:bg-slate-200 dark:hover:bg-[#2a3441] hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm thẻ
          </button>
        </div>
      )}
    </div>
  );
}

// --- COMPONENT BẢNG CHI TIẾT CHÍNH ---
export function BoardDetail({ board, onBack }: { board: any; onBack: () => void; }) {
  const [allTasks, setAllTasks] = useState<KanbanTask[]>(loadStoredTasks());
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  
  const [columns, setColumns] = useState([
    { id: 'TODO', label: 'Cần làm', dot: 'bg-slate-400', border: 'border-t-slate-500' },
    { id: 'DOING', label: 'Đang làm', dot: 'bg-cyan-500', border: 'border-t-cyan-500' },
    { id: 'DONE', label: 'Hoàn thành', dot: 'bg-emerald-500', border: 'border-t-emerald-500' },
  ]);
  
  const [addingTaskToCol, setAddingTaskToCol] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<string>('NONE');

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [taskComments, setTaskComments] = useState<{ [key: string]: any[] }>({});

  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(allTasks)); }, [allTasks]);

  const filteredTasks = allTasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    return matchSearch && matchPriority;
  });
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentBoardName, setCurrentBoardName] = useState(board?.name || 'Chi tiết bảng');
  
  const moveTask = (id: string, newStatus: string) => {
    setAllTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === id);
      if (taskIndex === -1) return prev;
      const updatedTask = { ...prev[taskIndex], status: newStatus as Status };
      let newTasks = [...prev];
      newTasks.splice(taskIndex, 1);
      newTasks.push(updatedTask); 
      return newTasks.map((t, i) => ({ ...t, order: i }));
    });
  };

  const handleAddList = () => {
    if (!newListName.trim()) return;
    const newCol = {
      id: `COL_${Date.now()}`,
      label: newListName,
      dot: 'bg-purple-500',
      border: 'border-t-purple-500'
    };
    setColumns([...columns, newCol]);
    setNewListName('');
    setIsAddingList(false);
  };
  
  const addTask = () => {
    if (!newTitle.trim() || !addingTaskToCol) return;
    const newTask: KanbanTask = { 
      id: `task-${Date.now()}`, 
      title: newTitle, 
      priority: newPriority as Priority, 
      status: addingTaskToCol as Status, 
      progress: 0, 
      order: allTasks.length, 
      scope: 'PROJECT', 
      labels: [] 
    };
    setAllTasks(prev => [...prev, newTask]);
    setNewTitle('');
    setNewPriority('NONE');
  };

  const isImageBg = board?.bgType === 'image';
  const bgStyle = isImageBg ? { backgroundImage: `url('${board.bg}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
  const bgClass = !isImageBg && board?.bg ? board.bg : 'bg-slate-50 dark:bg-[#0b1120]';

  return (
    <DndProvider backend={HTML5Backend}>
      {/* SỬA LẠI DÒNG NÀY: Dùng fixed inset-0 và z-[100] để che hoàn toàn Header/Sidebar */}
      <div 
        className={`fixed inset-0 z-[100] flex flex-col overflow-hidden transition-colors font-sans ${bgClass}`}
        style={bgStyle}
      >
        {isImageBg && <div className="absolute inset-0 bg-black/40 z-0 backdrop-blur-[2px]"></div>}

        {/* HEADER */}
        <header className="relative z-10 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 -ml-1.5 rounded-md text-slate-700 hover:bg-black/10 dark:text-slate-300 dark:hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-[1px] h-5 bg-slate-400 dark:bg-slate-600"></div>
            
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-cyan-500" /> 
              {isEditingName ? (
                <input
                  autoFocus
                  value={currentBoardName}
                  onChange={(e) => setCurrentBoardName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="font-bold text-lg text-slate-900 dark:text-white bg-white/50 dark:bg-black/30 border-2 border-cyan-500 rounded px-2 py-0.5 focus:outline-none w-48 sm:w-64 transition-all"
                />
              ) : (
                <h1 
                  onClick={() => setIsEditingName(true)}
                  className="font-bold text-lg text-slate-900 dark:text-white cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
                  title="Nhấn để đổi tên bảng"
                >
                  {currentBoardName}
                </h1>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <div className="flex -space-x-2 mr-1">
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white/50 z-20">TC</div>
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white/50 z-10">NV</div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/20 hover:bg-white/30 text-slate-900 dark:text-white text-[13px] font-semibold transition-all backdrop-blur-sm border border-slate-300/50 dark:border-white/20">
              <Share2 className="w-4 h-4" /> <span>Chia sẻ</span>
            </button>
          </div>
        </header>

        {/* TOOLBAR */}
        <div className="relative z-10 shrink-0 px-5 py-2.5 flex flex-wrap items-center gap-3 bg-white/40 dark:bg-black/20 backdrop-blur-sm border-b border-slate-200/50 dark:border-white/10">
          <div className="relative w-full sm:w-60 group">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
            <input type="text" placeholder="Tìm kiếm thẻ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-1 bg-white/60 dark:bg-[#101204]/60 border border-transparent rounded-md text-[13px] text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-[#151b28] focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-500 dark:placeholder:text-[#8c9bab]" />
          </div>

          <div className="relative w-full sm:w-44 flex-shrink-0">
            <Filter className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300 pointer-events-none" />
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)} 
              className="w-full pl-8 pr-7 py-1 bg-white/60 dark:bg-[#101204]/60 border border-transparent rounded-md text-[13px] text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-[#151b28] focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer transition-all"
            >
              <option value="ALL">Mọi ưu tiên</option>
              <option value="HIGH">Ưu tiên Cao</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="LOW">Ưu tiên Thấp</option>
              <option value="NONE">Không ưu tiên</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300 pointer-events-none" />
          </div>
        </div>

        {/* BOARD CANVAS */}
        <main className={`relative z-10 flex-1 min-h-0 overflow-x-auto overflow-y-hidden flex gap-3.5 px-5 pb-5 pt-4 items-start ${scrollbarClasses}`}>
          {columns.map((col) => (
            <KanbanColumn 
              key={col.id} 
              status={col.id} 
              colConfig={col}
              tasks={filteredTasks.filter(t => t.status === col.id).sort((a, b) => a.order - b.order)} 
              moveTask={moveTask} 
              onSelect={setSelectedTask} 
              taskComments={taskComments}
              
              addingTaskToCol={addingTaskToCol}
              setAddingTaskToCol={setAddingTaskToCol}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              newPriority={newPriority}
              setNewPriority={setNewPriority}
              onSaveTask={addTask}
            />
          ))}

          {/* FORM THÊM DANH SÁCH */}
          <div className="w-[280px] sm:w-[300px] flex-shrink-0 pt-0 h-fit">
            {isAddingList ? (
              <div className="bg-slate-100 dark:bg-[#101204] p-2 rounded-md border border-slate-300 dark:border-[#384148] shadow-md">
                <input 
                  autoFocus 
                  value={newListName} 
                  onChange={(e) => setNewListName(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleAddList()} 
                  placeholder="Nhập tiêu đề danh sách..." 
                  className="w-full px-2.5 py-1.5 text-[13px] bg-white dark:bg-[#22272b] border border-slate-300 dark:border-[#384148] rounded-md focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:text-[#b6c2cf]" 
                />
                <div className="flex items-center gap-1.5 mt-2">
                  <button onClick={handleAddList} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-[13px] font-semibold rounded-md transition-colors">
                    Thêm danh sách
                  </button>
                  <button onClick={() => setIsAddingList(false)} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-[#b6c2cf] transition-colors rounded-md hover:bg-slate-300 dark:hover:bg-[#2a3441]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingList(true)} 
                className="w-full flex items-center gap-2 p-2.5 rounded-md bg-white/50 dark:bg-black/40 text-slate-800 dark:text-white text-[13px] font-semibold hover:bg-white/80 dark:hover:bg-black/60 transition-all backdrop-blur-md"
              >
                <Plus className="w-4 h-4" /> Thêm danh sách khác
              </button>
            )}
          </div>
        </main>

        {/* MODAL CHI TIẾT THẺ KHI ĐƯỢC CLICK */}
        <AnimatePresence>
          {selectedTask && (
            <TaskDetailModal 
              task={selectedTask} 
              allTasks={allTasks} 
              onClose={() => setSelectedTask(null)} 
              onUpdate={(updated: any) => { setAllTasks(prev => prev.map(t => t.id === updated.id ? updated : t)); setSelectedTask(updated); }} 
              onMove={moveTask} 
              taskComments={taskComments[selectedTask.id] || []} 
              onAddComment={(text: string) => setTaskComments(prev => ({ ...prev, [selectedTask.id]: [{ author: 'Bạn', text, time: 'Vừa xong', avatar: 'ME' }, ...(prev[selectedTask.id] || [])] }))}
            />
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
}