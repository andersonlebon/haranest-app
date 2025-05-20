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

// Constants
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

export default function SidebarFilters() {
  const [price, setPrice] = React.useState<number[]>([20, 230]);
  const [bedrooms, setBedrooms] = React.useState(2);

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPrice(newValue as number[]);
  };

  const handleBedroomsChange = (delta: number) => {
    setBedrooms(prev => Math.max(0, prev + delta));
  };

  return (
    <Box sx={{ p: 2, maxWidth: 360 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      {/* Price Range */}
      <Box mb={3}>
        <Typography variant="subtitle1">Price range</Typography>
        <Slider
          value={price}
          onChange={handlePriceChange}
          min={0}
          max={500}
          sx={{ mt: 2 }}
        />
        <Grid container spacing={2} mt={1}>
          <Grid size={{ xs:6 }}>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: '999px',
                py: 1,
                textAlign: 'center',
              }}
            >
              ${price[0]}
            </Box>
          </Grid>
          <Grid size={{ xs:6 }}>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: '999px',
                py: 1,
                textAlign: 'center',
              }}
            >
              ${price[1]}+
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 2 }} />

      {/* Rooms and Beds */}
      <Box mb={3}>
        <Typography variant="subtitle1">Rooms and beds</Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" my={1}>
        <Typography variant="subtitle2" pl={2}>Bedrooms</Typography>
          <Box pl={2}>
            <IconButton onClick={() => handleBedroomsChange(-1)}>
              <RemoveIcon />
            </IconButton>
            <Typography component="span" mx={1}>
              {bedrooms}+
            </Typography>
            <IconButton onClick={() => handleBedroomsChange(1)}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        {/* Repeat similar blocks for Beds and Bathrooms if needed */}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Amenities */}
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Amenities
        </Typography>
        <Grid container spacing={1}>
          {AMENITIES.map((amenity, i) => (
            <Grid key={i}>
              <Chip
                icon={amenity.icon}
                label={amenity.label}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Accessibility */}
      <Box mb={3}>
        <Typography variant="subtitle1">Accessibility features</Typography>
        {ACCESSIBILITY_FEATURES.map((feature, i) => (
          <FormControlLabel
            key={i}
            control={<Checkbox />}
            label={feature}
          />
        ))}
      </Box>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button>Clear all</Button>
        <Button variant="contained">Show results</Button>
      </Box>
    </Box>
  );
}
