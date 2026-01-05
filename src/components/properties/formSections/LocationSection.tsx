import React from "react";
import { Box, Grid, TextField, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";

interface LocationSectionProps {
  control: Control<PropertyFormValues>;
  errors: FieldErrors<PropertyFormValues>;
  onNext?: () => void;
  isLastStep?: boolean;
}

export function LocationSection({ control, errors, onNext, isLastStep }: LocationSectionProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide the location details for your property. More details help buyers find your property easily.
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="locationProvince"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Province/State"
                fullWidth
                error={!!errors.locationProvince}
                helperText={errors.locationProvince?.message as string | undefined}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="locationDistrict"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="District"
                fullWidth
                error={!!errors.locationDistrict}
                helperText={errors.locationDistrict?.message as string | undefined}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="locationCity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                fullWidth
                error={!!errors.locationCity}
                helperText={errors.locationCity?.message as string | undefined}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="locationTown"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Town"
                fullWidth
                error={!!errors.locationTown}
                helperText={errors.locationTown?.message as string | undefined}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="locationCell"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cell/Sector"
                fullWidth
                error={!!errors.locationCell}
                helperText={errors.locationCell?.message as string | undefined}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="zip"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Zip/Postal Code"
                fullWidth
                error={!!errors.zip}
                helperText={errors.zip?.message as string | undefined}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="latitude"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Latitude"
                type="number"
                fullWidth
                placeholder="e.g., -1.9441"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                error={!!errors.latitude}
                helperText={errors.latitude?.message as string | undefined}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="longitude"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Longitude"
                type="number"
                fullWidth
                placeholder="e.g., 30.0619"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                error={!!errors.longitude}
                helperText={errors.longitude?.message as string | undefined}
              />
            )}
          />
        </Grid>
      </Grid>
      {onNext && !isLastStep && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={onNext}
            endIcon={<ArrowForwardIcon />}
            sx={{
              minWidth: 120,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateX(2px)",
                boxShadow: 4,
              },
            }}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}

