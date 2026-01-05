import React from "react";
import { Box, Grid, TextField, MenuItem, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";
import { propertyTypes, statuses } from "@/utils/constants";

interface BasicInfoSectionProps {
  control: Control<PropertyFormValues>;
  errors: FieldErrors<PropertyFormValues>;
  onNext?: () => void;
  isLastStep?: boolean;
}

export function BasicInfoSection({ control, errors, onNext, isLastStep }: BasicInfoSectionProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Property Title"
                placeholder="e.g., Beautiful 3BR Apartment in Downtown"
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title?.message as string | undefined}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                placeholder="Describe your property in detail..."
                multiline
                rows={5}
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message as string | undefined}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="propertyType"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Property Type"
                fullWidth
                required
                error={!!errors.propertyType}
                helperText={errors.propertyType?.message as string | undefined}
                {...field}
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="rentOrSell"
            control={control}
            render={({ field }) => (
              <TextField select label="Listing Type" fullWidth required {...field}>
                <MenuItem value="sell">For Sale</MenuItem>
                <MenuItem value="rent">For Rent</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField select label="Status" fullWidth {...field}>
                {statuses.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>
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
