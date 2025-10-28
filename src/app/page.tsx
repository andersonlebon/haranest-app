'use client';
import React, { useState } from 'react';
import {
  Grid, Box, ToggleButton, ToggleButtonGroup, useMediaQuery, Pagination, Typography, Button,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import MobileFiltersDrawer from '../components/properties/mobileFiltersDrawer';
import PropertyGridView from '../components/properties/propertyGridView';
import PropertyListView from '../components/properties/propertyListView';
import SidebarFilters from '../components/properties/sidebarFilters';
import TopFilters from '../components/properties/topFilters';
import { usePropertiesQuery } from '@/hooks/useProperties';
import { usePropertyFilters } from '@/hooks/useProperties/usePropertyFilters';
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
  
 
  const {
    filters,
    updateFilters,
    resetFilters,
    getActiveFiltersCount
  } = usePropertyFilters();
  

  const { 
    data: properties, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = usePropertiesQuery(filters);

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
    updateFilters({ page: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  
  const handleFilterChange = (newFilters: any) => {
    updateFilters(newFilters);
  };


  const handleResetFilters = () => {
    resetFilters();
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 
  const handleApplyFilters = () => {
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 3,
      // Animation CSS pour le spinner
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
        <Box sx={{ 
          mb: 4, 
          p: 3, 
          borderRadius: 3, 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Grid size={{ xs: 12, md: 10 }}>
              <TopFilters 
                onOpenDrawer={() => setDrawerOpen(true)}
                isSmall={isSmall}
                search={filters.search || ''}
                selectedType={filters.propertyType}
                handleFilterChange={handleFilterChange}
                handleApplyFilters={handleApplyFilters}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 2 }} sx={{ textAlign: 'right' }}>
              <ToggleButtonGroup 
                value={view} 
                exclusive 
                onChange={handleViewChange} 
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="grid"><ViewModuleIcon /></ToggleButton>
                <ToggleButton value="list"><ViewListIcon /></ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {!isSmall && (
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{
                p: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: 'fit-content',
                position: 'sticky',
                top: 20
              }}>
                <SidebarFilters 
                  onFilterChange={handleFilterChange} 
                  filters={omitValues(filters, ['propertyType', 'page', 'perPage'])}
                  onResetFilters={handleResetFilters}
                  onApplyFilters={handleApplyFilters}
                  defaultPriceRange={DEFAULT_PRICE_RANGE}
                />
              </Box>
            </Grid>
          )}
          <Grid size={{ xs: 12, md: isSmall ? 12 : 9 }}>
            <Box sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minHeight: '600px'
            }}>

              {isLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #1976d2',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        mx: 'auto',
                        mb: 2
                      }}
                    />
                    <Typography color="text.secondary">Loading of proprieties ....</Typography>
                  </Box>
                </Box>
              )}

          
              {isError && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h6" color="error" gutterBottom>
                      Something went wrong.
                    </Typography>
                    <Typography color="text.secondary" mb={2}>
                      {error?.message || 'Une erreur est survenue'}
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => refetch()}
                      sx={{ borderRadius: 2 }}
                    >
                      Please try again
                    </Button>
                  </Box>
                </Box>
              )}

           
              {!isLoading && !isError && (
                <>
                  {view === 'grid' ? (
                    <PropertyGridView properties={(properties as any)?.data || []} />
                  ) : (
                    <PropertyListView properties={(properties as any)?.data || []} />
                  )}
                  
               
                  {getActiveFiltersCount() > 0 && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      bgcolor: 'primary.light', 
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Typography variant="body2" color="primary.contrastText">
                        {getActiveFiltersCount()} Available filters 
                      </Typography>
                      <Button 
                        size="small" 
                        onClick={resetFilters}
                        sx={{ color: 'primary.contrastText' }}
                      >
                        Clear
                      </Button>
                    </Box>
                  )}
                </>
              )}

              {!isLoading && !isError && (
                <Box mt={4} display="flex" justifyContent="center">
                  <Pagination
                    count={(properties as any)?.totalPages || 1}
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="small"
                    shape='circular'
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          }
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <MobileFiltersDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        filters={omitValues(filters, ['propertyType', 'page', 'perPage', 'search'])}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        defaultPriceRange={DEFAULT_PRICE_RANGE}
      />
    </Box>
  );
}
