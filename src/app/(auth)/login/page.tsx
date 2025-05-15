"use client"
import { login, signup } from './actions';
import { Box, Button, TextField, Typography, Stack } from '@mui/material';

export default function LoginPage() {
  return (
    <Box
      component="form"
      onSubmit={(e) => e.preventDefault()}
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
        Welcome Back
      </Typography>

      <Stack spacing={2}>
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          fullWidth
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          required
          fullWidth
        />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            type="submit"
            formAction={login}
            variant="contained"
            fullWidth
          >
            Log in
          </Button>
          <Button
            type="submit"
            formAction={signup}
            variant="outlined"
            fullWidth
          >
            Sign up
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
