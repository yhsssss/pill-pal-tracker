
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
    <div className="space-y-3">
      {/* Header */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Medication Tracker
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Track your daily medication intake
          </p>
        </CardHeader>
      </Card>

      {/* Legend */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="py-3">
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
        </CardContent>
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
      </Card>
    </div>
  );
};
