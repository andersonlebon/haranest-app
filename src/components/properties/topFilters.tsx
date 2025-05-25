'use client';

import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  Stack,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import Slider from 'react-slick';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
  isSmall: boolean;
  search: string
  selectedType: string | null;
  onOpenDrawer: () => void;
  handleFilterChange: (filters: {
    propertyType?: string | null;
    search?: string;
  }) => void;
  handleApplyFilters: () => void;
}

export const PROPERTY_TYPES = [
  { label: 'Apartment', value: 'Apartment', icon: '🏢' },
  { label: 'House', value: 'House', icon: '🏠' },
  { label: 'Condo', value: 'Condo', icon: '🏬' },
  { label: 'Villa', value: 'Villa', icon: '🏡' },
  { label: 'Studio', value: 'Studio', icon: '🎬' },
  { label: 'Townhouse', value: 'Townhouse', icon: '🏘️' },
  { label: 'Cottage', value: 'Cottage', icon: '🌲' },
  { label: 'Loft', value: 'Loft', icon: '🏚️' },
  { label: 'Duplex', value: 'Duplex', icon: '🏠🏠' },
  { label: 'Penthouse', value: 'Penthouse', icon: '🌇' },
  { label: 'Cabin', value: 'Cabin', icon: '🪵' },
  { label: 'Farmhouse', value: 'Farmhouse', icon: '🚜' },
  { label: 'Bungalow', value: 'Bungalow', icon: '🏡' },
  { label: 'Boat', value: 'Boat', icon: '⛵' },
  { label: 'Treehouse', value: 'Treehouse', icon: '🌳' },
];

function SampleNextArrow(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        right: -30,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
      }}
    >
      <ArrowForwardIosIcon fontSize='small' />
    </IconButton>
  );
}

function SamplePrevArrow(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: -20,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
      }}
    >
      <ArrowBackIosNewIcon fontSize='small' />
    </IconButton>
  );
}

const sliderSettings = {
  infinite: true,
  speed: 300,
  slidesToShow: 8,
  slidesToScroll: 2,
  arrows: true,
  dots: false,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

export default function TopFilters({
  isSmall,
  search,
  selectedType,
  onOpenDrawer,
  handleFilterChange,
  handleApplyFilters
}: Props) {
  return (
    <Box display='flex' gap={2} flexWrap='wrap' alignItems='center'>
      {/* Property Type Selectors */}
      <Box sx={{ position: 'relative', pr: 6, maxWidth: '60%' }}>
        <Slider {...sliderSettings}>
          {PROPERTY_TYPES.map((type) => {
            const isSelected = selectedType === type.value;
            return (
              <Box key={type.value} sx={{ px: 1 }}>
                <Stack
                  alignItems='center'
                  justifyContent='center'
                  spacing={1}
                  onClick={() =>{
                    handleFilterChange({ propertyType: isSelected ? null : type.value })
                    handleApplyFilters()
                  }}
                  sx={{
                    borderRadius: 5,
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    width: 80,
                    height: 80,
                    cursor: 'pointer',
                    bgcolor: isSelected ? '#e0f7fa' : 'white',
                    boxShadow: isSelected ? '0 0 0 2px #00bcd4' : undefined,
                    transition: '0.2s',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    },
                  }}
                >
                  <span style={{ fontSize: 30, lineHeight: 1 }}>
                    {type.icon}
                  </span>
                  <Typography fontSize={10} fontWeight={500}>
                    {type.label}
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Slider>
      </Box>

      {/* Search Input */}
      <TextField
        value={search}
        onChange={(e) => handleFilterChange({ search: e.target.value })}
        size='small'
        placeholder='Search location or keyword'
        sx={{
          minWidth: 260,
          borderRadius: 5,
          bgcolor: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '& .MuiOutlinedInput-root': {
            borderRadius: 5,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon fontSize='small' />
            </InputAdornment>
          ),
        }}
      />

      {/* Filter Drawer Icon (mobile only) */}
      {isSmall && (
        <IconButton onClick={onOpenDrawer} sx={{ ml: 'auto' }}>
          <FilterListIcon />
        </IconButton>
      )}
    </Box>
  );
}
