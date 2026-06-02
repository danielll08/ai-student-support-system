import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ViewMode = 'Tháng' | 'Tuần' | 'Ngày' | 'Chế độ gọn';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTHS = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
  'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

// Định nghĩa type dựa theo Kanban Task
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type Status = 'TODO' | 'DOING' | 'DONE';

interface KanbanTask {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  startDate?: string | null;
  dueDate?: string | null;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function Schedule() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState<ViewMode>('Tháng');
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [tasks, setTasks] = useState<KanbanTask[]>([]);

  // Lấy dữ liệu task từ Kanban Board (localStorage)
  useEffect(() => {
    const storedTasks = window.localStorage.getItem('kanban-board-tasks-v1');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error('Lỗi khi lấy dữ liệu Kanban:', e);
      }
    }
  }, []);

  // Chuyển đổi Kanban tasks thành Events hiển thị trên lịch
  const calendarEvents = useMemo(() => {
    return tasks
      .filter(t => t.dueDate || t.startDate) // Chỉ lấy các task có gán ngày
      .map(t => {
        // Ưu tiên ghim vào ngày dueDate, nếu không có thì ghim vào startDate
        const dateStr = t.dueDate || t.startDate;
        const dt = new Date(dateStr!);
        
        // Phân loại màu sắc theo trạng thái / độ ưu tiên
        let color = 'bg-blue-500'; 
        if (t.status === 'DONE') {
          color = 'bg-emerald-500'; // Xanh lá nếu đã xong
        } else if (t.priority === 'HIGH') {
          color = 'bg-red-500';     // Đỏ nếu ưu tiên cao
        } else if (t.priority === 'MEDIUM') {
          color = 'bg-yellow-500';  // Vàng nếu ưu tiên TB
        } else if (t.priority === 'LOW') {
          color = 'bg-green-500';   // Xanh nếu ưu tiên thấp
        }

        return {
          id: t.id,
          title: t.title,
          day: dt.getDate(),
          month: dt.getMonth(),
          year: dt.getFullYear(),
          color,
          status: t.status
        };
      });
  }, [tasks]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Tìm task tương ứng với ngày hiện tại trong vòng lặp grid
  const getEventsForDay = (day: number) =>
    calendarEvents.filter(e => e.day === day && e.month === month && e.year === year);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Build calendar grid
  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="p-5 h-full flex flex-col bg-slate-50 dark:bg-[#090d13] transition-colors duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-950 dark:text-white">Lịch học & Công việc</h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
            Đồng bộ tự động các task từ Kanban board có thiết lập Deadline / Ngày bắt đầu.
          </p>
        </div>
        {/* Nút "Thêm sự kiện" đã được gỡ bỏ */}
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col dark:bg-[#161b27] dark:border-[#252d3d]">
        {/* Calendar toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-[#252d3d] bg-slate-50 dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="w-7 h-7 rounded-lg bg-white dark:bg-[#1e2534] hover:bg-slate-100 dark:hover:bg-[#252d3d] flex items-center justify-center text-slate-700 dark:text-gray-400 hover:text-blue-500 transition-all border border-slate-200 dark:border-[#252d3d]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-slate-950 dark:text-white min-w-40 text-center uppercase tracking-wide">
              {MONTHS[month]} - {year}
            </span>
            <button onClick={nextMonth} className="w-7 h-7 rounded-lg bg-white dark:bg-[#1e2534] hover:bg-slate-100 dark:hover:bg-[#252d3d] flex items-center justify-center text-slate-700 dark:text-gray-400 hover:text-blue-500 transition-all border border-slate-200 dark:border-[#252d3d]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 bg-white dark:bg-[#1a2030] rounded-xl p-1 border border-slate-200 dark:border-[#252d3d]">
            {(['Tháng', 'Tuần', 'Ngày', 'Chế độ gọn'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-[#252d3d] bg-slate-50/50 dark:bg-[#111827]/50">
          {WEEKDAYS.map(day => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-rows-6">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-slate-200 dark:border-[#252d3d] last:border-b-0">
              {week.map((cell, di) => {
                const cellEvents = cell.current ? getEventsForDay(cell.day) : [];
                const todayCell = cell.current && isToday(cell.day);

                return (
                  <motion.div
                    key={`${wi}-${di}`}
                    onClick={() => cell.current && setSelectedDate(cell.day)}
                    whileHover={cell.current ? { backgroundColor: 'rgba(59,130,246,0.03)' } : {}}
                    className={`relative border-r border-slate-200 dark:border-[#252d3d] last:border-r-0 p-1.5 cursor-pointer transition-colors min-h-[80px] ${
                      !cell.current ? 'bg-slate-50/50 dark:bg-[#0b1116]/50 opacity-50' : 'bg-transparent'
                    } ${todayCell ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 transition-all ${
                      todayCell
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30'
                        : cell.current
                          ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252d3d]'
                          : 'text-slate-400 dark:text-slate-600'
                    }`}>
                      {cell.day}
                    </div>
                    {todayCell && (
                      <div className="text-[9px] text-blue-600 dark:text-blue-400 font-bold mb-1 ml-1">Hôm nay</div>
                    )}
                    
                    {/* Hiển thị danh sách task */}
                    <div className="flex flex-col gap-1 max-h-[60px] overflow-y-auto custom-scrollbar">
                      {cellEvents.map(ev => (
                        <div 
                          key={ev.id} 
                          className={`rounded-md px-1.5 py-0.5 text-[10px] text-white font-medium truncate ${ev.color} ${ev.status === 'DONE' ? 'opacity-60 line-through' : 'shadow-sm'}`}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}