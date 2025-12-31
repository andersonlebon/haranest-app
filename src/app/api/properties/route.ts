import { PropertyParams } from "@/db/dtos/properties.dto";
import { PropertyRepository } from "@/db/repositories/property.repository";
import { propertySchema } from "@/db/validations/properties.validation";
import { NextRequest, NextResponse } from "next/server";
import {
  createErrorResponse,
  getArrayParam,
  getNumberArrayParam,
  getNumberParam,
  getStringParam,
} from "@/lib/api/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = getNumberParam(searchParams, "page", 1);
    const perPage = getNumberParam(searchParams, "perPage", 10);

    // Extract filters from query
    const filters = {
      price: getNumberArrayParam(searchParams, "price"), // [min, max]
      bedrooms: getNumberParam(searchParams, "bedrooms"),
      bathrooms: getNumberParam(searchParams, "bathrooms"),
      amenities: getArrayParam(searchParams, "amenities"),
      features: getArrayParam(searchParams, "features"),
      propertyType: getStringParam(searchParams, "propertyType"),
      search: getStringParam(searchParams, "search"),
    } as PropertyParams;

    const data = await PropertyRepository.findAll({ page, perPage, filters });
    return NextResponse.json(data);
  } catch (error) {
    return createErrorResponse(error, 500, "Error fetching properties");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = propertySchema.parse(body);

    const newProperty = await PropertyRepository.create(validatedData);

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    return createErrorResponse(error, 500, "Error creating property");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = propertySchema.parse(body);

    const updatedProperty = await PropertyRepository.update(Number(id), validatedData);
    
    if (!updatedProperty) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProperty);
  } catch (error) {
    return createErrorResponse(error, 500, "Error updating property");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    await PropertyRepository.delete(Number(id));

    return NextResponse.json({ message: "Property deleted" }, { status: 200 });
  } catch (error) {
    return createErrorResponse(error, 500, "Error deleting property");
  }
}