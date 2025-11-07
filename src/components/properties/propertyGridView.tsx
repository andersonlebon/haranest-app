import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import PropertyCard from './propertyCard';
import { PropertyResponseDto } from '@/db/schema/properties/dto';

interface PropertyGridViewProps {
  properties: PropertyResponseDto[];
}
export default function PropertyGridView({ properties }: PropertyGridViewProps) {
  if (!properties || properties.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Box textAlign="center">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucune propriété trouvée
          </Typography>
          <Typography color="text.disabled">
            Ajustez vos filtres ou réessayez plus tard.
          </Typography>
        </Box>
      </Box>
    );
  }

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
