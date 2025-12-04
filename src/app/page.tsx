'use client';

import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Grid,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  Pagination,
  Skeleton,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import MobileFiltersDrawer from '../components/properties/mobileFiltersDrawer';
import SidebarFilters from '../components/properties/sidebarFilters';
import TopFilters from '../components/properties/topFilters';
import { omitValues } from '@/utils/formats';
import { useGetProperties } from '@/hooks/useProperties';
import PageErrorState from '@/components/shared/ErrorState';
import { PropertyParams } from '@/db/dtos/properties.dto';
import { useAuth } from '@/context/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useRouter, useSearchParams } from 'next/navigation';

// ----------------------
// Small local debounce hook (lightweight)
// ----------------------
function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ----------------------
// Dynamic imports to split heavy views
// ----------------------
const PropertyGridViewRaw = dynamic(
  () => import('../components/properties/propertyGridView'),
  { loading: () => <Skeleton variant="rectangular" height={300} /> }
);
const PropertyListViewRaw = dynamic(
  () => import('../components/properties/propertyListView'),
  { loading: () => <Skeleton variant="rectangular" height={300} /> }
);

// wrap dynamic imports with memo to avoid needless re-renders
const PropertyGridView = React.memo((props: any) => <PropertyGridViewRaw {...props} />);
const PropertyListView = React.memo((props: any) => <PropertyListViewRaw {...props} />);

// ----------------------
// Defaults (adjusted perPage)
// ----------------------
const DEFAULT_FILTERS: PropertyParams = {
  price: [1, 999999999],
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
  features: [],
  propertyType: '',
  page: 1,
  perPage: 12, // realistic default to reduce requests
};

export default function PropertyListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // initialize filters from URL if available (non-blocking)
  const initialFromUrl = useMemo(() => {
    try {
      const params: Partial<PropertyParams> = {};
      const page = searchParams?.get('page');
      const perPage = searchParams?.get('perPage');
      const type = searchParams?.get('type');
      const search = searchParams?.get('q');
      if (page) params.page = Number(page) || 1;
      if (perPage) params.perPage = Number(perPage) || DEFAULT_FILTERS.perPage;
      if (type) params.propertyType = type;
      if (search) params.search = search;
      return params;
    } catch (e) {
      return {};
    }
  }, [searchParams]);

  const [filters, setFilters] = useState<PropertyParams>({
    ...DEFAULT_FILTERS,
    ...initialFromUrl,
  } as PropertyParams);

  // debounce filters to avoid spamming the API while the user types/adjusts
  const debouncedFilters = useDebounce(filters, 450);

  // Use your query hook — we pass debouncedFilters so API calls are throttled.
  // If your `useGetProperties` accepts query options (e.g., react-query options),
  // add keepPreviousData: true and a sensible staleTime there.
  const {
    data: properties,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProperties(debouncedFilters);

 const isSmall = useMediaQuery(
		(theme: {
			breakpoints: {
				down: (key: string) => string;
			};
		}) => theme.breakpoints.down('md')
	);
  // ----------
  // Handlers
  // ----------
  const handleViewChange = useCallback((_: React.MouseEvent<HTMLElement>, nextView: 'grid' | 'list') => {
    if (nextView) setView(nextView);
  }, []);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({ ...prev, page: value }));
    // sync to URL for shareability & browser back/forward
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(value));
    router.replace(url.pathname + url.search);
  }, [router]);

  const handleFilterChange = useCallback((newFilters: Partial<PropertyParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    // update URL params (non-blocking)
    const url = new URL(window.location.href);
    if (newFilters.propertyType !== undefined) url.searchParams.set('type', String(newFilters.propertyType || ''));
    if ((newFilters as any).search !== undefined) url.searchParams.set('q', String((newFilters as any).search || ''));
    url.searchParams.set('page', '1');
    router.replace(url.pathname + url.search);
  }, [router]);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setDrawerOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('type');
    url.searchParams.delete('q');
    url.searchParams.set('page', '1');
    router.replace(url.pathname + url.search);
  }, [router]);

  const handleApplyFilters = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  // small derived memo to avoid passing fresh arrays / objects every render
  const sidebarFilters = useMemo(() => omitValues(filters, ['propertyType', 'page', 'perPage']), [filters]);
  const mobileFilters = useMemo(() => omitValues(filters, ['propertyType', 'page', 'perPage', 'search']), [filters]);

  // We still keep authentication hook in case PrivateRoute needs it. Avoid logging to console in production code.

  return (
    <PrivateRoute>
      <Box sx={{ width: '100%', minHeight: '100vh', py: 3 }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
          <Box sx={{ mb: 4, p: 3, borderRadius: 3 }}>
            <Box display='flex' alignItems='center' justifyContent='space-between' mb={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TopFilters
                  onOpenDrawer={() => setDrawerOpen(true)}
                  isSmall={isSmall}
                  search={filters.search || ''}
                  selectedType={filters.propertyType}
                  handleFilterChange={handleFilterChange}
                />
              </Grid>

              <Grid sx={{ textAlign: 'right' }}>
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={handleViewChange}
                  size='small'
                  sx={{
                    '& .MuiToggleButton-root': {
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'primary.dark' },
                      },
                    },
                  }}
                >
                  <ToggleButton value='grid'>
                    <ViewModuleIcon />
                  </ToggleButton>
                  <ToggleButton value='list'>
                    <ViewListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {!isSmall && (
              <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', boxShadow: '0 1px 15px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.2)', height: 'fit-content', position: 'sticky', top: 20 }}>
                  <SidebarFilters
                    onFilterChange={handleFilterChange}
                    filters={sidebarFilters}
                    onResetFilters={handleResetFilters}
                    onApplyFilters={handleApplyFilters}
                    defaultPriceRange={DEFAULT_FILTERS.price}
                  />
                </Box>
              </Grid>
            )}

              <Grid size={{ xs: 12, md: isSmall ? 12 : 9 }}>
              <Box sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', boxShadow: '0 1px 15px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.2)', minHeight: '600px' }}>
                {isLoading && (
                  <Box>
                    {view === 'grid' ? (
                      <Grid container spacing={3}>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <Box sx={{ p: 1 }}>
                              <Skeleton variant='rectangular' height={160} sx={{ borderRadius: 2 }} />
                              <Skeleton width='60%' height={24} sx={{ mt: 1 }} />
                              <Skeleton width='40%' height={20} />
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                            <Skeleton variant='rectangular' width={120} height={80} sx={{ borderRadius: 2 }} />
                            <Box sx={{ flex: 1 }}>
                              <Skeleton width='80%' height={24} />
                              <Skeleton width='40%' height={20} />
                              <Skeleton width='30%' height={20} />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}

                {isError && <PageErrorState message={error?.message} onRetry={refetch} />}

                {!isLoading && !isError && (
                  <>
                    {view === 'grid' ? (
                      <PropertyGridView properties={properties?.data || []} />
                    ) : (
                      <PropertyListView properties={properties?.data || []} />
                    )}
                  </>
                )}

                {!isLoading && !isError && (
                  <Box mt={4} display='flex' justifyContent='center'>
                    <Pagination
                      count={properties?.totalPages || 1}
                      page={filters.page}
                      onChange={handlePageChange}
                      color='primary'
                      size='small'
                      shape='circular'
                      sx={{ '& .MuiPaginationItem-root': { borderRadius: 2, '&.Mui-selected': { backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } } } }}
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
          filters={mobileFilters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          defaultPriceRange={DEFAULT_FILTERS.price}
        />
      </Box>
    </PrivateRoute>
  );
}
