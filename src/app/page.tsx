'use client';
import React, { useState } from 'react';
import {
  Grid, Box, ToggleButton, ToggleButtonGroup, useMediaQuery, Pagination,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import MobileFiltersDrawer from '../components/properties/mobileFiltersDrawer';
import PropertyGridView from '../components/properties/propertyGridView';
import PropertyListView from '../components/properties/propertyListView';
import SidebarFilters from '../components/properties/sidebarFilters';
import TopFilters from '../components/properties/topFilters';
import { usePropertiesQuery } from '@/hooks/useProperties';
import { omitValues } from '@/utils/formats';


export interface FiltersState {
  price: number[];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  features: string[];
  propertyType: string;
  page: number;
  perPage: number;  
  search?: string; // Optional search field
}

const ITEMS_PER_PAGE = 8;
const DEFAULT_PRICE_RANGE = [1, 999999999];
export default function PropertyListPage() {
  
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FiltersState>({
    page: 1,
    perPage: ITEMS_PER_PAGE,
    price: DEFAULT_PRICE_RANGE,
    propertyType: 'all',
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    features: [],
    search: '', // Initialize search field
  });
  const { data: properties, refetch } = usePropertiesQuery(filters)

  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmall = useMediaQuery((theme: {
    breakpoints: {
      down: (key: string) => string;
    };
  }) => theme.breakpoints.down('md'));

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, nextView: 'grid' | 'list') => {
    if (nextView !== null) setView(nextView);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({
      ...prev,
      page: value,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      perPage: ITEMS_PER_PAGE,
      price: DEFAULT_PRICE_RANGE,
      propertyType: 'all',
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
      features: [],
    });
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleApplyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      page: 1, // Reset to first page on filter apply
    }));
    refetch();
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  return (
    <Box p={2} sx={{ width: '100%' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Grid size={{ xs: 12, md: 10 }} >
          <TopFilters onOpenDrawer={() => setDrawerOpen(true)}
            isSmall={isSmall}
            search={filters.search || ''}
            selectedType={filters.propertyType}
            handleFilterChange={handleFilterChange}
            handleApplyFilters={handleApplyFilters}
          />
        </Grid>
        <Grid size={{ xs: 4, sm: 2 }} sx={{ textAlign: 'right' }}>
          <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
            <ToggleButton value="grid"><ViewModuleIcon /></ToggleButton>
            <ToggleButton value="list"><ViewListIcon /></ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        {!isSmall && (
          <Grid size={{ xs: 12, md: 3 }}>
            <SidebarFilters onFilterChange={handleFilterChange} 
              filters={omitValues(filters, ['propertyType', 'page', 'perPage'])}
              onResetFilters={handleResetFilters}
              onApplyFilters={handleApplyFilters}
              defaultPriceRange={DEFAULT_PRICE_RANGE}
             />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: isSmall ? 12 : 9 }}>
          {view === 'grid' ? (
            <PropertyGridView properties={properties?.data || []} />
          ) : (
            <PropertyListView properties={properties?.data || []} />
          )}

          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={10}
              page={filters.page}
              onChange={handlePageChange}
              color="primary"
              size="small"
              shape='circular'
            />
          </Box>
        </Grid>
      </Grid>

      <MobileFiltersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}
