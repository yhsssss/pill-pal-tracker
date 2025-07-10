
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameMonth, startOfMonth, isBefore, isToday, isAfter } from 'date-fns';
import { CalendarView } from '@/components/CalendarView';
import { DailyDetailView } from '@/components/DailyDetailView';

// Simple in-memory storage for MVP
const medicationData: Record<string, { morning?: { time: string; comment: string }; evening?: { time: string; comment: string } }> = {};

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'detail'>('calendar');

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isAfter(date, new Date())) {
      setSelectedDate(date);
      setView('detail');
    }
  };

  const handleBackToCalendar = () => {
    setView('calendar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto">
        {view === 'calendar' ? (
          <CalendarView 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            medicationData={medicationData}
          />
        ) : (
          <DailyDetailView
            selectedDate={selectedDate}
            onBack={handleBackToCalendar}
            medicationData={medicationData}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
