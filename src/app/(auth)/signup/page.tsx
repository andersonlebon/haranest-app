"use client";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Validation schema
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phoneNumber: z.string(),
    country: z.string(),
    city: z.string(),
    role: z.enum([
      "client",
      "seller",
      "agent",
      "investor",
      "business_owner",
      "admin",
    ]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { signUp, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "client",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    const form = new FormData();
    form.append("name", data.name);
    form.append("email", data.email);
    form.append("password", data.password);
    form.append("phoneNumber", data.phoneNumber ?? "");
    form.append("country", data.country ?? "");
    form.append("city", data.city ?? "");
    form.append("role", data.role);
    signUp(form);
    
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
          disabled={loading}
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />

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

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          disabled={loading}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <TextField
          label="Phone Number"
          type="tel"
          fullWidth
          disabled={loading}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />

        <TextField
          label="Country"
          fullWidth
          disabled={loading}
          error={!!errors.country}
          helperText={errors.country?.message}
          {...register("country")}
        />

        <TextField
          label="City"
          fullWidth
          disabled={loading}
          error={!!errors.city}
          helperText={errors.city?.message}
          {...register("city")}
        />

        <TextField
          select
          label="Role"
          fullWidth
          disabled={loading}
          error={!!errors.role}
          helperText={errors.role?.message}
          {...register("role")}
        >
          <MenuItem value="client">Client</MenuItem>
          <MenuItem value="seller">Seller</MenuItem>
          <MenuItem value="agent">Agent</MenuItem>
          <MenuItem value="investor">Investor</MenuItem>
          <MenuItem value="business_owner">Business Owner</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        {!loading && error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Sign Up
        </Button>

        <Button
          variant="text"
          type="link"
          fullWidth
          href="/login"
          disabled={loading}
        >
          Already have an account?
        </Button>
      </Stack>
    </Box>
  );
}
