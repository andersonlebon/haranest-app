'use client';

import { Box, Button, Typography } from '@mui/material';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function PageErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Box textAlign="center" py={6}>
      <Typography variant="h6" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography color="text.secondary" mb={2}>
        {message || 'An unexpected error occurred.'}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{ borderRadius: 2 }}
        >
          Retry
        </Button>
      )}
    </Box>
  );
}
