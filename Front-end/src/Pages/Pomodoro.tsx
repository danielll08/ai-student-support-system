import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Square, ChevronDown, Activity, Zap, Clock, Timer } from 'lucide-react';
import { mockPomodoroSessions } from '@/data/mockData';

type Phase = 'focus' | 'short_break' | 'long_break';

interface Session {
  id: number;
  subject: string;
  date: string;
  duration: number;
  status: 'HOÀN THÀNH';
}

const DURATIONS: Record<Phase, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

const phaseLabels: Record<Phase, string> = {
  focus: 'TẬP TRUNG',
  short_break: 'NGHỈ NGẮN',
  long_break: 'NGHỈ DÀI',
};

const subjects = ['Java', 'Machine Learning', 'Database', 'Math', 'React', 'Algorithms', 'English', 'Data Structures'];

const sessionHistory: Session[] = mockPomodoroSessions.map((item) => ({
  id: Number(item.id),
  subject: item.subject,
  date: `${new Date(item.date).toLocaleDateString('vi-VN')} · ${item.duration} phút`,
  duration: item.duration,
  status: item.completed ? 'HOÀN THÀNH' : 'HOÀN THÀNH',
}));

export function Pomodoro() {
  const todayKey = new Date().toLocaleDateString('vi-VN');
  const todaySessionsCount = sessionHistory.filter((session) => session.date.startsWith(todayKey)).length;
  const todayHoursValue = Number(
    (sessionHistory.filter((session) => session.date.startsWith(todayKey)).reduce((sum, session) => sum + session.duration, 0) / 60).toFixed(1)
  );
  const completedCountValue = sessionHistory.filter((session) => session.status === 'HOÀN THÀNH').length;
  const totalHoursValue = Number((sessionHistory.reduce((sum, session) => sum + session.duration, 0) / 60).toFixed(1));

  const [phase, setPhase] = useState<Phase>('focus');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sessions, setSessions] = useState<Session[]>(sessionHistory);
  const [todaySessions, setTodaySessions] = useState(todaySessionsCount);
  const [todayHours, setTodayHours] = useState(todayHoursValue);
  const [completedCount, setCompletedCount] = useState(completedCountValue);
  const [totalHours] = useState(totalHoursValue);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [focusEnabled, setFocusEnabled] = useState(false);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (phase === 'focus') {
              const newSession: Session = {
                id: Date.now(),
                subject: selectedSubject || 'Không có chủ đề',
                date: `${new Date().toISOString().slice(0, 10)} · 25 phút`,
                duration: 25,
                status: 'HOÀN THÀNH',
              };
              setSessions(prev => [newSession, ...prev]);
              setCompletedCount(c => c + 1);
              setTodaySessions(s => s + 1);
              setTodayHours(h => parseFloat((h + 25 / 60).toFixed(1)));
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, selectedSubject]);

  const switchPhase = (p: Phase) => {
    setPhase(p);
    setTimeLeft(DURATIONS[p]);
    setRunning(false);
  };

  const reset = () => {
    setTimeLeft(DURATIONS[phase]);
    setRunning(false);
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const progress = 1 - timeLeft / DURATIONS[phase];
  const circumference = 2 * Math.PI * 110;

  return (
    <div className="p-5 h-full">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-950 dark:text-white">Pomodoro & Focus Mode</h1>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Bật chế độ học tập, đếm giờ Pomodoro, theo dõi phiên học và tổng giờ tập trung.</p>
      </div>

      <div className="grid grid-cols-3 gap-5 h-[calc(100%-70px)]">
        {/* Timer panel */}
        <div className="col-span-2 bg-white dark:bg-[#161b27] border border-slate-200 dark:border-[#252d3d] rounded-2xl p-6 flex flex-col">
          {/* Phase selector */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-gray-400 tracking-widest">FOCUS</span>
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#1a2030] rounded-lg p-0.5 border border-slate-200 dark:border-[#252d3d]">
                {(['focus', 'short_break', 'long_break'] as Phase[]).map(p => (
                  <button
                    key={p}
                    onClick={() => switchPhase(p)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      phase === p ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-slate-600 dark:text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {p === 'focus' ? '25 min' : p === 'short_break' ? '5 min' : '15 min'}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setFocusEnabled(!focusEnabled)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                focusEnabled
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                  : 'bg-slate-50 dark:bg-[#1a2030] border-slate-200 dark:border-[#252d3d] text-slate-700 dark:text-gray-500 hover:text-gray-300'
              }`}
            >
              {focusEnabled ? 'ĐÃ BẬT' : 'CHƯA BẬT'}
            </button>
          </div>

          {/* Circular timer */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative mb-8">
              <svg width="260" height="260" className="-rotate-90">
                <circle cx="130" cy="130" r="110" stroke="#e6eef6" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="130" cy="130" r="110"
                  stroke="url(#pomGrad)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  strokeLinecap="round"
                  animate={{ strokeDashoffset: circumference * (1 - progress) }}
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="pomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-6xl font-bold text-slate-950 dark:text-white tracking-tight font-mono">{mm}:{ss}</div>
                <div className="text-xs text-slate-500 dark:text-gray-400 mt-2 font-medium tracking-widest">{phaseLabels[phase]}</div>
                {running && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 bg-blue-400 rounded-full mt-2"
                  />
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setRunning(!running)}
                className="flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-purple-500/30"
              >
                {running ? <Square className="w-4 h-4" fill="white" /> : <Play className="w-4 h-4" fill="white" />}
                {running ? 'Dừng' : 'Bắt đầu'}
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-[#1e2534] hover:bg-slate-100 dark:hover:bg-[#252d3d] rounded-2xl text-sm font-medium text-slate-700 dark:text-gray-400 hover:text-white transition-all border border-slate-200 dark:border-[#252d3d]"
              >
                <RotateCcw className="w-4 h-4" />
                Đặt lại
              </button>
            </div>

            {/* Subject selector */}
            <div className="w-full max-w-sm">
                <label className="text-xs text-slate-500 dark:text-gray-400 mb-2 block">Chủ đề học</label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full bg-white dark:bg-[#1a2030] border border-slate-200 dark:border-[#252d3d] rounded-xl px-4 py-2.5 text-sm text-slate-950 dark:text-gray-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                >
                  <option value="">Chọn chủ đề</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-slate-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><Timer className="w-3 h-3" /> 25 phút học</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 5 phút nghỉ ngắn</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 15 phút nghỉ dài sau 4 phiên</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats panel */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <div>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">Thống kê Focus</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Activity, iconClass: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Phiên hoàn thành', value: completedCount },
                { icon: Zap, iconClass: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Giờ tập trung', value: `${totalHours} h` },
                { icon: Activity, iconClass: 'text-green-400', bg: 'bg-green-500/10', label: 'Phiên hôm nay', value: todaySessions },
                { icon: Clock, iconClass: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Giờ hôm nay', value: `${todayHours.toFixed(1)} h` },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-[#252d3d] rounded-xl p-3">
                  <div className={`w-7 h-7 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}>
                    <stat.icon className={`w-3.5 h-3.5 ${stat.iconClass}`} />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400 mb-0.5">{stat.label}</div>
                  <div className="text-lg font-bold text-slate-950 dark:text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Session history */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-2">Lịch sử phiên học</h3>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {sessions.map(session => (
                <div key={session.id} className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-[#252d3d] rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-slate-950 dark:text-gray-200">{session.subject}</div>
                    <div className="text-[10px] text-slate-600 dark:text-gray-400 mt-0.5">{session.date}</div>
                  </div>
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md">
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
