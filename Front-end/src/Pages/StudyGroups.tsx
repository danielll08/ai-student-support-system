import { useState, useRef, useEffect } from 'react';
import { Hash, Send, Paperclip, MoreVertical, Users, FileText, Image as ImageIcon } from 'lucide-react';

export function StudyGroups() {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [message]);

  return (
    <div className="h-full w-full flex bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
      
      {/* --- CỘT GIỮA: MAIN CHAT --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0b1120]">
        
        {/* Chat Header */}
        <header className="h-14 px-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-transparent">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-slate-400" />
            <h2 className="text-[15px] font-bold text-slate-800 dark:text-white">Đồ án AI</h2>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full ml-2">4 thành viên</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 lg:hidden"><Users className="w-5 h-5" /></button>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Lịch sử tin nhắn */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
          
          {/* Tin nhắn của người khác */}
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
              TR
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[13px] font-bold text-slate-900 dark:text-white">Trần Quốc Bảo</span>
                <span className="text-[10px] text-slate-500">Hôm nay lúc 10:24 AM</span>
              </div>
              <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                Mọi người ơi, phần model AI mình train xong rồi nhé. Accuracy đạt 92%, lát mình đẩy code lên Github cho ae check thử.
              </p>
            </div>
          </div>

          {/* Tin nhắn của bạn */}
          <div className="flex gap-4 flex-row-reverse">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
              NA
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-2 mb-1 flex-row-reverse">
                <span className="text-[13px] font-bold text-slate-900 dark:text-white">Nguyễn Văn An</span>
                <span className="text-[10px] text-slate-500">Hôm nay lúc 10:26 AM</span>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-lg">
                <p className="text-[13px] text-slate-800 dark:text-indigo-100 leading-relaxed">
                  Đỉnh quá! Thế phần UI web để mình lo nốt chiều nay ghép vào luôn.
                </p>
              </div>
            </div>
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Khung nhập liệu (Chat Input) */}
        <div className="p-4 shrink-0 bg-white dark:bg-[#0b1120]">
          <div className="flex items-end gap-2 bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-slate-800 rounded-xl p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn vào #đồ-án-ai..."
              className="flex-1 max-h-32 min-h-[40px] bg-transparent border-none focus:outline-none text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 resize-none py-2.5"
              rows={1}
            />
            <button 
              disabled={!message.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:text-slate-400 text-white rounded-lg transition-colors shrink-0 mb-0.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 ml-2">Nhấn Enter để gửi, Shift + Enter để xuống dòng.</p>
        </div>
      </div>

      {/* --- CỘT PHẢI: THÔNG TIN NHÓM (Ẩn trên mobile) --- */}
      <aside className="w-64 border-l border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#151b28] hidden lg:flex flex-col shrink-0">
        <div className="h-14 px-4 border-b border-slate-200 dark:border-white/10 flex items-center shrink-0">
          <h3 className="text-[13px] font-bold text-slate-800 dark:text-white">Chi tiết nhóm</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
          
          {/* Members */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Thành viên — 4</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">NA</div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-[#151b28]"></div>
                </div>
                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">Nguyễn Văn An (Bạn)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">TR</div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-[#151b28]"></div>
                </div>
                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300">Trần Quốc Bảo</span>
              </div>
              <div className="flex items-center gap-2.5 opacity-50">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center text-[10px] font-bold">LM</div>
                <span className="text-[12px] font-medium text-slate-500">Lê Minh</span>
              </div>
            </div>
          </div>

          {/* Shared Files */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Tài liệu chung</p>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-left group">
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">Yeu-cau-do-an.pdf</p>
                  <p className="text-[9px] text-slate-400">1.2 MB</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-left group">
                <ImageIcon className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">UI_Mockup_v1.png</p>
                  <p className="text-[9px] text-slate-400">3.4 MB</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>

    </div>
  );
}