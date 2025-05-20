'use client';

import React from 'react';
import {
	Box,
	TextField,
	IconButton,
	Typography,
	InputAdornment,
	Stack,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import Slider from 'react-slick';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
	isSmall: boolean;
	onOpenDrawer: () => void;
}

export const PROPERTY_TYPES = [
	{ label: 'Apartment', value: 'Apartment', icon: '🏢' },
	{ label: 'House', value: 'House', icon: '🏠' },
	{ label: 'Condo', value: 'Condo', icon: '🏬' },
	{ label: 'Villa', value: 'Villa', icon: '🏡' },
	{ label: 'Studio', value: 'Studio', icon: '🎬' },
	{ label: 'Townhouse', value: 'Townhouse', icon: '🏘️' },
	{ label: 'Cottage', value: 'Cottage', icon: '🌲' },
	{ label: 'Loft', value: 'Loft', icon: '🏚️' },
	{ label: 'Duplex', value: 'Duplex', icon: '🏠🏠' },
	{ label: 'Penthouse', value: 'Penthouse', icon: '🌇' },
	{ label: 'Cabin', value: 'Cabin', icon: '🪵' },
	{ label: 'Farmhouse', value: 'Farmhouse', icon: '🚜' },
	{ label: 'Bungalow', value: 'Bungalow', icon: '🏡' },
	{ label: 'Boat', value: 'Boat', icon: '⛵' },
	{ label: 'Treehouse', value: 'Treehouse', icon: '🌳' },
];

function SampleNextArrow(props: { onClick?: () => void }) {
	const { onClick } = props;
	return (
		<IconButton
			onClick={onClick}
			sx={{
				position: 'absolute',
				right: -30,
				top: '50%',
				transform: 'translateY(-50%)',
				zIndex: 1,
			}}
		>
			<ArrowForwardIosIcon fontSize='small' />
		</IconButton>
	);
}

function SamplePrevArrow(props: { onClick?: () => void }) {
	const { onClick } = props;
	return (
		<IconButton
			onClick={onClick}
			sx={{
				position: 'absolute',
				left: -20,
				top: '50%',
				transform: 'translateY(-50%)',
				zIndex: 1,
			}}
		>
			<ArrowBackIosNewIcon fontSize='small' />
		</IconButton>
	);
}

const settings = {
	infinite: true,
	speed: 300,
	slidesToShow: 8,
	slidesToScroll: 2,
	arrows: true,
	dots: false,
	nextArrow: <SampleNextArrow />,
	prevArrow: <SamplePrevArrow />,
};

export default function TopFilters({ isSmall, onOpenDrawer }: Props) {
	// const [selectedType, setSelectedType] = React.useState<string | null>(null);
	const [search, setSearch] = React.useState('');

	return (
		<Box display='flex' gap={2} flexWrap='wrap' alignItems='center'>
			{/* Property Type Selectors */}
			<Box sx={{ position: 'relative', pr: 6, maxWidth: '60%' }}>
				<Slider {...settings}>
					{PROPERTY_TYPES.map((type) => (
						<Box key={type.value} sx={{ px: 1 }}>
							<Stack
								alignItems='center'
								justifyContent='center'
								spacing={1}
								sx={{
									borderRadius: 5,
									border: '1px solid #ddd',
									textAlign: 'center',
									width: 80,
									height: 80,
									transition: '0.2s',
									cursor: 'pointer',
									'&:hover': {
										bgcolor: '#f5f5f5',
									},
								}}
							>
								<span style={{ fontSize: 30, lineHeight: 1 }}>
									{type.icon}
									{/* <type.icon fontSize="small" /> */}
								</span>
								<Typography fontSize={10} fontWeight={500}>
									{type.label}
								</Typography>
							</Stack>
						</Box>
					))}
				</Slider>
			</Box>

			<TextField
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				size='small'
				placeholder='Search location or keyword'
				sx={{
					minWidth: 260,
					borderRadius: 5,
					bgcolor: 'white',
					boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
					'& .MuiOutlinedInput-root': {
						borderRadius: 5,
					},
				}}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<SearchIcon fontSize='small' />
						</InputAdornment>
					),
				}}
			/>

			{/* Filter Drawer Icon (mobile only) */}
			{isSmall && (
				<IconButton onClick={onOpenDrawer} sx={{ ml: 'auto' }}>
					<FilterListIcon />
				</IconButton>
			)}
		</Box>
	);
}
