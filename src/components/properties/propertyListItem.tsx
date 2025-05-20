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
import { PropertyMock } from '@/db/types';



export default function PropertyListItem({ property }: { property: PropertyMock }) {

  return (
    <ListItem
      sx={{
        px: 0,
        py: 2,
        borderBottom: '1px solid #eee',
        transition: '0.3s ease',
        '&:hover': {
          backgroundColor: '#fafafa',
        },
      }}
      disableGutters
    >
      <Grid container spacing={2} alignItems="flex-start">
        {/* Image Slider */}
        <Grid size={{ xs: 4, sm: 7 }} >
          <Box
            sx={{
              width: '100%',
              height: 120,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <ImageSlide property={property} />
          </Box>
        </Grid>

        {/* Property Info */}
        <Grid size={{ xs: 8, sm: 5 }} >
          <Typography fontSize={14} fontWeight={500} noWrap>
            {property.title}
          </Typography>

          <Typography fontSize={13} color="text.secondary" mt={1}>
            ${property.price} for {property.nights || 1} nights
          </Typography>

          <Typography fontSize={13} color="text.secondary" mt={0.5}>
            ★ {2}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
}
