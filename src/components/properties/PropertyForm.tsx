"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageIcon from "@mui/icons-material/Image";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PublishIcon from "@mui/icons-material/Publish";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFeatures } from "@/utils/constants";
import { PropertyFormValues, propertySchema } from "@/db/validations/properties.validation";
import { useAuth } from "@/context/AuthContext";
import { Property } from "@/types";
import { BasicInfoSection } from "./formSections/BasicInfoSection";
import { PricingFinancialSection } from "./formSections/PricingFinancialSection";
import { PropertyDetailsSection } from "./formSections/PropertyDetailsSection";
import { ConstructionSection } from "./formSections/ConstructionSection";
import { LocationSection } from "./formSections/LocationSection";
import { FeaturesAmenitiesSection } from "./formSections/FeaturesAmenitiesSection";
import { MediaSection } from "./formSections/MediaSection";
import { ReviewPublishSection } from "./formSections/ReviewPublishSection";
import { StepPreview } from "./formSections/StepPreview";

type PropertyFeature = (typeof propertyFeatures)[number];

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

interface PropertyFormProps {
  onSubmit: (data: PropertyFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
  property?: Property; // Optional property for edit mode
}

export function PropertyForm({
  onSubmit,
  onCancel,
  loading,
  property,
}: PropertyFormProps) {
  const { profile } = useAuth();
  const isEditMode = !!property;
  const [activeStep, setActiveStep] = useState(0);
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Convert Property to PropertyFormValues for edit mode
  const getDefaultValues = (): PropertyFormValues => {
    if (property) {
      // Edit mode: populate with existing property data
      return {
        profileId: property.id || profile?.id || 0, // Use property.id as fallback, but should be profileId
        title: property.title || "",
        description: property.description || "",
        price: property.price || 0,
        currency: property.currency || "USD",
        commission: undefined,
        propertyType: property.propertyType || "apartment",
        rentOrSell: property.rentOrSell || "sell",
        status: property.status || "available",
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        rooms: property.rooms || 0,
        size: property.size || 0,
        lotSize: property.lotSize || 0,
        yearBuilt: property.yearBuilt || new Date().getFullYear(),
        floors: property.floors || 1,
        garage: false,
        garageSize: undefined,
        basement: false,
        structureType: undefined,
        roofing: undefined,
        exteriorMaterial: undefined,
        priceLabel: "",
        beforePriceLabel: "",
        availableFrom: undefined,
        locationProvince: property.locationProvince || "",
        locationDistrict: property.locationDistrict || "",
        locationTown: property.locationTown || "",
        locationCell: "",
        locationCity: property.locationCity || "",
        zip: property.zip || "",
        latitude: property.latitude,
        longitude: property.longitude,
        videoPreviewUrl: "",
        reviewRate: 0,
        amenities: property.amenities || [],
        features: (property.features || []) as PropertyFeature[],
        images: property.images || [],
        isPublished: false,
        isFeatured: false,
      };
    }
    // Create mode: use default empty values
    return {
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
      reviewRate: 0,
      amenities: [] as string[],
      features: [] as PropertyFeature[],
      images: [] as string[],
      isPublished: false,
      isFeatured: false,
    };
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  const amenities = watch("amenities") ?? [];
  const features = (watch("features") ?? []) as PropertyFeature[];
  const images = watch("images") ?? [];
  const rentOrSell = watch("rentOrSell");

  // Set profileId when profile is available, or reset form when property changes
  useEffect(() => {
    if (profile?.id) {
      setValue("profileId", profile.id);
    }
  }, [profile, setValue]);

  // Reset form when property changes (for edit mode)
  useEffect(() => {
    if (property) {
      const defaultValues = getDefaultValues();
      reset(defaultValues);
    }
  }, [property?.id, reset]);

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
    // Ensure user has reached the review step before allowing submission
    if (activeStep !== steps.length - 1) {
      return;
    }
    
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
    
    // If in edit mode, include the property ID
    if (isEditMode && property?.id) {
      (formattedData as any).id = property.id;
    }
    
    onSubmit(formattedData);
  };

  if (!profile?.id) {
    return (
      <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
        Please complete your profile before creating a property.
      </Alert>
    );
  }

  const handleEditStep = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const getStepContent = (stepIndex: number) => {
    // If this step is completed (before active step), show preview with edit button
    if (stepIndex < activeStep) {
      return (
        <StepPreview
          step={stepIndex}
          watch={watch}
          images={images}
          features={features}
          amenities={amenities}
          onEdit={() => handleEditStep(stepIndex)}
          showEditButton={true}
        />
      );
    }

    // If this is the current active step, show the form content
    if (stepIndex === activeStep) {
      const stepContent = (() => {
        switch (stepIndex) {
          case 0:
            return <BasicInfoSection control={control} errors={errors} onNext={handleNext} isLastStep={stepIndex === steps.length - 1} />;
          case 1:
            return <PricingFinancialSection control={control} errors={errors} watch={watch} onNext={handleNext} isLastStep={stepIndex === steps.length - 1} />;
          case 2:
            return <PropertyDetailsSection control={control} errors={errors} watch={watch} onNext={handleNext} isLastStep={stepIndex === steps.length - 1} />;
          case 3:
            return <ConstructionSection control={control} onNext={handleNext} isLastStep={stepIndex === steps.length - 1} />;
          case 4:
            return <LocationSection control={control} errors={errors} onNext={handleNext} isLastStep={stepIndex === steps.length - 1} />;
          case 5:
            return (
              <FeaturesAmenitiesSection
                features={features}
                amenities={amenities}
                newAmenity={newAmenity}
                onNewAmenityChange={setNewAmenity}
                onAddAmenity={handleAddAmenity}
                onRemoveAmenity={handleRemoveAmenity}
                onToggleFeature={handleToggleFeature}
                onKeyDown={handleKeyDown}
                onNext={handleNext}
                isLastStep={stepIndex === steps.length - 1}
              />
            );
          case 6:
            return (
              <MediaSection
                control={control}
                errors={errors}
                images={images}
                newImage={newImage}
                onNewImageChange={setNewImage}
                onAddImage={handleAddImage}
                onRemoveImage={handleRemoveImage}
                onSetImages={(newImages) => setValue("images", newImages)}
                uploadError={uploadError}
                uploadLoading={uploadLoading}
                uploadSuccess={uploadSuccess}
                onSetUploadError={setUploadError}
                onSetUploadLoading={setUploadLoading}
                onSetUploadSuccess={setUploadSuccess}
                onKeyDown={handleKeyDown}
                onNext={handleNext}
                isLastStep={stepIndex === steps.length - 1}
              />
            );
          case 7:
            return (
              <ReviewPublishSection
                control={control}
                watch={watch}
                images={images}
                onSubmit={handleSubmit(onSubmitForm)}
                loading={loading}
                isEditMode={isEditMode}
              />
            );
          default:
            return null;
        }
      })();

      return stepContent;
    }

    // If step is not reached yet, show nothing or a placeholder
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="body2" color="text.disabled" textAlign="center">
          Complete previous steps to unlock this section
        </Typography>
      </Box>
    );
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

      {/* Back and Cancel Buttons */}
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
