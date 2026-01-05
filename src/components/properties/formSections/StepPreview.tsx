import React from "react";
import { Box, Typography, Chip, Paper, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import { UseFormWatch } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";

interface StepPreviewProps {
  step: number;
  watch: UseFormWatch<PropertyFormValues>;
  images?: string[];
  features?: string[];
  amenities?: string[];
  onEdit?: () => void;
  showEditButton?: boolean;
}

export function StepPreview({ step, watch, images, features, amenities, onEdit, showEditButton = true }: StepPreviewProps) {
  const getPreviewContent = () => {
    switch (step) {
      case 0: // Basic Information
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Basic Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Title:</strong> {watch("title") || "Not set"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Type:</strong> {watch("propertyType") ? watch("propertyType").charAt(0).toUpperCase() + watch("propertyType").slice(1).replace(/_/g, " ") : "Not set"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Listing:</strong> {watch("rentOrSell") === "rent" ? "For Rent" : "For Sale"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Status:</strong> {watch("status") || "Not set"}
            </Typography>
          </Box>
        );

      case 1: // Pricing & Financial
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Pricing & Financial
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Price:</strong> {watch("currency")} {watch("price")?.toLocaleString() || "0"}
              {watch("rentOrSell") === "rent" && " / month"}
            </Typography>
            {watch("commission") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Commission:</strong> {watch("commission")}%
              </Typography>
            )}
            {watch("priceLabel") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Price Label:</strong> {watch("priceLabel")}
              </Typography>
            )}
          </Box>
        );

      case 2: // Property Details
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Property Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Bedrooms:</strong> {watch("bedrooms") || 0} | <strong>Bathrooms:</strong> {watch("bathrooms") || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Size:</strong> {watch("size") || 0} sqft
            </Typography>
            {watch("lotSize") && watch("lotSize")! > 0 && (
              <Typography variant="body2" color="text.secondary">
                <strong>Lot Size:</strong> {watch("lotSize")} sqft
              </Typography>
            )}
            {watch("garage") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Garage:</strong> Yes {watch("garageSize") && `(${watch("garageSize")} sqft)`}
              </Typography>
            )}
            {watch("basement") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Basement:</strong> Yes
              </Typography>
            )}
          </Box>
        );

      case 3: // Construction
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Construction
            </Typography>
            {watch("structureType") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Structure:</strong> {watch("structureType")}
              </Typography>
            )}
            {watch("roofing") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Roofing:</strong> {watch("roofing")}
              </Typography>
            )}
            {watch("exteriorMaterial") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Exterior:</strong> {watch("exteriorMaterial")}
              </Typography>
            )}
            {!watch("structureType") && !watch("roofing") && !watch("exteriorMaterial") && (
              <Typography variant="body2" color="text.disabled">
                No construction details provided
              </Typography>
            )}
          </Box>
        );

      case 4: // Location
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Location
            </Typography>
            {watch("locationCity") && (
              <Typography variant="body2" color="text.secondary">
                <strong>City:</strong> {watch("locationCity")}
              </Typography>
            )}
            {watch("locationProvince") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Province:</strong> {watch("locationProvince")}
              </Typography>
            )}
            {watch("locationDistrict") && (
              <Typography variant="body2" color="text.secondary">
                <strong>District:</strong> {watch("locationDistrict")}
              </Typography>
            )}
            {watch("zip") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Zip:</strong> {watch("zip")}
              </Typography>
            )}
            {!watch("locationCity") && !watch("locationProvince") && (
              <Typography variant="body2" color="text.disabled">
                No location details provided
              </Typography>
            )}
          </Box>
        );

      case 5: // Features & Amenities
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Features & Amenities
            </Typography>
            {features && features.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  <strong>Features ({features.length}):</strong>
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {features.slice(0, 3).map((feature) => (
                    <Chip
                      key={feature}
                      label={feature.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {features.length > 3 && (
                    <Chip label={`+${features.length - 3} more`} size="small" variant="outlined" />
                  )}
                </Box>
              </Box>
            )}
            {amenities && amenities.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  <strong>Amenities ({amenities.length}):</strong>
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {amenities.slice(0, 3).map((amenity) => (
                    <Chip key={amenity} label={amenity} size="small" variant="outlined" />
                  ))}
                  {amenities.length > 3 && (
                    <Chip label={`+${amenities.length - 3} more`} size="small" variant="outlined" />
                  )}
                </Box>
              </Box>
            )}
            {(!features || features.length === 0) && (!amenities || amenities.length === 0) && (
              <Typography variant="body2" color="text.disabled">
                No features or amenities added
              </Typography>
            )}
          </Box>
        );

      case 6: // Media
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Media
            </Typography>
            {images && images.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                <strong>Images:</strong> {images.length} uploaded
              </Typography>
            )}
            {watch("videoPreviewUrl") && (
              <Typography variant="body2" color="text.secondary">
                <strong>Video:</strong> Provided
              </Typography>
            )}
            {(!images || images.length === 0) && !watch("videoPreviewUrl") && (
              <Typography variant="body2" color="text.disabled">
                No media uploaded
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "action.hover",
        borderColor: "primary.main",
        borderWidth: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: showEditButton && onEdit ? 2 : 0 }}>
        <CheckCircleIcon color="primary" sx={{ fontSize: 20, mt: 0.5 }} />
        <Box sx={{ flex: 1 }}>
          {getPreviewContent()}
        </Box>
      </Box>
      {showEditButton && onEdit && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={onEdit}
            sx={{
              textTransform: "none",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 2,
              },
            }}
          >
            Edit
          </Button>
        </Box>
      )}
    </Paper>
  );
}

