"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
      router.push("/dashboard/properties/list");
    } catch (e: any) {
      alert(e?.message || "Error while creating property");
    }
  };

  const renderContent = () => {
    switch (action) {
      case "add":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Add New Property
              </h2>
              <PropertyForm 
                onSubmit={handlePropertyCreate}
                onCancel={() => router.push("/dashboard/properties/list")}
              />
            </div>
          </div>
        );

      case "edit":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Select a Property to Edit
                </h2>
                <PropertyList 
                  properties={properties}
                  loading={loading}
                  onPropertySelect={handlePropertySelect}
                  selectedProperty={selectedProperty}
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Edit Property
                </h2>
                {selectedProperty ? (
                  <PropertyEditForm 
                    property={selectedProperty}
                    onSuccess={handlePropertyUpdate}
                    onCancel={() => setSelectedProperty(null)}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>Select a property to edit</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "list":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  My Properties
                </h2>
                <button
                  onClick={() => router.push("/dashboard/properties/add")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Property
                </button>
              </div>
              <PropertyList 
                properties={properties}
                loading={loading}
                onPropertySelect={handlePropertySelect}
                showActions={true}
                onDelete={async (id: number) => {
                  try {
                    await deleteProperty(id);
                    setProperties(prev => prev.filter(p => p.id !== id));
                  } catch (e) {
                    console.error(e);
                    alert('Suppression échouée');
                  }
                }}
              />
            </div>
          </div>
        );

      case "view":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Détails de la propriété
              </h2>
              {selectedProperty ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <p className="text-lg">{selectedProperty.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="text-lg font-semibold text-green-600">
                        {selectedProperty.price} {selectedProperty.currency}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-600">{selectedProperty.description}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No property selected</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Action non reconnue
            </h2>
            <p className="text-gray-600 mb-4">
              L'action "{action}" n'est pas reconnue.
            </p>
            <button
              onClick={() => router.push("/dashboard/properties/list")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à la liste
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {renderContent()}
      </div>
    </div>
  );
}