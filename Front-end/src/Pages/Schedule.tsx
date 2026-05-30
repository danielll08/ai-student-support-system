import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { mockEvents } from '@/data/mockData';

type ViewMode = 'Tháng' | 'Tuần' | 'Ngày' | 'Chế độ gọn';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTHS = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
  'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

type CalendarEvent = typeof mockEvents[number] & {
  day: number;
  month: number;
  year: number;
};

const events: CalendarEvent[] = mockEvents.map((item) => {
  const dt = new Date(item.date);
  return {
    ...item,
    day: dt.getDate(),
    month: dt.getMonth(),
    year: dt.getFullYear(),
  };
});

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

  const getEventsForDay = (day: number) =>
    events.filter(e => e.day === day && e.month === month && e.year === year);

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
    <div className="p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white">Lịch học</h1>
          <p className="text-xs text-gray-500 mt-0.5">Quản lý lịch học, lịch thi, deadline assignment và đồng bộ task vào calendar.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" />
          Thêm sự kiện
        </button>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col dark:bg-[#161b27] dark:border-[#252d3d]">
        {/* Calendar toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#252d3d]">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-[#1e2534] hover:bg-slate-100 dark:hover:bg-[#252d3d] flex items-center justify-center text-slate-700 dark:text-gray-400 hover:text-white transition-all border border-slate-200 dark:border-[#252d3d]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-slate-950 dark:text-white min-w-40 text-center">
              {MONTHS[month]} năm {year}
            </span>
            <button onClick={nextMonth} className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-[#1e2534] hover:bg-slate-100 dark:hover:bg-[#252d3d] flex items-center justify-center text-slate-700 dark:text-gray-400 hover:text-white transition-all border border-slate-200 dark:border-[#252d3d]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#1a2030] rounded-xl p-1 border border-slate-200 dark:border-[#252d3d]">
            {(['Tháng', 'Tuần', 'Ngày', 'Chế độ gọn'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-[#252d3d]">
          {WEEKDAYS.map(day => (
            <div key={day} className="py-2 text-center text-xs font-medium text-slate-500 dark:text-gray-400">
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
                const isSelected = cell.current && selectedDate === cell.day && month === today.getMonth() && year === today.getFullYear();
                const todayCell = cell.current && isToday(cell.day);

                return (
                  <motion.div
                    key={`${wi}-${di}`}
                    onClick={() => cell.current && setSelectedDate(cell.day)}
                    whileHover={cell.current ? { backgroundColor: 'rgba(30,37,52,0.8)' } : {}}
                    className={`relative border-r border-slate-200 dark:border-[#252d3d] last:border-r-0 p-1.5 cursor-pointer transition-colors min-h-[80px] ${
                      !cell.current ? 'bg-slate-50' : 'bg-transparent'
                    } ${todayCell ? 'bg-blue-500/5' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 transition-all ${
                      todayCell
                        ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/30'
                        : cell.current
                          ? 'text-slate-700 hover:bg-slate-100 dark:hover:bg-[#252d3d]'
                          : 'text-slate-500'
                    }`}>
                      {cell.day}
                    </div>
                    {todayCell && (
                      <div className="text-[9px] text-blue-400 font-medium">Hôm nay</div>
                    )}
                    {cellEvents.map(ev => (
                      <div key={ev.id} className={`${ev.color} rounded-md px-1 py-0.5 text-[9px] text-white font-medium truncate mt-0.5`}>
                        {ev.title}
                      </div>
                    ))}
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
