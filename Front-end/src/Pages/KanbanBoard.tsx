import { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, GripVertical, ArrowRight, X, Check, Trash2, PlusCircle, List, CalendarDays, Clock3, Repeat, Bell, ChevronDown, Tag, Users, Paperclip } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format, differenceInHours, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, addYears, subYears, isSameMonth, isSameDay, isToday } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { mockTasks } from '@/data/mockData';

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type Status = 'TODO' | 'DOING' | 'DONE';

type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};

type Checklist = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

interface KanbanTask {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  progress: number;
  order: number;
  description?: string;
  labels?: string[];
  assignees?: string[];
  checklists?: Checklist[];
  startDate?: Date | null;
  dueDate?: Date | null;
  recurring?: string | null;
  reminder?: string | null;
}

interface DragItem {
  id: string;
  status: Status;
}

const defaultKanbanTasks: KanbanTask[] = [
  {
    id: 'task-1',
    title: 'Lập kế hoạch học tập tuần',
    priority: 'HIGH',
    status: 'TODO',
    progress: 15,
    order: 0,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    description: 'Phân bổ thời gian học, deadline bài tập và ôn thi.',
    labels: ['Planning', 'Study'],
  },
  {
    id: 'task-2',
    title: 'Hoàn thành project React',
    priority: 'MEDIUM',
    status: 'DOING',
    progress: 55,
    order: 0,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
    description: 'Xây dựng giao diện và hoàn tất chức năng Kanban board.',
    labels: ['Project'],
  },
  {
    id: 'task-3',
    title: 'Review và nộp báo cáo CSDL',
    priority: 'LOW',
    status: 'DONE',
    progress: 100,
    order: 0,
    description: 'Đã hoàn thành và gửi báo cáo cho giảng viên.',
    labels: ['Report'],
  },
];

