import React from 'react';
import { Grid } from '@mui/material';
import PropertyCard from './propertyCard';
import { PropertyResponseDto } from '@/hooks/useProperties/dto';

interface PropertyGridViewProps {
  properties: PropertyResponseDto[];
}
export default function PropertyGridView({ properties }: PropertyGridViewProps) {
  return (
    <Grid container spacing={2}>
      {properties.map((property) => (
        <Grid size={{ xs: 12, sm:3 }} key={property.id}>
          <PropertyCard property={property} />
        </Grid>
      ))}
    </Grid>
  );
}
