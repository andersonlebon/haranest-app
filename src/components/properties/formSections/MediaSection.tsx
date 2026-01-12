import React, { useRef } from "react";
import { Box, Grid, TextField, Button, IconButton, Typography, Alert, CircularProgress, LinearProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VideocamIcon from "@mui/icons-material/Videocam";
import ImageUploader from "../ImageUploader";
import { Controller, Control, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PropertyFormValues } from "@/db/validations/properties.validation";
import { uploadPropertyFiles } from "@/utils/propertyImages";

interface MediaSectionProps {
  control: Control<PropertyFormValues>;
  errors: FieldErrors<PropertyFormValues>;
  setValue: UseFormSetValue<PropertyFormValues>;
  watch: UseFormWatch<PropertyFormValues>;
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
  setValue,
  watch,
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
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    onSetUploadError(null);
    onSetUploadSuccess(false);
    onSetUploadLoading(true);
    
    try {
      const uploadedUrls = await uploadPropertyFiles(files);
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

  const handleVideoUpload = async (file: File) => {
    if (!file) return;
    
    onSetUploadError(null);
    onSetUploadSuccess(false);
    onSetUploadLoading(true);
    
    try {
      const uploadedUrls = await uploadPropertyFiles([file]);
      if (uploadedUrls.length > 0 && uploadedUrls[0]) {
        setValue("videoPreviewUrl", uploadedUrls[0]);
        onSetUploadSuccess(true);
        setTimeout(() => onSetUploadSuccess(false), 3000);
      } else {
        onSetUploadError("Video upload failed. Please check your connection and try again.");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error 
        ? e.message 
        : "Failed to upload video. Please check your connection and try again.";
      onSetUploadError(errorMessage);
      console.error("Error uploading video:", e);
    } finally {
      onSetUploadLoading(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "text.primary" }}>
          Video Preview
        </Typography>
        
        {/* Video File Upload */}
        <Box
          onClick={() => videoInputRef.current?.click()}
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            mb: 2,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "action.hover",
            },
          }}
        >
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleVideoUpload(e.target.files[0]);
              }
            }}
            style={{ display: "none" }}
          />
          <VideocamIcon sx={{ fontSize: 36, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Click to upload a video file
          </Typography>
          <Typography variant="caption" color="text.disabled" textAlign="center">
            Supports: MP4, MOV, AVI, WEBM (max 100MB)
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
          OR
        </Typography>

        {/* Video URL Input */}
        <Controller
          name="videoPreviewUrl"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Video Preview URL"
              placeholder="https://youtube.com/watch?v=... or paste uploaded video URL"
              fullWidth
              helperText="Optional: Add a video URL (YouTube, Vimeo, or direct link)"
              error={!!errors.videoPreviewUrl}
            />
          )}
        />
        
        {watch("videoPreviewUrl") && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Current Video:
            </Typography>
            <Box
              sx={{
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                mt: 1,
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
                    height: 200,
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
                    height: 200,
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
                    height: 200,
                    objectFit: "contain",
                    bgcolor: "black",
                  }}
                />
              )}
            </Box>
          </Box>
        )}
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
              Files uploaded successfully!
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

