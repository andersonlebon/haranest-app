"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { PropertyEditForm } from "@/components/properties/PropertyEditForm";
import { PropertyList } from "@/components/properties/PropertyList";
import { Property } from "@/types";
import { useCreateProperty, useDeleteProperty } from "@/hooks/useProperties";

export default function PropertyActionsPage() {
  const params = useParams();
  const router = useRouter();
  const action = params.actions as string;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Valid actions
  const validActions = ["add", "edit", "list", "view"];
  
  useEffect(() => {
    if (!validActions.includes(action)) {
      router.push("/dashboard/properties/list");
      return;
    }

    if (action === "list" || action === "edit") {
      fetchProperties();
    }
  }, [action, router]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        // API returns a paginated object, extract the properties array
        setProperties(data.data || []);
      }
    } catch (error) {
      console.error("Error while loading properties:", error);
      setProperties([]); // Ensure properties is always an array
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handlePropertyUpdate = (updatedProperty: Property) => {
    setProperties(prev => 
      prev.map(p => p.id === updatedProperty.id ? { ...updatedProperty, createdAt: p.createdAt, updatedAt: new Date().toISOString() } : p)
    );
    setSelectedProperty(null);
  };

  const { mutateAsync: createProperty, isPending: creating } = useCreateProperty();
  const { mutateAsync: deleteProperty } = useDeleteProperty();

  const handlePropertyCreate = async (formData: any) => {
    try {
      const created = await createProperty(formData);
      setProperties(prev => [created as unknown as Property, ...prev]);
      setSnackbar({ open: true, message: "Property created successfully!", severity: "success" });
      router.push("/dashboard/properties/list");
    } catch (e: any) {
      setSnackbar({ open: true, message: e?.message || "Error while creating property", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderContent = () => {
    switch (action) {
      case "add":
        return (
          <Container maxWidth="lg">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4, md: 6 },
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={600}
                sx={{ mb: 4, color: "text.primary" }}
              >
                Add New Property
              </Typography>
              <PropertyForm 
                onSubmit={handlePropertyCreate}
                onCancel={() => router.push("/dashboard/properties/list")}
                loading={creating}
              />
            </Paper>
          </Container>
        );

      case "edit":
        return (
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{ mb: 3, color: "text.primary" }}
                  >
                    Select a Property to Edit
                  </Typography>
                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <PropertyList 
                      properties={properties}
                      loading={loading}
                      onPropertySelect={handlePropertySelect}
                      selectedProperty={selectedProperty}
                    />
                  )}
                </Paper>
              </Grid>
              
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{ mb: 3, color: "text.primary" }}
                  >
                    Edit Property
                  </Typography>
                  {selectedProperty ? (
                    <PropertyEditForm 
                      property={selectedProperty}
                      onSuccess={handlePropertyUpdate}
                      onCancel={() => setSelectedProperty(null)}
                    />
                  ) : (
                    <Box
                      textAlign="center"
                      py={8}
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      <Typography variant="body1">
                        Select a property to edit
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        );

      case "list":
        return (
          <Container maxWidth="xl">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
                flexWrap="wrap"
                gap={2}
              >
                <Typography
                  variant="h4"
                  fontWeight={600}
                  sx={{ color: "text.primary" }}
                >
                  My Properties
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push("/dashboard/properties/add")}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  Add Property
                </Button>
              </Box>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                  <CircularProgress />
                </Box>
              ) : (
                <PropertyList 
                  properties={properties}
                  loading={loading}
                  onPropertySelect={handlePropertySelect}
                  showActions={true}
                  onDelete={async (id: number) => {
                    try {
                      await deleteProperty(id);
                      setProperties(prev => prev.filter(p => p.id !== id));
                      setSnackbar({ open: true, message: "Property deleted successfully!", severity: "success" });
                    } catch (e) {
                      console.error(e);
                      setSnackbar({ open: true, message: "Failed to delete property", severity: "error" });
                    }
                  }}
                />
              )}
            </Paper>
          </Container>
        );

      case "view":
        return (
          <Container maxWidth="lg">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4, md: 6 },
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={600}
                sx={{ mb: 4, color: "text.primary" }}
              >
                Property Details
              </Typography>
              {selectedProperty ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{ color: "text.secondary", mb: 1, display: "block" }}
                      >
                        Title
                      </Typography>
                      <Typography variant="h6" sx={{ color: "text.primary" }}>
                        {selectedProperty.title}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{ color: "text.secondary", mb: 1, display: "block" }}
                      >
                        Price
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ color: "success.main" }}
                      >
                        {selectedProperty.price} {selectedProperty.currency}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{ color: "text.secondary", mb: 1, display: "block" }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      {selectedProperty.description || "No description provided"}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  textAlign="center"
                  py={8}
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="body1">
                    No property selected
                  </Typography>
                </Box>
              )}
            </Paper>
          </Container>
        );

      default:
        return (
          <Container maxWidth="md">
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mb: 2, color: "text.primary" }}
              >
                Unknown Action
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 4, color: "text.secondary" }}
              >
                The action "{action}" is not recognized.
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/dashboard/properties/list")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }}
              >
                Back to List
              </Button>
            </Paper>
          </Container>
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, sm: 4, md: 6 },
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth={false}>
        {renderContent()}
      </Container>
      
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