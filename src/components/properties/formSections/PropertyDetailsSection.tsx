import React from "react";
import { Box, Grid, TextField, Typography, Divider, Switch, FormControlLabel, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Controller, Control, FieldErrors, UseFormWatch } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";

interface PropertyDetailsSectionProps {
  control: Control<PropertyFormValues>;
  errors: FieldErrors<PropertyFormValues>;
  watch: UseFormWatch<PropertyFormValues>;
  onNext?: () => void;
  isLastStep?: boolean;
}

const characteristics = [
  { name: "bedrooms", label: "Bedrooms", icon: "🛏️" },
  { name: "bathrooms", label: "Bathrooms", icon: "🚿" },
  { name: "rooms", label: "Total Rooms", icon: "🚪" },
  { name: "size", label: "Size (sqft)", icon: "📐" },
  { name: "lotSize", label: "Lot Size (sqft)", icon: "🏞️" },
  { name: "yearBuilt", label: "Year Built", icon: "📅" },
  { name: "floors", label: "Floors", icon: "🏢" },
];

export function PropertyDetailsSection({ control, errors, watch, onNext, isLastStep }: PropertyDetailsSectionProps) {
  const hasGarage = watch("garage");

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {characteristics.map(({ name, label, icon }) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={name}>
            <Controller
              name={name as keyof PropertyFormValues}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  name={name}
                  type="number"
                  label={`${icon} ${label}`}
                  fullWidth
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  error={!!errors[name as keyof PropertyFormValues]}
                  helperText={errors[name as keyof PropertyFormValues]?.message as string | undefined}
                />
              )}
            />
          </Grid>
        ))}

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "text.primary" }}>
            Additional Options
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="garage"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Has Garage"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="basement"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Has Basement"
              />
            )}
          />
        </Grid>

        {hasGarage && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="garageSize"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Garage Size (sqft)"
                  type="number"
                  fullWidth
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={!!errors.garageSize}
                  helperText={errors.garageSize?.message as string | undefined}
                />
              )}
            />
          </Grid>
        )}
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
