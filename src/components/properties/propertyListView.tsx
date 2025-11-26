import React from 'react';
import { Grid } from '@mui/material';
import PropertyListItem from './propertyListItem';
import { PropertyResponseDto } from '@/db/schema/properties/dto';

interface PropertyListViewProps {
  properties: PropertyResponseDto[];
}

export default function PropertyListView({ properties }: PropertyListViewProps) {
  return (
    <Grid container spacing={2}>
      {properties.map((property: PropertyResponseDto) => (
        <Grid size={{ xs: 12, sm: 4 }} key={property.id}>
          <PropertyListItem property={property} />
        </Grid>
      ))}
    </Grid>
  );
}
