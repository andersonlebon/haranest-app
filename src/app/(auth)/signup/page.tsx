"use client";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "../actions";
import { useSearchParams } from "next/navigation";

// Validation schema
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    const form = new FormData();
    form.append("name", data.name);
    form.append("email", data.email);
    form.append("password", data.password);

    startTransition(() => {
      signup(form);
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" mb={3} align="center">
        Create Your Account
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Name"
          fullWidth
          disabled={isPending}
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />

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

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          disabled={isPending}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
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
          Sign Up
        </Button>

        <Button
          variant="text"
          type="link"
          fullWidth
          href="/login"
          disabled={isPending}
        >
          Already have an account?
        </Button>
      </Stack>
    </Box>
  );
}
