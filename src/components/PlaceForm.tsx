import { useState, useEffect } from 'react';
import { TravelPlace } from '@/types/travel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

interface PlaceFormProps {
  initialData?: TravelPlace | null;
  onSubmit: (data: Omit<TravelPlace, 'id'>) => void;
  onCancel: () => void;
}

const months = ['March', 'May', 'October', 'December'];

const PlaceForm = ({ initialData, onSubmit, onCancel }: PlaceFormProps) => {
  const [name, setName] = useState('');
  const [days, setDays] = useState(1);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDays(initialData.days);
      setSelectedMonths(initialData.months);
    } else {
      setName('');
      setDays(1);
      setSelectedMonths([]);
    }
  }, [initialData]);

  const handleMonthChange = (month: string, checked: boolean) => {
    if (checked) {
      setSelectedMonths(prev => [...prev, month]);
    } else {
      setSelectedMonths(prev => prev.filter(m => m !== month));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedMonths.length > 0) {
      onSubmit({
        name: name.trim(),
        days,
        months: selectedMonths,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Destination Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter destination name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="days">Number of Days</Label>
        <Input
          id="days"
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value) || 1)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Travel Months (select multiple)</Label>
        <Card className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {months.map(month => (
              <div key={month} className="flex items-center space-x-2">
                <Checkbox
                  id={month}
                  checked={selectedMonths.includes(month)}
                  onCheckedChange={(checked) => handleMonthChange(month, checked as boolean)}
                />
                <Label htmlFor={month} className="text-sm">
                  {month}
                </Label>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white flex-1"
          disabled={!name.trim() || selectedMonths.length === 0}
        >
          {initialData ? 'Update' : 'Add'} Destination
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PlaceForm;
