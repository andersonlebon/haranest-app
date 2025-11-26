"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ImageUploader from "./ImageUploader";
import { uploadPropertyImages } from "@/hooks/useProperties/services";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertyFormValues, propertySchema } from "@/db/schema/properties/dto";
import { propertyTypes, propertyFeatures, statuses } from "@/utils/constants";

/* -------------------------------------------------------------------------- */
/* Notes sur les changements
   - Import par défaut de Grid : `import Grid from "@mui/material/Grid"` -> évite l'erreur TS
   - Remplacement de onKeyPress par onKeyDown (onKeyPress est déprécié/alerte linter)
   - Typages plus précis pour les callbacks d'événements clavier
   - Quelques ajouts/normalisations dans defaultValues (rooms, size, lotSize)
   - Utilisation de backgroundColor / &:hover via sx pour IconButton (plus MUI)
*/
/* -------------------------------------------------------------------------- */

const characteristics = [
  { name: "bedrooms", label: "Chambres" },
  { name: "bathrooms", label: "Salles de bain" },
  { name: "rooms", label: "Pièces" },
  { name: "size", label: "Superficie (m²)" },
  { name: "lotSize", label: "Taille du terrain (m²)" },
  { name: "yearBuilt", label: "Année de construction" },
  { name: "floors", label: "Étages" },
];

const locationFields = [
  { name: "locationProvince", label: "Province" },
  { name: "locationDistrict", label: "District" },
  { name: "locationCity", label: "Ville" },
  { name: "zip", label: "Code postal" },
  { name: "latitude", label: "Latitude", type: "number" as const },
  { name: "longitude", label: "Longitude", type: "number" as const },
];

/* -------------------------------------------------------------------------- */
/* 🧱 Main Form Component */
/* -------------------------------------------------------------------------- */

