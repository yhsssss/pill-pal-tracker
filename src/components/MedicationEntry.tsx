
import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Save, Pill, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format } from 'date-fns';

interface MedicationEntryProps {
  title: string;
  period: 'morning' | 'evening';
  data: { time: string; comment: string };
  onDataChange: (data: { time: string; comment: string }) => void;
  onSave: (period: 'morning' | 'evening', data: { time: string; comment: string }) => void;
  colorScheme: 'green' | 'blue';
}

export const MedicationEntry: React.FC<MedicationEntryProps> = ({
  title,
  period,
  data,
  onDataChange,
  onSave,
  colorScheme
}) => {
  const [isOpen, setIsOpen] = useState(!data.time);

  // Sync open state with data.time
  useEffect(() => {
    setIsOpen(!data.time);
  }, [data.time]);

  const setCurrentTime = () => {
    const now = format(new Date(), 'HH:mm');
    onDataChange({ ...data, time: now });
  };

  const handleSave = () => {
    onSave(period, data);
    // No need to manually close; isOpen will sync with data.time
  };

  const colorClasses = {
    green: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      pill: 'text-green-600'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      pill: 'text-blue-600'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-4 cursor-pointer hover:bg-gray-50/50 transition-colors">
            <CardTitle className={`flex items-center justify-between text-lg ${colors.text}`}>
              <div className="flex items-center gap-2">
                <div className={`p-2 ${colors.bg} rounded-full`}>
                  <Pill className={`h-4 w-4 ${colors.pill}`} />
                </div>
                {title}
                {data.time && (
                  <span className="text-sm font-normal text-gray-600">
                    ({data.time})
                  </span>
                )}
              </div>
              {isOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${period}-time`} className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Taken
              </Label>
              <div className="flex gap-2">
                <Input
                  id={`${period}-time`}
                  type="time"
                  value={data.time}
                  onChange={(e) => onDataChange({ ...data, time: e.target.value })}
                  className="flex-1"
                />
                <Button
                  onClick={setCurrentTime}
                  variant="outline"
                  className="px-3"
                >
                  Now
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`${period}-comment`} className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notes (optional)
              </Label>
              <Textarea
                id={`${period}-comment`}
                placeholder="e.g., took with food, feeling good..."
                value={data.comment}
                onChange={(e) => onDataChange({ ...data, comment: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <Button
              onClick={handleSave}
              className={`w-full ${colorScheme === 'green' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 rounded-xl shadow-lg transition-all hover:shadow-xl`}
              disabled={!data.time}
            >
              <Save className="h-4 w-4 mr-2" />
              Save {title}
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
