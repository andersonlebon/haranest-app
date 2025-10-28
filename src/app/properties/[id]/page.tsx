'use client';

import { useParams } from 'next/navigation';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { usePropertyQuery } from '@/hooks/useProperties';
import PropertyDetails from '@/components/properties/propertyDetails';


export default function PropertyPage() {
  const params = useParams();
  const id = Number(params?.id);

  const { data: property, isLoading, isError } = usePropertyQuery(id);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !property) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <Typography variant="h6">Failed to load property. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <PropertyDetails property={property} />
    </Container>
  );
}
