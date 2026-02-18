import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Rating,
  Divider,
  Stack,
  Link,
} from '@mui/material';
import { useGetReviews, useCreateReview } from '@/hooks/useReviews';
import type { PropertyReviewFormValues } from '@/db/validations/propertyReviews.validation';

interface PropertyReviewsProps {
  propertyId: number;
}

export default function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [newReview, setNewReview] = useState<{
    name: string;
    location: string;
    review: string;
    rating: number;
  }>({
    name: '',
    location: '',
    review: '',
    rating: 0,
  });

  // Fetch reviews using the custom hook
  const {
    data: paginatedReviews,
    isLoading: loading,
    refetch,
  } = useGetReviews(propertyId);

  // Create review using the custom mutation hook
  const createReviewMutation = useCreateReview(propertyId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (
    _e: React.SyntheticEvent<Element, Event>,
    value: number | null,
  ) => {
    setNewReview((prev) => ({ ...prev, rating: value || 0 }));
  };

  const handleSubmit = async () => {
    if (!propertyId) return;
    const payload: PropertyReviewFormValues = {
      name: newReview.name.trim(),
      location: newReview.location.trim(),
      comment: newReview.review.trim(),
      rating: newReview.rating,
    };
    try {
      await createReviewMutation.mutateAsync(payload as any); // lint: real payload type (see below)
      setNewReview({ name: '', location: '', review: '', rating: 0 });
      refetch();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Erreur handleSubmit:', err);
    }
  };

  const reviews = paginatedReviews?.data ?? [];

  return (
    <Box>
      {/* Reviews Section */}
      <Typography variant="h6" gutterBottom>
        Reviews
      </Typography>
      <Grid container spacing={2}>
        {reviews.length === 0 && !loading && (
          <Grid size={{xs: 12}}>
            <Typography color="text.secondary">No reviews yet.</Typography>
          </Grid>
        )}
        {reviews.map((review) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} 
           key={review.id}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <Avatar>{review.name[0]}</Avatar>
                <Box>
                  <Typography fontWeight={600}>{review.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.location || ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="body2" mt={1}>
                {review.comment}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* view more reviews link not button */}
      <Box mt={2} mb={3} textAlign="center" display="flex" justifyContent="center">
        <Link href="#" underline="hover" color="primary">
          View more reviews
        </Link>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Add Review Form */}
      <Typography variant="h6" gutterBottom>
        Add a Review
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={newReview.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={newReview.location}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Review"
              name="review"
              value={newReview.review}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1" gutterBottom>
              Rating
            </Typography>
            <Rating
              name="rating"
              value={newReview.rating}
              onChange={handleRatingChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={
                !newReview.name ||
                !newReview.review ||
                newReview.rating === 0 ||
                createReviewMutation.isLoading ||
                loading
              }
            >
              Submit Review
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}