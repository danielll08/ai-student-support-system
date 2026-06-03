import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, X, Send, Sparkles, Calendar, ListTodo, Zap, Loader2 
} from 'lucide-react';

// Các gợi ý lệnh nhanh (Quick Actions)
const QUICK_ACTIONS = [
  { id: '1', icon: <ListTodo className="w-3 h-3" />, text: 'Tạo 3 task Đồ án' },
  { id: '2', icon: <Calendar className="w-3 h-3" />, text: 'Xếp lịch trống tuần này' },
  { id: '3', icon: <Zap className="w-3 h-3" />, text: 'Tóm tắt deadline' },
];

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'msg-1', 
      role: 'ai', 
      text: 'Chào bạn! Mình là StudyAI Assistant. Bạn cần mình thêm Task mới, sắp xếp Lịch học hay kiểm tra Deadline hôm nay?' 
    }
  ]);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Thêm tin nhắn của User
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Giả lập AI phản hồi (Sau này bạn sẽ nối API vào đây)
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          text: `Đã nhận lệnh: "${text}". Tính năng kết nối trực tiếp vào Kanban và Lịch đang được hoàn thiện. Mình sẽ sớm có thể thực thi trực tiếp thay bạn!` 
        }
      ]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* CỬA SỔ CHAT AI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[340px] sm:w-[380px] h-[500px] max-h-[75vh] flex flex-col bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">StudyAI Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Sẵn sàng thực thi</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nội dung Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-br-sm' 
                      : 'bg-slate-100 dark:bg-[#151b28] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-[#151b28] border border-slate-200 dark:border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Vỏ thuốc gợi ý) */}
            <div className="px-3 pb-2 flex overflow-x-auto gap-2 hide-scrollbar shrink-0">
              {QUICK_ACTIONS.map(action => (
                <button 
                  key={action.id}
                  onClick={() => handleSend(action.text)}
                  className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 bg-slate-100 dark:bg-[#151b28] border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 rounded-md text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {action.icon} {action.text}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#0b1120] border-t border-slate-200 dark:border-white/10 shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder="Yêu cầu AI thực hiện lệnh..."
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-white/10 rounded-lg text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-400"
                />
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                  className="absolute right-1.5 p-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white rounded-md transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NÚT FLOAT GỌI AI */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-shadow border border-white/20 z-50 relative group"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        
        {/* Chấm thông báo nhỏ */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white dark:border-[#0b1120] rounded-full"></span>
        )}
      </motion.button>

    </div>
  );
}