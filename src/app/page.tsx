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


const ITEMS_PER_PAGE = 8;

export default function PropertyListPage() {
  
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    page: 1,
    perPage: ITEMS_PER_PAGE,
  });
  const { data: properties } = usePropertiesQuery(filters)

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
