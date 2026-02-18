import React from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyReviewSchema, type PropertyReviewFormValues } from '@/db/validations/propertyReviews.validation';
import { useGetReviews, useCreateReview } from '@/hooks/useReviews';
import { CreateReviewDto } from '@/db/dtos';

interface PropertyReviewsProps {
  propertyId: number;
}

export default function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  // Fetch reviews using the custom hook
  const {
    data: paginatedReviews,
    isPending: loading,
  } = useGetReviews(propertyId);
  const { mutate: createPropertyReview, isPending: isCreating } = useCreateReview()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PropertyReviewFormValues>({
    resolver: zodResolver(propertyReviewSchema),
    defaultValues: {
      name: '',
      location: '',
      comment: '',
      rating: 0,
    },
  });

  const onSubmit = async (data: PropertyReviewFormValues) => {
    const SubmittedData= { ...data, propertyId } as CreateReviewDto
    
    createPropertyReview(
      SubmittedData,
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const reviews = paginatedReviews?.data ?? [];

  // For disabling submit button
  const watchedFields = watch(['name', 'comment', 'rating']);

  return (
    <Box>
      {/* Reviews Section */}
      <Typography variant="h6" gutterBottom>
        Reviews
      </Typography>
      <Grid container spacing={2}>
        {reviews.length === 0 && !loading && (
          <Grid size={{ xs: 12 }}>
            <Typography color="text.secondary">No reviews yet.</Typography>
          </Grid>
        )}
        {reviews.map((review) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={review.id}>
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
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Location"
              {...register('location')}
              error={!!errors.location}
              helperText={errors.location?.message}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Review"
              {...register('comment')}
              error={!!errors.comment}
              helperText={errors.comment?.message}
              multiline
              rows={4}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body1" gutterBottom>
              Rating
            </Typography>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating
                  value={field.value}
                  onChange={(_e, value) => field.onChange(value || 0)}
                  name="rating"
                />
              )}
            />
            {errors.rating && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: 'block', marginTop: 0.5 }}
              >
                {errors.rating.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                !watchedFields[0] ||
                !watchedFields[1] ||
                watchedFields[2] === 0 ||
                isSubmitting ||
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