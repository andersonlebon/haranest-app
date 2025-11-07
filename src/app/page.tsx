'use client';
import React, { useState } from 'react';
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
import PropertyGridView from '../components/properties/propertyGridView';
import PropertyListView from '../components/properties/propertyListView';
import SidebarFilters from '../components/properties/sidebarFilters';
import TopFilters from '../components/properties/topFilters';
import { omitValues } from '@/utils/formats';
import { useGetProperties } from '@/hooks/useProperties';
import PageErrorState from '@/components/shared/ErrorState';
import { PropertyParams } from '@/db/schema/properties/dto';

const DEFAULT_FILTERS: PropertyParams = {
	price: [1, 999999999],
	bedrooms: 0,
	bathrooms: 0,
	amenities: [],
	features: [],
	propertyType: '',
	page: 1,
	perPage: 1,
};

export default function PropertyListPage() {
	const [view, setView] = useState<'grid' | 'list'>('grid');
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [filters, setFilters] = useState<PropertyParams>(DEFAULT_FILTERS);

	const {
		data: properties,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetProperties(filters);

	const isSmall = useMediaQuery(
		(theme: {
			breakpoints: {
				down: (key: string) => string;
			};
		}) => theme.breakpoints.down('md')
	);

	const handleViewChange = (
		_: React.MouseEvent<HTMLElement>,
		nextView: 'grid' | 'list'
	) => {
		if (nextView !== null) setView(nextView);
	};

	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setFilters((prev) => ({ ...prev, page: value }));
	};

	const handleFilterChange = (newFilters: PropertyParams) => {
		console.log('New Filters:', newFilters);
		console.log('Previous Filters:', filters);
		setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
	};

	const handleResetFilters = () => {
		setFilters(DEFAULT_FILTERS);
		setDrawerOpen(false);
	};

	const handleApplyFilters = () => {
		setDrawerOpen(false);
	};

	return (
		<Box
			sx={{
				width: '100%',
				minHeight: '100vh',
				py: 3,
			}}
		>
			<Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
				<Box
					sx={{
						mb: 4,
						p: 3,
						borderRadius: 3,
					}}
				>
					<Box
						display='flex'
						alignItems='center'
						justifyContent='space-between'
						mb={3}
					>
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
											'&:hover': {
												backgroundColor: 'primary.dark',
											},
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
							<Box
								sx={{
									p: 3,
									borderRadius: 3,
									background: 'rgba(255, 255, 255, 0.9)',
									backdropFilter: 'blur(5px)',
									boxShadow: '0 1px 15px rgba(0, 0, 0, 0.1)',
									border: '1px solid rgba(255, 255, 255, 0.2)',
									height: 'fit-content',
									position: 'sticky',
									top: 20,
								}}
							>
								<SidebarFilters
									onFilterChange={handleFilterChange}
									filters={omitValues(filters, [
										'propertyType',
										'page',
										'perPage',
									])}
									onResetFilters={handleResetFilters}
									onApplyFilters={handleApplyFilters}
									defaultPriceRange={DEFAULT_FILTERS.price}
								/>
							</Box>
						</Grid>
					)}
					<Grid size={{ xs: 12, md: isSmall ? 12 : 9 }}>
						<Box
							sx={{
								p: 3,
								borderRadius: 3,
								background: 'rgba(255, 255, 255, 0.9)',
								backdropFilter: 'blur(5px)',
								boxShadow: '0 1px 15px rgba(0, 0, 0, 0.1)',
								border: '1px solid rgba(255, 255, 255, 0.2)',
								minHeight: '600px',
							}}
						>
							{isLoading && (
								<Box>
									{view === 'grid' ? (
										<Grid container spacing={3}>
											{Array.from({ length: 8 }).map((_, i) => (
												<Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
													<Box sx={{ p: 1 }}>
														<Skeleton
															variant='rectangular'
															height={160}
															sx={{ borderRadius: 2 }}
														/>
														<Skeleton width='60%' height={24} sx={{ mt: 1 }} />
														<Skeleton width='40%' height={20} />
													</Box>
												</Grid>
											))}
										</Grid>
									) : (
										<Box>
											{Array.from({ length: 4 }).map((_, i) => (
												<Box
													key={i}
													sx={{
														display: 'flex',
														gap: 2,
														mb: 2,
														alignItems: 'center',
													}}
												>
													<Skeleton
														variant='rectangular'
														width={120}
														height={80}
														sx={{ borderRadius: 2 }}
													/>
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

							{isError && (
								<PageErrorState message={error?.message} onRetry={refetch} />
							)}
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
										count={properties?.totalPages}
										page={filters.page}
										onChange={handlePageChange}
										color='primary'
										size='small'
										shape='circular'
										sx={{
											'& .MuiPaginationItem-root': {
												borderRadius: 2,
												'&.Mui-selected': {
													backgroundColor: 'primary.main',
													color: 'white',
													'&:hover': {
														backgroundColor: 'primary.dark',
													},
												},
											},
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
				filters={omitValues(filters, [
					'propertyType',
					'page',
					'perPage',
					'search',
				])}
				onFilterChange={handleFilterChange}
				onApplyFilters={handleApplyFilters}
				onResetFilters={handleResetFilters}
				defaultPriceRange={DEFAULT_FILTERS.price}
			/>
		</Box>
	);
}
