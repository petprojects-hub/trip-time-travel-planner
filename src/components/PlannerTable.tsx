
import { TravelPlace, VacationType, PlannerCell } from '@/types/travel';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface PlannerTableProps {
  years: number[];
  vacationTypes: VacationType[];
  plannerData: PlannerCell[];
  places: TravelPlace[];
  draggedPlace: string | null;
  onAssignPlace: (year: number, vacationType: string, place: TravelPlace) => void;
  onRemovePlace: (year: number, vacationType: string) => void;
}

const PlannerTable = ({
  years,
  vacationTypes,
  plannerData,
  places,
  draggedPlace,
  onAssignPlace,
  onRemovePlace,
}: PlannerTableProps) => {
  const getCellData = (year: number, vacationType: string) => {
    return plannerData.find(cell => cell.year === year && cell.vacationType === vacationType);
  };

  const getVacationTypeMonth = (vacationType: string): string => {
    switch (vacationType) {
      case 'Annual Break': return 'March';
      case 'Summer Vacation': return 'May';
      case 'Puja': return 'October';
      case 'Christmas': return 'December';
      default: return '';
    }
  };

  const isPlaceCompatible = (placeId: string, vacationType: string): boolean => {
    const place = places.find(p => p.id === placeId);
    if (!place) return false;
    
    const requiredMonth = getVacationTypeMonth(vacationType);
    return place.months.includes(requiredMonth);
  };

  const handleDrop = (e: React.DragEvent, year: number, vacationType: string) => {
    e.preventDefault();
    if (draggedPlace && isPlaceCompatible(draggedPlace, vacationType)) {
      const place = places.find(p => p.id === draggedPlace);
      if (place) {
        onAssignPlace(year, vacationType, place);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent, vacationType: string) => {
    e.preventDefault();
    // Only allow drop if place is compatible
    if (draggedPlace && !isPlaceCompatible(draggedPlace, vacationType)) {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const getVacationTypeColor = (vacationType: string) => {
    switch (vacationType) {
      case 'Annual Break': return 'bg-blue-100 text-blue-800';
      case 'Summer Vacation': return 'bg-orange-100 text-orange-800';
      case 'Puja': return 'bg-purple-100 text-purple-800';
      case 'Christmas': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">
              Vacation Type
            </th>
            {years.map(year => (
              <th key={year} className="p-3 text-center font-semibold text-gray-700 border-b-2 border-gray-200 min-w-[150px]">
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vacationTypes.map(vacationType => (
            <tr key={vacationType} className="border-b border-gray-100">
              <td className="p-3 font-medium">
                <Badge className={getVacationTypeColor(vacationType)}>
                  {vacationType}
                </Badge>
              </td>
              {years.map(year => {
                const cellData = getCellData(year, vacationType);
                const isCompatibleDrop = draggedPlace ? isPlaceCompatible(draggedPlace, vacationType) : true;
                
                return (
                  <td
                    key={`${year}-${vacationType}`}
                    className="p-2"
                    onDrop={(e) => handleDrop(e, year, vacationType)}
                    onDragOver={(e) => handleDragOver(e, vacationType)}
                  >
                    <Card className={`min-h-[80px] border-2 border-dashed transition-all duration-200 ${
                      cellData?.place 
                        ? 'border-green-300 bg-green-50' 
                        : draggedPlace && !isCompatibleDrop
                        ? 'border-red-300 bg-red-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}>
                      {cellData?.place ? (
                        <div className="p-3 relative">
                          <button
                            onClick={() => onRemovePlace(year, vacationType)}
                            className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="text-sm font-medium text-gray-800 mb-1">
                            {cellData.place.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {cellData.place.days} days
                          </div>
                        </div>
                      ) : (
                        <div className={`p-3 text-center text-sm ${
                          draggedPlace && !isCompatibleDrop 
                            ? 'text-red-400' 
                            : 'text-gray-400'
                        }`}>
                          {draggedPlace && !isCompatibleDrop 
                            ? `Not valid for ${getVacationTypeMonth(vacationType)}`
                            : 'Drop destination here'
                          }
                        </div>
                      )}
                    </Card>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlannerTable;
