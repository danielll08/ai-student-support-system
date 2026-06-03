import { Clock, Video, ListTodo } from 'lucide-react';
import { WEEK_DAYS, HOURS } from './ScheduleData';

export function CalendarGrid() {
  return (
<div className="flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-[#0b1120] flex flex-col relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">      
      {/* Header Ngày trong tuần */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#0b1120] z-20">
        <div className="w-14 shrink-0 border-r border-slate-200 dark:border-slate-800"></div> 
        {WEEK_DAYS.map((day, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center py-2 border-r border-slate-200 dark:border-slate-800 last:border-0 relative">
            <span className={`text-[11px] font-semibold mb-0.5 ${day.isToday ? 'text-cyan-600' : 'text-slate-500'}`}>{day.name}</span>
            <span className={`w-8 h-8 flex items-center justify-center text-lg font-bold rounded-full ${day.isToday ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-800 dark:text-slate-200'}`}>
              {day.date}
            </span>
            {day.isToday && <div className="absolute bottom-0 w-full h-[2px] bg-cyan-500"></div>}
          </div>
        ))}
      </div>

      {/* Lưới Giờ 24h (Timeline) - Mỗi giờ cao 64px => Tổng cao 24 * 64 = 1536px */}
<div className="flex relative h-[1536px] pb-12">           {/* Cột thời gian */}
        <div className="w-14 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] relative z-10">
          {HOURS.map((hour, idx) => (
            <div key={idx} className="h-16 flex justify-center border-b border-slate-100 dark:border-slate-800/50">
              <span className="text-[10px] text-slate-400 font-medium -mt-2.5 bg-white dark:bg-[#0b1120] px-1">{hour}</span>
            </div>
          ))}
        </div>

        {/* Cột nội dung các ngày */}
        <div className="flex-1 flex relative">
          <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
            {HOURS.map((_, idx) => (
              <div key={idx} className="h-16 border-b border-slate-100 dark:border-slate-800/50 w-full"></div>
            ))}
          </div>
          {WEEK_DAYS.map((_, idx) => (
            <div key={idx} className="flex-1 border-r border-slate-200 dark:border-slate-800 last:border-0 relative border-dashed"></div>
          ))}

          {/* MOCK SỰ KIỆN */}
          {/* 08:00 (8 * 64 = 512px) đến 10:00 (2h = 128px) */}
          <div className="absolute top-[512px] left-[0%] w-[14.28%] h-[128px] p-0.5 z-10">
            <div className="w-full h-full bg-blue-500/10 dark:bg-blue-500/20 border-l-2 border-blue-500 rounded-md p-1.5 flex flex-col hover:shadow-md cursor-pointer transition-shadow">
              <h4 className="text-[11px] font-bold text-blue-700 dark:text-blue-400 leading-tight">Mạng máy tính</h4>
              <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3"/> 08:00 - 10:00</p>
            </div>
          </div>

          {/* 10:00 (10 * 64 = 640px) đến 11:30 (1.5h = 96px) */}
          <div className="absolute top-[640px] left-[28.56%] w-[14.28%] h-[96px] p-0.5 z-10">
            <div className="w-full h-full bg-purple-500/10 dark:bg-purple-500/20 border-l-2 border-purple-500 rounded-md p-1.5 flex flex-col hover:shadow-md cursor-pointer transition-shadow">
              <h4 className="text-[11px] font-bold text-purple-700 dark:text-purple-400 leading-tight">Họp team Đồ án</h4>
              <p className="text-[10px] text-purple-600/80 dark:text-purple-400/80 mt-0.5 flex items-center gap-1"><Video className="w-3 h-3"/> Google Meet</p>
            </div>
          </div>

          {/* 14:00 (14 * 64 = 896px) đến 16:00 (2h = 128px) */}
          <div className="absolute top-[896px] left-[42.84%] w-[14.28%] h-[128px] p-0.5 z-10">
            <div className="w-full h-full bg-rose-500/10 dark:bg-rose-500/20 border-l-2 border-rose-500 rounded-md p-1.5 flex flex-col hover:shadow-md cursor-pointer transition-shadow">
              <h4 className="text-[11px] font-bold text-rose-700 dark:text-rose-400 leading-tight flex items-start gap-1">
                <ListTodo className="w-3 h-3 mt-0.5 flex-shrink-0" /> Chốt SRS Document
              </h4>
            </div>
          </div>

          {/* ĐƯỜNG KẺ THỜI GIAN THỰC (Giả lập 10:45 AM = 10*64 + 45/60*64 = 688px) */}
          <div className="absolute top-[688px] left-[28.56%] w-[14.28%] h-[2px] bg-red-500 z-20 pointer-events-none flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}