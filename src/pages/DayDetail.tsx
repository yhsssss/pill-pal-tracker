
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { ArrowLeft, Clock, MessageSquare, Save, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

// Simple in-memory storage for MVP (same reference as Index)
const medicationData: Record<string, { morning?: { time: string; comment: string }; evening?: { time: string; comment: string } }> = {};

const DayDetail = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  
  const [morningTime, setMorningTime] = useState('');
  const [morningComment, setMorningComment] = useState('');
  const [eveningTime, setEveningTime] = useState('');
  const [eveningComment, setEveningComment] = useState('');

  const currentDate = date ? parse(date, 'yyyy-MM-dd', new Date()) : new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');

  useEffect(() => {
    // Load existing data if available
    if (date && medicationData[date]) {
      const data = medicationData[date];
      setMorningTime(data.morning?.time || '');
      setMorningComment(data.morning?.comment || '');
      setEveningTime(data.evening?.time || '');
      setEveningComment(data.evening?.comment || '');
    }
  }, [date]);

  const setCurrentTime = (period: 'morning' | 'evening') => {
    const now = format(new Date(), 'HH:mm');
    if (period === 'morning') {
      setMorningTime(now);
    } else {
      setEveningTime(now);
    }
  };

  const handleSave = () => {
    if (!date) return;

    // Save to in-memory storage
    if (!medicationData[date]) {
      medicationData[date] = {};
    }

    if (morningTime) {
      medicationData[date].morning = {
        time: morningTime,
        comment: morningComment
      };
    }

    if (eveningTime) {
      medicationData[date].evening = {
        time: eveningTime,
        comment: eveningComment
      };
    }

    toast({
      title: "Medication recorded!",
      description: "Your medication intake has been saved successfully.",
    });

    // Navigate back to calendar
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Medication Log
                </CardTitle>
                <p className="text-gray-600 text-sm">{formattedDate}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Morning Medication */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-green-700">
              <div className="p-2 bg-green-100 rounded-full">
                <Pill className="h-4 w-4 text-green-600" />
              </div>
              Morning Medication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="morning-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Taken
              </Label>
              <div className="flex gap-2">
                <Input
                  id="morning-time"
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => setCurrentTime('morning')}
                  variant="outline"
                  className="px-3"
                >
                  Now
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="morning-comment" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notes (optional)
              </Label>
              <Textarea
                id="morning-comment"
                placeholder="e.g., took with food, feeling good..."
                value={morningComment}
                onChange={(e) => setMorningComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Evening Medication */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
              <div className="p-2 bg-blue-100 rounded-full">
                <Pill className="h-4 w-4 text-blue-600" />
              </div>
              Evening Medication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evening-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Taken
              </Label>
              <div className="flex gap-2">
                <Input
                  id="evening-time"
                  type="time"
                  value={eveningTime}
                  onChange={(e) => setEveningTime(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => setCurrentTime('evening')}
                  variant="outline"
                  className="px-3"
                >
                  Now
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="evening-comment" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notes (optional)
              </Label>
              <Textarea
                id="evening-comment"
                placeholder="e.g., took with dinner, no side effects..."
                value={eveningComment}
                onChange={(e) => setEveningComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl shadow-lg transition-all hover:shadow-xl"
          size="lg"
          disabled={!morningTime && !eveningTime}
        >
          <Save className="h-5 w-5 mr-2" />
          Save Medication Log
        </Button>
      </div>
    </div>
  );
};

export default DayDetail;
