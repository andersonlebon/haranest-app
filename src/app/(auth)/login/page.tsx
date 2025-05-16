"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { login } from "../actions";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("email", formData.email);
    form.append("password", formData.password);

    startTransition(() => {
      login(form);
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 360,
        mx: "auto",
        mt: 8,
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" mb={3} align="center">
        Welcome Back
      </Typography>

      <Stack spacing={2}>
        <TextField
          id="email"
          name="email"
          label="Email"
          type="email"
          disabled={isPending}
          required
          fullWidth
          value={formData.email}
          onChange={handleChange}
          
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          disabled={isPending}
          required
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />
        {!isPending && error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} /> : null}
          >
            Log in
          </Button>
        </Stack>

        <Stack>
          <Button variant="text" fullWidth href="/signup" disabled={isPending}>
            Don't have an account?
          </Button>
          <Button variant="text" fullWidth href="/forgot-password" disabled={isPending}>
            Forgot password?
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
