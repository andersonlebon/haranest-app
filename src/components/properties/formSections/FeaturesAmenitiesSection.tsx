import React from "react";
import { Box, Grid, Button, Chip, Typography, Divider, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { propertyFeatures } from "@/utils/constants";

type PropertyFeature = (typeof propertyFeatures)[number];

interface FeaturesAmenitiesSectionProps {
  features: PropertyFeature[];
  amenities: string[];
  newAmenity: string;
  onNewAmenityChange: (value: string) => void;
  onAddAmenity: () => void;
  onRemoveAmenity: (amenity: string) => void;
  onToggleFeature: (feature: PropertyFeature) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, callback: () => void) => void;
}

export function FeaturesAmenitiesSection({
  features,
  amenities,
  newAmenity,
  onNewAmenityChange,
  onAddAmenity,
  onRemoveAmenity,
  onToggleFeature,
  onKeyDown,
}: FeaturesAmenitiesSectionProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "text.primary" }}>
        Property Features
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {propertyFeatures.map((feature) => {
          const label = feature
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={feature}>
              <Button
                variant={features.includes(feature) ? "contained" : "outlined"}
                onClick={() => onToggleFeature(feature)}
                fullWidth
                sx={{
                  textTransform: "none",
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: features.includes(feature) ? 600 : 400,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                  },
                }}
              >
                {label}
              </Button>
            </Grid>
          );
        })}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "text.primary" }}>
        Amenities
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Add an amenity"
          value={newAmenity}
          onChange={(e) => onNewAmenityChange(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown(e, onAddAmenity)}
          fullWidth
          placeholder="e.g., Near shopping mall, Close to school"
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

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, minHeight: 40 }}>
        {amenities.length > 0 ? (
          amenities.map((amenity: string) => (
            <Chip
              key={amenity}
              label={amenity}
              onDelete={() => onRemoveAmenity(amenity)}
              color="primary"
              variant="outlined"
              sx={{
                fontSize: "0.875rem",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                },
              }}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No amenities added yet
          </Typography>
        )}
      </Box>
    </Box>
  );
}

