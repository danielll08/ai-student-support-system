import { useState, useMemo } from 'react';
import { 
  Star, 
  Plus, 
  LayoutGrid, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  X,
  Lock,
  Users,
  Check
} from 'lucide-react';
import { BoardDetail } from '../components/kanban/BoardDetail';

// MOCK DATAx 
const INITIAL_FOLDERS = [
  {
    id: 'f1',
    name: 'Dự án Cá nhân',
    isExpanded: true,
    boards: [
      { id: 'b1', name: 'RunNow!! Workspace', bg: 'https://images.unsplash.com/photo-1506744626753-1fa44df14d28?q=80&w=800&auto=format&fit=crop', bgType: 'image', starred: true, visibility: 'Riêng tư' },
      { id: 'b4', name: 'Portfolio Website', bg: 'bg-gradient-to-br from-purple-500 to-indigo-600', bgType: 'color', starred: true, visibility: 'Không gian làm việc' },
    ]
  },
  {
    id: 'f2',
    name: 'Học tập & Trường lớp',
    isExpanded: true,
    boards: [
      { id: 'b2', name: 'Đồ án Tốt Nghiệp', bg: 'bg-gradient-to-br from-emerald-400 to-teal-600', bgType: 'color', starred: false, visibility: 'Không gian làm việc' },
      { id: 'b3', name: 'Học ReactJS & Node', bg: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800&auto=format&fit=crop', bgType: 'image', starred: false, visibility: 'Riêng tư' },
    ]
  }
];

const BACKGROUND_OPTIONS = [
  { id: 'img1', type: 'image', value: 'https://images.unsplash.com/photo-1506744626753-1fa44df14d28?q=80&w=400&auto=format&fit=crop' },
  { id: 'img2', type: 'image', value: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=400&auto=format&fit=crop' },
  { id: 'img3', type: 'image', value: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=400&auto=format&fit=crop' },
  { id: 'img4', type: 'image', value: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=400&auto=format&fit=crop' },
  { id: 'color1', type: 'color', value: 'bg-blue-600' },
  { id: 'color2', type: 'color', value: 'bg-indigo-600' },
  { id: 'color3', type: 'color', value: 'bg-emerald-600' },
  { id: 'color4', type: 'color', value: 'bg-rose-600' },
];

export function KanbanBoard() {
  const [activeBoard, setActiveBoard] = useState<any | null>(null);
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [addingBoardToFolder, setAddingBoardToFolder] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_OPTIONS[0]);
  const [visibility, setVisibility] = useState('Không gian làm việc');

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    return folders.map(folder => ({
      ...folder,
      boards: folder.boards.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    })).filter(folder => folder.boards.length > 0);
  }, [folders, searchQuery]);

  const starredBoards = useMemo(() => {
    return folders.flatMap(f => f.boards).filter(b => b.starred);
  }, [folders]);

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(f => 
      f.id === folderId ? { ...f, isExpanded: !f.isExpanded } : f
    ));
  };

  const handleToggleStar = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    setFolders(folders.map(f => ({
      ...f,
      boards: f.boards.map(b => b.id === boardId ? { ...b, starred: !b.starred } : b)
    })));
  };

  const handleCloseModal = () => {
    setIsAddingFolder(false);
    setAddingBoardToFolder(null);
    setNewItemName('');
    setSelectedBg(BACKGROUND_OPTIONS[0]);
    setVisibility('Không gian làm việc');
  };

  const handleSaveItem = () => {
    if (!newItemName.trim()) return;

    if (isAddingFolder) {
      const newFolder = { id: `f-${Date.now()}`, name: newItemName, isExpanded: true, boards: [] };
      setFolders([newFolder, ...folders]);
    } else if (addingBoardToFolder) {
      const newBoard = {
        id: `b-${Date.now()}`,
        name: newItemName,
        bg: selectedBg.value,
        bgType: selectedBg.type,
        starred: false,
        visibility: visibility
      };

      setFolders(folders.map(f => {
        if (f.id === addingBoardToFolder) {
          return { ...f, isExpanded: true, boards: [...f.boards, newBoard] };
        }
        return f;
      }));
    }
    handleCloseModal();
  };

  if (activeBoard) {
  return <BoardDetail board={activeBoard} onBack={() => setActiveBoard(null)} />;
}

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen text-slate-900 dark:text-slate-200">
      
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
            Không Gian Làm Việc
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm bảng..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-[#22272b] border border-slate-300 dark:border-slate-700 rounded text-sm w-full md:w-64 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setIsAddingFolder(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Thư mục
          </button>
        </div>
      </div>

      {/* BẢNG NỔI BẬT */}
      {!searchQuery && starredBoards.length > 0 && (
        <div className="mb-10">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
            <Star className="w-5 h-5 text-slate-500" /> Bảng đã đánh dấu sao
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {starredBoards.map(board => (
              <BoardCard 
                key={`starred-${board.id}`} 
                board={board} 
                onClick={() => setActiveBoard(board)} 
                onToggleStar={(e) => handleToggleStar(e, board.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* DANH SÁCH THƯ MỤC & BẢNG */}
      <div className="space-y-8">
        {filteredFolders.map(folder => (
          <div key={folder.id} className="pb-4">
            <div className="flex items-center group cursor-pointer mb-4" onClick={() => toggleFolder(folder.id)}>
              <div className="w-8 h-8 flex items-center justify-center bg-slate-200 dark:bg-[#22272b] rounded mr-3">
                 <span className="text-sm font-bold">{folder.name.charAt(0)}</span>
              </div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {folder.name}
              </h2>
            </div>

            {folder.isExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {folder.boards.map(board => (
                  <BoardCard 
                    key={board.id} 
                    board={board} 
                    onClick={() => setActiveBoard(board)} 
                    onToggleStar={(e) => handleToggleStar(e, board.id)}
                  />
                ))}
                
                {/* Nút Tạo Bảng Mới (Phong cách Trello phẳng) */}
                <div 
                  onClick={() => setAddingBoardToFolder(folder.id)}
                  className="h-[100px] rounded-md flex items-center justify-center cursor-pointer bg-slate-100 dark:bg-[#22272b] hover:bg-slate-200 dark:hover:bg-[#2c333a] transition-colors"
                >
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Tạo bảng mới</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL TẠO MỚI (Giữ nguyên logic cũ, chỉ gọt lại UI xíu) */}
      {(isAddingFolder || addingBoardToFolder) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#22272b] w-full max-w-xs rounded shadow-lg overflow-hidden relative">
            <div className="px-4 py-3 flex items-center justify-center relative border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {isAddingFolder ? 'Tạo không gian làm việc' : 'Tạo bảng'}
              </h3>
              <button onClick={handleCloseModal} className="absolute right-3 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              {addingBoardToFolder && (
                <div className="mb-4">
                  <div className="flex justify-center mb-4">
                    <div 
                      className={`w-40 h-24 rounded shadow-sm flex items-center justify-center ${selectedBg.type === 'color' ? selectedBg.value : ''}`}
                      style={selectedBg.type === 'image' ? { backgroundImage: `url(${selectedBg.value})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                      <img src="https://trello.com/assets/14cda5dc635d1f13bc48.svg" alt="Preview UI" className="w-3/4 opacity-90" />
                    </div>
                  </div>

                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Phông nền</label>
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {BACKGROUND_OPTIONS.map((bg) => (
                      <div 
                        key={bg.id}
                        onClick={() => setSelectedBg(bg)}
                        className={`w-full aspect-video rounded cursor-pointer relative overflow-hidden group hover:opacity-80 ${bg.type === 'color' ? bg.value : ''}`}
                        style={bg.type === 'image' ? { backgroundImage: `url(${bg.value})`, backgroundSize: 'cover' } : {}}
                      >
                        {selectedBg.id === bg.id && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Tiêu đề bảng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoFocus
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className={`w-full px-3 py-1.5 text-sm bg-white dark:bg-[#22272b] border ${!newItemName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white mb-4`}
              />

              {addingBoardToFolder && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Quyền xem</label>
                  <div className="relative">
                    <select 
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-[#22272b] border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="Không gian làm việc">Không gian làm việc</option>
                      <option value="Riêng tư">Riêng tư</option>
                    </select>
                    {visibility === 'Riêng tư' ? (
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    ) : (
                      <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveItem}
                disabled={!newItemName.trim()}
                className="w-full py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:dark:bg-[#2c333a] disabled:text-slate-400 text-white rounded transition-colors"
              >
                Tạo mới
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// -----------------------------------------------------
// Component BoardCard: Thiết kế chuẩn form Trello
// -----------------------------------------------------
function BoardCard({ board, onClick, onToggleStar }: { board: any, onClick: () => void, onToggleStar: (e: React.MouseEvent) => void }) {
  const isImage = board.bgType === 'image';

  return (
    <div 
      onClick={onClick}
      className={`group relative h-[100px] cursor-pointer rounded-md overflow-hidden transition-colors ${!isImage ? board.bg : ''}`}
style={isImage ? { backgroundImage: `url('${board.bg}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Lớp overlay tĩnh (tạo độ tương phản cho text) và sẽ sậm hơn khi hover */}
      <div className={`absolute inset-0 transition-colors duration-200 ${isImage ? 'bg-black/20 group-hover:bg-black/40' : 'bg-black/10 group-hover:bg-black/20'}`}></div>
      
      {/* Nội dung Card: Text Top-Left, Star Bottom-Right */}
      <div className="relative z-10 flex flex-col justify-between h-full p-2.5">
        <div>
          <h3 className="text-white font-bold text-[15px] leading-tight break-words pr-2">
            {board.name}
          </h3>
        </div>
        
        <div className="flex justify-end items-end">
          <button 
            onClick={onToggleStar}
            className="p-1 -mr-1 -mb-1 transition-transform hover:scale-110"
          >
            <Star 
              className={`w-4 h-4 transition-opacity duration-200 ${
                board.starred 
                  ? 'text-yellow-400 fill-yellow-400 opacity-100' 
                  : 'text-white opacity-0 group-hover:opacity-100 hover:text-white'
              }`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}