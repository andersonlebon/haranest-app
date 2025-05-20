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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  login: (formData: FormData) => Promise<void>;
}

export default function LoginForm({ login }: LoginProps) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [isPending, startTransition] = useTransition();

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

    startTransition(() => {
      login(formData);
    });
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
          disabled={isPending}
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          disabled={isPending}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />

        {!isPending && error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : null}
        >
          Log in
        </Button>

        <Stack>
          <Button
            variant="text"
            fullWidth
            href="/signup"
            type="link"
            disabled={isPending}
          >
            Don&apos;t have an account?
          </Button>
          <Button
            variant="text"
            type="link"
            fullWidth
            href="/forgot-password"
            disabled={isPending}
          >
            Forgot password?
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
