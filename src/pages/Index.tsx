
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { format, isSameMonth, startOfMonth } from 'date-fns';
import { Pill, Plus } from 'lucide-react';

// Simple in-memory storage for MVP
const medicationData: Record<string, { morning?: { time: string; comment: string }; evening?: { time: string; comment: string } }> = {};

const Index = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const dateString = format(date, 'yyyy-MM-dd');
      navigate(`/day/${dateString}`);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-blue-500 rounded-full">
                <Pill className="h-6 w-6 text-white" />
              </div>
            </div>
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
              onSelect={handleDateSelect}
              onMonthChange={setCurrentMonth}
              className="w-full"
              components={{
                Day: ({ date, ...props }) => (
                  <div className="relative">
                    <button
                      {...props}
                      className="w-full h-12 flex flex-col items-center justify-center hover:bg-blue-50 rounded-lg transition-colors relative"
                      onClick={() => handleDateSelect(date)}
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

        {/* Quick Add Today Button */}
        <Button
          onClick={() => handleDateSelect(new Date())}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl shadow-lg transition-all hover:shadow-xl"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Today's Medication
        </Button>
      </div>
    </div>
  );
};

export default Index;
