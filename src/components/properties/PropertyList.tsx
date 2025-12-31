"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/components/shared/types";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  onPropertySelect?: (property: Property) => void;
  selectedProperty?: Property | null;
  showActions?: boolean;
  onDelete?: (id: number) => void;
}

export function PropertyList({ 
  properties, 
  loading, 
  onPropertySelect, 
  selectedProperty,
  showActions = false,
  onDelete,
}: PropertyListProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // Ensure properties is always an array
  const safeProperties = Array.isArray(properties) ? properties : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rented":
        return "bg-blue-100 text-blue-800";
      case "off_market":
        return "bg-gray-100 text-gray-800";
      case "under_construction":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "sold":
        return "Sold";
      case "pending":
        return "Pending";
      case "rented":
        return "Rented";
      case "off_market":
        return "Off Market";
      case "under_construction":
        return "Under Construction";
      default:
        return status;
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (safeProperties.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties</h3>
        <p className="text-gray-500 mb-4">You don't have any properties yet.</p>
        {showActions && (
          <button
            onClick={() => router.push("/dashboard/properties/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Property
          </button>
        )}
      </div>
    );
  }

  return (
    <>
    <div className="space-y-4">
      {safeProperties.map((property) => (
        <div
          key={property.id}
          className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
            selectedProperty?.id === property.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
          }`}
          onClick={() => onPropertySelect?.(property)}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Image */}
            <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/house.png';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {property.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {getStatusText(property.status)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {property.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                {property.bedrooms && (
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    {property.bedrooms} bed
                  </span>
                )}
                {property.bathrooms && (
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10 3h4M3 10l3-3m0 0l3 3m-3-3v18" />
                    </svg>
                    {property.bathrooms} bath
                  </span>
                )}
                {property.size && (
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    {property.size} sqft
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(property.price, property.currency)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {property.propertyType}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(property.createdAt)}
                </div>
              </div>

              {property.locationCity && (
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.locationCity}
                  {property.locationProvince && `, ${property.locationProvince}`}
                </div>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/properties/edit`);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/properties/${property.id}`);
                  }}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!onDelete) return;
                    setPendingDeleteId(property.id);
                    setConfirmOpen(true);
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    {/* Confirmation dialog */}
    <Dialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      aria-labelledby="confirm-delete-title"
    >
      <DialogTitle id="confirm-delete-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this property? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmOpen(false)} variant="outlined">
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            if (pendingDeleteId != null && onDelete) {
              onDelete(pendingDeleteId);
            }
            setConfirmOpen(false);
            setPendingDeleteId(null);
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