export function PropertyForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: PropertyFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  type PropertyFeature = (typeof propertyFeatures)[number];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      currency: "USD",
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
      locationProvince: "",
      locationDistrict: "",
      locationCity: "",
      zip: "",
      latitude: 0,
      longitude: 0,
      amenities: [] as string[],
      features: [] as PropertyFeature[],
      images: [] as string[],
    },
  });

  /* ------------------------- Local state for chip inputs ------------------------- */
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");

  const amenities = watch("amenities") ?? [];
  const features = (watch("features") ?? []) as PropertyFeature[];
  const images = watch("images") ?? [];

  /* ------------------------------- Amenity logic ------------------------------- */
  const handleAddAmenity = useCallback(() => {
    const trimmed = newAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setValue("amenities", [...amenities, trimmed]);
      setNewAmenity("");
    }
  }, [newAmenity, amenities, setValue]);

  const handleRemoveAmenity = useCallback(
    (amenity: string) => {
      setValue("amenities", amenities.filter((x) => x !== amenity));
    },
    [amenities, setValue]
  );

  /* ------------------------------- Feature logic ------------------------------- */
  const handleToggleFeature = useCallback(
    (feature: PropertyFeature) => {
    if (features.includes(feature)) {
        const next = features.filter((x) => x !== feature) as PropertyFeature[];
        setValue("features", next as any);
    } else {
        const next = [...features, feature] as PropertyFeature[];
        setValue("features", next as any);
    }
    },
    [features, setValue]
  );

  /* -------------------------------- Image logic -------------------------------- */
  const handleAddImage = useCallback(() => {
    const trimmed = newImage.trim();
    if (trimmed && !images.includes(trimmed)) {
      setValue("images", [...images, trimmed]);
      setNewImage("");
    }
  }, [newImage, images, setValue]);

  const handleRemoveImage = useCallback(
    (img: string) => {
      setValue("images", images.filter((x) => x !== img));
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

  /* -------------------------------------------------------------------------- */
  /* 🧩 Reusable Section Component */
  /* -------------------------------------------------------------------------- */
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  /* -------------------------------------------------------------------------- */
  /* 🧾 Form JSX */
  /* -------------------------------------------------------------------------- */

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) => onSubmit(data as PropertyFormValues))}
      sx={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      {/* -------------------------------------------------------------- */}
      {/* 🧱 Basic Information */}
      {/* -------------------------------------------------------------- */}
      <Section title="Informations de base">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Titre *"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message as string | undefined}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Prix *"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message as string | undefined}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <TextField select label="Devise" fullWidth {...field}>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="RWF">RWF</MenuItem>
                </TextField>
              )}
            />
          </div>

          <div>
            <Controller
              name="propertyType"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Type de propriété *"
                  fullWidth
                  error={!!errors.propertyType}
                  helperText={errors.propertyType?.message as string | undefined}
                  {...field}
                >
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>

          <div>
            <Controller
              name="rentOrSell"
              control={control}
              render={({ field }) => (
                <TextField select label="Location ou Vente" fullWidth {...field}>
                  <MenuItem value="sell">Vente</MenuItem>
                  <MenuItem value="rent">Location</MenuItem>
                </TextField>
              )}
            />
          </div>

          <div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField select label="Statut" fullWidth {...field}>
                  {statuses.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message as string | undefined}
                />
              )}
            />
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}
      {/* 🧱 Caractéristiques */}
      {/* -------------------------------------------------------------- */}
      <Section title="Caractéristiques">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {characteristics.map(({ name, label }) => (
            <div key={name}>
              <Controller
                name={name as keyof PropertyFormValues}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label={label}
                    fullWidth
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors[name as keyof PropertyFormValues]}
                    helperText={errors[name as keyof PropertyFormValues]?.message as string | undefined}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}
      {/* 🧱 Localisation */}
      {/* -------------------------------------------------------------- */}
      <Section title="Localisation">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locationFields.map(({ name, label, type = "text" }) => (
            <div key={name}>
              <Controller
                name={name as keyof PropertyFormValues}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={label}
                    type={type}
                    fullWidth
                    onChange={(e) => {
                      if (type === "number") {
                        field.onChange(Number(e.target.value));
                      } else {
                        field.onChange(e.target.value);
                      }
                    }}
                    error={!!errors[name as keyof PropertyFormValues]}
                    helperText={errors[name as keyof PropertyFormValues]?.message as string | undefined}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}
      {/* 🧱 Équipements */}
      {/* -------------------------------------------------------------- */}
      <Section title="Équipements">
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Ajouter un équipement"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, handleAddAmenity)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddAmenity} startIcon={<AddIcon />}>
            Ajouter
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {amenities.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              onDelete={() => handleRemoveAmenity(amenity)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        {errors.amenities && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
            {errors.amenities.message as string | undefined}
          </Typography>
        )}
      </Section>

      {/* -------------------------------------------------------------- */}
      {/* 🧱 Fonctionnalités */}
      {/* -------------------------------------------------------------- */}
      <Section title="Fonctionnalités">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {propertyFeatures.map((feature) => (
            <div key={feature}>
              <Button
                variant={features.includes(feature) ? "contained" : "outlined"}
                onClick={() => handleToggleFeature(feature)}
                fullWidth
              >
                {feature}
              </Button>
            </div>
          ))}
        </div>
        {errors.features && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
            {errors.features.message as string | undefined}
          </Typography>
        )}
      </Section>

      {/* -------------------------------------------------------------- */}
      {/* 🧱 Images */}
      {/* -------------------------------------------------------------- */}
      <Section title="Images">
        <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <TextField
            label="URL de l'image"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, handleAddImage)}
            fullWidth
          />
          <Button variant="contained" color="success" onClick={handleAddImage} startIcon={<AddIcon />}>
            Ajouter
          </Button>

          <ImageUploader
            onFiles={async (files: File[]) => {
              if (!files || files.length === 0) return;
              try {
                const uploadedUrls = await uploadPropertyImages(files);
                setValue("images", [...images, ...uploadedUrls]);
              } catch (e: any) {
                console.error(e);
                
              }
            }}
          />
        </Box>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={idx}>
              <Box position="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Uploaded ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <IconButton
                  size="small"
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "grey.100" },
                  }}
                  onClick={() => handleRemoveImage(img)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </div>
          ))}
        </div>
        {errors.images && (
          <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
            {errors.images.message as string | undefined}
          </Typography>
        )}
      </Section>

      {/* -------------------------------------------------------------- */}
      {/* 🧱 Actions */}
      {/* -------------------------------------------------------------- */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Annuler
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Création..." : "Créer la propriété"}
        </Button>
      </Box>
    </Box>
  );
}
