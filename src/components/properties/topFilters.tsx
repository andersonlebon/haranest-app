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
import { PropertyParams } from '@/db/dtos/properties.dto';

interface Props {
  isSmall: boolean;
  search: string
  selectedType?: string;
  onOpenDrawer: () => void;
  handleFilterChange: (filters: Partial<PropertyParams>) => void;
}

export const PROPERTY_TYPES = [
  { label: 'All', value: '', icon: '🏠' },
  { label: 'Apartment', value: 'apartment', icon: '🏢' },
  { label: 'House', value: 'house', icon: '🏠' },
  { label: 'Condo', value: 'condo', icon: '🏬' },
  { label: 'Villa', value: 'villa', icon: '🏡' },
  { label: 'Studio', value: 'studio', icon: '🎬' },
  { label: 'Townhouse', value: 'townhouse', icon: '🏘️' },
  { label: 'Loft', value: 'loft', icon: '🏚️' },
  { label: 'Duplex', value: 'duplex', icon: '🏠🏠' },
  { label: 'Penthouse', value: 'penthouse', icon: '🌇' },
  { label: 'Cabin', value: 'cabin', icon: '🪵' },
  { label: 'Farmhouse', value: 'farmhouse', icon: '🚜' },
  { label: 'Bungalow', value: 'bungalow', icon: '🏡' },
  { label: 'Other', value: 'other', icon: '✨' },
] as const;

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
}: Props) {
  return (
    <Box display='flex' gap={3} flexWrap='wrap' alignItems='center'>
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
                    handleFilterChange({ propertyType: type.value })
                  }}
                  sx={(theme) => ({
                    borderRadius: 3,
                    textAlign: 'center',
                    width: 90,
                    height: 90,
                    cursor: 'pointer',
                    bgcolor: isSelected 
                      ? theme.palette.mode === 'dark' 
                        ? theme.palette.primary.dark 
                        : '#b8b8b8'
                      : 'background.paper',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    boxShadow: isSelected 
                      ? theme.shadows[4] 
                      : theme.shadows[1],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: isSelected 
                        ? theme.shadows[8] 
                        : theme.shadows[4],
                      
                    },
                  })}
                >
                  <span style={{ fontSize: 32, lineHeight: 1 }}>
                    {type.icon}
                  </span>
                  <Typography fontSize={11} fontWeight={600} color={isSelected ? 'primary.secondary' : 'text.primary'}>
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
        sx={(theme) => ({
          minWidth: 300,
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[2],
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            '&:hover': {
              boxShadow: theme.shadows[4],
            },
            '&.Mui-focused': {
              boxShadow: theme.shadows[6],
            }
          },
        })}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon fontSize='small' color="primary" />
            </InputAdornment>
          ),
        }}
      />

      {/* Filter Drawer Icon (mobile only) */}
      {isSmall && (
        <IconButton 
          onClick={onOpenDrawer} 
          sx={(theme) => ({ 
            ml: 'auto',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
            boxShadow: theme.shadows[4],
          })}
        >
          <FilterListIcon />
        </IconButton>
      )}
    </Box>
  );
}
