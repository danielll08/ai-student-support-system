import { ChevronLeft, ChevronRight, Plus, Search, Zap, Check, PanelRightOpen, PanelRightClose, Filter } from 'lucide-react';
import { CATEGORIES } from './ScheduleData';

export function ScheduleHeader({ 
  currentView, setCurrentView, aiInput, setAiInput, activeCategories, toggleCategory, showTaskPanel, setShowTaskPanel, setShowEventModal 
}: any) {
  return (
    <header className="px-6 py-3 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-20">
      
      {/* Cụm điều hướng & View Switcher */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block">Tháng 6, 2026</h2>
        <div className="flex items-center gap-1 border border-slate-200 dark:border-white/10 rounded-md p-0.5 bg-slate-50 dark:bg-[#151b28]">
          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
          <button className="px-3 py-1 text-[13px] font-semibold text-slate-700 dark:text-slate-300">Hôm nay</button>
          <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
        </div>
        
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-[#151b28] border border-slate-200 dark:border-white/5 rounded-md p-0.5">
          {['Ngày', 'Tuần', 'Tháng'].map(view => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-3 py-1 text-[12px] font-semibold rounded-sm transition-all ${currentView === view ? 'bg-white dark:bg-[#2a3441] text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* AI Input */}
      <div className="flex-1 max-w-sm mx-4 hidden xl:block">
        <div className="relative group">
          <Zap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 group-focus-within:text-cyan-600 transition-colors" />
          <input 
            type="text" 
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Nhập: Họp nhóm lúc 3h chiều..." 
            className="w-full pl-9 pr-14 py-1.5 bg-slate-100 dark:bg-[#151b28] border border-transparent rounded-md text-[13px] focus:outline-none focus:bg-white dark:focus:bg-[#0b1120] focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-500"
          />
          <button className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] bg-cyan-600 text-white px-2 py-1 rounded font-bold transition-all ${aiInput ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            Tạo
          </button>
        </div>
      </div>

      {/* Các nút công cụ bên phải */}
      <div className="flex items-center gap-2">
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-white/10 rounded-md text-[13px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#151b28] transition-colors">
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Lọc</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#1e2532] border border-slate-200 dark:border-slate-700 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1.5">
            <div className="px-2 py-1 mb-1 border-b border-slate-100 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Danh mục</span>
            </div>
            {CATEGORIES.map(cat => (
              <label key={cat.id} className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 dark:hover:bg-[#2a3441] rounded cursor-pointer group/item">
                <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border transition-colors ${activeCategories.includes(cat.id) ? `${cat.color} border-transparent` : 'border-slate-300 dark:border-slate-600 group-hover/item:border-slate-400'}`}>
                  {activeCategories.includes(cat.id) && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowTaskPanel(!showTaskPanel)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all border ${showTaskPanel ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/50' : 'bg-white dark:bg-[#0b1120] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#151b28]'}`}
        >
          {showTaskPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          <span className="hidden sm:inline">Chờ xếp lịch</span>
        </button>

        <button 
          onClick={() => setShowEventModal(true)}
          className="flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white w-8 h-8 rounded-md transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}