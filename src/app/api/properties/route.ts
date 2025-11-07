import { PropertyRepository } from "@/db/repositories/property.repository";
import { propertySchema } from "@/db/schema/properties/validation";
import { NextResponse } from "next/server";




export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 10);

  try {
    if (id) {
      // GET single property
      const property = await PropertyRepository.findById(Number(id));
      if (!property) {
        return NextResponse.json({ error: "Property not found" }, { status: 404 });
      }
      return NextResponse.json(property);
    }

    // GET paginated list
    const data = await PropertyRepository.findAll({ page, perPage });
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(err);
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