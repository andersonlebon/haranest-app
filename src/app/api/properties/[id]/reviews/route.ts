import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/drizzle.config';
import { propertyReviews } from '@/db/schema/property_reviews';
import { sql } from 'drizzle-orm';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid property id' }, { status: 400 });
    }
    const reviews = await db
      .select()
      .from(propertyReviews)
      .where(eq(propertyReviews.propertyId, id))
      .orderBy(desc(propertyReviews.createdAt));
    return NextResponse.json({ data: reviews });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch reviews';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid property id' }, { status: 400 });
    }
    const body = await req.json();
    const name = String(body?.name || '').trim();
    const comment = String(body?.comment || '').trim();
    const location = String(body?.location || '').trim();
    const rating = Number(body?.rating || 0);

    if (!name || !comment || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Name, comment and rating(1-5) are required' }, { status: 400 });
    }

    const [created] = await db
      .insert(propertyReviews)
      .values({ propertyId: id, name, location, comment, rating })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create review';
    return NextResponse.json({ message }, { status: 500 });
  }
}


