"use client";

import React, { useState } from "react";
import { Box, Button, CircularProgress, Alert, Snackbar } from "@mui/material";
import { Property } from "@/types";
import { usePropertyEditForm } from "@/hooks/usePropertyEditForm";
import { updateProperty } from "@/services/propertyEdit.service";
import { BasicInfoSection } from "./editFormSections/BasicInfoSection";
import { CharacteristicsSection } from "./editFormSections/CharacteristicsSection";
import { LocationSection } from "./editFormSections/LocationSection";
import { AmenitiesFeaturesSection } from "./editFormSections/AmenitiesFeaturesSection";
import { ImagesSection } from "./editFormSections/ImagesSection";

interface PropertyEditFormProps {
  property: Property;
  onSuccess: (property: Property) => void;
  onCancel: () => void;
}

export function PropertyEditForm({ property, onSuccess, onCancel }: PropertyEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    formData,
    newAmenity,
    newImage,
    setNewAmenity,
    setNewImage,
    handleInputChange,
    handleAddAmenity,
    handleRemoveAmenity,
    handleFeatureToggle,
    handleAddImage,
    handleRemoveImage,
    handleAddImagesFromFiles,
  } = usePropertyEditForm(property);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedProperty = await updateProperty(property.id, formData);
      setSnackbar({ open: true, message: "Property updated successfully!", severity: "success" });
      onSuccess(updatedProperty);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error while updating property";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <BasicInfoSection formData={formData} onInputChange={handleInputChange} />
      <CharacteristicsSection formData={formData} onInputChange={handleInputChange} />
      <LocationSection formData={formData} onInputChange={handleInputChange} />
      <AmenitiesFeaturesSection
        formData={formData}
        newAmenity={newAmenity}
        onNewAmenityChange={setNewAmenity}
        onAddAmenity={handleAddAmenity}
        onRemoveAmenity={handleRemoveAmenity}
        onFeatureToggle={handleFeatureToggle}
      />
      <ImagesSection
        images={formData.images}
        newImage={newImage}
        onNewImageChange={setNewImage}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        onImagesUploaded={handleAddImagesFromFiles}
      />

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            minWidth: 180,
            borderRadius: 2,
            textTransform: "none",
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
          {loading ? "Updating..." : "Update Property"}
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
