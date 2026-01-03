import React from "react";
import { Box, Grid, TextField, Typography, Paper } from "@mui/material";
import { Property } from "@/types";

interface LocationSectionProps {
  formData: Property;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function LocationSection({ formData, onInputChange }: LocationSectionProps) {
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
        Location
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="locationProvince"
            label="Province/Region"
            value={formData.locationProvince || ""}
            onChange={onInputChange}
            required
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="locationDistrict"
            label="District"
            value={formData.locationDistrict || ""}
            onChange={onInputChange}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="locationCity"
            label="City"
            value={formData.locationCity || ""}
            onChange={onInputChange}
            required
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="zip"
            label="Postal Code"
            value={formData.zip || ""}
            onChange={onInputChange}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="latitude"
            label="Latitude"
            type="number"
            value={formData.latitude || ""}
            onChange={onInputChange}
            inputProps={{ step: "any" }}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="longitude"
            label="Longitude"
            type="number"
            value={formData.longitude || ""}
            onChange={onInputChange}
            inputProps={{ step: "any" }}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

