
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col items-center w-full bg-white/90 backdrop-blur-sm border-0">
        {/* Medication Log Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 w-full text-center mb-2 pt-4">
          Daily Medication Log
        </h1>
        {/* Back button and date row */}
        <div className="flex items-center justify-center w-full gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full w-20 h-20 mr-2"
            aria-label="Back"
          >
            <ArrowLeft className="h-10 w-10" />
          </Button>
          <p className="text-gray-700 text-lg font-semibold flex-1 text-center">
            {formattedDate}
          </p>
          {/* Empty div for symmetrical spacing */}
          <div className="w-20 h-20 mr-2" />
        </div>
      </div>

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
