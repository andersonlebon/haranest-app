"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  InputAdornment,
  Alert,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ImageUploader from "./ImageUploader";
import { uploadPropertyImages } from "@/utils/propertyImages";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertyTypes,
  propertyFeatures,
  statuses,
  structureTypes,
  roofingTypes,
  exteriorMaterials,
  currencies,
} from "@/utils/constants";
import { PropertyFormValues, propertySchema } from "@/db/validations/properties.validation";
import { useAuth } from "@/context/AuthContext";

type PropertyFeature = (typeof propertyFeatures)[number];

const characteristics = [
  { name: "bedrooms", label: "Bedrooms", icon: "🛏️" },
  { name: "bathrooms", label: "Bathrooms", icon: "🚿" },
  { name: "rooms", label: "Total Rooms", icon: "🚪" },
  { name: "size", label: "Size (sqft)", icon: "📐" },
  { name: "lotSize", label: "Lot Size (sqft)", icon: "🏞️" },
  { name: "yearBuilt", label: "Year Built", icon: "📅" },
  { name: "floors", label: "Floors", icon: "🏢" },
];

export function PropertyForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: PropertyFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const { profile } = useAuth();
  
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      profileId: profile?.id || 0,
      title: "",
      description: "",
      price: 0,
      currency: "USD",
      commission: undefined,
      propertyType: "apartment",
      rentOrSell: "sell",
      status: "available",
      bedrooms: 0,
      bathrooms: 0,
      rooms: 0,
      size: 0,
      lotSize: 0,
      yearBuilt: new Date().getFullYear(),
      floors: 1,
      garage: false,
      garageSize: undefined,
      basement: false,
      structureType: undefined,
      roofing: undefined,
      exteriorMaterial: undefined,
      priceLabel: "",
      beforePriceLabel: "",
      availableFrom: undefined,
      locationProvince: "",
      locationDistrict: "",
      locationTown: "",
      locationCell: "",
      locationCity: "",
      zip: "",
      latitude: undefined,
      longitude: undefined,
      videoPreviewUrl: "",
      amenities: [] as string[],
      features: [] as PropertyFeature[],
      images: [] as string[],
      isPublished: false,
      isFeatured: false,
    },
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");

  const amenities = watch("amenities") ?? [];
  const features = (watch("features") ?? []) as PropertyFeature[];
  const images = watch("images") ?? [];
  const rentOrSell = watch("rentOrSell");

  // Set profileId when profile is available
  useEffect(() => {
    if (profile?.id) {
      setValue("profileId", profile.id);
    }
  }, [profile, setValue]);

  const handleAddAmenity = useCallback(() => {
    const trimmed = newAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setValue("amenities", [...amenities, trimmed]);
      setNewAmenity("");
    }
  }, [newAmenity, amenities, setValue]);

  const handleRemoveAmenity = useCallback(
    (amenity: string) => {
      setValue("amenities", amenities.filter((x: string) => x !== amenity));
    },
    [amenities, setValue]
  );

  const handleToggleFeature = useCallback(
    (feature: PropertyFeature) => {
      if (features.includes(feature)) {
        const next = features.filter((x) => x !== feature) as PropertyFeature[];
        setValue("features", next);
      } else {
        const next = [...features, feature] as PropertyFeature[];
        setValue("features", next);
      }
    },
    [features, setValue]
  );

  const handleAddImage = useCallback(() => {
    const trimmed = newImage.trim();
    if (trimmed && !images.includes(trimmed)) {
      setValue("images", [...images, trimmed]);
      setNewImage("");
    }
  }, [newImage, images, setValue]);

  const handleRemoveImage = useCallback(
    (img: string) => {
      setValue("images", images.filter((x: string) => x !== img));
    },
    [images, setValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, callback: () => void) => {
      if (e.key === "Enter") {
        e.preventDefault();
        callback();
      }
    },
    []
  );

  const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <Box 
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1.5, 
        mb: 2,
        pb: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0.75,
          borderRadius: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        {icon}
      </Box>
      <Typography 
        variant="h6" 
        fontWeight={600}
        sx={{ 
          color: "text.primary",
        }}
      >
        {title}
      </Typography>
    </Box>
  );

  const onSubmitForm = (data: PropertyFormValues) => {
    if (!profile?.id) {
      return;
    }
    
    // Convert datetime-local to ISO string if availableFrom exists
    const formattedData = {
      ...data,
      profileId: profile.id,
      availableFrom: data.availableFrom
        ? new Date(data.availableFrom).toISOString()
        : undefined,
    };
    
    onSubmit(formattedData);
  };

  if (!profile?.id) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Please complete your profile before creating a property.
      </Alert>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmitForm)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: "1200px",
        mx: "auto",
        pb: 4,
        px: { xs: 1, sm: 2 },
        pt: 2,
      }}
    >
      {/* Basic Information Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: (theme) => theme.palette.mode === "dark" ? 2 : 1,
          },
        }}
      >
        <SectionHeader icon={<HomeIcon />} title="Basic Information" />
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Property Title"
                  placeholder="e.g., Beautiful 3BR Apartment in Downtown"
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title?.message as string | undefined}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  placeholder="Describe your property in detail..."
                  multiline
                  rows={5}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message as string | undefined}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Property Type"
                  fullWidth
                  required
                  error={!!errors.propertyType}
                  helperText={errors.propertyType?.message as string | undefined}
                  {...field}
                >
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="rentOrSell"
              control={control}
              render={({ field }) => (
                <TextField select label="Listing Type" fullWidth required {...field}>
                  <MenuItem value="sell">For Sale</MenuItem>
                  <MenuItem value="rent">For Rent</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField select label="Status" fullWidth {...field}>
                  {statuses.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Pricing Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: (theme) => theme.palette.mode === "dark" ? 2 : 1,
          },
        }}
      >
        <SectionHeader icon={<AttachMoneyIcon />} title="Pricing & Financial" />
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
      </Paper>

      {/* Property Characteristics */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: (theme) => theme.palette.mode === "dark" ? 2 : 1,
          },
        }}
      >
        <SectionHeader icon={<CheckCircleIcon />} title="Property Characteristics" />
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {characteristics.map(({ name, label, icon }) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Controller
                name={name as keyof PropertyFormValues}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    name={name}
                    type="number"
                    label={`${icon} ${label}`}
                    fullWidth
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    error={!!errors[name as keyof PropertyFormValues]}
                    helperText={errors[name as keyof PropertyFormValues]?.message as string | undefined}
                  />
                )}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography 
              variant="subtitle2" 
              fontWeight={600} 
              sx={{ 
                mb: 2,
                color: "text.primary",
              }}
            >
              Additional Options
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="garage"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Has Garage"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="basement"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Has Basement"
                />
              )}
            />
          </Grid>

          {watch("garage") && (
            <Grid item xs={12} md={4}>
              <Controller
                name="garageSize"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Garage Size (sqft)"
                    type="number"
                    fullWidth
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    error={!!errors.garageSize}
                    helperText={errors.garageSize?.message as string | undefined}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Construction Details */}
      <Accordion
        defaultExpanded={false}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          "&:before": { display: "none" },
          "&:hover": {
            bgcolor: "action.hover",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
          sx={{
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <SectionHeader icon={<BuildIcon />} title="Construction & Structure Details" />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
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

            <Grid item xs={12} md={4}>
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

            <Grid item xs={12} md={4}>
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
        </AccordionDetails>
      </Accordion>

      {/* Location Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: (theme) => theme.palette.mode === "dark" ? 2 : 1,
          },
        }}
      >
        <SectionHeader icon={<LocationOnIcon />} title="Location Details" />
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="locationProvince"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Province/State"
                  fullWidth
                  error={!!errors.locationProvince}
                  helperText={errors.locationProvince?.message as string | undefined}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="locationDistrict"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="District"
                  fullWidth
                  error={!!errors.locationDistrict}
                  helperText={errors.locationDistrict?.message as string | undefined}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="locationCity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="City"
                  fullWidth
                  error={!!errors.locationCity}
                  helperText={errors.locationCity?.message as string | undefined}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="locationTown"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Town"
                  fullWidth
                  error={!!errors.locationTown}
                  helperText={errors.locationTown?.message as string | undefined}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="locationCell"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cell/Sector"
                  fullWidth
                  error={!!errors.locationCell}
                  helperText={errors.locationCell?.message as string | undefined}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="zip"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Zip/Postal Code"
                  fullWidth
                  error={!!errors.zip}
                  helperText={errors.zip?.message as string | undefined}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="latitude"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Latitude"
                  type="number"
                  fullWidth
                  placeholder="e.g., -1.9441"
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={!!errors.latitude}
                  helperText={errors.latitude?.message as string | undefined}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="longitude"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Longitude"
                  type="number"
                  fullWidth
                  placeholder="e.g., 30.0619"
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={!!errors.longitude}
                  helperText={errors.longitude?.message as string | undefined}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: (theme) => theme.palette.mode === "dark" ? 2 : 1,
          },
        }}
      >
        <SectionHeader icon={<CheckCircleIcon />} title="Property Features" />
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {propertyFeatures.map((feature) => {
            const label = feature
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            return (
              <Grid item xs={6} sm={4} md={3} key={feature}>
                <Button
                  variant={features.includes(feature) ? "contained" : "outlined"}
                  onClick={() => handleToggleFeature(feature)}
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
        {errors.features && (
          <Typography color="error" variant="caption" sx={{ mt: 2, display: "block" }}>
            {errors.features.message as string | undefined}
          </Typography>
        )}
      </Paper>

      {/* Amenities Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: (theme) => theme.palette.mode === "dark" ? 2 : 1,
          },
        }}
      >
        <SectionHeader icon={<CheckCircleIcon />} title="Amenities" />
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Add an amenity"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, handleAddAmenity)}
            fullWidth
            placeholder="e.g., Near shopping mall, Close to school"
          />
          <Button
            variant="contained"
            onClick={handleAddAmenity}
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
                onDelete={() => handleRemoveAmenity(amenity)}
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
        {errors.amenities && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
            {errors.amenities.message as string | undefined}
          </Typography>
        )}
      </Paper>

      {/* Media Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: (theme) => theme.palette.mode === "dark" ? 2 : 1,
          },
        }}
      >
        <SectionHeader icon={<ImageIcon />} title="Media & Visuals" />
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Controller
            name="videoPreviewUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Video Preview URL"
                placeholder="https://youtube.com/watch?v=..."
                fullWidth
                helperText="Optional: Add a video tour or preview link"
                error={!!errors.videoPreviewUrl}
              />
            )}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            fontWeight={600} 
            sx={{ 
              mb: 2,
              color: "text.primary",
            }}
          >
            Upload Images
          </Typography>
          <ImageUploader
            onFiles={async (files: File[]) => {
              if (!files || files.length === 0) return;
              try {
                const uploadedUrls = await uploadPropertyImages(files);
                setValue("images", [...images, ...uploadedUrls]);
              } catch (e: unknown) {
                console.error("Error uploading images:", e);
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="subtitle2" 
            fontWeight={600} 
            sx={{ 
              mb: 2,
              color: "text.primary",
            }}
          >
            Or Add Image URLs
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <TextField
              label="Image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, handleAddImage)}
              fullWidth
              placeholder="https://example.com/image.jpg"
            />
            <Button
              variant="outlined"
              onClick={handleAddImage}
              startIcon={<AddIcon />}
              sx={{ minWidth: 120 }}
            >
              Add URL
            </Button>
          </Box>
        </Box>

        {images.length > 0 && (
          <Box>
            <Typography 
              variant="subtitle2" 
              fontWeight={600} 
              sx={{ 
                mb: 2,
                color: "text.primary",
              }}
            >
              Uploaded Images ({images.length})
            </Typography>
            <Grid container spacing={2}>
              {images.map((img: string, idx: number) => (
                <Grid item xs={6} sm={4} md={3} key={idx}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      aspectRatio: "4/3",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Property image ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "background.paper",
                        boxShadow: 2,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": { 
                          bgcolor: "error.main", 
                          color: "error.contrastText",
                          transform: "scale(1.1)",
                        },
                      }}
                      onClick={() => handleRemoveImage(img)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {errors.images && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
            {errors.images.message as string | undefined}
          </Typography>
        )}
      </Paper>

      {/* Publishing Options */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: (theme) => theme.palette.mode === "dark" ? 2 : 1,
          },
        }}
      >
        <SectionHeader icon={<CheckCircleIcon />} title="Publishing Options" />
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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
      </Paper>

      {/* Form Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          pt: 3,
          mt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button 
          onClick={onCancel} 
          variant="outlined" 
          size="large" 
          sx={{ 
            minWidth: 120,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 2,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
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
          {loading ? "Creating Property..." : "Create Property"}
        </Button>
      </Box>
    </Box>
  );
}

