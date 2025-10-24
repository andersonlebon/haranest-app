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

const reviews = [
  {
    name: 'Maria',
    location: 'Washington, District of Columbia',
    date: '2 weeks ago',
    review: "Truly 5 stars. We loved Esther's apartment. It was very spacious, modern and comfortable. Location is great for Nairobi, and the kids loved the indoor playground and the ...",
    rating: 5,
  },
  {
    name: 'Ramon',
    location: '',
    date: '1 week ago',
    review: "Esther’s apartment was the perfect place to stay during our visit to Nairobi. It was designed beautifully and had all of the amenities that we needed for our stay. The location was gre...",
    rating: 5,
  },
  {
    name: 'Kennedy',
    location: '',
    date: 'March 2025',
    review: "I had a wonderful stay at Esther’s Airbnb. The place was clean, comfortable, and well-equipped with everything I needed. Esther was a fantastic host, responsive, friendly, and always ...",
    rating: 5,
  },
];

export default function PropertyReviews() {
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    review: '',
    rating: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (e: React.ChangeEvent<{}>, value: number | null) => {
    setNewReview((prev) => ({ ...prev, rating: value || 0 }));
  };

  const handleSubmit = () => {
    // Logic to submit the review
    console.log('New Review:', newReview);
    setNewReview({ name: '', location: '', review: '', rating: 0 });
  };

  return (
    <Box>
      {/* Reviews Section */}
      <Typography variant="h6" gutterBottom>
        Reviews
      </Typography>
      <Grid container spacing={2}>
        {reviews.map((review, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} 
           key={index}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <Avatar>{review.name[0]}</Avatar>
                <Box>
                  <Typography fontWeight={600}>{review.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.date}
                  </Typography>
                </Box>
              </Stack>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="body2" mt={1}>
                {review.review}
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
              disabled={!newReview.name || !newReview.review || newReview.rating === 0}
            >
              Submit Review
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}