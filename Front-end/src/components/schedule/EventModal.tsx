import { motion, AnimatePresence } from 'motion/react';
import { MapPin, AlignLeft, Calendar as CalendarIcon } from 'lucide-react';

export function EventModal({ showEventModal, setShowEventModal, isAllDay, setIsAllDay, eventTitle, setEventTitle, eventLocation, setEventLocation }: any) {
  return (
    <AnimatePresence>
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: '100%' }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#f2f2f7] dark:bg-[#000000] w-full sm:w-[440px] max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-[#38383a]">
              <button onClick={() => setShowEventModal(false)} className="text-red-500 dark:text-red-400 text-[15px] font-medium">Hủy</button>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Sự kiện mới</h3>
              <button disabled={!eventTitle} onClick={() => setShowEventModal(false)} className="text-cyan-500 dark:text-cyan-400 text-[15px] font-semibold disabled:opacity-50">Thêm</button>
            </div>

            <div className="p-4 space-y-5">
              <div className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden border border-slate-200 dark:border-[#38383a] shadow-sm">
                <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-[#38383a]">
                  <input autoFocus type="text" placeholder="Tiêu đề" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full bg-transparent border-none focus:outline-none text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400"/>
                </div>
                <div className="flex items-center px-4 py-3 gap-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Vị trí hoặc Cuộc gọi video" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full bg-transparent border-none focus:outline-none text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400"/>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden border border-slate-200 dark:border-[#38383a] shadow-sm text-[15px]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#38383a]">
                  <span className="text-slate-900 dark:text-white">Cả ngày</span>
                  <button onClick={() => setIsAllDay(!isAllDay)} className={`w-11 h-6 rounded-full transition-colors relative ${isAllDay ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-[#38383a]'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${isAllDay ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#38383a]">
                  <span className="text-slate-900 dark:text-white">Bắt đầu</span>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 dark:bg-[#2c2c2e] px-2 py-1 rounded text-slate-800 dark:text-slate-200">Hôm nay</span>
                    {!isAllDay && <span className="bg-slate-100 dark:bg-[#2c2c2e] px-2 py-1 rounded text-slate-800 dark:text-slate-200">09:00</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-slate-900 dark:text-white">Kết thúc</span>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 dark:bg-[#2c2c2e] px-2 py-1 rounded text-slate-800 dark:text-slate-200">Hôm nay</span>
                    {!isAllDay && <span className="bg-slate-100 dark:bg-[#2c2c2e] px-2 py-1 rounded text-slate-800 dark:text-slate-200">10:00</span>}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden border border-slate-200 dark:border-[#38383a] shadow-sm text-[15px]">
                <div className="flex items-center px-4 py-3 gap-3">
                  <CalendarIcon className="w-4 h-4 text-cyan-500" />
                  <select className="w-full bg-transparent border-none focus:outline-none text-slate-900 dark:text-white appearance-none cursor-pointer">
                    <option>Học trên trường</option>
                    <option>Cá nhân</option>
                    <option>Hoạt động nhóm</option>
                  </select>
                </div>
                <div className="flex items-center px-4 py-3 gap-3 border-t border-slate-100 dark:border-[#38383a]">
                  <AlignLeft className="w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Thêm ghi chú..." className="w-full bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"/>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}