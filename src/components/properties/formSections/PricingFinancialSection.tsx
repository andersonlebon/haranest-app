import React from "react";
import { Box, Grid, TextField, MenuItem, InputAdornment, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Controller, Control, FieldErrors, UseFormWatch } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";
import { currencies } from "@/utils/constants";

interface PricingFinancialSectionProps {
  control: Control<PropertyFormValues>;
  errors: FieldErrors<PropertyFormValues>;
  watch: UseFormWatch<PropertyFormValues>;
  onNext?: () => void;
  isLastStep?: boolean;
}

export function PricingFinancialSection({ control, errors, watch, onNext, isLastStep }: PricingFinancialSectionProps) {
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

