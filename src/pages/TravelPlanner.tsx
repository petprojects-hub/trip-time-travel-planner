
import { useState } from 'react';
import { useTravelData } from '@/hooks/useTravelData';
import { VacationType } from '@/types/travel';
import PlannerTable from '@/components/PlannerTable';
import PlacesList from '@/components/PlacesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TravelPlanner = () => {
  const { places, plannerData, assignPlaceToCell, removePlaceFromCell, isLoading } = useTravelData();
  const [draggedPlace, setDraggedPlace] = useState<string | null>(null);
  const [endYear, setEndYear] = useState(2033);
  
  const years = Array.from({ length: endYear - 2026 + 1 }, (_, i) => 2026 + i);
  const vacationTypes: VacationType[] = ['Annual Break', 'Summer Vacation', 'Puja', 'Christmas'];

  const addMoreYears = () => {
    setEndYear(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Travel Planner</h1>
        <p className="text-gray-600">Plan your adventures from 2026 to {endYear}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Available Destinations</CardTitle>
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

        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800">Vacation Planning Table</CardTitle>
              <Button 
                onClick={addMoreYears}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add More Years
              </Button>
            </CardHeader>
            <CardContent>
              <PlannerTable
                years={years}
                vacationTypes={vacationTypes}
                plannerData={plannerData}
                places={places}
                draggedPlace={draggedPlace}
                onAssignPlace={assignPlaceToCell}
                onRemovePlace={removePlaceFromCell}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanner;
