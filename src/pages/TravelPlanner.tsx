
import { useState } from 'react';
import { useTravelData } from '@/hooks/useTravelData';
import { VacationType } from '@/types/travel';
import PlannerTable from '@/components/PlannerTable';
import PlacesList from '@/components/PlacesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const TravelPlanner = () => {
  const { places, plannerData, assignPlaceToCell, removePlaceFromCell, isLoading } = useTravelData();
  const [draggedPlace, setDraggedPlace] = useState<string | null>(null);
  const [endYear, setEndYear] = useState(2033);
  const isMobile = useIsMobile();
  
  const years = Array.from({ length: endYear - 2026 + 1 }, (_, i) => 2026 + i);
  const vacationTypes: VacationType[] = ['Annual Break', 'Summer Vacation', 'Puja', 'Christmas'];

  const addMoreYears = () => {
    setEndYear(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 space-y-4">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Travel Planner</h1>
          <p className="text-sm sm:text-base text-gray-600">Plan your adventures from 2026 to {endYear}</p>
        </div>

        <div className={`space-y-6 ${isMobile ? '' : 'grid grid-cols-1 lg:grid-cols-4 gap-8'}`}>
          <div className={isMobile ? 'order-2' : 'lg:col-span-1'}>
            <Card className={isMobile ? '' : 'sticky top-4'}>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">Available Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <PlacesList 
                  places={places} 
                  onDragStart={setDraggedPlace}
                  onDragEnd={() => setDraggedPlace(null)}
                />
              </CardContent>
            </Card>
          </div>

          <div className={isMobile ? 'order-1' : 'lg:col-span-3'}>
            <Card>
              <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">Vacation Planning Table</CardTitle>
                <Button 
                  onClick={addMoreYears}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add More Years
                </Button>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="overflow-x-auto">
                  <PlannerTable
                    years={years}
                    vacationTypes={vacationTypes}
                    plannerData={plannerData}
                    places={places}
                    draggedPlace={draggedPlace}
                    onAssignPlace={assignPlaceToCell}
                    onRemovePlace={removePlaceFromCell}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanner;
