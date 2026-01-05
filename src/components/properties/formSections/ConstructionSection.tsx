import React from "react";
import { Box, Grid, TextField, MenuItem, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Controller, Control } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";
import { structureTypes, roofingTypes, exteriorMaterials } from "@/utils/constants";

interface ConstructionSectionProps {
  control: Control<PropertyFormValues>;
  onNext?: () => void;
  isLastStep?: boolean;
}

export function ConstructionSection({ control, onNext, isLastStep }: ConstructionSectionProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Optional: Provide construction and structure details for your property.
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="structureType"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Structure Type"
                fullWidth
                {...field}
                value={field.value || ""}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {structureTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="roofing"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Roofing Type"
                fullWidth
                {...field}
                value={field.value || ""}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {roofingTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="exteriorMaterial"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Exterior Material"
                fullWidth
                {...field}
                value={field.value || ""}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {exteriorMaterials.map((material) => (
                  <MenuItem key={material.value} value={material.value}>
                    {material.label}
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

