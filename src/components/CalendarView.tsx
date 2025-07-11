
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
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Medication Tracker
        </h1>
        <p className="text-gray-600">
          Track your daily medication intake
        </p>
      </div>

      {/* Separator Line */}
      <div className="w-full h-px bg-gray-200 my-4" />

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border border-blue-100 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Take your medication within 30 minutes after meals.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-purple-100 bg-purple-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">🌙</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Don't skip your evening dose for consistent results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card className="border border-gray-100">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-8 text-sm">
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
      </Card>

      {/* Calendar */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-3">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              onMonthChange={setCurrentMonth}
              className="w-full max-w-sm mx-auto"
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
          </div>
        </CardContent>
      </Card>

      {/* Add Today's Medication Button */}
      <div className="pt-4">
        <button
          onClick={() => onDateSelect(new Date())}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Add Today's Medication
        </button>
      </div>
    </div>
  );
};
