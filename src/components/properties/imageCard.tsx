'use client';

import React from 'react';
import {
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import Slider from 'react-slick';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { PropertyResponseDto } from '@/db/dtos/properties.dto';


function NextArrow(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        right: 8,
        zIndex: 1,
        transform: 'translateY(-50%)',
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <ArrowForwardIos fontSize="small" />
    </IconButton>
  );
}

function PrevArrow(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        left: 8,
        zIndex: 1,
        transform: 'translateY(-50%)',
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <ArrowBackIos fontSize="small" />
    </IconButton>
  );
}

interface ImageSlideProps {
  property: PropertyResponseDto;
  page: 'list' | 'detail' | 'card'
}

export default function ImageSlide({ property, page='card' }: ImageSlideProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  // Build a safe list of images; fallback to a single placeholder when absent/empty
  const imagesToShow = (Array.isArray(property.images) && property.images.length > 0)
    ? property.images
    : ['/images/house.png'];

  // Detail page: interactive slider with next/prev arrows
  if (page === 'detail') {
    return (
      <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
        <Slider {...settings}>
          {imagesToShow.map((img, index) => (
            <Box
              key={index}
              component="img"
              src={img}
              alt={property.title}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/house.png'; }}
              sx={{
                width: '100%',
                height: 480,
                objectFit: 'cover',
              }}
            />
          ))}
        </Slider>
      </Box>
    );
  }

  // Card/List: single image for compact layout
  const firstImage = imagesToShow[0];
  return (
    <>
      <Box
        component="img"
        src={firstImage}
        alt={property.title}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/house.png'; }}
        sx={{
          width: '100%',
          height: 200,
          objectFit: 'cover',
          borderRadius: 3,
        }}
      />

      {(
        <>
          {property.status && (
            <Chip
              label={property.status}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: 'background.paper',
                fontSize: 12,
                fontWeight: 500,
              }}
            />
          )}
          {property.rentOrSell && (
            <Chip
              label={`for ${property.rentOrSell}`}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: '50%',
                bgcolor: 'background.paper',
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
              bgcolor: 'background.paper',
            }}
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </>
  );
}
