"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PropertyList } from "@/components/properties/PropertyList";
import { Property } from "@/components/shared/types";

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // S'assurer que properties est toujours un tableau
  const safeProperties = Array.isArray(properties) ? properties : [];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        // L'API retourne un objet paginé, on extrait le tableau des propriétés
        setProperties(data.data || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des propriétés:", error);
      setProperties([]); // S'assurer que properties est toujours un tableau
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleDeleteProperty = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
      
        await fetchProperties();
      } else {
        alert('Erreur lors de la suppression.');
      }
    } catch (error) {
      alert('Erreur lors de la suppression.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Mes propriétés
                </h1>
                <p className="text-gray-600 mt-2">
                  Gérez vos propriétés et ajoutez de nouvelles annonces
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/dashboard/properties/add")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter une propriété
                </button>
                <button
                  onClick={() => router.push("/dashboard/properties/edit")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total</p>
                    <p className="text-2xl font-semibold text-gray-900">{safeProperties.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Disponibles</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {safeProperties.filter(p => p.status === 'available').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">En attente</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {safeProperties.filter(p => p.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Vendues</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {safeProperties.filter(p => p.status === 'sold').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

       
            <PropertyList 
              properties={safeProperties}
              loading={loading}
              onPropertySelect={handlePropertySelect}
              selectedProperty={selectedProperty}
              showActions={true}
              onDelete={handleDeleteProperty}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
