import { Property } from "@/types";

export async function updateProperty(
  propertyId: number,
  data: Property
): Promise<Property> {
  const response = await fetch(`/api/properties/${propertyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Unable to update property");
  }

  return await response.json();
}

