import React from "react";
import { Box, Grid, TextField, MenuItem, InputAdornment } from "@mui/material";
import { Controller, Control, FieldErrors, UseFormWatch } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";
import { currencies } from "@/utils/constants";

interface PricingFinancialSectionProps {
  control: Control<PropertyFormValues>;
  errors: FieldErrors<PropertyFormValues>;
  watch: UseFormWatch<PropertyFormValues>;
}

export function PricingFinancialSection({ control, errors, watch }: PricingFinancialSectionProps) {
  const rentOrSell = watch("rentOrSell");

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                fullWidth
                required
                error={!!errors.price}
                helperText={errors.price?.message as string | undefined}
                onChange={(e) => field.onChange(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <TextField select label="Currency" fullWidth {...field}>
                {currencies.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="commission"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Commission (%)"
                type="number"
                fullWidth
                error={!!errors.commission}
                helperText={errors.commission?.message as string | undefined}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="priceLabel"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price Label"
                placeholder="e.g., Negotiable, Best Offer"
                fullWidth
                helperText="Optional label to display with the price"
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="beforePriceLabel"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Before Price Label"
                placeholder="e.g., Was $500,000"
                fullWidth
                helperText="Previous price for comparison"
              />
            )}
          />
        </Grid>

        {rentOrSell === "rent" && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="availableFrom"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Available From"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.availableFrom}
                  helperText={errors.availableFrom?.message as string | undefined}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

