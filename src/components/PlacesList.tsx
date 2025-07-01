
import { TravelPlace } from '@/types/travel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface PlacesListProps {
  places: TravelPlace[];
  onDragStart: (placeId: string) => void;
  onDragEnd: () => void;
}

const PlacesList = ({ places, onDragStart, onDragEnd }: PlacesListProps) => {
  return (
    <div className="space-y-3 max-h-[70vh] overflow-y-auto">
      {places.map(place => (
        <Card
          key={place.id}
          draggable
          onDragStart={() => onDragStart(place.id)}
          onDragEnd={onDragEnd}
          className="p-3 cursor-grab hover:cursor-grabbing border-2 hover:border-blue-400 hover:shadow-md transition-all duration-200"
        >
          <div className="text-sm font-medium text-gray-800 mb-2">
            {place.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Clock className="h-3 w-3" />
            <span>{place.days} days</span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <Calendar className="h-3 w-3 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {place.months.map(month => (
                <Badge key={month} variant="secondary" className="text-xs">
                  {month}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PlacesList;
