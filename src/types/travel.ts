
export interface TravelPlace {
  id: string;
  name: string;
  days: number;
  months: string[];
}

export interface PlannerCell {
  year: number;
  vacationType: string;
  place?: TravelPlace;
}

export type VacationType = 'Annual Break' | 'Summer Vacation' | 'Puja' | 'Christmas';
