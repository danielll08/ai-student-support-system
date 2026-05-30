import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, Image, Smile, MoreVertical, Info, Users } from 'lucide-react';
import { mockGroups } from '@/data/mockData';

interface ChatMessage {
  id: number;
  sender: string;
  initials: string;
  color: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Group {
  id: string;
  name: string;
  initials: string;
  color: string;
  lastMessage: string;
  lastTime: string;
  members: number;
  unread?: number;
  messages: ChatMessage[];
}

const groups: Group[] = mockGroups.map((group) => ({
  id: group.id,
  name: group.name,
  initials: group.name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase(),
  color: group.subject === 'Java' ? 'from-purple-500 to-blue-500' : group.subject === 'Machine Learning' ? 'from-orange-500 to-red-500' : 'from-cyan-500 to-blue-500',
  lastMessage: group.messages[group.messages.length - 1]?.content ?? '',
  lastTime: new Date(group.lastActivity).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  members: group.members.length,
  unread: group.messages.some((msg) => msg.senderId !== 'user-1') ? 2 : 0,
  messages: group.messages.map((msg) => ({
    id: Number(String(msg.id).replace(/\D/g, '')) || Date.now(),
    sender: msg.senderName,
    initials: msg.senderName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    color: msg.senderId === 'user-1' ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-cyan-500',
    text: msg.content,
    time: new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    isMe: msg.senderId === 'user-1',
  })),
}));

export function StudyGroups() {
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id ?? 'g1');
  const [groupData, setGroupData] = useState(groups);
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedGroup = groupData.find((g) => g.id === selectedGroupId) ?? groupData[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedGroup.messages]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: Date.now(),
      sender: 'Me',
      initials: 'VA',
      color: 'from-purple-500 to-pink-500',
      text,
      time: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
      isMe: true,
    };
    setGroupData(prev => prev.map(g =>
      g.id === selectedGroupId
        ? { ...g, messages: [...g.messages, msg], lastMessage: `Bạn: ${text.slice(0, 30)}...`, lastTime: msg.time, unread: 0 }
        : g
    ));
    setInputText('');
  };

  const switchGroup = (id: number) => {
    setSelectedGroupId(id);
    setGroupData(prev => prev.map(g => g.id === id ? { ...g, unread: 0 } : g));
  };

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-950 dark:text-white">Nhóm học tập</h1>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Nhắn tin, chia sẻ tài liệu và hợp tác cùng nhóm học tập.</p>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Group list */}
        <div className="w-64 flex-shrink-0 bg-white dark:bg-[#161b27] border border-slate-200 dark:border-[#252d3d] rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-[#252d3d]">
            <input
              placeholder="Tìm kiếm nhóm..."
              className="w-full bg-white dark:bg-[#1a2030] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {groupData.map(group => (
              <button
                key={group.id}
                onClick={() => switchGroup(group.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-[#1e2534] transition-all text-left border-b border-slate-200/50 last:border-b-0 ${
                  selectedGroupId === group.id ? 'bg-slate-50 dark:bg-[#1e2534]' : ''
                }`}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${group.color} rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-md`}>
                  {group.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-slate-950 dark:text-white truncate">{group.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 flex-shrink-0 ml-1">{group.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">{group.lastMessage}</p>
                    {group.unread && group.unread > 0 ? (
                      <span className="w-4 h-4 bg-blue-500 rounded-full text-[9px] flex items-center justify-center text-white flex-shrink-0 ml-1">
                        {group.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-white dark:bg-[#161b27] border border-slate-200 dark:border-[#252d3d] rounded-2xl flex flex-col overflow-hidden min-w-0">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-[#252d3d]">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 bg-gradient-to-br ${selectedGroup.color} rounded-xl flex items-center justify-center text-xs font-bold text-white`}>
                {selectedGroup.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-950 dark:text-white">{selectedGroup.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {selectedGroup.members} thành viên
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-[#1e2534] hover:bg-slate-100 dark:hover:bg-[#252d3d] flex items-center justify-center text-slate-700 dark:text-gray-400 hover:text-white transition-all">
                <Info className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-[#1e2534] hover:bg-slate-100 dark:hover:bg-[#252d3d] flex items-center justify-center text-slate-700 dark:text-gray-400 hover:text-white transition-all">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <AnimatePresence>
              {selectedGroup.messages.map((msg, i) => {
                const prevMsg = selectedGroup.messages[i - 1];
                const showSender = !msg.isMe && (!prevMsg || prevMsg.sender !== msg.sender || prevMsg.isMe);
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                  >
                    {!msg.isMe && (
                        <div className={`w-8 h-8 bg-gradient-to-br ${msg.color} rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mb-0.5`}>
                          {msg.initials}
                        </div>
                      )}
                      <div className={`max-w-[65%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        {showSender && (
                          <span className="text-[10px] text-slate-500 dark:text-gray-400 mb-1 ml-1">{msg.sender}</span>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          msg.isMe
                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-[#1a2030] border border-slate-200 dark:border-[#252d3d] text-slate-950 dark:text-gray-300 rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <span className={`text-[9px] text-slate-600 dark:text-gray-400 mt-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                          {msg.time}
                        </span>
                      </div>
                    {msg.isMe && (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mb-0.5">
                        VA
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-200 dark:border-[#252d3d]">
            <div className="flex items-center gap-2 bg-white dark:bg-[#1a2030] border border-slate-200 dark:border-[#252d3d] rounded-xl px-3 py-2 focus-within:border-blue-500/50 transition-all">
              <button className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0">
                <Image className="w-4 h-4" />
              </button>
              <input
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={`Nhắn tin vào nhóm ${selectedGroup.name}...`}
                className="flex-1 bg-transparent text-xs text-slate-950 dark:text-gray-300 placeholder-gray-600 focus:outline-none"
              />
              <button className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0">
                <Smile className="w-4 h-4" />
              </button>
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
