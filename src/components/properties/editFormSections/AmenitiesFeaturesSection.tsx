import React from "react";
import { Box, Grid, TextField, Button, Chip, FormControlLabel, Checkbox, Typography, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Property } from "@/types";
import { propertyFeatures } from "@/utils/constants";

interface AmenitiesFeaturesSectionProps {
  formData: Property;
  newAmenity: string;
  onNewAmenityChange: (value: string) => void;
  onAddAmenity: () => void;
  onRemoveAmenity: (amenity: string) => void;
  onFeatureToggle: (feature: string) => void;
}

export function AmenitiesFeaturesSection({
  formData,
  newAmenity,
  onNewAmenityChange,
  onAddAmenity,
  onRemoveAmenity,
  onFeatureToggle,
}: AmenitiesFeaturesSectionProps) {
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
        Amenities and Features
      </Typography>

      {/* Amenities */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "text.secondary" }}>
          Amenities
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            value={newAmenity}
            onChange={(e) => onNewAmenityChange(e.target.value)}
            placeholder="Add amenity"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddAmenity();
              }
            }}
            sx={{ bgcolor: "background.default" }}
          />
          <Button
            variant="contained"
            onClick={onAddAmenity}
            startIcon={<AddIcon />}
            sx={{ minWidth: 120 }}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {(formData.amenities || []).map((amenity, index) => (
            <Chip
              key={index}
              label={amenity}
              onDelete={() => onRemoveAmenity(amenity)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      {/* Features */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "text.secondary" }}>
          Features
        </Typography>
        <Grid container spacing={2}>
          {propertyFeatures.map((feature) => (
            <Grid size={{ xs: 6, md: 4 }} key={feature}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(formData.features || []).includes(feature)}
                    onChange={() => onFeatureToggle(feature)}
                  />
                }
                label={feature.replace(/_/g, " ")}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}

