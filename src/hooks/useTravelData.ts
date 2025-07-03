
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TravelPlace, PlannerCell } from '@/types/travel';
import { useToast } from '@/hooks/use-toast';

export const useTravelData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch travel places from Supabase
  const { data: places = [], isLoading } = useQuery({
    queryKey: ['travel-places'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_places')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch planner assignments from Supabase
  const { data: plannerData = [] } = useQuery({
    queryKey: ['planner-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('planner_assignments')
        .select(`
          *,
          travel_places (*)
        `)
        .order('year', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map(assignment => ({
        year: assignment.year,
        vacationType: assignment.vacation_type,
        place: assignment.travel_places
      })) as PlannerCell[];
    },
  });

  // Add place mutation
  const addPlaceMutation = useMutation({
    mutationFn: async (place: Omit<TravelPlace, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('travel_places')
        .insert([place])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-places'] });
      toast({
        title: "Success",
        description: "Destination added successfully!",
      });
    },
    onError: (error) => {
      console.error('Error adding place:', error);
      toast({
        title: "Error",
        description: "Failed to add destination. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update place mutation
  const updatePlaceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TravelPlace> }) => {
      const { data, error } = await supabase
        .from('travel_places')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-places'] });
      queryClient.invalidateQueries({ queryKey: ['planner-assignments'] });
      toast({
        title: "Success",
        description: "Destination updated successfully!",
      });
    },
    onError: (error) => {
      console.error('Error updating place:', error);
      toast({
        title: "Error",
        description: "Failed to update destination. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete place mutation
  const deletePlaceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('travel_places')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-places'] });
      queryClient.invalidateQueries({ queryKey: ['planner-assignments'] });
      toast({
        title: "Success",
        description: "Destination deleted successfully!",
      });
    },
    onError: (error) => {
      console.error('Error deleting place:', error);
      toast({
        title: "Error",
        description: "Failed to delete destination. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Assign place to cell mutation
  const assignPlaceMutation = useMutation({
    mutationFn: async ({ year, vacationType, place }: { year: number; vacationType: string; place: TravelPlace }) => {
      const { data, error } = await supabase
        .from('planner_assignments')
        .upsert({
          year,
          vacation_type: vacationType,
          place_id: place.id
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner-assignments'] });
      toast({
        title: "Success",
        description: "Destination assigned successfully!",
      });
    },
    onError: (error) => {
      console.error('Error assigning place:', error);
      toast({
        title: "Error",
        description: "Failed to assign destination. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove place from cell mutation
  const removePlaceMutation = useMutation({
    mutationFn: async ({ year, vacationType }: { year: number; vacationType: string }) => {
      const { error } = await supabase
        .from('planner_assignments')
        .delete()
        .eq('year', year)
        .eq('vacation_type', vacationType);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner-assignments'] });
      toast({
        title: "Success",
        description: "Destination removed successfully!",
      });
    },
    onError: (error) => {
      console.error('Error removing place:', error);
      toast({
        title: "Error",
        description: "Failed to remove destination. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addPlace = (place: Omit<TravelPlace, 'id' | 'created_at' | 'updated_at'>) => {
    addPlaceMutation.mutate(place);
  };

  const updatePlace = (id: string, updates: Partial<TravelPlace>) => {
    updatePlaceMutation.mutate({ id, updates });
  };

  const deletePlace = (id: string) => {
    deletePlaceMutation.mutate(id);
  };

  const assignPlaceToCell = (year: number, vacationType: string, place: TravelPlace) => {
    assignPlaceMutation.mutate({ year, vacationType, place });
  };

  const removePlaceFromCell = (year: number, vacationType: string) => {
    removePlaceMutation.mutate({ year, vacationType });
  };

  return {
    places,
    plannerData,
    isLoading,
    addPlace,
    updatePlace,
    deletePlace,
    assignPlaceToCell,
    removePlaceFromCell,
  };
};
