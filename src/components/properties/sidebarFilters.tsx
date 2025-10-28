'use client';

import React from 'react';
import {
  Box,
  Typography,
  Slider,
  IconButton,
  Grid,
  Chip,
  Checkbox,
  FormControlLabel,
  Divider,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import HotTubIcon from '@mui/icons-material/HotTub';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import KitchenIcon from '@mui/icons-material/Kitchen';
import DryIcon from '@mui/icons-material/LocalLaundryService';
import { formatNumber } from '@/utils/formats';

export interface FiltersState {
  price: number[];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  features: string[];
}

interface SidebarFiltersProps  {
  onFilterChange: (filters: FiltersState) => void;
  filters: FiltersState;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  defaultPriceRange: number[];
}

const AMENITIES = [
  { label: 'Wifi', icon: <WifiIcon /> },
  { label: 'Air conditioning', icon: <AcUnitIcon /> },
  { label: 'Hot tub', icon: <HotTubIcon /> },
  { label: 'Free parking', icon: <LocalParkingIcon /> },
  { label: 'Kitchen', icon: <KitchenIcon /> },
  { label: 'Dryer', icon: <DryIcon /> },
];

const ACCESSIBILITY_FEATURES = [
  'Step-free access',
  'Disabled parking spot',
  'Guest entrance wider than 32 inches',
  'Step-free bedroom access',
  'Bedroom entrance wider than 32 inches',
  'Step-free bathroom access',
  'Bathroom entrance wider than 32 inches',
  'Toilet grab bar',
  'Shower grab bar',
  'Step-free shower',
  'Shower seat/bench',
];

export default function SidebarFilters({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  defaultPriceRange
}: SidebarFiltersProps) {
  const {
    price,
    bedrooms,
    bathrooms,
    amenities,
    features,
  } = filters;
  const update = (updated: Partial<FiltersState>) => {
    onFilterChange({
      price,
      bedrooms,
      bathrooms,
      amenities,
      features,
      ...updated,
    });
  };

  const toggleItem = (list: string[], item: string) =>
    list.includes(item)
      ? list.filter((x) => x !== item)
      : [...list, item];

  return (
    <Box sx={{ maxWidth: 360 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom color="primary.main">
        Filters
      </Typography>

    
{/* Price */}
 {/* Price */}
 <Box mb={3}>
        <Typography variant="subtitle1">Price range</Typography>
        <Slider
          value={price}
          onChange={(_, newValue) => update({ price: newValue as number[] })}
          min={defaultPriceRange[0]}
          max={defaultPriceRange[1]}
        />
        <Grid container spacing={2}>
          <Grid size={{xs: 6 }}><Box textAlign="start">${formatNumber(price[0])}</Box></Grid>
          <Grid size={{xs: 6 }}><Box textAlign="end">${formatNumber(price[1])}+</Box></Grid>
        </Grid>
      </Box>


      <Divider sx={{ my: 2 }} />

      {/* Bedrooms */}
      <Box mb={2} justifyContent={'space-between'} display="flex" alignItems="center">
        <Typography variant="subtitle1">Bedrooms</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <IconButton onClick={() => update({ bedrooms: Math.max(0, bedrooms - 1) })}>
            <RemoveIcon />
          </IconButton>
          <Typography>{bedrooms}+</Typography>
          <IconButton onClick={() => update({ bedrooms: bedrooms + 1 })}>
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Bathrooms */}
      <Box mb={3} justifyContent={'space-between'} display="flex" alignItems="center">
        <Typography variant="subtitle1">Bathrooms</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <IconButton onClick={() => update({ bathrooms: Math.max(0, bathrooms - 1) })}>
            <RemoveIcon />
          </IconButton>
          <Typography>{bathrooms}+</Typography>
          <IconButton onClick={() => update({ bathrooms: bathrooms + 1 })}>
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Amenities */}
      <Box mb={3}>
        <Typography variant="subtitle1">Amenities</Typography>
        <Grid container spacing={1}>
          {AMENITIES.map((item) => (
            <Grid key={item.label}>
              <Chip
                icon={item.icon}
                label={item.label}
                clickable
                variant={amenities.includes(item.label) ? 'filled' : 'outlined'}
                color={amenities.includes(item.label) ? 'primary' : 'default'}
                onClick={() => update({ amenities: toggleItem(amenities, item.label) })}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Accessibility Features */}
      <Box mb={3}>
        <Typography variant="subtitle1">Accessibility features</Typography>
        {ACCESSIBILITY_FEATURES.map((feature) => (
          <FormControlLabel
            key={feature}
            control={
              <Checkbox
                checked={features.includes(feature)}
                onChange={() => update({ features: toggleItem(features, feature) })}
              />
            }
            label={feature}
          />
        ))}
      </Box>

      {/* Footer Buttons */}
      <Box display="flex" justifyContent="space-between" gap={2} mt={4}>
        <Button 
          onClick={onResetFilters} 
          variant="outlined"
          color="secondary"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Clear all
        </Button>
        <Button 
          variant="contained" 
          onClick={onApplyFilters} 
          color="primary"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0, 123, 255, 0.4)',
            }
          }}
        >
          Show results
        </Button>
      </Box>
    </Box>
  );
}
