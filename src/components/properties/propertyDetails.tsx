'use client';

import React from 'react';
import {
	Box,
	Typography,
	Grid,
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
import { PropertyResponseDto } from '@/hooks/useProperties/dto';
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
		<Box mx='auto' py={4}>
			{/* Image Slider */}
			<Typography variant='h5' fontWeight={600}>
				{title}
			</Typography>
			<Box
				mb={2}
				display='flex'
				justifyContent='space-between'
				alignItems='center'
			>
				<Typography variant='body1' color='text.secondary' mb={2}>
					{locationString}
				</Typography>
				<Stack direction='row' spacing={1}>
					<IconButton>
						<ShareIcon />
					</IconButton>
					<IconButton>
						<FavoriteBorderIcon />
					</IconButton>
				</Stack>
			</Box>
			<Box borderRadius={3} overflow='hidden' mb={4}>
				<ImageSlide property={property} page='detail' />
			</Box>

			{/* Highlight Info */}
			<Box
				alignItems='center'
				mb={2}
				display='flex'
				justifyContent='space-between'
			>
				<Typography variant='h6' fontWeight={600}>
					{formatPrice(price, currency)}
				</Typography>
				<Stack direction='row' spacing={1}>
					<Rating
						name='rating'
						readOnly
						defaultValue={property.reviewRate}
						size='small'
					/>
				</Stack>
			</Box>

			<Stack direction='row' spacing={1} mb={3}>
				<Chip label={`${bedrooms} Bedrooms`} icon={<span>{'🛏️'}</span>} />
				<Chip label={`${bathrooms} Bathrooms`} icon={<span>{'🛁'}</span>} />
				<Chip label={`${size} sqft`} icon={<span>{'📏'}</span>} />
				<Chip label={`${rooms} Rooms`} icon={<span>{'🚪'}</span>} />
			</Stack>

							{/* Host Info */}
				<Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3, display: "flex", gap: 4 }} >
					<Stack direction="row" alignItems="center" spacing={2} mb={2}>
						<Avatar alt="Host" src="/images/user-avatar.png" sx={{ width: 64, height: 64 }} />
						<Box>
							<Typography fontWeight={600} display="flex" alignItems="center">
								<Typography px={0.5}>Hosted by Kevin</Typography>
								<Verified color="primary" fontSize="small" />
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Superhost · 2 years hosting
							</Typography>
						</Box>
					</Stack>
					<Divider sx={{ my: 2 }} />
					<Box>
						<Typography variant="body2" fontWeight={600} gutterBottom>
							Contact Information
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Phone: +1 (123) 456-7890
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Email: kevin.host@example.com
						</Typography>
					</Box>
					<Divider sx={{ my: 2 }} />
					<Stack direction="row" spacing={1} alignItems="center">
						<IconButton>
							<ChatIcon />
						</IconButton>
						<Typography variant="body2" color="text.secondary">
							Message host
						</Typography>
					</Stack>
				</Paper>

			<Typography variant='body2' color='text.secondary'>
				{description}
			</Typography>

      <Divider sx={{ my: 3 }} />
        <Typography variant='h6' gutterBottom>
          What this place offers
        </Typography>
        <Stack direction='row' spacing={1} flexWrap='wrap' mb={3}>
          {PROPERTY_FEATURES.map((feature) => (
            <Chip
              key={feature}
              label={feature
                .replace(/_/g, ' ') // Replace underscores with spaces
                .replace(/\b\w/g, (char) => char.toUpperCase())} // Capitalize each word
              icon={
                <span>
                  {feature === 'garage' && '🚗'}
                  {feature === 'swimming_pool' && '🏊'}
                  {feature === 'garden' && '🌳'}
                  {feature === 'balcony' && '🏞️'}
                  {feature === 'air_conditioning' && '❄️'}
                  {feature === 'security' && '🔒'}
                  {feature === 'gym' && '🏋️'}
                  {feature === 'fireplace' && '🔥'}
                  {feature === 'furnished' && '🛋️'}
                  {feature === 'internet' && '🌐'}
                  {feature === 'solar_panels' && '☀️'}
                  {feature === 'basement' && '🏠'}
                </span>
              }
              sx={{ mb: 1 }} // Add margin for better spacing
            />
          ))}
        </Stack>

      <Divider sx={{ my: 3 }} />
      <PropertyReviews/>

			{/* Video Tour */}
			<>
				<Divider sx={{ my: 3 }} />
				<Typography variant='h6' gutterBottom>
					Property Video Tour
				</Typography>
				<Box
					sx={{
						position: 'relative',
						paddingTop: '56.25%',
						borderRadius: 3,
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
			</>

			{/* Map */}
			<Divider sx={{ my: 3 }} />
			<Typography variant='h6' gutterBottom>
				Location
			</Typography>
			<Box sx={{ borderRadius: 3, overflow: 'hidden', height: 400 }}>
				<iframe
					width='100%'
					height='100%'
					loading='lazy'
					allowFullScreen
					referrerPolicy='no-referrer-when-downgrade'
					src={googleMapSrc}
				/>
			</Box>

			{/* Property Details */}
		</Box>
	);
}
