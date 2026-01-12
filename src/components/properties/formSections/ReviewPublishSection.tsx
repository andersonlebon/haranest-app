import React from "react";
import { Box, Grid, Card, CardContent, Typography, Divider, Switch, FormControlLabel, Button, Chip, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BuildIcon from "@mui/icons-material/Build";
import ImageIcon from "@mui/icons-material/Image";
import { Controller, Control, UseFormWatch } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";

interface ReviewPublishSectionProps {
  control: Control<PropertyFormValues>;
  watch: UseFormWatch<PropertyFormValues>;
  images: string[];
  features?: string[];
  amenities?: string[];
  onSubmit?: () => void;
  loading?: boolean;
  isEditMode?: boolean;
}

export function ReviewPublishSection({ control, watch, images, features = [], amenities = [], onSubmit, loading, isEditMode }: ReviewPublishSectionProps) {
  const formatPropertyType = (type: string | undefined) => {
    if (!type) return "Not set";
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ");
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: "text.primary" }}>
        Complete Property Preview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Review all your property details before publishing.
      </Typography>

      {/* Basic Information */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <HomeIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Basic Information
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Title
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("title") || "Not set"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {watch("description") || "No description provided"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Property Type
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {formatPropertyType(watch("propertyType"))}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Listing Type
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("rentOrSell") === "rent" ? "For Rent" : "For Sale"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Status
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("status") ? watch("status").charAt(0).toUpperCase() + watch("status").slice(1) : "Not set"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Pricing & Financial */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AttachMoneyIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Pricing & Financial
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Price
            </Typography>
            <Typography variant="h5" fontWeight={600} color="primary.main">
              {watch("currency")} {watch("price")?.toLocaleString() || "0"}
              {watch("rentOrSell") === "rent" && " / month"}
            </Typography>
          </Grid>
          {watch("commission") && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Commission
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {watch("commission")}%
              </Typography>
            </Grid>
          )}
          {watch("priceLabel") && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Price Label
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {watch("priceLabel")}
              </Typography>
            </Grid>
          )}
          {watch("beforePriceLabel") && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Before Price Label
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {watch("beforePriceLabel")}
              </Typography>
            </Grid>
          )}
          {watch("availableFrom") && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Available From
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {new Date(watch("availableFrom")).toLocaleDateString()}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Property Details */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <HomeIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Property Details
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Bedrooms
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("bedrooms") || 0}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Bathrooms
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("bathrooms") || 0}
            </Typography>
          </Grid>
          {watch("rooms") && watch("rooms") > 0 && (
            <Grid size={{ xs: 6, md: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Rooms
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {watch("rooms")}
              </Typography>
            </Grid>
          )}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Size
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("size")?.toLocaleString() || 0} sqft
            </Typography>
          </Grid>
          {watch("lotSize") && watch("lotSize")! > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Lot Size
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {watch("lotSize")?.toLocaleString()} sqft
              </Typography>
            </Grid>
          )}
          {watch("yearBuilt") && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Year Built
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {watch("yearBuilt")}
              </Typography>
            </Grid>
          )}
          {watch("floors") && watch("floors") > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Floors
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {watch("floors")}
              </Typography>
            </Grid>
          )}
          {watch("garage") && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Garage
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                Yes {watch("garageSize") && `(${watch("garageSize")} sqft)`}
              </Typography>
            </Grid>
          )}
          {watch("basement") && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Basement
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                Yes
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Construction Details */}
      {(watch("structureType") || watch("roofing") || watch("exteriorMaterial")) && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <BuildIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Construction Details
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {watch("structureType") && (
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Structure Type
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {watch("structureType")}
                </Typography>
              </Grid>
            )}
            {watch("roofing") && (
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Roofing
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {watch("roofing")}
                </Typography>
              </Grid>
            )}
            {watch("exteriorMaterial") && (
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Exterior Material
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {watch("exteriorMaterial")}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* Location */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <LocationOnIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Location
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Province
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("locationProvince") || "Not set"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              District
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("locationDistrict") || "Not set"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Town
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("locationTown") || "Not set"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              City
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("locationCity") || "Not set"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Cell
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("locationCell") || "Not set"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              ZIP Code
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {watch("zip") || "Not set"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Coordinates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {watch("latitude") && watch("longitude") 
                ? `${watch("latitude")}, ${watch("longitude")}`
                : "Not set"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Features & Amenities */}
      {(features.length > 0 || amenities.length > 0) && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Features & Amenities
          </Typography>
          {features.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Features ({features.length})
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {features.map((feature) => (
                  <Chip
                    key={feature}
                    label={feature.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          )}
          {amenities.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Amenities ({amenities.length})
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {amenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* Media */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <ImageIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Media
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {/* Images Preview */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary" display="block" gutterBottom>
              Images ({images.length})
            </Typography>
            {images.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  {images.map((img, idx) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                      <Box
                        component="img"
                        src={img}
                        alt={`Property image ${idx + 1}`}
                        sx={{
                          width: "100%",
                          height: 250,
                          objectFit: "cover",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          cursor: "pointer",
                          transition: "transform 0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: 2,
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                No images uploaded
              </Typography>
            )}
          </Grid>

          {/* Video Preview */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary" display="block" gutterBottom>
              Video Preview
            </Typography>
            {watch("videoPreviewUrl") ? (
              <>
                <Box
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {watch("videoPreviewUrl")?.includes("youtube.com") || watch("videoPreviewUrl")?.includes("youtu.be") ? (
                    <Box
                      component="iframe"
                      src={
                        watch("videoPreviewUrl")?.includes("youtu.be")
                          ? `https://www.youtube.com/embed/${watch("videoPreviewUrl")?.split("/").pop()?.split("?")[0]}`
                          : `https://www.youtube.com/embed/${watch("videoPreviewUrl")?.split("v=")[1]?.split("&")[0]}`
                      }
                      sx={{
                        width: "100%",
                        height: 400,
                        border: "none",
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : watch("videoPreviewUrl")?.includes("vimeo.com") ? (
                    <Box
                      component="iframe"
                      src={`https://player.vimeo.com/video/${watch("videoPreviewUrl")?.split("/").pop()?.split("?")[0]}`}
                      sx={{
                        width: "100%",
                        height: 400,
                        border: "none",
                      }}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <Box
                      component="video"
                      src={watch("videoPreviewUrl")}
                      controls
                      sx={{
                        width: "100%",
                        height: 400,
                        objectFit: "contain",
                        bgcolor: "black",
                      }}
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", wordBreak: "break-all" }}>
                  {watch("videoPreviewUrl")}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                No video URL provided
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "text.primary" }}>
        Publishing Options
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="isPublished"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} color="primary" />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Publish Property
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Make this property visible to all users
                    </Typography>
                  </Box>
                }
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} color="primary" />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Feature Property
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Highlight this property in featured listings
                    </Typography>
                  </Box>
                }
              />
            )}
          />
        </Grid>
      </Grid>
          {onSubmit && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CheckCircleIcon /> : <CheckCircleIcon />}
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            sx={{
              minWidth: 180,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,
              },
              "&:disabled": {
                opacity: 0.6,
              },
            }}
          >
            {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Property" : "Create Property")}
          </Button>
        </Box>
      )}
    </Box>
  );
}

