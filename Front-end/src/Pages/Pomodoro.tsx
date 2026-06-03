import { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Maximize2, Minimize2, 
  CheckCircle2, Circle, Coffee, BrainCircuit, Volume2, VolumeX, X
} from 'lucide-react';
import { KanbanTask } from '../components/kanban/TaskDetailModal';

const FOCUS_TIME = 25 * 60; 
const BREAK_TIME = 5 * 60;  
const STORAGE_KEY = 'kanban-board-tasks-v5';

export function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');
  const [isZenMode, setIsZenMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const playAlarm = () => {
    if (!soundEnabled) return;
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const loadTasks = () => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as KanbanTask[];
          setTasks(parsed.filter(t => t.status === 'TODO' || t.status === 'DOING'));
        } catch (e) {
          console.error("Lỗi parse tasks", e);
        }
      }
    };
    loadTasks();
    window.addEventListener('storage', loadTasks);
    return () => window.removeEventListener('storage', loadTasks);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      handleCompleteSession();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleCompleteSession = () => {
    setIsRunning(false);
    playAlarm();

    if (mode === 'FOCUS') {
      if (selectedTaskId) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const allTasks = JSON.parse(stored) as KanbanTask[];
          const updatedTasks = allTasks.map(t => {
            if (t.id === selectedTaskId) {
              const currentSpent = (t as any).timeSpent || 0;
              return { ...t, timeSpent: currentSpent + 25 };
            }
            return t;
          });
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
          setTasks(updatedTasks.filter(t => t.status === 'TODO' || t.status === 'DOING'));
        }
      }
      setMode('BREAK');
      setTimeLeft(BREAK_TIME);
    } else {
      setMode('FOCUS');
      setTimeLeft(FOCUS_TIME);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME);
  };

  const totalTime = mode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME;
  const percentage = (timeLeft / totalTime) * 100;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const isFocus = mode === 'FOCUS';
  // Sử dụng màu phẳng, nhã nhặn: Đỏ Rose cho học, Xanh Teal cho nghỉ
  const strokeColor = isFocus ? '#f43f5e' : '#14b8a6'; 
  const textColorClass = isFocus ? 'text-rose-500' : 'text-teal-500';
  const bgColorClass = isFocus ? 'bg-rose-500 hover:bg-rose-600' : 'bg-teal-500 hover:bg-teal-600';

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className={`transition-all duration-300 ease-in-out ${isZenMode ? 'fixed inset-0 z-[100] bg-white dark:bg-[#0f1115]' : 'h-full w-full bg-slate-50/50 dark:bg-[#0b1120]'}`}>
      
      {isZenMode && (
        <button 
          onClick={() => setIsZenMode(false)}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#161b22] rounded border border-slate-200 dark:border-slate-800 text-sm font-medium"
        >
          <Minimize2 className="w-4 h-4" /> Thoát toàn màn hình
        </button>
      )}

      <div className="flex h-full w-full flex-col lg:flex-row items-center justify-center p-6 gap-8 max-w-6xl mx-auto">
        
        {/* --- CỘT TRÁI: TIMER CHÍNH --- */}
        <div className={`flex flex-col items-center justify-center transition-all ${isZenMode ? 'scale-110' : 'flex-1'}`}>
          
          {/* Nút chuyển chế độ phẳng */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-[#161b22] rounded-lg mb-8">
            <button 
              onClick={() => { setMode('FOCUS'); setTimeLeft(FOCUS_TIME); setIsRunning(false); }} 
              className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-colors ${isFocus ? 'bg-white dark:bg-[#21262d] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
            >
              <BrainCircuit className="w-4 h-4" /> Tập trung
            </button>
            <button 
              onClick={() => { setMode('BREAK'); setTimeLeft(BREAK_TIME); setIsRunning(false); }} 
              className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-colors ${!isFocus ? 'bg-white dark:bg-[#21262d] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
            >
              <Coffee className="w-4 h-4" /> Giải lao
            </button>
          </div>

          {/* VÒNG TRÒN SVG PHẲNG (KHÔNG GLOW) */}
          <div className="relative flex items-center justify-center">
            <svg className="w-[300px] h-[300px] -rotate-90 transform">
              <circle cx="150" cy="150" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200 dark:text-slate-800" />
              <circle
                cx="150"
                cy="150"
                r={radius}
                stroke={strokeColor}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            
            <div className="absolute flex flex-col items-center">
              <span className={`font-mono text-7xl font-semibold tracking-tight ${textColorClass}`}>
                {minutes}:{seconds}
              </span>
            </div>
          </div>

          {/* HIỂN THỊ TASK ĐANG CHỌN (Gọn gàng) */}
          <div className="mt-8 h-10 flex items-center justify-center">
            {selectedTask ? (
              <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-md">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                  {selectedTask.title}
                </span>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
                <button onClick={() => setSelectedTaskId(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className="text-sm text-slate-400 dark:text-slate-500">Chưa chọn công việc</span>
            )}
          </div>

          {/* CÁC NÚT ĐIỀU KHIỂN CƠ BẢN */}
          <div className="flex items-center gap-4 mt-8">
            <button onClick={resetTimer} className="p-3 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-[#21262d] rounded-full transition-colors" title="Đặt lại">
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button onClick={toggleTimer} className={`flex items-center justify-center w-16 h-16 rounded-full text-white transition-colors shadow-sm ${bgColorClass}`}>
              {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>

            <div className="flex items-center gap-1">
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-3 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-[#21262d] rounded-full transition-colors" title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}>
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              {!isZenMode && (
                <button onClick={() => setIsZenMode(true)} className="p-3 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-[#21262d] rounded-full transition-colors" title="Toàn màn hình">
                  <Maximize2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH CÔNG VIỆC TỪ KANBAN (Chuẩn Todo App) --- */}
        {!isZenMode && (
          <div className="w-full lg:w-[380px] h-[550px] bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Danh sách công việc</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Chọn một việc để ghi nhận thời gian</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
              {tasks.length === 0 ? (
                <div className="text-center text-slate-500 text-sm py-10">
                  Không có công việc đang thực hiện.
                </div>
              ) : (
                tasks.map(task => {
                  const isSelected = selectedTaskId === task.id;
                  const timeSpent = (task as any).timeSpent || 0;
                  
                  return (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                        isSelected 
                          ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30' 
                          : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-[#21262d]'
                      }`}
                    >
                      <div className="pt-0.5 shrink-0">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-rose-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[11px] text-slate-500 dark:text-slate-500">
                            {task.status === 'DOING' ? 'Đang làm' : 'Cần làm'}
                          </span>
                          {timeSpent > 0 && (
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              Đã làm: {timeSpent}p
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}