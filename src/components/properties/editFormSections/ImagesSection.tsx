import React from "react";
import { Box, Grid, TextField, Button, IconButton, Typography, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ImageUploader from "../ImageUploader";
import { uploadPropertyImages } from "@/utils/propertyImages";

interface ImagesSectionProps {
  images: string[];
  newImage: string;
  onNewImageChange: (value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (image: string) => void;
  onImagesUploaded: (urls: string[]) => void;
}

export function ImagesSection({
  images,
  newImage,
  onNewImageChange,
  onAddImage,
  onRemoveImage,
  onImagesUploaded,
}: ImagesSectionProps) {
  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    try {
      const uploadedUrls = await uploadPropertyImages(files);
      onImagesUploaded(uploadedUrls);
    } catch (error) {
      console.error("Error uploading images:", error);
      // Error handling can be added here (e.g., show snackbar)
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: "text.primary" }}>
        Images
      </Typography>

      {/* Image URL Input */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          type="url"
          value={newImage}
          onChange={(e) => onNewImageChange(e.target.value)}
          placeholder="Image URL"
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddImage();
            }
          }}
          sx={{ bgcolor: "background.default" }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={onAddImage}
          startIcon={<AddIcon />}
          sx={{ minWidth: 120 }}
        >
          Add URL
        </Button>
      </Box>

      {/* Image Uploader */}
      <Box sx={{ mb: 3 }}>
        <ImageUploader onFiles={handleFileUpload} />
      </Box>

      {/* Image Gallery */}
      {images.length > 0 && (
        <Box>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "text.secondary" }}>
            Uploaded Images ({images.length})
          </Typography>
          <Grid container spacing={2}>
            {images.map((image, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    aspectRatio: "4/3",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
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
                      "&:hover": {
                        bgcolor: "error.main",
                        color: "error.contrastText",
                      },
                    }}
                    onClick={() => onRemoveImage(image)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
}

