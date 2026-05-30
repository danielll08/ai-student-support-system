import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, GripVertical, ArrowRight } from 'lucide-react';
import { mockTasks } from '@/data/mockData';

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type Status = 'TODO' | 'DOING' | 'DONE';

interface KanbanTask {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  priority: Priority;
  status: Status;
  progress: number;
}

interface DragItem {
  id: string;
  status: Status;
}

const initialTasks: KanbanTask[] = mockTasks.map((item) => ({
  id: item.id,
  title: item.title,
  subject: item.subject,
  deadline: new Date(item.deadline).toLocaleDateString('vi-VN'),
  priority: item.priority.toUpperCase() as Priority,
  status: item.status.toUpperCase() as Status,
  progress: item.progress,
}));

const priorityConfig: Record<Priority, { label: string; text: string; bg: string }> = {
  HIGH: { label: 'HIGH', text: 'text-red-400', bg: 'bg-red-500/15' },
  MEDIUM: { label: 'MEDIUM', text: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  LOW: { label: 'LOW', text: 'text-green-400', bg: 'bg-green-500/15' },
};

const columnConfig: Record<Status, { label: string; count_color: string; bar: string; header: string }> = {
  TODO: { label: 'TODO', count_color: 'text-gray-400', bar: 'bg-gray-500', header: 'bg-gray-500/10' },
  DOING: { label: 'DOING', count_color: 'text-blue-400', bar: 'bg-gradient-to-r from-blue-500 to-purple-500', header: 'bg-blue-500/10' },
  DONE: { label: 'DONE', count_color: 'text-green-400', bar: 'bg-gradient-to-r from-green-500 to-emerald-400', header: 'bg-green-500/10' },
};

const nextStatus: Record<Status, Status> = { TODO: 'DOING', DOING: 'DONE', DONE: 'TODO' };

function KanbanTaskCard({ task, moveTask }: { task: KanbanTask; moveTask: (id: string, status: Status) => void }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status } as DragItem,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [task.id, task.status]);

  const pc = priorityConfig[task.priority];

  return (
    <motion.div
      ref={dragRef}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white dark:bg-[#1a2030] border border-slate-200 dark:border-[#252d3d] hover:border-slate-300 dark:hover:border-[#3a4455] rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all group hover:shadow-lg hover:shadow-black/20 ${isDragging ? 'opacity-50 scale-95' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${pc.bg} ${pc.text}`}>
          {pc.label}
        </span>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3.5 h-3.5 text-slate-600 dark:text-gray-600" />
          <button
            onClick={() => moveTask(task.id, nextStatus[task.status])}
            className="w-5 h-5 rounded-md bg-slate-50 dark:bg-[#252d3d] hover:bg-slate-100 dark:hover:bg-blue-500/20 flex items-center justify-center text-slate-700 dark:text-gray-500 hover:text-blue-400 transition-all"
            title={`Chuyển → ${nextStatus[task.status]}`}
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
      <p className={`text-xs font-medium leading-relaxed mb-2 ${task.status === 'DONE' ? 'line-through text-slate-500' : 'text-slate-950 dark:text-gray-200'}`}>
        {task.title}
      </p>
      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-gray-400 mb-2">
        <span className="truncate">{task.subject}</span>
        <span>{task.deadline}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-200 dark:bg-[#252d3d] rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${pc.bg.replace('/15', '')}`} style={{ width: `${task.progress}%` }} />
        </div>
        <span className="text-[10px] text-slate-500 dark:text-gray-400 flex-shrink-0">{task.progress}%</span>
      </div>
    </motion.div>
  );
}

function KanbanColumn({ status, tasks, moveTask }: { status: Status; tasks: KanbanTask[]; moveTask: (id: string, status: Status) => void }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: DragItem) => moveTask(item.id, status),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [status]);

  const cfg = columnConfig[status];

    return (
      <div ref={dropRef} className={`flex-1 flex flex-col min-w-0 rounded-2xl overflow-hidden border transition ${isOver ? 'border-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.08)] bg-blue-50 dark:bg-[#0b1220]' : 'border-slate-200 dark:border-[#252d3d]'} bg-slate-50 dark:bg-[#171c28]`}>
      <div className={`px-4 py-3 border-b border-slate-200 dark:border-[#252d3d] ${cfg.header}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cfg.bar.split(' ')[0]}`} />
            <span className={`text-xs font-bold ${cfg.count_color} dark:text-white`}>{cfg.label}</span>
            <span className="text-xs text-slate-500 dark:text-gray-400 ml-1">{tasks.length} task</span>
          </div>
          <button className="text-gray-500 hover:text-gray-300 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="h-0.5 bg-slate-200 dark:bg-[#252d3d] rounded-full mt-2 overflow-hidden">
          <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${tasks.length > 0 ? 100 : 0}%` }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        <AnimatePresence>
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} moveTask={moveTask} />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500 dark:text-gray-400">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#252d3d] flex items-center justify-center mb-2">
              <Plus className="w-4 h-4" />
            </div>
            <p className="text-xs">Chưa có task</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);

  const moveTask = (id: string, status: Status) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
              progress: status === 'DONE' ? 100 : task.progress < 20 ? 20 : task.progress,
            }
          : task
      )
    );
  };

  const cols: Status[] = ['TODO', 'DOING', 'DONE'];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-white">Kanban Board</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Kéo thả công việc để cập nhật trạng thái và theo dõi workflow realtime.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            Tạo task mới
          </button>
        </div>
        <div className="flex gap-4 flex-1 min-h-0">
          {cols.map((colStatus) => (
            <KanbanColumn key={colStatus} status={colStatus} tasks={tasks.filter((task) => task.status === colStatus)} moveTask={moveTask} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
