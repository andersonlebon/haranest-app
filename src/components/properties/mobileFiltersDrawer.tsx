import React from 'react';
import { Drawer, Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SidebarFilters from './sidebarFilters';

interface Props {
  open: boolean;
  onClose: () => void;
  filters: {
    price: number[];
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    features: string[];
  };
  onFilterChange: (filters: any) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  defaultPriceRange: number[];
}

export default function MobileFiltersDrawer({ 
  open, 
  onClose, 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters, 
  defaultPriceRange 
}: Props) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: '80%', maxWidth: 300, p: 2 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <SidebarFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
        defaultPriceRange={defaultPriceRange}
      />
    </Drawer>
  );
}
