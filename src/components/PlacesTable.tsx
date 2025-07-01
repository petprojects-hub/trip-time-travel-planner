
import { TravelPlace } from '@/types/travel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, Calendar } from 'lucide-react';

interface PlacesTableProps {
  places: TravelPlace[];
  onEdit: (place: TravelPlace) => void;
  onDelete: (id: string) => void;
}

const PlacesTable = ({ places, onEdit, onDelete }: PlacesTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left p-3 font-semibold text-gray-700">Destination</th>
            <th className="text-left p-3 font-semibold text-gray-700">Duration</th>
            <th className="text-left p-3 font-semibold text-gray-700">Best Months</th>
            <th className="text-right p-3 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map(place => (
            <tr key={place.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3">
                <div className="font-medium text-gray-800">{place.name}</div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{place.days} days</span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-wrap gap-1">
                    {place.months.map(month => (
                      <Badge key={month} variant="secondary" className="text-xs">
                        {month}
                      </Badge>
                    ))}
                  </div>
                </div>
              </td>
              <td className="p-3 text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(place)}
                    className="hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(place.id)}
                    className="hover:bg-red-50 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {places.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No destinations found. Add your first destination to get started!
        </div>
      )}
    </div>
  );
};

export default PlacesTable;
