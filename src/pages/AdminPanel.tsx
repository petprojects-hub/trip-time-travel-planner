
import { useState } from 'react';
import { useTravelData } from '@/hooks/useTravelData';
import { TravelPlace } from '@/types/travel';
import PlaceForm from '@/components/PlaceForm';
import PlacesTable from '@/components/PlacesTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminPanel = () => {
  const { places, addPlace, updatePlace, deletePlace, isLoading } = useTravelData();
  const [editingPlace, setEditingPlace] = useState<TravelPlace | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; place: TravelPlace | null }>({
    show: false,
    place: null
  });

  const handleEdit = (place: TravelPlace) => {
    setEditingPlace(place);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPlace(null);
    setShowForm(true);
  };

  const handleSubmit = (placeData: Omit<TravelPlace, 'id' | 'created_at' | 'updated_at'>) => {
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

  const handleDeleteClick = (place: TravelPlace) => {
    setDeleteConfirm({ show: true, place });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.place) {
      deletePlace(deleteConfirm.place.id);
    }
    setDeleteConfirm({ show: false, place: null });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-full sm:w-48" />
            </div>
          </div>
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
    );
  }

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your travel destinations</p>
            </div>
            <Button 
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Destination
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
              Travel Destinations ({places.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <PlacesTable
              places={places}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPlace ? 'Edit Destination' : 'Add New Destination'}
              </DialogTitle>
            </DialogHeader>
            <PlaceForm
              initialData={editingPlace}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirm.show} onOpenChange={(open) => !open && setDeleteConfirm({ show: false, place: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Destination</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteConfirm.place?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminPanel;
