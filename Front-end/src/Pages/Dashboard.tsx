import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Tooltip, Area, AreaChart
} from 'recharts';
import { CheckCircle2, AlertCircle, Timer, Zap, TrendingUp, Plus, ChevronRight, BookOpen, Bot, CheckSquare } from 'lucide-react';
import { mockTasks, mockDailyStats, mockSubjectWorkload } from '@/data/mockData';
// Định nghĩa trực tiếp kiểu Page để không cần import từ file khác nữa
export type Page = 'dashboard' | 'tasks' | 'kanban' | 'schedule' | 'pomodoro' | 'ai' | 'groups';
const weekData = mockDailyStats.slice(-7).map((item) => ({
  day: item.date.slice(5),
  hours: item.hoursStudied,
}));

const workloadData = mockSubjectWorkload.map((item) => ({
  subject: item.subject,
  tasks: item.taskCount,
}));

const todayTasks = mockTasks.filter((task) => task.status !== 'done').slice(0, 3);

const priorityColors: Record<string, string> = {
  HIGH: 'text-red-400 bg-red-500/10',
  MEDIUM: 'text-yellow-400 bg-yellow-500/10',
  LOW: 'text-green-400 bg-green-500/10',
};

interface DashboardProps {
  setCurrentPage: (page: Page) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-slate-950 border border-slate-200 rounded-lg px-3 py-2 shadow-xl dark:bg-[#1e2534] dark:border-[#2a3444] dark:text-white">
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-sm text-slate-950 dark:text-white font-semibold">{payload[0].value} giờ</p>
      </div>
    );
  }

  return null;
};

const WorkloadTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-slate-950 border border-slate-200 rounded-lg px-3 py-2 shadow-xl dark:bg-[#1e2534] dark:border-[#2a3444] dark:text-white">
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-sm text-slate-950 dark:text-white font-semibold">{payload[0].value} tasks</p>
      </div>
    );
  }

  return null;
};

