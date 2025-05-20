import React from 'react';
import { Drawer, Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SidebarFilters from './sidebarFilters';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileFiltersDrawer({ open, onClose }: Props) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: '80%', maxWidth: 300, p: 2 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <SidebarFilters />
    </Drawer>
  );
}
