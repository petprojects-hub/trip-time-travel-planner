
import { useState } from 'react';
import { useTravelData } from '@/hooks/useTravelData';
import { VacationType } from '@/types/travel';
import PlannerTable from '@/components/PlannerTable';
import PlacesList from '@/components/PlacesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TravelPlanner = () => {
  const { places, plannerData, assignPlaceToCell, removePlaceFromCell } = useTravelData();
  const [draggedPlace, setDraggedPlace] = useState<string | null>(null);
  
  const years = Array.from({ length: 8 }, (_, i) => 2026 + i);
  const vacationTypes: VacationType[] = ['Annual Break', 'Summer Vacation', 'Puja', 'Christmas'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Travel Planner</h1>
        <p className="text-gray-600">Plan your adventures from 2026 to 2033</p>
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
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Vacation Planning Table</CardTitle>
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
