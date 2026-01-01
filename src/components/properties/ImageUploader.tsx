"use client";
import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface ImageUploaderProps {
  onFiles: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

export default function ImageUploader({ onFiles, maxFiles = 20, accept = "image/*" }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) onFiles(files.slice(0, maxFiles));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) onFiles(files.slice(0, maxFiles));
    // allow selecting same file again
    e.currentTarget.value = "";
  };

  return (
    <Box>
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        sx={{
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : "divider",
          borderRadius: 2,
          p: 4,
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          bgcolor: isDragging ? "action.hover" : "background.paper",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFilesSelected}
          style={{ display: "none" }}
        />
        <CloudUploadIcon 
          sx={{ 
            fontSize: 48, 
            color: isDragging ? "primary.main" : "text.secondary",
            transition: "color 0.2s ease-in-out",
          }} 
        />
        <Typography 
          variant="body2" 
          color="text.secondary"
          textAlign="center"
          sx={{
            transition: "color 0.2s ease-in-out",
            color: isDragging ? "primary.main" : "text.secondary",
          }}
        >
          Drag and drop images here, or click to select
        </Typography>
        <Typography 
          variant="caption" 
          color="text.disabled"
          textAlign="center"
        >
          Supports: JPG, PNG, GIF, WEBP (max {maxFiles} files)
        </Typography>
      </Box>
    </Box>
  );
}
