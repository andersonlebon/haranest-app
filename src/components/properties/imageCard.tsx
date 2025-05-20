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
import { PropertyMock } from '@/db/types';


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
        backgroundColor: 'white',
        '&:hover': { backgroundColor: '#f5f5f5' },
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
        backgroundColor: 'white',
        '&:hover': { backgroundColor: '#f5f5f5' },
      }}
    >
      <ArrowBackIos fontSize="small" />
    </IconButton>
  );
}

export default function ImageSlide({ property }: { property: PropertyMock }) {
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

  return (
       <>
        <Slider {...settings}>
        {(property.images || ['/images/house.png', '/images/house.png', '/images/house.png', '/images/house.png']).map((img, index) => (

            <Box
              key={index}
              component="img"
              src={img}
              alt={property.title}
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: 3,
              }}
            />
          ))}
        </Slider>

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
      </>

    
  );
}
