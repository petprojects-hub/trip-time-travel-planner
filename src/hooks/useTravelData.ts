
import { useState, useEffect } from 'react';
import { TravelPlace, PlannerCell } from '@/types/travel';

const initialPlaces: TravelPlace[] = [
  { id: '1', name: 'Kazakhstan + Uzbekistan', days: 14, months: ['May'] },
  { id: '2', name: 'Egypt', days: 9, months: ['March', 'October'] },
  { id: '3', name: 'Varanasi', days: 4, months: ['March', 'December'] },
  { id: '4', name: 'Singapore + Malaysia', days: 9, months: ['March', 'May', 'October'] },
  { id: '5', name: 'Maldives + Sri Lanka', days: 14, months: ['March'] },
  { id: '6', name: 'Hyderabad', days: 4, months: ['March', 'December'] },
  { id: '7', name: 'Georgia + Azerbaijan', days: 14, months: ['March', 'May'] },
  { id: '8', name: 'Dubai', days: 5, months: ['March'] },
  { id: '9', name: 'Iceland', days: 9, months: ['September', 'October'] },
  { id: '10', name: 'Kedarnath', days: 9, months: ['May'] },
  { id: '11', name: 'Nepal', days: 6, months: ['October'] },
  { id: '12', name: 'Vietnam', days: 9, months: ['December', 'March'] },
  { id: '13', name: 'China', days: 9, months: ['March', 'October'] },
  { id: '14', name: 'Bhutan', days: 9, months: ['March', 'October'] },
];

export const useTravelData = () => {
  const [places, setPlaces] = useState<TravelPlace[]>(() => {
    const saved = localStorage.getItem('travelPlaces');
    return saved ? JSON.parse(saved) : initialPlaces;
  });

  const [plannerData, setPlannerData] = useState<PlannerCell[]>(() => {
    const saved = localStorage.getItem('plannerData');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('travelPlaces', JSON.stringify(places));
  }, [places]);

  useEffect(() => {
    localStorage.setItem('plannerData', JSON.stringify(plannerData));
  }, [plannerData]);

  const addPlace = (place: Omit<TravelPlace, 'id'>) => {
    const newPlace: TravelPlace = {
      ...place,
      id: Date.now().toString(),
    };
    setPlaces(prev => [...prev, newPlace]);
  };

  const updatePlace = (id: string, updates: Partial<TravelPlace>) => {
    setPlaces(prev => prev.map(place => 
      place.id === id ? { ...place, ...updates } : place
    ));
  };

  const deletePlace = (id: string) => {
    setPlaces(prev => prev.filter(place => place.id !== id));
    // Remove from planner if assigned
    setPlannerData(prev => prev.map(cell => 
      cell.place?.id === id ? { ...cell, place: undefined } : cell
    ));
  };

  const assignPlaceToCell = (year: number, vacationType: string, place: TravelPlace) => {
    setPlannerData(prev => {
      const existing = prev.find(cell => cell.year === year && cell.vacationType === vacationType);
      if (existing) {
        return prev.map(cell => 
          cell.year === year && cell.vacationType === vacationType 
            ? { ...cell, place } 
            : cell
        );
      } else {
        return [...prev, { year, vacationType, place }];
      }
    });
  };

  const removePlaceFromCell = (year: number, vacationType: string) => {
    setPlannerData(prev => prev.map(cell => 
      cell.year === year && cell.vacationType === vacationType 
        ? { ...cell, place: undefined } 
        : cell
    ));
  };

  return {
    places,
    plannerData,
    addPlace,
    updatePlace,
    deletePlace,
    assignPlaceToCell,
    removePlaceFromCell,
  };
};
