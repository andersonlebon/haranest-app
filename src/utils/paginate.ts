// @ts-nocheck

import { PaginatedResponse, PaginationParams } from '@/components/shared/types';
import { SQLWrapper, asc, desc, sql } from 'drizzle-orm';
import { PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export interface QueryOptions<T> {
  where?: SQLWrapper | undefined;
  orderBy?: { column: PgColumn; direction: 'asc' | 'desc' }[];
  join?: { table: PgTableWithColumns<Record<string, unknown>>; on: SQLWrapper }[];
  transformResult?: (items: T[]) => T[];
}

export function validatePaginationParams(params: PaginationParams): {
  perPage: number;
  page: number;
  offset: number;
} {
  const limit = params.perPage || 10;
  const page = params.page || 1;

  if (limit < 1 || page < 1) {
    throw new Error('Invalid pagination parameters');
  }

  const offset = (page - 1) * limit;
  return { perPage: limit , page, offset };
}

export async function paginateQuery<
  T extends Record<string, unknown>,
  TTable extends PgTableWithColumns<Record<string, unknown>>,
>(
  db: PostgresJsDatabase,
  table: TTable,
  params: PaginationParams,
  options: QueryOptions<T> = {},
): Promise<PaginatedResponse<T>> {
  try {
    const { perPage, page, offset } = validatePaginationParams(params);

    // COUNT with optional where
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(table);
    if (options.where) {
      // drizzle builder is immutable; reassign when applying where
      countQuery = countQuery.where(options.where);
    }
    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    if (total === 0) {
      return {
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPreviousPage: page > 1,
      } as unknown as PaginatedResponse<T>;
    }

    // DATA with optional where, joins and ordering
    let dataQuery = db
      .select()
      .from(table)
      .limit(perPage)
      .offset(offset);

    options.join?.forEach(({ table: joinTable, on }) => {
      dataQuery = dataQuery.leftJoin(joinTable, on);
    });
    if (options.where) {
      dataQuery = dataQuery.where(options.where);
    }
    if (options.orderBy && options.orderBy.length > 0) {
      options.orderBy.forEach(({ column, direction }) => {
        dataQuery = dataQuery.orderBy(
          direction === 'desc' ? desc(column) : asc(column)
        );
      });
    }
    let data = (await dataQuery) as T[];

    if (
      options.transformResult &&
      typeof options.transformResult === 'function'
    ) {
      data = options.transformResult(data);
    }

    return {
      data,
      totalItems: total,
      totalPages: Math.ceil(total / perPage),
      currentPage: page,
      hasNextPage: page * perPage < total,
      hasPreviousPage: page > 1,
    } as unknown as PaginatedResponse<T>;
  } catch (error) {
    console.error('Error in pagination:', error);
    throw new Error('Error in pagination');
  }
}