import React from 'react';
import { Grid } from '@mui/material';
import PropertyListItem from './propertyListItem';
import { PropertyMock } from '@/db/types';

interface PropertyListViewProps {
  properties: PropertyMock[];
}

export default function PropertyListView({ properties }: PropertyListViewProps) {
  return (
    <Grid container spacing={2}>
      {properties.map((property: PropertyMock) => (
        <Grid size={{ xs: 12, sm: 4 }} key={property.id}>
          <PropertyListItem property={property} />
        </Grid>
      ))}
    </Grid>
  );
}
