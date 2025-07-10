
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameMonth, isAfter, isToday } from 'date-fns';

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  medicationData: Record<string, { morning?: { time: string; comment: string }; evening?: { time: string; comment: string } }>;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  medicationData
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
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
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
        <CardContent className="pt-4">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-700">Morning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-700">Evening</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-gray-700">Not taken</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            onMonthChange={setCurrentMonth}
            className="w-full"
            disabled={(date) => isAfter(date, new Date())}
            modifiers={{
              today: (date) => isToday(date)
            }}
            modifiersStyles={{
              today: {
                fontWeight: 'bold',
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))'
              }
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
                    <span className="text-sm font-medium">
                      {format(date, 'd')}
                    </span>
                    {getDayContent(date)}
                  </button>
                </div>
              )
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
