import React from "react";
import { Box, Grid, TextField, MenuItem, Typography, Paper } from "@mui/material";
import { Property } from "@/types";
import { propertyTypes, statuses, currencies } from "@/utils/constants";

interface BasicInfoSectionProps {
  formData: Property;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function BasicInfoSection({ formData, onInputChange }: BasicInfoSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "text.primary" }}>
        Basic Information
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={onInputChange}
            required
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="description"
            label="Description"
            value={formData.description ?? ""}
            onChange={onInputChange}
            required
            multiline
            rows={4}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={onInputChange}
            required
            fullWidth
            inputProps={{ step: "0.01" }}
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="currency"
            label="Currency"
            select
            value={formData.currency}
            onChange={onInputChange}
            required
            fullWidth
            sx={{ bgcolor: "background.default" }}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="propertyType"
            label="Property Type"
            select
            value={formData.propertyType}
            onChange={onInputChange}
            required
            fullWidth
            sx={{ bgcolor: "background.default" }}
          >
            <MenuItem value="">Select a property type</MenuItem>
            {propertyTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="rentOrSell"
            label="Rent or Sell"
            select
            value={formData.rentOrSell || "sell"}
            onChange={onInputChange}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          >
            <MenuItem value="sell">Sell</MenuItem>
            <MenuItem value="rent">Rent</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="status"
            label="Status"
            select
            value={formData.status}
            onChange={onInputChange}
            required
            fullWidth
            sx={{ bgcolor: "background.default" }}
          >
            {statuses.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
}

