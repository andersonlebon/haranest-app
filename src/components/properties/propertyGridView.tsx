import React from 'react';
import { Grid } from '@mui/material';
import PropertyCard from './propertyCard';
import { PropertyMock } from '@/db/types';

export default function PropertyGridView({ properties }: { properties: PropertyMock[] }) {
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
