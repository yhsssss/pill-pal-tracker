
import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicationEntry } from '@/components/MedicationEntry';
import { toast } from '@/hooks/use-toast';

interface DailyDetailViewProps {
  selectedDate: Date | undefined;
  onBack: () => void;
  medicationData: Record<string, { morning?: { time: string; comment: string }; evening?: { time: string; comment: string } }>;
}

export const DailyDetailView: React.FC<DailyDetailViewProps> = ({
  selectedDate,
  onBack,
  medicationData
}) => {
  const [morningData, setMorningData] = useState({ time: '', comment: '' });
  const [eveningData, setEveningData] = useState({ time: '', comment: '' });

  const currentDate = selectedDate || new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  useEffect(() => {
    // Load existing data if available
    if (medicationData[dateKey]) {
      const data = medicationData[dateKey];
      setMorningData({
        time: data.morning?.time || '',
        comment: data.morning?.comment || ''
      });
      setEveningData({
        time: data.evening?.time || '',
        comment: data.evening?.comment || ''
      });
    }
  }, [dateKey, medicationData]);

  const handleSave = (period: 'morning' | 'evening', data: { time: string; comment: string }) => {
    if (!data.time) return;

    // Save to in-memory storage
    if (!medicationData[dateKey]) {
      medicationData[dateKey] = {};
    }

    medicationData[dateKey][period] = data;

    toast({
      title: `${period.charAt(0).toUpperCase() + period.slice(1)} medication saved!`,
      description: "Your medication intake has been recorded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
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

      {/* Morning Entry */}
      <MedicationEntry
        title="Morning"
        period="morning"
        data={morningData}
        onDataChange={setMorningData}
        onSave={handleSave}
        colorScheme="green"
      />

      {/* Evening Entry */}
      <MedicationEntry
        title="Evening"
        period="evening"
        data={eveningData}
        onDataChange={setEveningData}
        onSave={handleSave}
        colorScheme="blue"
      />
    </div>
  );
};
