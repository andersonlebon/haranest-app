"use client";
import React, { useRef, useState } from "react";

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
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-dashed border-2 rounded-md p-4 cursor-pointer transition-colors ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFilesSelected}
          className="hidden"
        />
        <div className="text-center text-sm text-gray-600">
          Glisser-déposer des images ici, ou cliquer pour sélectionner (jpg, png, etc.).
        </div>
      </div>
    </div>
  );
}
