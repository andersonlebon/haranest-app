"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  login: (formData: FormData) => Promise<void>;
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { signIn, loading, response } = useAuth();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    signIn(formData);
    
  };

  return (    
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
          label="Email"
          type="email"
          fullWidth
          disabled={loading}
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          disabled={loading}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />

        {!loading && (error || response?.error) && (
          <Typography variant="body2" color="error">
            {error || response?.error}
          </Typography>
        )}

        {!loading && response?.success && (
          <Typography variant="body2" color="primary">
            {response.success}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Log in
        </Button>

        <Stack>
          <Button
            variant="text"
            fullWidth
            href="/signup"
            type="link"
            disabled={loading}
          >
            Don&apos;t have an account?
          </Button>
          <Button
            variant="text"
            type="link"
            fullWidth
            href="/forgot-password"
            disabled={loading}
          >
            Forgot password?
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
