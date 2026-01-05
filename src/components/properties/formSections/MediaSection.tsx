import React from "react";
import { Box, Grid, TextField, Button, IconButton, Typography, Alert, CircularProgress, LinearProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ImageUploader from "../ImageUploader";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";
import { uploadPropertyImages } from "@/utils/propertyImages";

interface MediaSectionProps {
  control: Control<PropertyFormValues>;
  errors: FieldErrors<PropertyFormValues>;
  images: string[];
  newImage: string;
  onNewImageChange: (value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (img: string) => void;
  onSetImages: (images: string[]) => void;
  uploadError: string | null;
  uploadLoading: boolean;
  uploadSuccess: boolean;
  onSetUploadError: (error: string | null) => void;
  onSetUploadLoading: (loading: boolean) => void;
  onSetUploadSuccess: (success: boolean) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, callback: () => void) => void;
  onNext?: () => void;
  isLastStep?: boolean;
}

export function MediaSection({
  control,
  errors,
  images,
  newImage,
  onNewImageChange,
  onAddImage,
  onRemoveImage,
  onSetImages,
  uploadError,
  uploadLoading,
  uploadSuccess,
  onSetUploadError,
  onSetUploadLoading,
  onSetUploadSuccess,
  onKeyDown,
  onNext,
  isLastStep,
}: MediaSectionProps) {
  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    onSetUploadError(null);
    onSetUploadSuccess(false);
    onSetUploadLoading(true);
    
    try {
      const uploadedUrls = await uploadPropertyImages(files);
      if (uploadedUrls.length > 0) {
        onSetImages([...images, ...uploadedUrls]);
        
        if (uploadedUrls.length < files.length) {
          onSetUploadError(
            `Only ${uploadedUrls.length} of ${files.length} images uploaded successfully. Some files may have failed.`
          );
        } else {
          onSetUploadSuccess(true);
          setTimeout(() => onSetUploadSuccess(false), 3000);
        }
      } else {
        onSetUploadError("No images were uploaded. Please check your connection and try again.");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error 
        ? e.message 
        : "Failed to upload images. Please check your connection and try again.";
      onSetUploadError(errorMessage);
      console.error("Error uploading images:", e);
    } finally {
      onSetUploadLoading(false);
    }
  };

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
        <ImageUploader onFiles={handleFileUpload} />
        
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
              onClose={() => onSetUploadError(null)}
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
              onClose={() => onSetUploadSuccess(false)}
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
            onChange={(e) => onNewImageChange(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown(e, onAddImage)}
            fullWidth
            placeholder="https://example.com/image.jpg"
          />
          <Button
            variant="outlined"
            onClick={onAddImage}
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
                    onError={(e) => {
                      e.currentTarget.src = "/images/house.png";
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
                    onClick={() => onRemoveImage(img)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
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

