import React from "react";
import { Box, Grid, Card, CardContent, Typography, Divider, Switch, FormControlLabel } from "@mui/material";
import { Controller, Control, UseFormWatch } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";

interface ReviewPublishSectionProps {
  control: Control<PropertyFormValues>;
  watch: UseFormWatch<PropertyFormValues>;
  images: string[];
}

export function ReviewPublishSection({ control, watch, images }: ReviewPublishSectionProps) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Review your property details and set publishing options before submitting.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Property Title
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {watch("title") || "Not set"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Price
              </Typography>
              <Typography variant="h6" fontWeight={600} color="primary.main">
                {watch("currency")} {watch("price")?.toLocaleString() || "0"}
                {watch("rentOrSell") === "rent" && " / month"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Property Type
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {watch("propertyType")?.charAt(0).toUpperCase() + watch("propertyType")?.slice(1).replace(/_/g, " ") || "Not set"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Bedrooms / Bathrooms
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {watch("bedrooms") || 0} bed / {watch("bathrooms") || 0} bath
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Images
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {images.length} image{images.length !== 1 ? "s" : ""} uploaded
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
    </Box>
  );
}

