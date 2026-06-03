import { useState } from 'react';
import { ScheduleHeader } from '../components/schedule/ScheduleHeader';
import { CalendarGrid } from '../components/schedule/CalendarGrid';
import { TaskSidebar } from '../components/schedule/TaskSidebar';
import { EventModal } from '../components/schedule/EventModal';

export function Schedule() {
  const [aiInput, setAiInput] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>(['study', 'kanban', 'personal', 'group']);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [currentView, setCurrentView] = useState('Tuần');
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const toggleCategory = (id: string) => {
    setActiveCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  return (
    // 1. Thẻ bao bọc ngoài cùng: Ép chiều cao tối đa bằng 100% không gian cho phép (Dashboard)
    <div className="h-full w-full flex flex-col bg-white dark:bg-[#0b1120] text-slate-900 dark:text-slate-200 font-sans overflow-hidden relative">
      
      {/* 2. Khu vực trung tâm: Chứa Toolbar, Lịch và Sidebar */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Toolbar nằm trên cùng */}
        <ScheduleHeader 
          currentView={currentView} setCurrentView={setCurrentView}
          aiInput={aiInput} setAiInput={setAiInput}
          activeCategories={activeCategories} toggleCategory={toggleCategory}
          showTaskPanel={showTaskPanel} setShowTaskPanel={setShowTaskPanel}
          setShowEventModal={setShowEventModal}
        />
        
        {/* Bọc Lưới lịch và Sidebar vào chung một Flex row để chúng nằm ngang */}
        <div className="flex-1 flex overflow-hidden relative">
          <CalendarGrid />
          <TaskSidebar showTaskPanel={showTaskPanel} />
        </div>
      </main>

      {/* Modal sự kiện nổi (để ngoài cùng để luôn nổi lên trên) */}
      <EventModal 
        showEventModal={showEventModal} setShowEventModal={setShowEventModal}
        isAllDay={isAllDay} setIsAllDay={setIsAllDay}
        eventTitle={eventTitle} setEventTitle={setEventTitle}
        eventLocation={eventLocation} setEventLocation={setEventLocation}
      />
    </div>
  );
}