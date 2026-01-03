import { useState, useEffect, useCallback } from "react";
import { Property } from "@/types";

export function usePropertyEditForm(initialProperty: Property) {
  const [formData, setFormData] = useState<Property>(initialProperty);
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    setFormData(initialProperty);
  }, [initialProperty]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleAddAmenity = useCallback(() => {
    if (newAmenity.trim() && !(formData.amenities || []).includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  }, [newAmenity, formData.amenities]);

  const handleRemoveAmenity = useCallback(
    (amenity: string) => {
      setFormData((prev) => ({
        ...prev,
        amenities: (prev.amenities || []).filter((a) => a !== amenity),
      }));
    },
    []
  );

  const handleFeatureToggle = useCallback(
    (feature: string) => {
      setFormData((prev) => ({
        ...prev,
        features: (prev.features || []).includes(feature)
          ? (prev.features || []).filter((f) => f !== feature)
          : [...(prev.features || []), feature],
      }));
    },
    []
  );

  const handleAddImage = useCallback(() => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  }, [newImage, formData.images]);

  const handleRemoveImage = useCallback((image: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  }, []);

  const handleAddImagesFromFiles = useCallback((imageUrls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...imageUrls.filter((url) => url && !prev.images.includes(url)),
      ],
    }));
  }, []);

  return {
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
    setFormData,
  };
}

