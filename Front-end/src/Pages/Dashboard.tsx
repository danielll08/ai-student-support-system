import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckSquare, Timer, Clock, TrendingUp, Flame, ArrowUp, ArrowDown, Circle, CheckCircle2, Calendar, Plus, BookMarked, GitPullRequest, Sparkles, ChevronRight, Zap } from 'lucide-react';

export type Page = 'dashboard' | 'tasks' | 'kanban' | 'schedule' | 'pomodoro' | 'ai' | 'groups';

const stats = [
  { label: "Hoàn thành", value: "12", unit: "nhiệm vụ", icon: <CheckSquare size={20} />, bg: "#F0F4FF", color: "#4F46E5", change: "+3 tuần này", up: true },
  { label: "Đang làm", value: "3", unit: "nhiệm vụ", icon: <Zap size={20} />, bg: "#FFF7ED", color: "#F97316", change: "2 sắp đến hạn", up: false },
  { label: "Giờ học", value: "30.7", unit: "giờ", icon: <Clock size={20} />, bg: "#E0F2FE", color: "#0284C7", change: "+5.2h tuần này", up: true },
  { label: "Hiệu suất", value: "72", unit: "%", icon: <TrendingUp size={20} />, bg: "#F0FDF4", color: "#15803D", change: "+8% tháng này", up: true },
];

const weekData = [
  { day: "T2", hours: 2.5, tasks: 3 },
  { day: "T3", hours: 4.2, tasks: 5 },
  { day: "T4", hours: 3.8, tasks: 4 },
  { day: "T5", hours: 5.5, tasks: 7 },
  { day: "T6", hours: 4.8, tasks: 6 },
  { day: "T7", hours: 6.2, tasks: 8 },
  { day: "CN", hours: 3.0, tasks: 4 },
];

const pieData = [
  { name: "Hoàn thành", value: 12, color: "#4F46E5" },
  { name: "Đang làm", value: 3, color: "#E5E7EB" },
  { name: "Chờ duyệt", value: 5, color: "#BFDBFE" },
];

const taskList = [
  { id: 1, title: "Nộp bài tập CSS", subject: "Giao diện", subjectColor: "#4F46E5", dueTime: "Hôm nay 23:59", priority: "high", done: false },
  { id: 2, title: "Review slide KTM", subject: "Kinh tế", subjectColor: "#F97316", dueTime: "Hôm nay 22:00", priority: "medium", done: false },
  { id: 3, title: "Commit project React", subject: "Lập trình", subjectColor: "#0284C7", dueTime: "Ngày mai 08:00", priority: "low", done: true },
];

