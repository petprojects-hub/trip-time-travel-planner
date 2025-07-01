
import { useState } from 'react';
import { useTravelData } from '@/hooks/useTravelData';
import { TravelPlace } from '@/types/travel';
import PlaceForm from '@/components/PlaceForm';
import PlacesTable from '@/components/PlacesTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AdminPanel = () => {
  const { places, addPlace, updatePlace, deletePlace } = useTravelData();
  const [editingPlace, setEditingPlace] = useState<TravelPlace | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (place: TravelPlace) => {
    setEditingPlace(place);
    setShowForm(true);
  };

  const handleSubmit = (placeData: Omit<TravelPlace, 'id'>) => {
    if (editingPlace) {
      updatePlace(editingPlace.id, placeData);
    } else {
      addPlace(placeData);
    }
    setEditingPlace(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingPlace(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your travel destinations</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={showForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Destination
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {showForm && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {editingPlace ? 'Edit Destination' : 'Add New Destination'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlaceForm
                  initialData={editingPlace}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          </div>
        )}

        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Travel Destinations ({places.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PlacesTable
                places={places}
                onEdit={handleEdit}
                onDelete={deletePlace}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
