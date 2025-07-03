
import { TravelPlace } from '@/types/travel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useRef } from 'react';

interface PlacesListProps {
  places: TravelPlace[];
  onDragStart: (placeId: string) => void;
  onDragEnd: () => void;
}

const PlacesList = ({ places, onDragStart, onDragEnd }: PlacesListProps) => {
  const isMobile = useIsMobile();
  const [touchedPlace, setTouchedPlace] = useState<string | null>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (placeId: string) => {
    if (!isMobile) return;
    
    setTouchedPlace(placeId);
    touchTimeoutRef.current = setTimeout(() => {
      // Simulate drag start after 500ms of holding
      onDragStart(placeId);
      // Provide haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    setTouchedPlace(null);
    onDragEnd();
  };

  const handleTouchCancel = () => {
    if (!isMobile) return;
    
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    setTouchedPlace(null);
    onDragEnd();
  };

  return (
    <div className={`space-y-3 ${isMobile ? 'max-h-60' : 'max-h-[70vh]'} overflow-y-auto`}>
      {places.map(place => (
        <Card
          key={place.id}
          draggable={!isMobile}
          onDragStart={() => !isMobile && onDragStart(place.id)}
          onDragEnd={onDragEnd}
          onTouchStart={() => handleTouchStart(place.id)}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          className={`p-3 border-2 transition-all duration-200 ${
            touchedPlace === place.id
              ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg'
              : isMobile 
              ? 'hover:shadow-sm border-gray-200' 
              : 'cursor-grab hover:cursor-grabbing hover:border-blue-400 hover:shadow-md border-gray-300'
          }`}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
        >
          <div className="text-sm font-medium text-gray-800 mb-2">
            {place.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Clock className="h-3 w-3" />
            <span>{place.days} days</span>
          </div>
          <div className="flex items-start gap-1 mb-2">
            <Calendar className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {place.months.map(month => (
                <Badge key={month} variant="secondary" className="text-xs">
                  {month}
                </Badge>
              ))}
            </div>
          </div>
          {isMobile && (
            <div className="text-xs text-gray-400 mt-2 italic">
              {touchedPlace === place.id ? 'Release to select' : 'Hold to select destination'}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PlacesList;
