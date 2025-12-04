import { PropertyParams } from "@/db/dtos/properties.dto";
import { PropertyRepository } from "@/db/repositories/property.repository";
import { propertySchema } from "@/db/validations/properties.validation";
import { NextResponse } from "next/server";




export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 10);

  // ✅ Parse arrays safely
  const getArrayParam = (key: string): string[] =>
    searchParams.getAll(key).filter(Boolean);

  const getNumberArrayParam = (key: string): number[] =>
    searchParams.getAll(key).map(Number).filter((n) => !isNaN(n));

  // ✅ Extract filters from query
  const filters = {
    price: getNumberArrayParam("price"), // [min, max]
    bedrooms: Number(searchParams.get("bedrooms") ?? 0),
    bathrooms: Number(searchParams.get("bathrooms") ?? 0),
    amenities: getArrayParam("amenities"),
    features: getArrayParam("features"),
    propertyType: searchParams.get("propertyType") ?? undefined,
    search: searchParams.get("search") ?? undefined,
  } as PropertyParams

  try {
    const data = await PropertyRepository.findAll({ page, perPage, filters });
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error fetching properties:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = propertySchema.parse(body);

    const newProperty = await PropertyRepository.create(validatedData);

    return NextResponse.json(newProperty, { status: 201 });
  }  catch (err: unknown) {
    // Narrow to Error type to safely access message
    const message = err instanceof Error ? err.message : String(err);
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Property ID required" }, { status: 400 });

    const body = await req.json();
    const validatedData = propertySchema.parse(body);

    const updatedProperty = await PropertyRepository.update(Number(id), validatedData);
    if (!updatedProperty) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    return NextResponse.json(updatedProperty);
  }  catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Property ID required" }, { status: 400 });

    await PropertyRepository.delete(Number(id));

    return NextResponse.json({ message: "Property deleted" }, { status: 200 });
  }  catch (err: unknown) {
    // Narrow to Error type to safely access message
    const message = err instanceof Error ? err.message : String(err);
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}