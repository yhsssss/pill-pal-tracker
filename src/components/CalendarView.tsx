
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameMonth, isAfter, isToday } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  medicationData: Record<string, { morning?: { time: string; comment: string }; evening?: { time: string; comment: string } }>;
  onAddToday?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  medicationData,
  onAddToday
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getMedicationStatus = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const data = medicationData[dateKey];
    
    if (!data) return { morning: false, evening: false };
    
    return {
      morning: !!data.morning?.time,
      evening: !!data.evening?.time
    };
  };

  const getDayContent = (date: Date) => {
    if (!isSameMonth(date, currentMonth)) return null;
    
    const status = getMedicationStatus(date);
    
    return (
      <div className="flex flex-col items-center gap-1 mt-1">
        <div className="flex gap-1">
          <div 
            className={`w-2 h-2 rounded-full ${
              status.morning ? 'bg-green-500' : 'bg-gray-200'
            }`}
            title="Morning medication"
          />
          <div 
            className={`w-2 h-2 rounded-full ${
              status.evening ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            title="Evening medication"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between min-h-[600px] h-full space-y-3">
      {/* Header and Calendar */}
      <div className="bg-white/90 backdrop-blur-sm border-0">
        <div className="text-center pb-3">
          <h1 className="text-3xl font-extrabold text-gray-900 w-full text-center mb-2 pt-4">
            Medication Tracker
          </h1>
          <p className="text-gray-600 text-base font-medium">
            Track your daily medication intake
          </p>
          <hr className="mt-6 mb-4 border-gray-200" />
          <div className="flex flex-col gap-3 mt-4 max-w-3xl mx-auto w-full">
            <div className="flex items-center bg-blue-100/30 border border-blue-300 rounded-xl p-4 gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-gray-700 text-sm text-left">Take your medication within 30 minutes after meals.</span>
            </div>
            <div className="flex items-center bg-purple-100/30 border border-purple-300 rounded-xl p-4 gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
              <span className="text-gray-700 text-sm text-left">Don't skip your evening dose for consistent results.</span>
            </div>
          </div>
        </div>
        <div className="py-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-700 font-medium">Morning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-700 font-medium">Evening</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-gray-700 font-medium">Not taken</span>
            </div>
          </div>
        </div>
        <div className="p-3 flex justify-center">
          <div className="origin-top" style={{ transform: 'scale(1.3)' }}>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              onMonthChange={setCurrentMonth}
              className="w-fit"
              disabled={(date) => isAfter(date, new Date())}
              modifiers={{
                today: (date) => isToday(date),
              }}
              modifiersStyles={{
                today: {
                  fontWeight: 'bold',
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                },
              }}
              components={{
                Day: ({ date, ...props }) => (
                  <div className="relative">
                    <button
                      {...props}
                      className={`w-full h-12 flex flex-col items-center justify-center hover:bg-blue-50 rounded-lg transition-colors relative ${
                        isAfter(date, new Date()) ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                      onClick={() => !isAfter(date, new Date()) && onDateSelect(date)}
                      disabled={isAfter(date, new Date())}
                    >
                      <span className="text-sm font-medium">{format(date, 'd')}</span>
                      {getDayContent(date)}
                    </button>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </div>
      {/* Add Today's Medication Button at the bottom of the main wrapper */}
      <div className="flex justify-center mt-8 mb-4">
        <button
          className="w-full max-w-3xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all text-lg"
          type="button"
          onClick={onAddToday}
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Today's Medication
          </span>
        </button>
      </div>
    </div>
  );
};
