import React from "react";
import { Box, Grid, TextField, Typography, Paper } from "@mui/material";
import { Property } from "@/types";

interface CharacteristicsSectionProps {
  formData: Property;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function CharacteristicsSection({ formData, onInputChange }: CharacteristicsSectionProps) {
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
        Characteristics
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="bedrooms"
            label="Bedrooms"
            type="number"
            value={formData.bedrooms || ""}
            onChange={onInputChange}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="bathrooms"
            label="Bathrooms"
            type="number"
            value={formData.bathrooms || ""}
            onChange={onInputChange}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="rooms"
            label="Total Rooms"
            type="number"
            value={formData.rooms || ""}
            onChange={onInputChange}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="size"
            label="Size (m²)"
            type="number"
            value={formData.size || ""}
            onChange={onInputChange}
            inputProps={{ step: "0.01" }}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="lotSize"
            label="Lot Size (m²)"
            type="number"
            value={formData.lotSize || ""}
            onChange={onInputChange}
            inputProps={{ step: "0.01" }}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="floors"
            label="Floors"
            type="number"
            value={formData.floors || ""}
            onChange={onInputChange}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            name="yearBuilt"
            label="Year Built"
            type="number"
            value={formData.yearBuilt || ""}
            onChange={onInputChange}
            fullWidth
            sx={{ bgcolor: "background.default" }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

