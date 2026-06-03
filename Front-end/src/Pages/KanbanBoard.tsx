import { useState } from 'react';
import { Layout, Clock, Star, Settings, Plus, LayoutGrid } from 'lucide-react';
// Đảm bảo import đúng đường dẫn component vừa tạo
import { BoardDetail } from '../components/kanban/BoardDetail';

// MOCK DATA: Danh sách các bảng dự án
const MOCK_BOARDS = [
  { id: 'b1', name: 'RunNow!! Workspace', bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', starred: true },
  { id: 'b2', name: 'Đồ án Tốt Nghiệp', bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', starred: false },
  { id: 'b3', name: 'Học ReactJS & Node', bg: 'bg-gradient-to-br from-rose-500 to-orange-500', starred: true },
];

export function KanbanBoard() {
  const [activeBoard, setActiveBoard] = useState<{ id: string; name: string } | null>(null);

  // NẾU ĐÃ CHỌN BẢNG -> RENDER BOARD DETAIL
  if (activeBoard) {
    return (
      <BoardDetail 
        boardName={activeBoard.name} 
        onBack={() => setActiveBoard(null)} 
      />
    );
  }

  // NẾU CHƯA CHỌN BẢNG -> RENDER DANH SÁCH BẢNG (BOARD LIST)
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Các Bảng Của Bạn</h1>
          <p className="text-slate-500 dark:text-slate-400">Chọn một không gian làm việc để xem chi tiết tiến độ.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Tạo bảng mới
        </button>
      </div>

      {/* Đã xem gần đây / Đánh dấu sao */}
      <div className="mb-10">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
          <Star className="w-5 h-5 text-amber-500" /> Bảng nổi bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_BOARDS.filter(b => b.starred).map(board => (
            <div 
              key={board.id} 
              onClick={() => setActiveBoard(board)}
              className={`${board.bg} rounded-xl p-5 aspect-[4/3] flex flex-col justify-end cursor-pointer group relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <h3 className="relative z-10 text-white font-bold text-lg">{board.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Tất cả các bảng */}
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
          <LayoutGrid className="w-5 h-5 text-slate-500" /> Không gian làm việc
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_BOARDS.map(board => (
            <div 
              key={board.id} 
              onClick={() => setActiveBoard(board)}
              className={`${board.bg} rounded-xl p-5 aspect-[4/3] flex flex-col justify-end cursor-pointer group relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <h3 className="relative z-10 text-white font-bold text-lg">{board.name}</h3>
            </div>
          ))}
          
          {/* Nút tạo bảng */}
          <div className="rounded-xl p-5 aspect-[4/3] flex flex-col items-center justify-center cursor-pointer bg-slate-100 dark:bg-[#151b28] border-2 border-dashed border-slate-300 dark:border-[#2a3441] hover:bg-slate-200 dark:hover:bg-[#1e2532] transition-colors group">
            <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
            <span className="text-sm font-semibold text-slate-500 group-hover:text-blue-500 transition-colors">Tạo bảng mới</span>
          </div>
        </div>
      </div>

    </div>
  );
}