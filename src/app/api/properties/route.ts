
import { db } from '@/config/drizzle.config';
import { properties } from '@/db/schema/properties';
import { paginateQuery } from '@/utils/paginate';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');

  try {
    const data = await paginateQuery(db, properties, { page, perPage})
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching properties:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}