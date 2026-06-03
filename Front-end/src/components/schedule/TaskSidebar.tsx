import { Clock, ListTodo } from 'lucide-react';
import { UNSCHEDULED_TASKS } from './ScheduleData';

export function TaskSidebar({ showTaskPanel }: { showTaskPanel: boolean }) {
  return (
    <aside 
      className={`bg-slate-50 dark:bg-[#151b28] border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${showTaskPanel ? 'w-[280px] opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'}`}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between min-w-[280px]">
        <h3 className="text-[13px] font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-cyan-600" /> Chờ xếp lịch
        </h3>
        <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
          {UNSCHEDULED_TASKS.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-w-[280px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
        <p className="text-[11px] text-slate-500 text-center mb-2 italic">
          Kéo thả thẻ vào lịch để tạo Event
        </p>
        {UNSCHEDULED_TASKS.map(task => (
          <div key={task.id} className="p-3 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 rounded-md cursor-grab active:cursor-grabbing hover:border-cyan-500/50 hover:shadow-sm transition-all group">
            <h4 className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 leading-tight mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">{task.title}</h4>
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1 bg-slate-50 dark:bg-[#151b28] px-1.5 py-0.5 rounded">
                <Clock className="w-3 h-3"/> {task.duration}
              </span>
              <span className={`px-1.5 py-0.5 rounded border ${
                task.priority === 'HIGH' ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' : 
                task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 
                'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}