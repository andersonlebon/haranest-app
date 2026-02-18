import { useState, useEffect, useCallback } from 'react';

export interface PropertyFilters {
  price: number[];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  features: string[];
  propertyType: string;
  search: string;
  page: number;
  perPage: number;
}

const DEFAULT_FILTERS: PropertyFilters = {
  price: [0, 1000000],
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
  features: [],
  propertyType: 'all',
  search: '',
  page: 1,
  perPage: 8,
};

 
export function usePropertyFilters() {
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  
  // Debounce search input by 5 seconds before applying it to the filters
  const debouncedSearch = useDebounce(filters.search, 5000);
  const debouncedFilters = { ...filters, search: debouncedSearch };

 
  const updateFilters = useCallback((newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
 
      ...(newFilters.page === undefined && Object.keys(newFilters).length > 0 ? { page: 1 } : {})
    }));
  }, []);

 
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

 
  const getActiveFilters = useCallback(() => {
    const active: Partial<PropertyFilters> = {};
    
    if (filters.price[0] > 0 || filters.price[1] < 1000000) {
      active.price = filters.price;
    }
    if (filters.bedrooms > 0) active.bedrooms = filters.bedrooms;
    if (filters.bathrooms > 0) active.bathrooms = filters.bathrooms;
    if (filters.amenities.length > 0) active.amenities = filters.amenities;
    if (filters.features.length > 0) active.features = filters.features;
    if (filters.propertyType !== 'all') active.propertyType = filters.propertyType;
    if (filters.search.trim()) active.search = filters.search;
    
    return active;
  }, [filters]);
 
  const getActiveFiltersCount = useCallback(() => {
    return Object.keys(getActiveFilters()).length;
  }, [getActiveFilters]);

  return {
    filters: debouncedFilters,
    updateFilters,
    resetFilters,
    getActiveFilters,
    getActiveFiltersCount,
    isLoading,
    setIsLoading,
  };
}

 
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
