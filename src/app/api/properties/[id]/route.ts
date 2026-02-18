import { NextRequest, NextResponse } from "next/server";
import { PropertyRepository } from "@/db/repositories/property.repository";
import { propertySchema } from "@/db/validations/properties.validation";
import { createErrorResponse } from "@/lib/api/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid property id" },
        { status: 400 }
      );
    }

    const property = await PropertyRepository.findById(id);

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    return createErrorResponse(error, 500, "Error fetching property");
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid property id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = propertySchema.parse(body);

    const updated = await PropertyRepository.update(id, validatedData);

    if (!updated) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return createErrorResponse(error, 500, "Error updating property");
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid property id" },
        { status: 400 }
      );
    }

    const existing = await PropertyRepository.findById(id);
    if (!existing) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    await PropertyRepository.delete(id);

    return NextResponse.json(
      { message: "Property deleted" },
      { status: 200 }
    );
  } catch (error) {
    return createErrorResponse(error, 500, "Error deleting property");
  }
}