export function Dashboard() {
  const totalTasks = mockTasks.length;
  const doneTasks = mockTasks.filter((task) => task.status === 'done').length;
  const overdueTasks = mockTasks.filter((task) => task.status !== 'done' && new Date(task.deadline) < new Date()).length;
  const studyHours = mockDailyStats.length
    ? Number((mockDailyStats.reduce((sum, item) => sum + item.hoursStudied, 0) / mockDailyStats.length).toFixed(1))
    : 0;
  const progressPercent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const circumference = 2 * Math.PI * 68;

  return (
    <div className="p-5 space-y-5">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-gray-500 mb-1">Chào buổi sáng, Nguyễn 👋</p>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Kiểm tra lịch trình và công việc của bạn
        </h2>
        <p className="text-xs text-gray-500 mt-1">Thứ Sáu, 29 tháng 5 năm 2026 · Chúc bạn học tập hiệu quả!</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            icon: CheckCircle2, iconClass: 'text-green-400', bgClass: 'bg-green-500/10 group-hover:bg-green-500/20',
            value: doneTasks, label: 'Hoàn thành', sub: `/${totalTasks} tasks`, borderHover: 'hover:border-green-500/30', delay: 0.1,
          },
          {
            icon: AlertCircle, iconClass: 'text-red-400', bgClass: 'bg-red-500/10 group-hover:bg-red-500/20',
            value: overdueTasks, label: 'Đang làm', sub: 'tasks còn lại', borderHover: 'hover:border-red-500/30', delay: 0.15,
          },
          {
            icon: Timer, iconClass: 'text-purple-400', bgClass: 'bg-purple-500/10 group-hover:bg-purple-500/20',
            value: `${studyHours}h`, label: 'Giờ học', sub: 'tuần này', borderHover: 'hover:border-purple-500/30', delay: 0.2,
          },
          {
            icon: TrendingUp, iconClass: 'text-blue-400', bgClass: 'bg-blue-500/10 group-hover:bg-blue-500/20',
            value: `${progressPercent}%`, label: 'Hiệu suất', sub: '↑ 5% so tuần trước', borderHover: 'hover:border-blue-500/30', delay: 0.25,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            className={`bg-white border border-slate-200 dark:bg-[#161b27] dark:border-[#252d3d] ${stat.borderHover} rounded-2xl p-4 group transition-all duration-200 cursor-default`}
          >
            <div className={`w-9 h-9 ${stat.bgClass} rounded-xl flex items-center justify-center mb-3 transition-colors`}>
              <stat.icon className={`w-4 h-4 ${stat.iconClass}`} />
            </div>
            <div className="text-2xl font-bold text-slate-950 dark:text-white mb-0.5">{stat.value}</div>
            <div className="text-xs text-slate-500 dark:text-gray-400">{stat.label}</div>
            <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: charts */}
        <div className="col-span-2 space-y-5">
          {/* Weekly progress chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-slate-200 dark:bg-[#161b27] dark:border-[#252d3d] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Tiến độ tuần này</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Tổng {studyHours} giờ học</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-xs text-gray-500">Giờ học</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weekData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2534" vertical={false} />
                <XAxis dataKey="day" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fill="url(#hoursGrad)"
                  dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#a78bfa', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Workload chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-slate-200 dark:bg-[#161b27] dark:border-[#252d3d] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Workload theo môn</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Tổng {totalTasks} tasks đang hoạt động</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-500">Tasks</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={workloadData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2534" horizontal={true} vertical={false} />
                <XAxis dataKey="subject" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<WorkloadTooltip />} />
                <Bar dataKey="tasks" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Right: progress + tasks */}
        <div className="space-y-5">
          {/* Progress circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-slate-200 dark:bg-[#161b27] dark:border-[#252d3d] rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Tổng quan</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-36 h-36 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" stroke="#1e2534" strokeWidth="10" fill="none" />
                  <circle
                    cx="80" cy="80" r="68"
                    stroke="url(#circleGrad)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{progressPercent}%</div>
                    <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">Hiệu suất</div>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Hoàn thành</span>
                  <span className="text-xs font-medium text-green-400">{doneTasks} tasks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Đang làm</span>
                  <span className="text-xs font-medium text-blue-400">3 tasks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Chưa bắt đầu</span>
                  <span className="text-xs font-medium text-gray-400">5 tasks</span>
                </div>
                <button
                  onClick={() => {}}
                  className="w-full mt-2 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-xs font-medium transition-all hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-1.5"
                >
                  Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Today tasks */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-slate-200 dark:bg-[#161b27] dark:border-[#252d3d] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Cần làm hôm nay</h3>
              <button
                onClick={() => {}}
                className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors"
              >
                Xem tất cả
              </button>
            </div>
            <div className="space-y-2.5">
              {todayTasks.map((task) => (
                <div key={task.id} className="bg-white dark:bg-[#1a2030] rounded-xl p-3 border border-slate-200 dark:border-[#252d3d] dark:hover:border-[#3a4455] hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-xs font-medium text-slate-950 dark:text-gray-200 leading-tight line-clamp-2">{task.title}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-500 dark:text-gray-400">{task.subject} · {task.deadline}</span>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400">{task.progress}%</span>
                  </div>
                  <div className="h-1 bg-[#252d3d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-slate-200 dark:bg-[#161b27] dark:border-[#252d3d] rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">Thao tác nhanh</h3>
            <div className="space-y-2">
              {[
                { icon: Plus, label: 'Thêm task mới', iconClass: 'text-blue-400', bg: 'bg-blue-500/10', page: 'tasks' as Page },
                { icon: Timer, label: 'Bắt đầu Pomodoro', iconClass: 'text-purple-400', bg: 'bg-purple-500/10', page: 'pomodoro' as Page },
                { icon: Bot, label: 'Hỏi AI Assistant', iconClass: 'text-green-400', bg: 'bg-green-500/10', page: 'ai' as Page },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 dark:bg-[#1a2030] dark:hover:bg-[#1e2534] dark:text-gray-200 border border-slate-200 dark:border-[#252d3d] dark:hover:border-[#3a4455] transition-all text-left group"
                >
                  <div className={`w-7 h-7 ${action.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <action.icon className={`w-3.5 h-3.5 ${action.iconClass}`} />
                  </div>
                  <span className="text-xs text-slate-700 dark:text-gray-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{action.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 dark:text-gray-400 ml-auto group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
