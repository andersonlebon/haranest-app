'use client';

import React from 'react';
import {
  Box,
  Typography,
  Rating,
} from '@mui/material';
import ImageSlide from './imageCard';
import { PropertyResponseDto } from '@/hooks/useProperties/dto';
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
        width: 260,
        borderRadius: 5,
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'none',
        },
      }}
      onClick={handleClick}
    >
      <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
        <ImageSlide property={property} />
      </Box>

      <Box mt={1} py={2}>
        <Typography fontSize={14} fontWeight={500} noWrap>
          {property.title}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontSize={10} color="text.secondary" noWrap>
         {formatPrice(property.price, property.currency)}
        </Typography>
        <Typography fontSize={10} color="text.secondary" mt={0.3}>
          <Rating name="rating" readOnly defaultValue={property.reviewRate} size="small" />
        </Typography>
        </Box>
      </Box>
    </Box>
  );
}
