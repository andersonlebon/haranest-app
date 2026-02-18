'use client';

import React from 'react';
import {
	Box,
	Typography,
	Stack,
	Chip,
	Divider,
	Avatar,
	Paper,
	IconButton,
	Rating,
  Button,
} from '@mui/material';
import { Star, Favorite } from '@mui/icons-material';
import { PropertyResponseDto } from '@/db/dtos/properties.dto';
import ImageSlide from './imageCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { formatPrice } from '@/utils/formats';
import PropertyReviews from './review';
import { Verified } from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
interface Props {
	property: PropertyResponseDto;
}
const PROPERTY_FEATURES = [
	'garage',
	'swimming_pool',
	'garden',
	'balcony',
	'air_conditioning',
	'security',
	'gym',
	'fireplace',
	'furnished',
	'internet',
	'solar_panels',
	'basement',
];
export default function PropertyDetails({ property }: Props) {
	const {
		title,
		images,
		locationCity,
		locationTown,
		locationProvince,
		price,
		currency,
		description,
		bedrooms,
		bathrooms,
		size,
		rooms,
		floors,
		structureType,
		roofing,
		exteriorMaterial,
		garage,
		basement,
		status,
		latitude,
		longitude,
		videoPreviewUrl,
	} = property;

	const locationString = `${locationTown}, ${locationCity}, ${locationProvince}`;
	const googleMapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBBWTeGAQYOjuq4ITcaOp4dWk6MOO76WB4&q=${latitude},${longitude}`;

	return (
		<Box mx='auto' py={2}>
			{/* Header Section - Compact */}
			<Box mb={2}>
				<Box display='flex' justifyContent='space-between' alignItems='flex-start' mb={1}>
					<Box flex={1}>
						<Typography variant='h5' fontWeight={600} gutterBottom>
							{title}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{locationString}
						</Typography>
					</Box>
					<Stack direction='row' spacing={0.5}>
						<IconButton size='small'>
							<ShareIcon fontSize='small' />
						</IconButton>
						<IconButton size='small'>
							<FavoriteBorderIcon fontSize='small' />
						</IconButton>
					</Stack>
				</Box>
			</Box>

			{/* Image Slider */}
			<Box borderRadius={2} overflow='hidden' mb={3}>
				<ImageSlide property={property} page='detail' />
			</Box>

			{/* Main Content Layout */}
			<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
				{/* Left Column - Main Info */}
				<Box flex={2}>
					{/* Price and Rating */}
					<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
						<Typography variant='h5' fontWeight={600} color='primary'>
							{formatPrice(price, currency)}
						</Typography>
						<Stack direction='row' spacing={1} alignItems='center'>
							<Rating
								name='rating'
								readOnly
								defaultValue={property.reviewRate}
								size='small'
							/>
							<Typography variant='body2' color='text.secondary'>
								({property.reviewRate})
							</Typography>
						</Stack>
					</Box>

					{/* Property Stats - Compact */}
					<Stack direction='row' spacing={1} mb={2} flexWrap='wrap'>
						<Chip label={`${bedrooms} Bed`} size='small' />
						<Chip label={`${bathrooms} Bath`} size='small' />
						<Chip label={`${size} sqft`} size='small' />
						<Chip label={`${rooms} Rooms`} size='small' />
					</Stack>

					{/* Description */}
					<Typography variant='body2' color='text.secondary' mb={2}>
						{description}
					</Typography>

					{/* Features */}
					<Box mb={2}>
						<Typography variant='h6' gutterBottom>
							What this place offers
						</Typography>
						<Stack direction='row' spacing={1} flexWrap='wrap'>
							{PROPERTY_FEATURES.map((feature) => (
								<Chip
									key={feature}
									label={feature
										.replace(/_/g, ' ')
										.replace(/\b\w/g, (char) => char.toUpperCase())}
									size='small'
									sx={{ mb: 0.5 }}
								/>
							))}
						</Stack>
					</Box>

					{/* Video Tour */}
					<Box mb={3}>
						<Typography variant='h6' gutterBottom>
							Property Video Tour
						</Typography>
						<Box
							sx={{
								position: 'relative',
								paddingTop: '56.25%',
								borderRadius: 2,
								overflow: 'hidden',
							}}
						>
							<iframe
								src={videoPreviewUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
								title='Property video'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
								allowFullScreen
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									border: 0,
								}}
							/>
						</Box>
					</Box>

					{/* Reviews */}
					<PropertyReviews propertyId={property.id}/>
				</Box>

				{/* Right Column - Host Info & Map */}
				<Box flex={1} minWidth={300}>
					{/* Host Info - Compact */}
					<Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
						<Stack direction="row" alignItems="center" spacing={2} mb={2}>
							<Avatar alt="Host" src="/images/user-avatar.png" sx={{ width: 48, height: 48 }} />
							<Box>
								<Typography fontWeight={600} display="flex" alignItems="center" variant="body2">
									Hosted by Caleb Anderson
									<Verified color="primary" fontSize="small" sx={{ ml: 0.5 }} />
								</Typography>
								<Typography variant="caption" color="text.secondary">
									Superhost · 2 years hosting
								</Typography>
							</Box>
						</Stack>
						
						<Stack direction="row" spacing={1} alignItems="center" mb={2}>
							<IconButton size='small'>
								<ChatIcon fontSize='small' />
							</IconButton>
							<Typography variant="body2" color="text.secondary">
								Message host
							</Typography>
						</Stack>
						
						<Typography variant="caption" color="text.secondary" display="block">
							Phone: +250794387483
						</Typography>
						<Typography variant="caption" color="text.secondary" display="block">
							Email: buyanaanderson@gmail.com
						</Typography>
					</Paper>

					{/* Map - Compact */}
					<Box>
						<Typography variant='h6' gutterBottom>
							Location
						</Typography>
						<Box sx={{ borderRadius: 2, overflow: 'hidden', height: 300 }}>
							<iframe
								width='100%'
								height='100%'
								loading='lazy'
								allowFullScreen
								referrerPolicy='no-referrer-when-downgrade'
								src={googleMapSrc}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
