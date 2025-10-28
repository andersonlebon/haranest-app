
import { db } from '@/config/drizzle.config';
import { properties, propertyTypeEnum } from '@/db/schema/properties';
import { paginateQuery } from '@/utils/paginate';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and, gte, lte, like, inArray } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');
  
  // Extract filter parameters
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const propertyType = searchParams.get('propertyType');
  const bedrooms = searchParams.get('bedrooms');
  const bathrooms = searchParams.get('bathrooms');
  const search = searchParams.get('search');
  const amenities = searchParams.get('amenities');
  const features = searchParams.get('features');

  try {
    // Build where conditions
    const conditions = [];
    
    // Apply price filters only when they differ from defaults to avoid accidental over-filtering
    if (priceMin && priceMin !== '0') {
      conditions.push(gte(properties.price, priceMin));
    }
    if (priceMax && priceMax !== '1000000' && priceMax !== '999999999') {
      conditions.push(lte(properties.price, priceMax));
    }
    if (propertyType && propertyType !== 'all') {
      const normalizedType = propertyType.toLowerCase();
      const validTypes = propertyTypeEnum.enumValues as unknown as string[];
      if (validTypes.includes(normalizedType)) {
        conditions.push(eq(properties.propertyType, normalizedType as any));
      }
    }
    const bedroomsNum = bedrooms ? parseInt(bedrooms, 10) : 0;
    if (!Number.isNaN(bedroomsNum) && bedroomsNum > 0) {
      conditions.push(gte(properties.bedrooms, bedroomsNum));
    }
    const bathroomsNum = bathrooms ? parseInt(bathrooms, 10) : 0;
    if (!Number.isNaN(bathroomsNum) && bathroomsNum > 0) {
      conditions.push(gte(properties.bathrooms, bathroomsNum));
    }
    if (search && search.trim().length > 0) {
      conditions.push(like(properties.title, `%${search.trim()}%`));
    }
    // TODO: Add proper array filtering (overlaps/contains). Temporarily ignore to avoid over-filtering.

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const data = await paginateQuery(db, properties, { 
      page, 
      perPage,
    }, {
      ...(whereClause ? { where: whereClause } : {}),
      orderBy: [{ column: properties.createdAt, direction: 'desc' }]
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching properties:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.title || !body.price || !body.propertyType) {
      return NextResponse.json(
        { message: 'Vuillez remplir tout les champs requis' },
        { status: 400 }
      );
    }

    const newProperty = await db.insert(properties).values({
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
      profileId: 1, // TODO: Récupérer l'ID du profil depuis l'authentification
    }).returning();

    return NextResponse.json(newProperty[0], { status: 201 });
  } catch (err) {
    console.error('Error creating property:', err);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la propriété' },
      { status: 500 }
    );
  }
}

