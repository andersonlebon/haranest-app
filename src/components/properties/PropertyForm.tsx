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
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  InputAdornment,
  Alert,
  CircularProgress,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PublishIcon from "@mui/icons-material/Publish";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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

const steps = [
  {
    label: "Basic Information",
    icon: <HomeIcon />,
    description: "Property title, type, and status",
  },
  {
    label: "Pricing & Financial",
    icon: <AttachMoneyIcon />,
    description: "Price, currency, and commission",
  },
  {
    label: "Property Details",
    icon: <CheckCircleIcon />,
    description: "Size, rooms, and characteristics",
  },
  {
    label: "Construction",
    icon: <BuildIcon />,
    description: "Structure and materials",
  },
  {
    label: "Location",
    icon: <LocationOnIcon />,
    description: "Address and coordinates",
  },
  {
    label: "Features & Amenities",
    icon: <CheckCircleIcon />,
    description: "Property features and amenities",
  },
  {
    label: "Media",
    icon: <ImageIcon />,
    description: "Images and video",
  },
  {
    label: "Review & Publish",
    icon: <PublishIcon />,
    description: "Final review and publishing options",
  },
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
  const [activeStep, setActiveStep] = useState(0);
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    mode: "onChange",
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

  const handleNext = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: (keyof PropertyFormValues)[] = [];
    
    switch (activeStep) {
      case 0: // Basic Information
        fieldsToValidate = ["title", "propertyType", "rentOrSell", "status"];
        break;
      case 1: // Pricing
        fieldsToValidate = ["price", "currency"];
        break;
      case 2: // Property Details
        fieldsToValidate = ["bedrooms", "bathrooms"];
        break;
      case 3: // Construction (optional)
        fieldsToValidate = [];
        break;
      case 4: // Location (optional)
        fieldsToValidate = [];
        break;
      case 5: // Features & Amenities (optional)
        fieldsToValidate = [];
        break;
      case 6: // Media (optional)
        fieldsToValidate = [];
        break;
      case 7: // Review & Publish
        fieldsToValidate = [];
        break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        return;
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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

  const onSubmitForm = (data: PropertyFormValues) => {
    if (!profile?.id) {
      return;
    }
    
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
      <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
        Please complete your profile before creating a property.
      </Alert>
    );
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
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
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
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

              <Grid size={{ xs: 12, md: 4 }}>
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

              <Grid size={{ xs: 12, md: 4 }}>
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

              <Grid size={{ xs: 12, md: 4 }}>
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
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
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

              <Grid size={{ xs: 12, md: 4 }}>
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

              <Grid size={{ xs: 12, md: 4 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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
                <Grid size={{ xs: 12, md: 6 }}>
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
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {characteristics.map(({ name, label, icon }) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={name}>
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

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "text.primary" }}>
                  Additional Options
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
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

              <Grid size={{ xs: 12, md: 4 }}>
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
                <Grid size={{ xs: 12, md: 4 }}>
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
          </Box>
        );

      case 3:
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
          </Box>
        );

      case 4:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Provide the location details for your property. More details help buyers find your property easily.
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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
          </Box>
        );

      case 5:
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

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "text.primary" }}>
              Amenities
            </Typography>
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
          </Box>
        );

      case 6:
        return (
          <Box sx={{ mt: 2 }}>
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
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "text.primary" }}>
                Upload Images
              </Typography>
              <ImageUploader
                onFiles={async (files: File[]) => {
                  if (!files || files.length === 0) return;
                  
                  setUploadError(null);
                  setUploadSuccess(false);
                  setUploadLoading(true);
                  
                  try {
                    const uploadedUrls = await uploadPropertyImages(files);
                    if (uploadedUrls.length > 0) {
                      setValue("images", [...images, ...uploadedUrls]);
                      
                      if (uploadedUrls.length < files.length) {
                        setUploadError(
                          `Only ${uploadedUrls.length} of ${files.length} images uploaded successfully. Some files may have failed.`
                        );
                      } else {
                        setUploadSuccess(true);
                        setTimeout(() => setUploadSuccess(false), 3000);
                      }
                    } else {
                      setUploadError("No images were uploaded. Please check your connection and try again.");
                    }
                  } catch (e: unknown) {
                    const errorMessage = e instanceof Error 
                      ? e.message 
                      : "Failed to upload images. Please check your connection and try again.";
                    setUploadError(errorMessage);
                    console.error("Error uploading images:", e);
                  } finally {
                    setUploadLoading(false);
                  }
                }}
              />
              
              {uploadLoading && (
                <Box sx={{ mt: 2 }}>
                  <Alert 
                    severity="info" 
                    sx={{ borderRadius: 2 }}
                    icon={<CircularProgress size={20} />}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body2">
                        Uploading images... Please wait.
                      </Typography>
                    </Box>
                    <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />
                  </Alert>
                </Box>
              )}
              
              {uploadError && (
                <Box sx={{ mt: 2 }}>
                  <Alert 
                    severity="error" 
                    onClose={() => setUploadError(null)}
                    sx={{ borderRadius: 2 }}
                  >
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Upload Failed
                    </Typography>
                    <Typography variant="body2">
                      {uploadError}
                    </Typography>
                  </Alert>
                </Box>
              )}
              
              {uploadSuccess && (
                <Box sx={{ mt: 2 }}>
                  <Alert 
                    severity="success" 
                    onClose={() => setUploadSuccess(false)}
                    sx={{ borderRadius: 2 }}
                  >
                    Images uploaded successfully!
                  </Alert>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "text.primary" }}>
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
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "text.primary" }}>
                  Uploaded Images ({images.length})
                </Typography>
                <Grid container spacing={2}>
                  {images.map((img: string, idx: number) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
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
          </Box>
        );

      case 7:
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
                    {watch("rentOrSell") === "sell" && ""}
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

      default:
        return null;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmitForm)}
      sx={{
        maxWidth: "1000px",
        mx: "auto",
        pb: 4,
      }}
    >
      {/* Progress Indicator */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Step {activeStep + 1} of {steps.length}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={((activeStep + 1) / steps.length) * 100}
          sx={{
            mt: 1,
            height: 6,
            borderRadius: 3,
            bgcolor: "action.disabledBackground",
          }}
        />
      </Box>

      {/* Navigation Buttons */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              minWidth: 120,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateX(-2px)",
              },
            }}
          >
            Back
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
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
          ) : (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
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
              {loading ? "Creating..." : "Create Property"}
            </Button>
          )}
        </Box>

        <Button
          onClick={onCancel}
          variant="outlined"
          color="error"
          sx={{
            minWidth: 100,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          Cancel
        </Button>
      </Paper>

      {/* Progress Stepper */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label} completed={index < activeStep}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: index < activeStep 
                        ? "primary.main" 
                        : index === activeStep 
                        ? "primary.main" 
                        : "action.disabledBackground",
                      color: index <= activeStep ? "primary.contrastText" : "text.disabled",
                      fontWeight: 600,
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {index < activeStep ? (
                      <CheckCircleIcon />
                    ) : (
                      <Box sx={{ color: "inherit" }}>{step.icon}</Box>
                    )}
                  </Box>
                )}
              >
                <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary" }}>
                  {step.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "background.default",
                    border: "1px solid",
                    borderColor: "divider",
                    minHeight: 200,
                  }}
                >
                  {getStepContent(index)}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
}
