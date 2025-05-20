'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ImageSlide from './imageCard';
import { PropertyMock } from '@/db/types';


export default function PropertyCard({ property }: { property: PropertyMock }) {


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
    >
      <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
        <ImageSlide property={property} />

        {property.badge && (
          <Chip
            label={property.badge}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'white',
              fontSize: 12,
              fontWeight: 500,
            }}
          />
        )}

        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'white',
          }}
        >
          <FavoriteBorderIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box mt={1}>
        <Typography fontSize={14} fontWeight={500} noWrap>
          {property.title}
        </Typography>
        <Typography fontSize={13} color="text.secondary" noWrap>
          ${property.price} for {property.nights} nights
        </Typography>
        <Typography fontSize={13} color="text.secondary" mt={0.3}>
          ★ {2}
        </Typography>
      </Box>
    </Box>
  );
}