const priorityConfig = {
  high: { color: "#DC2626", bg: "#FEE2E2", label: "Cao" },
  medium: { color: "#D97706", bg: "#FEF3C7", label: "Trung bình" },
  low: { color: "#059669", bg: "#DBEAFE", label: "Thấp" },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg p-3 border border-gray-200" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
        <p className="text-xs text-gray-600 font-medium mb-1">{payload[0].payload.day}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <p className="text-sm font-semibold text-gray-900">
              {entry.value}{entry.dataKey === "hours" ? "h" : " task"}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Chào buổi sáng" : currentHour < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  const greetingEmoji = currentHour < 12 ? "🌅" : currentHour < 18 ? "☀️" : "🌙";
  const totalHours = weekData.reduce((sum, d) => sum + d.hours, 0).toFixed(1);
  const total = pieData.reduce((s, d) => s + d.value, 0);
  const completion = Math.round((pieData[0].value / total) * 100);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#F0F2F8" }}>
      <div className="flex gap-5 p-5 min-h-full">
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden p-7"
            style={{
              background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4C1D95 75%, #5B21B6 100%)",
              boxShadow: "0 20px 60px rgba(79, 70, 229, 0.35)",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #A78BFA, transparent)", transform: "translate(30%, -30%)" }} />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #818CF8, transparent)", transform: "translate(0, 40%)" }} />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #C4B5FD, transparent)", transform: "translate(0, -50%)" }} />
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full" style={{ fontSize: "12px", fontWeight: 500 }}>
                    <span>{greetingEmoji}</span>
                    <span>{new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" })}</span>
                  </span>
                </div>
                <h1 className="text-white mb-2" style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.2 }}>
                  {greeting}, Nguyễn! 👋
                </h1>
                <p className="text-indigo-200" style={{ fontSize: "14px", maxWidth: "400px", lineHeight: 1.6 }}>
                  Bạn đang có <strong className="text-white">3 nhiệm vụ</strong> cần hoàn thành hôm nay. Hãy tiếp tục giữ phong độ!
                </p>

                <div className="flex items-center gap-4 mt-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-indigo-200" style={{ fontSize: "13px" }}>72% mục tiêu tuần</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <Flame size={13} className="text-amber-400" />
                    <span className="text-indigo-200" style={{ fontSize: "13px" }}>7 ngày liên tục</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-center gap-3 shrink-0">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="url(#progressGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 40 * 0.72} ${2 * Math.PI * 40 * 0.28}`} />
                    <defs>
                      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A78BFA" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white" style={{ fontSize: "20px", fontWeight: 700 }}>72%</span>
                    <span className="text-indigo-300" style={{ fontSize: "10px" }}>hiệu suất</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style={{ background: stat.gradient, boxShadow: `0 6px 16px ${stat.color}40` }}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: stat.up ? "#F0FDF4" : "#FEF3C7", color: stat.up ? "#16A34A" : "#D97706" }}>
                    {stat.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                    <span style={{ fontSize: "10px", fontWeight: 600 }}>{stat.up ? "Tốt" : "Chú ý"}</span>
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-slate-900" style={{ fontSize: "30px", fontWeight: 700, lineHeight: 1 }}>{stat.value}</span>
                  <span className="text-slate-400 mb-0.5" style={{ fontSize: "13px" }}>{stat.unit}</span>
                </div>
                <p className="text-slate-500 mt-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>{stat.label}</p>
                <p className="mt-1" style={{ fontSize: "11px", color: stat.up ? "#16A34A" : "#D97706", fontWeight: 500 }}>{stat.change}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 700 }}>Tiến độ tuần này</h3>
                <p className="text-slate-400 mt-0.5" style={{ fontSize: "13px" }}>Giờ học và nhiệm vụ hoàn thành mỗi ngày</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-xl">
                  <TrendingUp size={12} />
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>+12% tuần này</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }} />
                <span className="text-slate-500" style={{ fontSize: "12px" }}>Giờ học</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)" }} />
                <span className="text-slate-500" style={{ fontSize: "12px" }}>Nhiệm vụ</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-slate-400" style={{ fontSize: "12px" }}>Tổng:</span>
                <span className="text-slate-900" style={{ fontSize: "14px", fontWeight: 700 }}>{totalHours}h</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weekData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tasksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E2E8F0", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="hours" stroke="#6366F1" strokeWidth={2.5} fill="url(#hoursGrad)" dot={{ r: 3.5, fill: "#6366F1", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 5, fill: "#6366F1", stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="tasks" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#tasksGrad)" dot={{ r: 3.5, fill: "#0EA5E9", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 5, fill: "#0EA5E9", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <aside className="w-72 shrink-0 flex flex-col gap-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900" style={{ fontSize: "14px", fontWeight: 700 }}>Tổng tiến độ</h3>
              <span className="bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg" style={{ fontSize: "11px", fontWeight: 500 }}>Tuần này</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={42} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-slate-900" style={{ fontSize: "20px", fontWeight: 800 }}>{completion}%</span>
                  <span className="text-slate-400" style={{ fontSize: "9px" }}>hoàn thành</span>
                </div>
              </div>

              <div className="flex-1 space-y-2.5">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-slate-500" style={{ fontSize: "11px" }}>{item.name}</span>
                    </div>
                    <span className="text-slate-800" style={{ fontSize: "12px", fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${completion}%`, background: "linear-gradient(90deg, #6366F1, #8B5CF6, #A78BFA)", boxShadow: "0 2px 6px rgba(99,102,241,0.4)" }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-slate-400" style={{ fontSize: "11px" }}>0%</span>
                <span className="text-indigo-600" style={{ fontSize: "11px", fontWeight: 600 }}>{completion}% mục tiêu</span>
                <span className="text-slate-400" style={{ fontSize: "11px" }}>100%</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "linear-gradient(135deg, #F5F3FF, #EFF6FF)", border: "1px solid #DDD6FE" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #8B5CF6, #6366F1)" }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-indigo-900" style={{ fontSize: "12px", fontWeight: 600 }}>Gợi ý từ AI</p>
              <p className="text-indigo-700 mt-0.5" style={{ fontSize: "11px", lineHeight: 1.5 }}>
                Bạn học hiệu quả nhất vào <strong>19:00–21:00</strong>. Hãy sắp xếp bài khó vào khung giờ này.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-5 flex-1" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900" style={{ fontSize: "14px", fontWeight: 700 }}>Cần làm hôm nay</h3>
              <button className="text-indigo-500 hover:text-indigo-700 transition-colors" style={{ fontSize: "12px", fontWeight: 600 }}>
                Xem tất cả
              </button>
            </div>

            <div className="space-y-2.5">
              {taskList.map((task) => {
                const pConfig = priorityConfig[task.priority as keyof typeof priorityConfig];
                return (
                  <div key={task.id} className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer group ${task.done ? "opacity-60" : "hover:border-indigo-200 hover:shadow-sm"}`} style={{ borderColor: "#F1F5F9", background: task.done ? "#FAFAFA" : "#fff" }}>
                    <button className="mt-0.5 shrink-0 transition-colors">
                      {task.done ? (
                        <CheckCircle2 size={16} className="text-indigo-400" />
                      ) : (
                        <Circle size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`truncate ${task.done ? "line-through text-slate-400" : "text-slate-800"}`} style={{ fontSize: "13px", fontWeight: 500 }}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md" style={{ fontSize: "10px", fontWeight: 600, color: task.subjectColor, background: `${task.subjectColor}15` }}>
                          {task.subject}
                        </span>
                        <Clock size={9} className="text-slate-400" />
                        <span className="text-slate-400" style={{ fontSize: "10px" }}>{task.dueTime}</span>
                      </div>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-lg" style={{ fontSize: "10px", fontWeight: 600, color: pConfig.color, background: pConfig.bg }}>
                      {pConfig.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
              <p className="text-slate-400 mb-3" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Thao tác nhanh</p>
              <div className="space-y-2">
                {[
                  { icon: <Plus size={14} />, label: "Thêm nhiệm vụ", color: "#6366F1", bg: "#EEF2FF" },
                  { icon: <BookMarked size={14} />, label: "Ghi chú nhanh", color: "#0EA5E9", bg: "#F0F9FF" },
                  { icon: <GitPullRequest size={14} />, label: "Thêm dự án", color: "#10B981", bg: "#F0FDF4" },
                ].map((action) => (
                  <button key={action.label} className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-all group text-left">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: action.bg, color: action.color }}>
                      {action.icon}
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors" style={{ fontSize: "12px", fontWeight: 500 }}>
                      {action.label}
                    </span>
                    <ChevronRight size={12} className="text-slate-300 ml-auto group-hover:text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
