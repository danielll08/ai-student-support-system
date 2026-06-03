import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, CalendarDays, ChevronDown, List as ListIcon, Trash2, Check, Users, Paperclip, Tag, ArrowRight, Activity } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, addYears, subYears, isSameMonth, isSameDay, isToday, differenceInHours } from 'date-fns';

// --- Shared Types ---
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'TODO' | 'DOING' | 'DONE';

export type ChecklistItem = { id: string; text: string; checked: boolean; };
export type Checklist = { id: string; title: string; items: ChecklistItem[]; };

export interface KanbanTask {
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
  scope?: 'PERSONAL' | 'PROJECT';
}

interface TaskDetailModalProps {
  task: KanbanTask;
  allTasks: KanbanTask[];
  onClose: () => void;
  onUpdate: (updatedTask: KanbanTask) => void;
  onMove: (id: string, newStatus: Status, newPosition?: number) => void; 
  taskComments: { author: string; text: string; time: string; avatar: string }[];
  onAddComment: (text: string) => void;
}

// --- Trello-Style Calendar Component ---
function TrelloCalendar({ displayMonth, selectedDate, onSelectDate, onChangeMonth }: any) {
  const monthStart = startOfMonth(displayMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days: Date[] = [];
  for (let day = calendarStart; day <= calendarEnd; day = addDays(day, 1)) days.push(day);

  return (
    <div className="bg-white dark:bg-[#282e33] text-slate-900 dark:text-[#b6c2cf] select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-[#384148]">
        <div className="flex gap-1">
          <button type="button" onClick={() => onChangeMonth(subYears(displayMonth, 1))} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#a6c5e229] text-slate-500 dark:text-[#9fadbc] transition-colors">«</button>
          <button type="button" onClick={() => onChangeMonth(subMonths(displayMonth, 1))} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#a6c5e229] text-slate-500 dark:text-[#9fadbc] transition-colors">‹</button>
        </div>
        <div className="text-sm font-semibold">{format(displayMonth, 'MMMM yyyy')}</div>
        <div className="flex gap-1">
          <button type="button" onClick={() => onChangeMonth(addMonths(displayMonth, 1))} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#a6c5e229] text-slate-500 dark:text-[#9fadbc] transition-colors">›</button>
          <button type="button" onClick={() => onChangeMonth(addYears(displayMonth, 1))} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#a6c5e229] text-slate-500 dark:text-[#9fadbc] transition-colors">»</button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1 text-center text-xs font-bold text-slate-500 dark:text-[#9fadbc]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => <div key={w}>{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isOutside = !isSameMonth(day, displayMonth);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isTodayDate = isToday(day);
          
          let stateClasses = 'text-slate-700 dark:text-[#b6c2cf] hover:bg-slate-100 dark:hover:bg-[#a6c5e229]';
          if (isSelected) {
            stateClasses = 'bg-blue-600 text-white font-bold hover:bg-blue-700';
          } else if (isOutside) {
            stateClasses = 'text-slate-400 dark:text-[#738496] opacity-50 hover:bg-slate-100 dark:hover:bg-[#a6c5e229]';
          } else if (isTodayDate) {
            stateClasses = 'border border-blue-600 text-blue-600 dark:text-blue-400 font-bold';
          }

          return (
            <button 
              key={day.toISOString()} 
              type="button" 
              onClick={() => { onSelectDate(day); if (isOutside) onChangeMonth(day); }} 
              className={`h-7 w-full flex items-center justify-center rounded-[3px] text-sm transition-colors ${stateClasses}`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Main Modal Component ---
export function TaskDetailModal({ task, allTasks, onClose, onUpdate, onMove, taskComments, onAddComment }: TaskDetailModalProps) {
  // Title Edit State
  const [titleValue, setTitleValue] = useState(task.title);
  useEffect(() => { setTitleValue(task.title); }, [task.title]);

  const [descText, setDescText] = useState(task.description || '');
  const [newComment, setNewComment] = useState('');
  
  // Checklist State
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('Checklist');
  const [addingItemFor, setAddingItemFor] = useState<string | null>(null);
  const [newChecklistItemText, setNewChecklistItemText] = useState('');

  // Tọa độ Modal Popups
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showDatesModal, setShowDatesModal] = useState(false);

  // Dates State
  const [startEnabled, setStartEnabled] = useState(!!task.startDate);
  const [startDateValue, setStartDateValue] = useState<Date | null>(task.startDate ? new Date(task.startDate) : null);
  const [dueEnabled, setDueEnabled] = useState(!!task.dueDate);
  const [dueDateValue, setDueDateValue] = useState<Date | null>(task.dueDate ? new Date(task.dueDate) : null);
  const [calendarSelection, setCalendarSelection] = useState<'start' | 'due'>(task.startDate ? 'start' : 'due');
  const [calendarMonth, setCalendarMonth] = useState<Date>(task.startDate || task.dueDate || new Date());
  const [recurringValue, setRecurringValue] = useState<string>(task.recurring || 'Never');
  const [reminderValue, setReminderValue] = useState<string>(task.reminder || '1 Day before');

  // Move Modal State
  const [moveToList, setMoveToList] = useState<Status>(task.status);
  const [moveToPosition, setMoveToPosition] = useState<number>(1);

  // Helper Functions
  const getListName = (status: Status) => {
    switch(status) {
      case 'TODO': return 'To Do';
      case 'DOING': return 'Doing';
      case 'DONE': return 'Done';
      default: return 'Unknown';
    }
  };

  const saveTitle = () => {
    if (titleValue.trim() !== task.title && titleValue.trim() !== '') {
      onUpdate({ ...task, title: titleValue.trim() });
    } else {
      setTitleValue(task.title);
    }
  };

  const recalculateProgress = (checklists: Checklist[]) => {
    const allItems = checklists.flatMap(c => c.items);
    const checkedCount = allItems.filter(i => i.checked).length;
    return allItems.length === 0 ? 0 : Math.round((checkedCount / allItems.length) * 100);
  };

  const addChecklist = () => {
    const newChecklists = [...(task.checklists || []), { id: `chk-${Date.now()}`, title: newChecklistTitle || 'Checklist', items: [] }];
    onUpdate({ ...task, checklists: newChecklists });
    setShowAddChecklist(false);
    setNewChecklistTitle('Checklist');
  };

  const addChecklistItem = (checklistId: string) => {
    if (!newChecklistItemText.trim()) return;
    const newChecklists = (task.checklists || []).map(c => c.id === checklistId ? { ...c, items: [...c.items, { id: `it-${Date.now()}`, text: newChecklistItemText.trim(), checked: false }] } : c);
    onUpdate({ ...task, checklists: newChecklists, progress: recalculateProgress(newChecklists) });
    setNewChecklistItemText('');
    setAddingItemFor(null);
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    const newChecklists = (task.checklists || []).map(c => {
      if (c.id !== checklistId) return c;
      return { ...c, items: c.items.map(it => it.id === itemId ? { ...it, checked: !it.checked } : it) };
    });
    onUpdate({ ...task, checklists: newChecklists, progress: recalculateProgress(newChecklists) });
  };

  const deleteChecklist = (checklistId: string) => {
    const newChecklists = (task.checklists || []).filter(c => c.id !== checklistId);
    onUpdate({ ...task, checklists: newChecklists, progress: recalculateProgress(newChecklists) });
  };

  const openDatesModal = () => {
    setStartEnabled(!!task.startDate);
    setStartDateValue(task.startDate || null);
    setDueEnabled(!!task.dueDate);
    setDueDateValue(task.dueDate || null);
    setCalendarSelection(task.startDate && !task.dueDate ? 'start' : 'due');
    setCalendarMonth(task.startDate || task.dueDate || new Date());
    setShowDatesModal(true);
  };

  const saveDatesToTask = () => {
    let finalStartDate = startEnabled ? startDateValue : null;
    let finalDueDate = dueEnabled ? dueDateValue : null;
    if (finalStartDate && finalDueDate && finalStartDate >= finalDueDate) {
      finalDueDate = addDays(finalStartDate, 1);
      setDueDateValue(finalDueDate);
    }
    onUpdate({ ...task, startDate: finalStartDate, dueDate: finalDueDate, recurring: recurringValue, reminder: reminderValue });
    setShowDatesModal(false);
  };

  const removeDatesFromTask = () => {
    onUpdate({ ...task, startDate: null, dueDate: null, recurring: null, reminder: null });
    setShowDatesModal(false);
  };

  const isDueSoon = task.dueDate ? differenceInHours(task.dueDate, new Date()) <= 24 && differenceInHours(task.dueDate, new Date()) >= 0 : false;
  const tasksInSelectedList = allTasks.filter(t => t.status === moveToList);
  const maxPositionCount = moveToList === task.status ? Math.max(1, tasksInSelectedList.length) : tasksInSelectedList.length + 1;

  // CLASS STYLE
  const popupClasses = "bg-white dark:bg-[#282e33] border border-slate-300 dark:border-[#454f59] rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10";
  const actionBtnClass = "inline-flex items-center gap-1.5 rounded-[4px] border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm dark:bg-[#22272b] dark:border-[#384148] dark:text-[#b6c2cf] dark:hover:bg-[#282e33]";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-7 bg-black/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      
      {/* THAY ĐỔI QUAN TRỌNG: Đổi `h-full md:h-[90vh]` thành `max-h-full md:max-h-[90vh]`. Modal sẽ tự động thu nhỏ nếu nội dung ít, và phình to tối đa 90vh nếu nội dung nhiều */}
      <motion.div initial={{ scale: 0.98, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 8 }} className="w-full max-w-[75rem] max-h-full md:max-h-[90vh] bg-white dark:bg-[#22272b] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* ========================================================= */}
        {/* KHUNG HEADER */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#384148] bg-slate-50 dark:bg-[#1d2125] shrink-0 z-20 relative">
          <div className="flex items-center gap-4 relative">
             <div className="relative inline-block">
               <button 
                 onClick={() => setShowMoveModal(!showMoveModal)}
                 className="flex items-center gap-2 bg-slate-200/50 dark:bg-[#a6c5e229] text-slate-800 dark:text-[#b6c2cf] font-semibold text-sm rounded-md px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-[#a6c5e23d] transition-colors focus:outline-none"
               >
                 <span>{getListName(task.status)}</span>
                 <ChevronDown className="w-4 h-4" />
               </button>

               <AnimatePresence>
                 {showMoveModal && (
                   <>
                     <div className="fixed inset-0 z-[80]" onClick={(e) => { e.stopPropagation(); setShowMoveModal(false); }}></div>
                     <motion.div 
                       initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }}
                       onClick={(e) => e.stopPropagation()} 
                       className={`absolute left-0 top-full mt-2 z-[90] w-72 p-4 ${popupClasses}`}
                     >
                       <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-[#384148]">
                         <div className="w-6" />
                         <h3 className="text-sm font-semibold text-slate-700 dark:text-[#9fadbc]">Move card</h3>
                         <button onClick={() => setShowMoveModal(false)} className="text-slate-400 hover:text-slate-700 dark:text-[#9fadbc] dark:hover:text-white transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#a6c5e229]">
                           <X className="w-4 h-4" />
                         </button>
                       </div>
                       <div className="flex gap-3 mb-5">
                         <div className="flex-[2]">
                           <label className="block text-xs font-bold text-slate-600 dark:text-[#9fadbc] mb-1.5">List</label>
                           <select value={moveToList} onChange={(e) => { setMoveToList(e.target.value as Status); setMoveToPosition(1); }} className="w-full px-3 py-2 rounded-[3px] bg-slate-50 dark:bg-[#22272b] border border-slate-300 dark:border-[#a6c5e229] text-slate-800 dark:text-[#b6c2cf] text-sm focus:outline-none focus:border-blue-500 cursor-pointer">
                             <option value="TODO">To Do</option><option value="DOING">Doing</option><option value="DONE">Done</option>
                           </select>
                         </div>
                         <div className="flex-1">
                           <label className="block text-xs font-bold text-slate-600 dark:text-[#9fadbc] mb-1.5">Position</label>
                           <select value={moveToPosition} onChange={(e) => setMoveToPosition(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-[3px] bg-slate-50 dark:bg-[#22272b] border border-slate-300 dark:border-[#a6c5e229] text-slate-800 dark:text-[#b6c2cf] text-sm focus:outline-none focus:border-blue-500 cursor-pointer">
                             {Array.from({ length: maxPositionCount }).map((_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
                           </select>
                         </div>
                       </div>
                       <button onClick={() => { onMove(task.id, moveToList, moveToPosition); setShowMoveModal(false); }} className="w-full py-2 rounded-[3px] bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">Move</button>
                     </motion.div>
                   </>
                 )}
               </AnimatePresence>
             </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-[#a6c5e229] text-slate-500 dark:text-[#9fadbc] transition-colors"><X className="w-5 h-5" /></button>
        </div>
        {/* ========================================================= */}

        {/* POPOVER DATES */}
        <AnimatePresence>
          {showDatesModal && (
            <>
              <div className="fixed inset-0 z-[80]" onClick={(e) => { e.stopPropagation(); setShowDatesModal(false); }}></div>
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()} 
                className={`absolute left-6 sm:left-8 top-[76px] z-[90] w-[320px] max-h-[calc(100%-90px)] overflow-y-auto custom-scrollbar ${popupClasses}`}
              >
                <div className="flex items-center justify-between px-4 py-2 mb-2 text-slate-600 dark:text-[#9fadbc]">
                  <div className="w-5" /> 
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-[#b6c2cf]">Dates</h3>
                  <button onClick={() => setShowDatesModal(false)} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#a6c5e229] transition-colors"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="px-3 pb-3">
                  <TrelloCalendar 
                    displayMonth={calendarMonth} 
                    selectedDate={calendarSelection === 'start' ? startDateValue : dueDateValue} 
                    onSelectDate={(date: Date) => {
                      if (calendarSelection === 'start') {
                        setStartEnabled(true); setStartDateValue(date);
                        if (dueDateValue && date > dueDateValue) { setDueEnabled(true); setDueDateValue(addDays(date, 1)); }
                      } else {
                        setDueEnabled(true);
                        if (startDateValue && date <= startDateValue) { setDueDateValue(addDays(startDateValue, 1)); } else { setDueDateValue(date); }
                      }
                    }} 
                    onChangeMonth={(date: Date) => setCalendarMonth(startOfMonth(date))} 
                  />
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <input type="checkbox" checked={startEnabled} onChange={(e) => { setStartEnabled(e.target.checked); if (e.target.checked) setCalendarSelection('start'); else if (calendarSelection === 'start') setCalendarSelection('due'); }} className="h-3.5 w-3.5 rounded border-slate-300 dark:border-[#384148]" />
                        <span className="text-xs font-bold text-slate-700 dark:text-[#b6c2cf]">Start date</span>
                      </label>
                      <input type="text" readOnly value={startDateValue && startEnabled ? format(startDateValue, 'M/d/yyyy') : 'M/D/YYYY'} onClick={() => { setStartEnabled(true); setCalendarSelection('start'); }} className={`w-full px-2 py-1.5 text-sm rounded-[3px] border bg-slate-50 dark:bg-[#22272b] outline-none cursor-pointer transition-colors ${calendarSelection === 'start' ? 'border-blue-600 ring-1 ring-blue-600 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-[#a6c5e229] text-slate-900 dark:text-[#b6c2cf]'}`} />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 mb-1.5 cursor-pointer">
                        <input type="checkbox" checked={dueEnabled} onChange={(e) => { setDueEnabled(e.target.checked); if (e.target.checked) setCalendarSelection('due'); }} className="h-3.5 w-3.5 rounded border-slate-300 dark:border-[#384148]" />
                        <span className="text-xs font-bold text-slate-700 dark:text-[#b6c2cf]">Due date</span>
                      </label>
                      <div className="flex gap-2">
                        <input type="text" readOnly value={dueDateValue && dueEnabled ? format(dueDateValue, 'M/d/yyyy') : 'M/D/YYYY'} onClick={() => { setDueEnabled(true); setCalendarSelection('due'); }} className={`flex-1 px-2 py-1.5 text-sm rounded-[3px] border bg-slate-50 dark:bg-[#22272b] outline-none cursor-pointer transition-colors ${calendarSelection === 'due' ? 'border-blue-600 ring-1 ring-blue-600 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-[#a6c5e229] text-slate-900 dark:text-[#b6c2cf]'}`} />
                        <select disabled={!dueEnabled} value={dueDateValue ? format(dueDateValue, 'p') : '12:00 PM'} onChange={(e) => {
                            if (!dueEnabled) return;
                            const [time, meridiem] = e.target.value.split(' '); const [hour, minute] = time.split(':').map(Number);
                            const date = dueDateValue || new Date(); const adjusted = new Date(date);
                            const hour24 = meridiem === 'PM' && hour !== 12 ? hour + 12 : meridiem === 'AM' && hour === 12 ? 0 : hour;
                            adjusted.setHours(hour24, minute, 0, 0); setDueDateValue(adjusted);
                          }} className="w-24 px-2 py-1.5 text-sm rounded-[3px] border border-slate-300 dark:border-[#a6c5e229] bg-slate-50 dark:bg-[#22272b] text-slate-900 dark:text-[#b6c2cf] outline-none disabled:opacity-50">
                          {['12:00 AM', '6:00 AM', '12:00 PM', '6:00 PM'].map((t) => (<option key={t} value={t}>{t}</option>))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-[#b6c2cf] mb-1.5">Recurring</label>
                      <select value={recurringValue} onChange={(e) => setRecurringValue(e.target.value)} className="w-full px-2 py-1.5 text-sm rounded-[3px] border border-slate-300 dark:border-[#a6c5e229] bg-slate-50 dark:bg-[#22272b] text-slate-900 dark:text-[#b6c2cf] outline-none cursor-pointer">
                        <option>Never</option><option>Daily</option><option>Weekly</option><option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-[#b6c2cf] mb-1.5">Set due date reminder</label>
                      <select value={reminderValue} onChange={(e) => setReminderValue(e.target.value)} className="w-full px-2 py-1.5 text-sm rounded-[3px] border border-slate-300 dark:border-[#a6c5e229] bg-slate-50 dark:bg-[#22272b] text-slate-900 dark:text-[#b6c2cf] outline-none cursor-pointer">
                        <option>1 Day before</option><option>1 Hour before</option><option>At time of due date</option>
                      </select>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#9fadbc]">Reminders will be sent to all members and watchers of this card.</p>
                    <div className="flex flex-col gap-2 pt-2">
                      <button onClick={saveDatesToTask} className="w-full py-1.5 text-sm font-medium rounded-[3px] bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save</button>
                      <button onClick={removeDatesFromTask} className="w-full py-1.5 text-sm font-medium rounded-[3px] bg-slate-200/50 hover:bg-slate-200 dark:bg-[#a6c5e214] dark:hover:bg-[#a6c5e229] text-slate-700 dark:text-[#b6c2cf] transition-colors">Remove</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* NỘI DUNG (Khung chứa Scrollbar bên trong) - Thêm min-h-0 để flex cuộn hoạt động tốt */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 relative z-10">
          
          {/* CỘT TRÁI CHÍNH */}
          <div className="flex-[2] p-6 sm:p-8 overflow-y-auto custom-scrollbar">
            
            <div className="flex items-start justify-between">
              <div className="w-full">
                <input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                  className="w-full text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-white bg-transparent outline-none border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-[#22272b] rounded-md px-2 py-1 -ml-2 transition-colors cursor-text"
                  placeholder="Task title..."
                />
                <p className="text-sm text-slate-500 dark:text-[#9fadbc] mt-1 px-2 -ml-2">{task.priority}</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2 mt-4 relative">
              <button className={actionBtnClass}><Plus className="w-4 h-4" /> Add</button>
              <button className={actionBtnClass}><Tag className="w-4 h-4" /> Labels</button>

              <button onClick={openDatesModal} className={actionBtnClass}>
                <CalendarDays className="w-4 h-4" /> Dates
              </button>

              <div className="relative inline-block">
                <button onClick={() => setShowAddChecklist(!showAddChecklist)} className={actionBtnClass}><Check className="w-4 h-4" /> Checklist</button>
                {showAddChecklist && (
                  <>
                    <div className="fixed inset-0 z-[80]" onClick={(e) => { e.stopPropagation(); setShowAddChecklist(false); }}></div>
                    <div className={`absolute left-0 top-full mt-2 z-[90] p-4 w-72 sm:w-80 ${popupClasses}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm font-medium dark:text-[#b6c2cf]"><ListIcon className="w-4 h-4 text-slate-500" />Add checklist</div>
                        <button onClick={() => setShowAddChecklist(false)} className="text-xs px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#a6c5e229] dark:text-[#9fadbc]"><X className="w-4 h-4"/></button>
                      </div>
                      <input value={newChecklistTitle} onChange={(e) => setNewChecklistTitle(e.target.value)} className="w-full mb-3 rounded-[3px] border px-2 py-1.5 text-sm bg-slate-50 dark:bg-[#22272b] border-slate-300 dark:border-[#a6c5e229] dark:text-white outline-none focus:border-blue-500" />
                      <div className="flex gap-2">
                        <button onClick={addChecklist} className="px-4 py-1.5 bg-blue-600 text-white rounded-[3px] text-sm font-medium">Add</button>
                        <button onClick={() => setShowAddChecklist(false)} className="px-4 py-1.5 rounded-[3px] text-sm text-slate-700 dark:text-[#b6c2cf] hover:bg-slate-100 dark:hover:bg-[#a6c5e229]">Cancel</button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button className={actionBtnClass}><Users className="w-4 h-4" /> Members</button>
              <button className={actionBtnClass}><Paperclip className="w-4 h-4" /> Attachment</button>
            </div>

            {/* DATES HIỂN THỊ */}
            {(task.dueDate || task.startDate) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <button type="button" onClick={openDatesModal} className="inline-flex items-center gap-2 rounded-[4px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 active:bg-slate-200 dark:border-[#a6c5e229] dark:bg-[#a6c5e214] dark:text-[#b6c2cf] dark:hover:bg-[#a6c5e229]">
                  <CalendarDays className="w-4 h-4" />
                  <span>{task.startDate && task.dueDate ? `${format(task.startDate, 'MMM d')} - ${format(task.dueDate, 'MMM d, p')}` : task.dueDate ? format(task.dueDate, 'MMM d, p') : format(task.startDate!, 'MMM d')}</span>
                </button>
                {(task.dueDate || task.startDate) && isDueSoon && (
                  <div className="inline-flex items-center gap-2 rounded-[4px] bg-amber-400 px-2 py-1.5 text-xs font-semibold text-slate-900 shadow-sm">Due soon <ChevronDown className="w-3 h-3" /></div>
                )}
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="mt-6 py-4 border-t border-slate-200 dark:border-[#384148]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-semibold text-slate-900 dark:text-[#b6c2cf]">Description</div>
                <button onClick={() => onUpdate({...task, description: descText})} className="text-xs rounded-md bg-slate-100 dark:bg-[#a6c5e214] px-3 py-1.5 text-slate-700 dark:text-[#b6c2cf] font-medium hover:bg-slate-200 dark:hover:bg-[#a6c5e229] transition">Save description</button>
              </div>
              <textarea value={descText} onChange={(e) => setDescText(e.target.value)} placeholder="Add a more detailed description..." className="w-full min-h-[120px] bg-slate-50 dark:bg-[#22272b] border border-slate-200 dark:border-[#a6c5e229] rounded-[3px] p-3 text-base text-slate-700 dark:text-[#b6c2cf] focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#22272b] shadow-sm transition-colors" />
            </div>

            {/* CHECKLISTS */}
            <div className="mt-2 pb-4">
              {(task.checklists || []).map((c) => {
                const total = c.items.length;
                const checked = c.items.filter((it) => it.checked).length;
                const pct = total === 0 ? 0 : Math.round((checked / total) * 100);
                return (
                  <div key={c.id} className="mb-6 bg-transparent">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-slate-700 dark:text-[#9fadbc]" />
                        <div className="text-base font-semibold text-slate-900 dark:text-[#b6c2cf]">{c.title}</div>
                      </div>
                      <button onClick={() => deleteChecklist(c.id)} className="text-xs px-3 py-1.5 rounded-md bg-slate-100 dark:bg-[#a6c5e214] text-slate-600 dark:text-[#b6c2cf] font-medium hover:bg-slate-200 dark:hover:bg-[#a6c5e229] transition">Delete</button>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs text-slate-500 dark:text-[#9fadbc] w-8 text-right font-medium">{pct}%</span>
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-[#091e4224] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2 pl-11">
                      {c.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-3 text-sm group">
                          <button onClick={() => toggleChecklistItem(c.id, it.id)} className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${it.checked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-[#22272b] border-slate-300 dark:border-[#a6c5e229] hover:border-blue-500'}`}>
                            {it.checked ? <Check className="w-3 h-3" /> : null}
                          </button>
                          <span className={`text-sm dark:text-[#b6c2cf] transition-all ${it.checked ? 'line-through text-slate-500 dark:text-[#9fadbc]' : 'text-slate-800'}`}>{it.text}</span>
                        </div>
                      ))}
                      {addingItemFor === c.id ? (
                        <div className="mt-3 flex flex-col gap-2">
                          <input autoFocus value={newChecklistItemText} onChange={(e) => setNewChecklistItemText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addChecklistItem(c.id)} placeholder="Add an item" className="w-full rounded-[3px] border px-3 py-2 bg-slate-50 dark:bg-[#22272b] border-slate-300 dark:border-[#a6c5e229] dark:text-[#b6c2cf] focus:outline-none focus:border-blue-500 shadow-sm" />
                          <div className="flex gap-2">
                            <button onClick={() => addChecklistItem(c.id)} className="px-4 py-1.5 rounded-[3px] bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm">Add</button>
                            <button onClick={() => { setAddingItemFor(null); setNewChecklistItemText(''); }} className="px-4 py-1.5 rounded-[3px] text-slate-700 dark:text-[#9fadbc] hover:bg-slate-200 dark:hover:bg-[#a6c5e229] font-medium text-sm transition">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setAddingItemFor(c.id)} className="mt-3 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-[#a6c5e214] text-sm font-medium text-slate-700 dark:text-[#b6c2cf] hover:bg-slate-200 dark:hover:bg-[#a6c5e229] transition">Add an item</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI (COMMENTS & ACTIVITY) - Làm y hệt ảnh */}
          <div className="w-full md:w-[22rem] lg:w-[26rem] border-t md:border-t-0 md:border-l border-slate-200 dark:border-[#384148] bg-slate-50 dark:bg-[#1d2125] overflow-y-auto custom-scrollbar p-6">
            
            {/* Header Cột phải */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-[#b6c2cf]">
                <Activity className="w-5 h-5 text-slate-700 dark:text-[#9fadbc]" /> Activity
              </div>
              <button className="text-sm px-3 py-1.5 rounded-[4px] border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm dark:bg-[#22272b] dark:border-[#384148] dark:text-[#b6c2cf] dark:hover:bg-[#282e33]">Show details</button>
            </div>

            {/* Input Comment - Giao diện trơn, full-width, không Avatar theo ảnh */}
            <div className="mb-8">
              <form onSubmit={(e) => { e.preventDefault(); if (newComment.trim()) { onAddComment(newComment); setNewComment(''); } }}>
                <input 
                  placeholder="Write a comment..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  className="w-full bg-white dark:bg-[#22272b] border border-slate-300 dark:border-[#a6c5e229] rounded-lg px-4 py-2.5 text-sm text-slate-700 dark:text-[#b6c2cf] focus:outline-none focus:border-blue-500 shadow-sm transition-colors" 
                />
                {newComment.trim() && (
                  <div className="mt-3 flex justify-end">
                    <button type="submit" className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-sm">Save</button>
                  </div>
                )}
              </form>
            </div>

            {/* List Activity - Chữ inline, link xanh, làm theo style ảnh */}
            <div className="flex-1 space-y-6">
              {taskComments.map((comment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d93a1c] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-sm leading-snug">
                      <span className="font-bold text-slate-900 dark:text-[#b6c2cf]">{comment.author}</span>
                      <span className="text-slate-700 dark:text-[#9fadbc] ml-1">{comment.text}</span>
                    </div>
                    <div className="mt-0.5">
                      {/* Fake thẻ a có màu xanh y như hình */}
                      <a href="#" className="text-xs text-blue-600 hover:underline">{comment.time}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}