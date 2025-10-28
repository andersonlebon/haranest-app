import { db } from '@/config/drizzle.config';
import { properties } from '@/db/schema/properties';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paramsId = await params
    if (!paramsId || !paramsId.id) return new NextResponse('Property ID is required', { status: 400 });
    const id = parseInt(paramsId.id, 10);

    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    if (result.length === 0) {
      return new NextResponse('Property not found', { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paramsId = await params;
    if (!paramsId || !paramsId.id) {
      return NextResponse.json(
        { message: 'ID de propriété requis' },
        { status: 400 }
      );
    }

    const id = parseInt(paramsId.id, 10);
    const body = await req.json();

    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { message: 'Propriété non trouvée' },
        { status: 404 }
      );
    }

    const updatedProperty = await db
      .update(properties)
      .set({
        title: body.title,
        description: body.description || null,
        price: body.price.toString(),
        currency: body.currency || 'USD',
        propertyType: body.propertyType,
        rentOrSell: body.rentOrSell || 'sell',
        status: body.status || 'available',
        bedrooms: body.bedrooms || null,
        bathrooms: body.bathrooms || null,
        size: body.size ? body.size.toString() : null,
        lotSize: body.lotSize ? body.lotSize.toString() : null,
        rooms: body.rooms || null,
        floors: body.floors || null,
        yearBuilt: body.yearBuilt || null,
        locationProvince: body.locationProvince || null,
        locationDistrict: body.locationDistrict || null,
        locationTown: body.locationTown || null,
        locationCity: body.locationCity || null,
        zip: body.zip || null,
        latitude: body.latitude ? body.latitude.toString() : null,
        longitude: body.longitude ? body.longitude.toString() : null,
        amenities: body.amenities || [],
        features: body.features || [],
        images: body.images || [],
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id))
      .returning();

    return NextResponse.json(updatedProperty[0]);
  } catch (err) {
    console.error('Error updating property:', err);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la propriété' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paramsId = await params;
    if (!paramsId || !paramsId.id) {
      return NextResponse.json(
        { message: 'ID de propriété requis' },
        { status: 400 }
      );
    }

    const id = parseInt(paramsId.id, 10);

    // Vérifier si la propriété existe
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { message: 'Propriété non trouvée' },
        { status: 404 }
      );
    }

    await db
      .delete(properties)
      .where(eq(properties.id, id));

    return NextResponse.json(
      { message: 'Propriété supprimée avec succès' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting property:', err);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la propriété' },
      { status: 500 }
    );
  }
}
