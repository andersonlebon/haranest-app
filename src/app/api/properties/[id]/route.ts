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
