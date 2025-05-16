"use client"
import { signup } from '../actions';
import { Box, Button, TextField, Typography, Stack } from '@mui/material';

export default function LoginPage() {
  return (
    <Box
      component="form"
      sx={{
        width: '100%',
        maxWidth: 360,
        mx: 'auto',
        mt: 8,
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" mb={3} align="center">
        Create an account
      </Typography>

      <Stack spacing={2}>
        <TextField
          id="email"
          name="email"
          label="Email"
          type="email"
          required
          fullWidth
        />
        <TextField
          id='password'
          name="password"
          label="Password"
          type="password"
          required
          fullWidth
        />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            type="submit"
            formAction={signup}
            variant="contained"
            fullWidth
          >
            Sign up
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            type="link"
            variant="text"
            fullWidth
            href="/login"
          >
            Already have an account?
          </Button>
        
          </Stack>
      </Stack>
    </Box>
  );
}
