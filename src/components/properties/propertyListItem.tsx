'use client';

import React from 'react';
import {
  Grid,
  ListItem,
  Typography,
  Box,
} from '@mui/material';
// import BedIcon from '@mui/icons-material/Bed';
// import HomeWorkIcon from '@mui/icons-material/HomeWork';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImageSlide from './imageCard';
import { PropertyResponseDto } from '@/db/dtos/properties.dto';



export default function PropertyListItem({ property }: { property: PropertyResponseDto }) {

  return (
    <ListItem
      sx={{
        px: 3,
        py: 3,
        mb: 2,
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.shadows[2],
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
      disableGutters
    >
      <Grid container spacing={3} alignItems="center">
        {/* Image Slider */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box
            sx={(theme) => ({
              width: '100%',
              height: 200,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: theme.shadows[2],
            })}
          >
            <ImageSlide property={property} page={'list'} />
          </Box>
        </Grid>

        {/* Property Info */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Typography 
            fontSize={20} 
            fontWeight={600} 
            sx={{ 
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {property.title}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography fontSize={24} fontWeight={700} color="primary.main">
              ${property.price} {property.rentOrSell === 'rent' ? '/month' : ''}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontSize={14} color="text.secondary">
                ★ {property.reviewRate || 0}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
            <Typography fontSize={14} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              🛏️ {property.bedrooms || 0} bed
            </Typography>
            <Typography fontSize={14} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              🚿 {property.bathrooms || 0} bath
            </Typography>
            {property.size && (
              <Typography fontSize={14} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                📐 {property.size} sqft
              </Typography>
            )}
            <Typography fontSize={14} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              🏠 {property.propertyType}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </ListItem>
  );
}
