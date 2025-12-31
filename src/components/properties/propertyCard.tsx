'use client';

import React from 'react';
import {
  Box,
  Typography,
  Rating,
} from '@mui/material';
import ImageSlide from './imageCard';
import { PropertyResponseDto } from '@/db/dtos/properties.dto';
import { formatPrice } from '@/utils/formats';
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  property: PropertyResponseDto;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/properties/${property.id}`);
  }


  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 300,
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.shadows[2],
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
      onClick={handleClick}
    >
      <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
        <ImageSlide property={property} page="card" />
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography 
          fontSize={16} 
          fontWeight={600} 
          sx={{ 
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {property.title}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography fontSize={18} fontWeight={700} color="primary.main">
            {formatPrice(property.price, property.currency)}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Rating 
              name="rating" 
              readOnly 
              value={property.reviewRate || 0} 
              size="small" 
              precision={0.1}
            />
            <Typography fontSize={12} color="text.secondary">
              ({property.reviewRate || 0})
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <Typography fontSize={12} color="text.secondary">
            {property.bedrooms || 0} bed
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {property.bathrooms || 0} bath
          </Typography>
          {property.size && (
            <Typography fontSize={12} color="text.secondary">
              {property.size} sqft
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
