import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, Lightbulb, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { AI_SUGGESTIONS, AI_RESPONSES, mockChatMessages } from '@/data/mockData';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const suggestedQuestions = AI_SUGGESTIONS;

const getAIResponse = (msg: string): string => {
  const m = msg.toLowerCase();
  if (m.includes('ưu tiên') || m.includes('quan trọng')) {
    return AI_RESPONSES.priority;
  }
  if (m.includes('java') || m.includes('lập trình')) {
    return AI_RESPONSES.plan;
  }
  if (m.includes('deadline') || m.includes('trễ') || m.includes('hạn')) {
    return AI_RESPONSES.workload;
  }
  if (m.includes('pomodoro') || m.includes('học tập') || m.includes('hiệu quả')) {
    return 'Để tối ưu hiệu suất học tập:\n\n🍅 **Pomodoro technique:**\n- 25 phút học tập trung → 5 phút nghỉ\n- Sau 4 phiên: nghỉ 15-30 phút\n\n📚 **Tips học hiệu quả:**\n1. Ưu tiên task theo deadline và độ quan trọng\n2. Tắt thông báo khi học\n3. Ghi chép tóm tắt sau mỗi phiên\n4. Review lại trước khi ngủ\n\nBạn đã hoàn thành 8 phiên Pomodoro, tiếp tục cố gắng nhé! 🎯';
  }
  return `Tôi đã phân tích yêu cầu của bạn: "${msg}"\n\nDựa trên workload hiện tại (10 tasks, 3.3h học/ngày), tôi gợi ý:\n\n1. **Tập trung vào tasks deadline gần nhất** - CSDL và KTPM cần hoàn thành ngay\n2. **Duy trì streak 7 ngày** - Hãy học ít nhất 30 phút mỗi ngày\n3. **Sử dụng Pomodoro** - Giúp duy trì tập trung hiệu quả hơn\n\nBạn có muốn tôi lập kế hoạch chi tiết hơn không?`;
};

const getNow = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const initialMessages: Message[] = mockChatMessages.length
  ? mockChatMessages.map((item, index) => ({
      id: Number(item.id) || index + 1,
      role: item.role === 'assistant' ? 'ai' : 'user',
      text: item.content,
      time: new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }))
  : [
      {
        id: 1,
        role: 'ai',
        text: 'Xin chào! Tôi hỗ trợ phân tích workload, ưu tiên công việc, lập kế hoạch học tập và tối ưu lịch học của bạn.',
        time: '14:43',
      },
    ];

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    const userMsg: Message = { id: Date.now(), role: 'user', text: msg, time: getNow() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const aiMsg: Message = { id: Date.now() + 1, role: 'ai', text: getAIResponse(msg), time: getNow() };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-950 dark:text-white">AI Assistant</h1>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Chat với AI để phân tích workload, ưu tiên task và lập kế hoạch học tập.</p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-5 min-h-0">
        {/* Chat */}
        <div className="col-span-2 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden dark:bg-[#161b27] dark:border-[#252d3d]">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-200 dark:border-[#252d3d]">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950 dark:text-white">AI Chat</div>
              <div className="text-[10px] text-green-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                Trực tuyến
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => send(q)}
                    className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-500/30 hover:bg-slate-100 text-slate-700 hover:text-slate-950 rounded-xl transition-all dark:bg-[#1a2030] dark:border-[#252d3d] dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.role === 'user' ? '' : ''}`}>
                    <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-tr-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-950 rounded-tl-sm dark:bg-[#1a2030] dark:border-[#252d3d] dark:text-gray-300'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`text-[9px] text-slate-600 dark:text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white dark:bg-[#1a2030] border border-slate-200 dark:border-[#252d3d] rounded-2xl rounded-tl-sm px-4 py-2.5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-gray-500 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-200 dark:border-[#252d3d]">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-500/50 transition-all dark:bg-[#1a2030] dark:border-[#252d3d]">
              <input
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Gõ câu hỏi của bạn..."
                className="flex-1 bg-transparent text-xs text-slate-950 dark:text-gray-300 placeholder-gray-600 focus:outline-none"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Insights panel */}
        <div className="space-y-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Insight học tập</h3>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 dark:bg-[#161b27] dark:border-[#252d3d]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-950 dark:text-white">Workload hiện tại</div>
              </div>
            </div>
            <p className="text-lg font-bold text-slate-950 dark:text-white mb-0.5">8 task chưa hoàn thành</p>
            <p className="text-[10px] text-slate-500 dark:text-gray-400">Trong 6 môn học khác nhau</p>
          </div>

            <div className="bg-white border border-red-500/20 rounded-2xl p-4 dark:bg-[#161b27] dark:border-red-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-950 dark:text-white">Task quá hạn</div>
              </div>
            </div>
            <p className="text-lg font-bold text-red-400 mb-0.5">8 task</p>
            <p className="text-[10px] text-slate-500 dark:text-gray-400">Cần xử lý ngay trong tuần này</p>
          </div>

            <div className="bg-white border border-yellow-500/20 rounded-2xl p-4 dark:bg-[#161b27] dark:border-yellow-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-950 dark:text-white">Gợi ý ưu tiên</div>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-950 dark:text-white mb-0.5">3 task nên xử lý</p>
            <p className="text-[10px] text-slate-500 dark:text-gray-400">Theo deadline và độ quan trọng</p>
            <div className="mt-2 space-y-1">
              {['CSDL Báo cáo', 'KTPM Thuyết trình', 'Java OOP'].map((t, i) => (
                <div key={t} className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span className="text-yellow-400">{i + 1}.</span>
                  {t}
                </div>
              ))}
            </div>
          </div>

            <div className="bg-white border border-blue-500/20 rounded-2xl p-4 dark:bg-[#161b27] dark:border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-xs font-semibold text-slate-950 dark:text-white">Lời khuyên nhanh</div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
              Ưu tiên các task deadline gần trước, xen kẽ Pomodoro với lịch học để tránh overload, và kiểm tra lại tiến độ mỗi ngày.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
