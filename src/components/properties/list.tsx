'use client';
import React, { useState } from 'react';
import {
  Grid, Box, ToggleButton, ToggleButtonGroup, useMediaQuery, Pagination,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import MobileFiltersDrawer from './mobileFiltersDrawer';
import PropertyGridView from './propertyGridView';
import PropertyListView from './propertyListView';
import SidebarFilters from './sidebarFilters';
import TopFilters from './topFilters';
import { PropertyMock } from '@/db/types';

const properties = [
  { id: 1, title: 'Luxury Villa', price: 500000, type: 'House', bedrooms: 4 },
  { id: 2, title: 'Downtown Apartment', price: 300000, type: 'Apartment', bedrooms: 2 },
  { id: 3, title: 'Modern Condo', price: 350000, type: 'Condo', bedrooms: 3 },
  { id: 4, title: 'Cozy Cottage', price: 275000, type: 'Cottage', bedrooms: 2 },
  { id: 5, title: 'Beach House', price: 750000, type: 'House', bedrooms: 5 },
  { id: 6, title: 'Suburban Home', price: 420000, type: 'House', bedrooms: 4 },
  { id: 7, title: 'City Loft', price: 310000, type: 'Loft', bedrooms: 1 },
  { id: 8, title: 'Country Farmhouse', price: 390000, type: 'Farmhouse', bedrooms: 3 },
  { id: 9, title: 'Mountain Cabin', price: 260000, type: 'Cabin', bedrooms: 2 },
] as PropertyMock[];

const ITEMS_PER_PAGE = 8;

export default function PropertyListPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const isSmall = useMediaQuery((theme: {
    breakpoints: {
      down: (key: string) => string;
    };
  }) => theme.breakpoints.down('md'));

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, nextView: 'grid' | 'list') => {
    if (nextView !== null) setView(nextView);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedProperties = properties.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box p={2} sx={{ width: '100%' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Grid size={{ xs: 12, md: 10 }} >
          <TopFilters isSmall={isSmall} onOpenDrawer={() => setDrawerOpen(true)} />
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
            <SidebarFilters />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: isSmall ? 12 : 9 }}>
          {view === 'grid' ? (
            <PropertyGridView properties={paginatedProperties} />
          ) : (
            <PropertyListView properties={paginatedProperties} />
          )}

          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(properties.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="large"
            />
          </Box>
        </Grid>
      </Grid>

      <MobileFiltersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}