const sourceTasks = mockTasks.length > 0 ? mockTasks : defaultKanbanTasks;
const initialTasks: KanbanTask[] = sourceTasks.map((item, index) => ({
  id: item.id,
  title: item.title,
  priority: ((item.priority || 'medium') as string).toUpperCase() as Priority,
  status: ((item.status || 'todo') as string).toUpperCase() as Status,
  progress: item.progress || 0,
  order: typeof item.order === 'number' ? item.order : index,
  description: item.description,
  labels: item.labels,
  assignees: item.assignees,
  startDate: item.startDate ?? null,
  dueDate: item.dueDate ?? null,
  recurring: item.recurring ?? null,
  reminder: item.reminder ?? null,
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

function TrelloCalendar({
  displayMonth,
  selectedDate,
  onSelectDate,
  onChangeMonth,
}: {
  displayMonth: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
}) {
  const monthStart = startOfMonth(displayMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days: Date[] = [];

  for (let day = calendarStart; day <= calendarEnd; day = addDays(day, 1)) {
    days.push(day);
  }

  return (
    <div className="max-h-[17rem] rounded-3xl border border-slate-800 bg-slate-950 text-slate-100 shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeMonth(subYears(displayMonth, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
            aria-label="Previous year"
          >
            <span className="text-base">«</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(subMonths(displayMonth, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
            aria-label="Previous month"
          >
            <span className="text-base">‹</span>
          </button>
        </div>

        <div className="text-xs font-semibold">{format(displayMonth, 'MMMM yyyy')}</div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeMonth(addMonths(displayMonth, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
            aria-label="Next month"
          >
            <span className="text-base">›</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(addYears(displayMonth, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
            aria-label="Next year"
          >
            <span className="text-base">»</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-900 px-2 py-1 text-[9px] uppercase tracking-[0.3em] text-slate-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((weekday) => (
          <div key={weekday} className="text-center font-semibold">
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-1 bg-slate-950">
        {days.map((day) => {
          const isOutside = !isSameMonth(day, displayMonth);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isTodayDate = isToday(day);
          const baseClasses =
            'flex h-8 items-center justify-center rounded-2xl text-sm font-semibold transition';
          const stateClasses = isSelected
            ? 'bg-blue-600 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.35)]'
            : isTodayDate
            ? 'border border-slate-600 text-white'
            : isOutside
            ? 'text-slate-500'
            : 'text-slate-100 hover:bg-slate-900 hover:text-white';

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => {
                onSelectDate(day);
                if (isOutside) onChangeMonth(day);
              }}
              className={`${baseClasses} ${stateClasses}`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const nextStatus: Record<Status, Status> = { TODO: 'DOING', DOING: 'DONE', DONE: 'TODO' };

function KanbanTaskCard({ task, moveTask, onSelect }: { task: KanbanTask; moveTask: (id: string, status: Status, beforeId?: string) => void; onSelect: (task: KanbanTask) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [, dropRef] = useDrop(() => ({
    accept: 'TASK',
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return;
      if (item.id === task.id) return;
      if (item.status === task.status && task.id === item.id) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (item.status === task.status && hoverClientY < hoverMiddleY) return;

      moveTask(item.id, task.status, task.id);
      item.status = task.status;
    },
  }), [task.id, task.status, moveTask]);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status } as DragItem,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [task.id, task.status]);

  dragRef(dropRef(ref));

  const pc = priorityConfig[task.priority];

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onSelect(task)}
      className={`bg-white dark:bg-[#1a2030] border border-slate-200 dark:border-[#252d3d] hover:border-slate-300 dark:hover:border-[#3a4455] rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all group hover:shadow-lg hover:shadow-black/20 ${isDragging ? 'opacity-50 scale-95' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${pc.bg} ${pc.text}`}>
          {pc.label}
        </span>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3.5 h-3.5 text-slate-600 dark:text-gray-600" />
          <button
            onClick={(e) => { e.stopPropagation(); moveTask(task.id, nextStatus[task.status]); }}
            className="w-5 h-5 rounded-md bg-slate-50 dark:bg-[#252d3d] hover:bg-slate-100 dark:hover:bg-blue-500/20 flex items-center justify-center text-slate-700 dark:text-gray-500 hover:text-blue-400 transition-all"
            title={`Chuyển → ${nextStatus[task.status]}`}
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
      <p className={`text-sm font-medium leading-relaxed mb-2 ${task.status === 'DONE' ? 'line-through text-slate-500' : 'text-slate-950 dark:text-gray-200'}`}>
        {task.title}
      </p>
      <div className="flex items-center justify-between gap-2 mb-3 text-xs text-slate-500 dark:text-gray-400">
        {task.dueDate ? <span>Due {format(task.dueDate, 'MMM d')}</span> : <span>No due date</span>}
        <span>{task.progress}%</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-200 dark:bg-[#252d3d] rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${pc.bg.replace('/15', '')}`} style={{ width: `${task.progress}%` }} />
        </div>
      </div>
    </motion.div>
  );
}

function KanbanColumn({ status, tasks, moveTask, onAdd, onSelect }: { status: Status; tasks: KanbanTask[]; moveTask: (id: string, status: Status, beforeId?: string) => void; onAdd: (status: Status) => void; onSelect: (task: KanbanTask) => void }) {
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
        </div>
        <div className="h-0.5 bg-slate-200 dark:bg-[#252d3d] rounded-full mt-2 overflow-hidden">
          <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${tasks.length > 0 ? 100 : 0}%` }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        <AnimatePresence>
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} moveTask={moveTask} onSelect={onSelect} />
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
      <div className="px-3 pb-3 pt-2 border-t border-slate-200 dark:border-[#252d3d] bg-slate-100 dark:bg-[#141a28]">
        <button
          onClick={() => onAdd(status)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0d1117] text-slate-700 dark:text-gray-300 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#1f2738] transition"
        >
          <Plus className="w-4 h-4" />
          Add a card
        </button>
      </div>
    </div>
  );
}

const STORAGE_KEY = 'kanban-board-tasks-v1';

const loadStoredTasks = () => {
  if (typeof window === 'undefined') return initialTasks;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialTasks;

  try {
    const parsed = JSON.parse(stored) as KanbanTask[];
    return parsed.map((task, index) => ({
      ...task,
      order: typeof task.order === 'number' ? task.order : index,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      startDate: task.startDate ? new Date(task.startDate) : null,
    }));
  } catch {
    return initialTasks;
  }
};

export function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>(loadStoredTasks);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Status>('TODO');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('Checklist');
  const [addingItemFor, setAddingItemFor] = useState<string | null>(null);
  const [newChecklistItemText, setNewChecklistItemText] = useState('');
  const [showDatesPopup, setShowDatesPopup] = useState(false);
  const [startEnabled, setStartEnabled] = useState(false);
  const [startDateValue, setStartDateValue] = useState<Date | null>(null);
  const [dueEnabled, setDueEnabled] = useState(false);
  const [dueDateValue, setDueDateValue] = useState<Date | null>(null);
  const [calendarSelection, setCalendarSelection] = useState<'start' | 'due'>('due');
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [recurringValue, setRecurringValue] = useState<string>('Never');
  const [reminderValue, setReminderValue] = useState<string>('1 Day before');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks, (key, value) => (value instanceof Date ? value.toISOString() : value))
    );
  }, [tasks]);

  const moveTask = (id: string, status: Status, beforeId?: string) => {
    setTasks((prev) => {
      const taskToMove = prev.find((task) => task.id === id);
      if (!taskToMove) return prev;

      const updatedTask = {
        ...taskToMove,
        status,
        progress: status === 'DONE' ? 100 : taskToMove.progress < 20 ? 20 : taskToMove.progress,
      };

      const destinationTasks = prev
        .filter((task) => task.status === status && task.id !== id)
        .sort((a, b) => a.order - b.order);

      const rawIndex = beforeId ? destinationTasks.findIndex((task) => task.id === beforeId) : destinationTasks.length;
      const insertIndex = rawIndex >= 0 ? rawIndex : destinationTasks.length;
      const reordered = [
        ...destinationTasks.slice(0, insertIndex),
        updatedTask,
        ...destinationTasks.slice(insertIndex),
      ].map((task, index) => ({ ...task, order: index }));

      const otherTasks = prev.filter((task) => task.status !== status && task.id !== id);
      return [...otherTasks, ...reordered];
    });
  };
  const openAddModal = (status: Status) => {
    setNewTaskStatus(status);
    setShowAddModal(true);
  };

  const addTask = () => {
    if (!newTitle.trim()) return;
    const nextOrder = tasks.filter((task) => task.status === newTaskStatus).length;
    const newTask: KanbanTask = {
      id: `new-${Date.now()}`,
      title: newTitle,
      priority: newPriority,
      status: newTaskStatus,
      progress: newTaskStatus === 'DONE' ? 100 : 0,
      order: nextOrder,
      description: '',
      labels: [],
      assignees: [],
      startDate: null,
      dueDate: null,
      recurring: null,
      reminder: null,
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setNewPriority('MEDIUM');
    setShowAddModal(false);
  };

  const updateTask = (updated: KanbanTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTask(updated);
  };

  const updateSelectedTaskField = <K extends keyof KanbanTask>(field: K, value: KanbanTask[K]) => {
    if (!selectedTask) return;
    setSelectedTask({ ...selectedTask, [field]: value });
  };

  const saveSelectedTask = () => {
    if (!selectedTask) return;
    updateTask(selectedTask);
  };

  const addChecklistToTask = (taskId: string, title: string) => {
    const id = `chk-${Date.now()}`;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, checklists: [...(t.checklists || []), { id, title, items: [] }] }
          : t
      )
    );
    const updated = tasks.find((t) => t.id === taskId);
    if (updated) {
      const newUpdated = { ...updated, checklists: [...(updated.checklists || []), { id, title, items: [] }] };
      setSelectedTask(newUpdated);
    }
  };

  const addChecklistItem = (taskId: string, checklistId: string, text: string) => {
    const item: ChecklistItem = { id: `it-${Date.now()}`, text, checked: false };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const checklists = (t.checklists || []).map((c) => (c.id === checklistId ? { ...c, items: [...c.items, item] } : c));
        const allItems = checklists.flatMap((c) => c.items);
        const checkedCount = allItems.filter((i) => i.checked).length;
        const progress = allItems.length === 0 ? 0 : Math.round((checkedCount / allItems.length) * 100);
        return { ...t, checklists, progress };
      })
    );
    const updated = tasks.find((t) => t.id === taskId);
    if (updated) {
      const newChecklists = (updated.checklists || []).map((c) => (c.id === checklistId ? { ...c, items: [...c.items, item] } : c));
      const allItems = newChecklists.flatMap((c) => c.items);
      const checkedCount = allItems.filter((i) => i.checked).length;
      const progress = allItems.length === 0 ? 0 : Math.round((checkedCount / allItems.length) * 100);
      setSelectedTask({ ...updated, checklists: newChecklists, progress });
    }
  };

  const toggleChecklistItem = (taskId: string, checklistId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const checklists = (t.checklists || []).map((c) => {
          if (c.id !== checklistId) return c;
          const items = c.items.map((it) => (it.id === itemId ? { ...it, checked: !it.checked } : it));
          return { ...c, items };
        });
        const allItems = checklists.flatMap((c) => c.items);
        const checkedCount = allItems.filter((i) => i.checked).length;
        const progress = allItems.length === 0 ? 0 : Math.round((checkedCount / allItems.length) * 100);
        return { ...t, checklists, progress };
      })
    );
    const updated = tasks.find((t) => t.id === taskId);
    if (updated) {
      const newChecklists = (updated.checklists || []).map((c) => {
        if (c.id !== checklistId) return c;
        const items = c.items.map((it) => (it.id === itemId ? { ...it, checked: !it.checked } : it));
        return { ...c, items };
      });
      const allItems = newChecklists.flatMap((c) => c.items);
      const checkedCount = allItems.filter((i) => i.checked).length;
      const progress = allItems.length === 0 ? 0 : Math.round((checkedCount / allItems.length) * 100);
      setSelectedTask({ ...updated, checklists: newChecklists, progress });
    }
  };

  const deleteChecklist = (taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const checklists = (t.checklists || []).filter((c) => c.id !== checklistId);
        const allItems = checklists.flatMap((c) => c.items);
        const checkedCount = allItems.filter((i) => i.checked).length;
        const progress = allItems.length === 0 ? 0 : Math.round((checkedCount / allItems.length) * 100);
        return { ...t, checklists, progress };
      })
    );
    const updated = tasks.find((t) => t.id === taskId);
    if (updated) {
      const newChecklists = (updated.checklists || []).filter((c) => c.id !== checklistId);
      const allItems = newChecklists.flatMap((c) => c.items);
      const checkedCount = allItems.filter((i) => i.checked).length;
      const progress = allItems.length === 0 ? 0 : Math.round((checkedCount / allItems.length) * 100);
      setSelectedTask({ ...updated, checklists: newChecklists, progress });
    }
  };

  const openDatesPopup = () => {
    if (!selectedTask) return;
    setStartEnabled(!!selectedTask.startDate);
    setStartDateValue(selectedTask.startDate || null);
    setDueEnabled(true);
    setDueDateValue(selectedTask.dueDate || null);
    setCalendarSelection(selectedTask.startDate ? 'start' : 'due');
    setCalendarMonth(selectedTask.startDate || selectedTask.dueDate || new Date());
    setRecurringValue(selectedTask.recurring || 'Never');
    setReminderValue(selectedTask.reminder || '1 Day before');
    setShowDatesPopup(true);
  };

  const saveDatesToTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              startDate: startEnabled ? startDateValue : null,
              dueDate: dueEnabled ? dueDateValue : null,
              recurring: recurringValue,
              reminder: reminderValue,
            }
          : t
      )
    );
    const updated = tasks.find((t) => t.id === taskId);
    if (updated) {
      const newUpdated = {
        ...updated,
        startDate: startEnabled ? startDateValue : null,
        dueDate: dueEnabled ? dueDateValue : null,
        recurring: recurringValue,
        reminder: reminderValue,
      };
      setSelectedTask(newUpdated);
    }
    setShowDatesPopup(false);
  };

  const removeDatesFromTask = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, startDate: null, dueDate: null, recurring: null, reminder: null } : t)));
    const updated = tasks.find((t) => t.id === taskId);
    if (updated) setSelectedTask({ ...updated, startDate: null, dueDate: null, recurring: null, reminder: null });
    setShowDatesPopup(false);
  };

  const isDueSoon = selectedTask?.dueDate
    ? differenceInHours(selectedTask.dueDate, new Date()) <= 24 && differenceInHours(selectedTask.dueDate, new Date()) >= 0
    : false;

  const cols: Status[] = ['TODO', 'DOING', 'DONE'];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-white">Kanban Board</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Kéo thả công việc để cập nhật trạng thái và theo dõi workflow realtime.</p>
          </div>
          <div className="text-right text-xs text-slate-500 dark:text-gray-400">Nhấn vào task để mở modal chi tiết, hoặc dùng Add a card ở dưới mỗi cột.</div>
        </div>
        <div className="flex-1 min-h-0 flex gap-4">
          <div className="flex gap-4 flex-1 min-h-0">
            {cols.map((colStatus) => (
              <KanbanColumn
                key={colStatus}
                status={colStatus}
                tasks={tasks
                  .filter((task) => task.status === colStatus)
                  .sort((a, b) => a.order - b.order)}
                moveTask={moveTask}
                onAdd={openAddModal}
                onSelect={(task) => setSelectedTask(task)}
              />
            ))}
          </div>

          <AnimatePresence>
            {selectedTask && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40 backdrop-blur-sm"
                onClick={(e) => { if (e.target === e.currentTarget) setSelectedTask(null); }}
              >
                <motion.div initial={{ scale: 0.98, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 8 }} className="w-full max-w-4xl bg-white dark:bg-[#0f1720] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-[#252d3d]">
                  <div className="flex">
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{selectedTask.title}</h2>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">{selectedTask.priority}</p>
                        </div>
                        <button onClick={() => setSelectedTask(null)} className="text-slate-500 hover:text-white p-2 rounded-full">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="relative">
                        <div className="flex flex-wrap gap-2 mt-4">
                          <button className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition">
                            <Plus className="w-4 h-4" />
                            Add
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition">
                            <Tag className="w-4 h-4" />
                            Labels
                          </button>
                          <button onClick={() => openDatesPopup()} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition">
                            <CalendarDays className="w-4 h-4" />
                            Dates
                          </button>
                          <button onClick={() => setShowAddChecklist(true)} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition">
                            <Check className="w-4 h-4" />
                            Checklist
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition">
                            <Users className="w-4 h-4" />
                            Members
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition">
                            <Paperclip className="w-4 h-4" />
                            Attachment
                          </button>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-slate-200">
                            <CalendarDays className="w-4 h-4" />
                            <span>{selectedTask.dueDate ? format(selectedTask.dueDate, 'MMM d, p') : 'No due date'}</span>
                          </div>
                          {selectedTask.dueDate && isDueSoon && (
                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-2 py-1 text-[11px] font-semibold text-slate-950">
                              Due soon
                              <ChevronDown className="w-3 h-3" />
                            </div>
                          )}
                        </div>

                        {showAddChecklist && (
                          <div className="absolute left-0 top-14 z-40 bg-white dark:bg-[#0b1116] border border-slate-200 dark:border-[#252d3d] rounded-md p-4 w-80 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-sm font-medium"><List className="w-4 h-4 text-slate-500" />Add checklist</div>
                              <button onClick={() => setShowAddChecklist(false)} className="text-xs px-2 py-1 rounded-md">X</button>
                            </div>
                            <input value={newChecklistTitle} onChange={(e) => setNewChecklistTitle(e.target.value)} className="w-full mb-3 rounded-md border px-2 py-1 text-sm bg-slate-50 dark:bg-[#0d1117]" />
                            <div className="flex gap-2">
                              <button onClick={() => { addChecklistToTask(selectedTask.id, newChecklistTitle || 'Checklist'); setShowAddChecklist(false); setNewChecklistTitle('Checklist'); }} className="flex-1 bg-blue-600 text-white rounded-md py-1 text-sm flex items-center justify-center gap-2"><PlusCircle className="w-4 h-4" />Add</button>
                              <button onClick={() => setShowAddChecklist(false)} className="flex-1 border rounded-md py-1 text-sm">Cancel</button>
                            </div>
                          </div>
                        )}

                        {showDatesPopup && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto bg-black/30 p-6"
                            onClick={(e) => { if (e.target === e.currentTarget) setShowDatesPopup(false); }}
                          >
                            <section className="w-full max-w-[520px] h-[calc(100vh-5rem)] rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 shadow-2xl shadow-black/60 overflow-hidden">
                              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                                <div>
                                  <h2 className="text-base font-semibold">Dates</h2>
                                  <p className="text-xs text-slate-500">Set start date, due date, reminders, and recurring options.</p>
                                </div>
                                <button onClick={() => setShowDatesPopup(false)} className="rounded-full p-2 text-slate-300 hover:bg-slate-900 transition">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <form className="flex h-full flex-col" onSubmit={(e) => { e.preventDefault(); if (selectedTask) saveDatesToTask(selectedTask.id); }}>
                                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-5 pb-20">
                                  <div>
                                    <TrelloCalendar
                                      displayMonth={calendarMonth}
                                      selectedDate={calendarSelection === 'start' ? startDateValue : dueDateValue}
                                      onSelectDate={(date) => {
                                        if (calendarSelection === 'start') {
                                          setStartEnabled(true);
                                          setStartDateValue(date);
                                        } else {
                                          setDueEnabled(true);
                                          setDueDateValue(date);
                                        }
                                      }}
                                      onChangeMonth={(date) => setCalendarMonth(startOfMonth(date))}
                                    />
                                  </div>

                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between gap-3">
                                        <div>
                                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Start date</p>
                                          <p className="mt-1 text-sm text-slate-300">Set when work should begin.</p>
                                        </div>
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                          <input
                                            type="checkbox"
                                            checked={startEnabled}
                                            onChange={(e) => {
                                              setStartEnabled(e.target.checked);
                                              if (e.target.checked) setCalendarSelection('start');
                                              else if (calendarSelection === 'start') setCalendarSelection('due');
                                            }}
                                            className="h-4 w-4 rounded border-slate-700 bg-slate-700 text-blue-500"
                                          />
                                          Enabled
                                        </label>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setStartEnabled(true);
                                          setCalendarSelection('start');
                                        }}
                                        className={`w-full rounded-2xl border px-3 py-2.5 text-left text-sm ${calendarSelection === 'start' ? 'border-blue-500 bg-slate-950 text-white shadow' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white'}`}
                                      >
                                        <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Start date</div>
                                        <div className="mt-1 text-sm font-medium text-white">
                                          {startDateValue ? format(startDateValue, 'M/d/yyyy') : 'No start date set'}
                                        </div>
                                      </button>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between gap-2">
                                        <div>
                                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Due date</p>
                                          <p className="mt-1 text-sm text-slate-300">Choose a deadline and time.</p>
                                        </div>
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                          <input
                                            type="checkbox"
                                            checked={dueEnabled}
                                            onChange={(e) => {
                                              setDueEnabled(e.target.checked);
                                              if (e.target.checked) setCalendarSelection('due');
                                            }}
                                            className="h-4 w-4 rounded border-slate-700 bg-slate-700 text-blue-500"
                                          />
                                          Enabled
                                        </label>
                                      </div>
                                      <div className="grid gap-2 md:grid-cols-[1.4fr_0.6fr]">
                                        <button
                                          type="button"
                                          onClick={() => setCalendarSelection('due')}
                                          className={`rounded-2xl border px-3 py-2.5 text-left text-sm ${calendarSelection === 'due' ? 'border-blue-500 bg-slate-950 text-white shadow' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white'}`}
                                        >
                                          <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Due date</div>
                                          <div className="mt-1 text-sm font-medium text-white">
                                            {dueDateValue ? format(dueDateValue, 'M/d/yyyy') : 'No due date set'}
                                          </div>
                                        </button>
                                        <select
                                          value={dueDateValue ? format(dueDateValue, 'p') : '12:00 AM'}
                                          onChange={(e) => {
                                            if (!dueEnabled) return;
                                            const [time, meridiem] = e.target.value.split(' ');
                                            const [hour, minute] = time.split(':').map(Number);
                                            const date = dueDateValue || new Date();
                                            const adjusted = new Date(date);
                                            const hour24 = meridiem === 'PM' && hour !== 12 ? hour + 12 : meridiem === 'AM' && hour === 12 ? 0 : hour;
                                            adjusted.setHours(hour24, minute, 0, 0);
                                            setDueDateValue(adjusted);
                                          }}
                                          disabled={!dueEnabled}
                                          className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                        >
                                          {['12:00 AM', '6:00 AM', '12:00 PM', '6:00 PM'].map((timeValue) => (
                                            <option key={timeValue} value={timeValue}>{timeValue}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recurring</p>
                                      <select
                                        value={recurringValue}
                                        onChange={(e) => setRecurringValue(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                      >
                                        <option>Never</option>
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                      </select>
                                    </div>

                                    <div className="space-y-3">
                                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Set due date reminder</p>
                                      <select
                                        value={reminderValue}
                                        onChange={(e) => setReminderValue(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                      >
                                        <option>1 Day before</option>
                                        <option>1 Hour before</option>
                                        <option>At time of due date</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="sticky bottom-0 z-20 bg-slate-950 px-4 pb-4 pt-4">
                                  <p className="text-xs text-slate-500 mb-3">Reminders will be sent to all members and watchers of this card.</p>

                                  <div className="grid gap-3">
                                    <button
                                      type="submit"
                                      className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => selectedTask && removeDatesFromTask(selectedTask.id)}
                                      className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-3 text-sm text-slate-300 hover:bg-slate-800 transition"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </section>
                          </motion.div>
                        )}

                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">Description</div>
                            <button onClick={saveSelectedTask} className="text-xs rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                              Save description
                            </button>
                          </div>
                          <textarea
                            value={selectedTask.description || ''}
                            onChange={(e) => updateSelectedTaskField('description', e.target.value)}
                            placeholder="Add a more detailed description..."
                            className="w-full min-h-[120px] bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#252d3d] rounded-lg p-3 text-sm text-slate-700 dark:text-gray-300"
                          />
                        </div>

                        {/* Checklist list */}
                        <div className="mt-6">
                          {(selectedTask.checklists || []).map((c) => {
                            const total = c.items.length;
                            const checked = c.items.filter((it) => it.checked).length;
                            const pct = total === 0 ? 0 : Math.round((checked / total) * 100);
                            return (
                              <div key={c.id} className="mb-4 bg-transparent">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <List className="w-4 h-4 text-slate-400" />
                                    <div className="text-sm font-medium">{c.title}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-xs text-slate-500">{pct}%</div>
                                    <button onClick={() => deleteChecklist(selectedTask.id, c.id)} className="text-xs px-2 py-1 rounded-md border"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-[#252d3d] rounded-full mb-3 overflow-hidden">
                                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                                </div>

                                <div className="space-y-2">
                                  {c.items.map((it) => (
                                    <div key={it.id} className="flex items-center gap-3 text-sm">
                                      <button onClick={() => toggleChecklistItem(selectedTask.id, c.id, it.id)} className={`w-5 h-5 rounded-sm border flex items-center justify-center ${it.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-transparent border-slate-300'}`}>
                                        {it.checked ? <Check className="w-3 h-3" /> : null}
                                      </button>
                                      <span className={`text-sm ${it.checked ? 'line-through text-slate-500' : ''}`}>{it.text}</span>
                                    </div>
                                  ))}

                                  {addingItemFor === c.id ? (
                                    <div className="mt-2 flex gap-2">
                                      <input value={newChecklistItemText} onChange={(e) => setNewChecklistItemText(e.target.value)} className="flex-1 rounded-md border px-2 py-1 bg-slate-50 dark:bg-[#0d1117]" />
                                      <button onClick={() => { if (newChecklistItemText.trim()) { addChecklistItem(selectedTask.id, c.id, newChecklistItemText.trim()); setNewChecklistItemText(''); setAddingItemFor(null); } }} className="px-3 py-1 rounded-md bg-blue-600 text-white">Add</button>
                                      <button onClick={() => { setAddingItemFor(null); setNewChecklistItemText(''); }} className="px-3 py-1 rounded-md border">Cancel</button>
                                    </div>
                                  ) : (
                                    <button onClick={() => setAddingItemFor(c.id)} className="mt-2 px-3 py-1 rounded-md border text-sm">Add an item</button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="w-96 border-l border-slate-200 dark:border-[#252d3d] bg-slate-50 dark:bg-[#0b1116] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">Comments and activity</div>
                        <button className="text-xs px-2 py-1 rounded-md border">Show details</button>
                      </div>
                      <div className="mb-3">
                        <input placeholder="Write a comment..." className="w-full bg-transparent border border-slate-200 dark:border-[#252d3d] rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-gray-300" />
                      </div>
                      <div className="text-sm text-slate-600 dark:text-gray-400">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white">KT</div>
                          <div>
                            <div className="font-medium">Kiệt Tuấn added this card to To Do</div>
                            <a className="text-xs text-blue-500">a few seconds ago</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-[#252d3d] rounded-2xl p-6 w-full max-w-md shadow-2xl"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950 dark:text-white">Tạo task mới</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400">Trạng thái: {newTaskStatus}</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-500 dark:text-gray-400 hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-gray-400 mb-1.5 block">Tiêu đề *</label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Nhập tiêu đề task..."
                      className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 text-sm text-slate-950 dark:text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-gray-400 mb-1.5 block">Ưu tiên</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as Priority)}
                      className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 text-sm text-slate-950 dark:text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                    >
                      <option value="HIGH">Cao</option>
                      <option value="MEDIUM">Trung bình</option>
                      <option value="LOW">Thấp</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-[#252d3d] text-sm text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#252d3d] transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={addTask}
                    disabled={!newTitle.trim()}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Thêm task
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
}
