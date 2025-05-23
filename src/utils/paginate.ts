import { PaginatedResponse, PaginationParams } from '@/components/shared/types';
import { SQLWrapper, sql } from 'drizzle-orm';
import { PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core';

export interface QueryOptions<T> {
  where?: SQLWrapper | undefined;
  orderBy?: { column: PgColumn; direction: 'asc' | 'desc' }[];
  join?: { table: PgTableWithColumns<any>; on: SQLWrapper }[];
  populate?: any;
  select?: (keyof T)[];
  transformResult?: (items: T[]) => any[];
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
  T extends Record<string, any>,
  TTable extends PgTableWithColumns<any>,
>(
  db: any,
  table: TTable,
  params: PaginationParams,
  options: QueryOptions<T> = {},
): Promise<PaginatedResponse<T>> {
  try {
    const { perPage, page, offset } = validatePaginationParams(params);

    const countQuery = db.select({ count: sql<number>`count(*)` }).from(table);

    if (options.where) {
      countQuery.where(options.where);
    }

    const [countResult] = await countQuery;
    const total = Number(countResult?.count || 0);

    if (total === 0) {
      return {
        perPage,
        page,
        total: 0,
        totalPages: 0,
        data: [],
      };
    }

    const dataQuery = db
      .select(options.populate)
      .from(table)
      .limit(perPage)
      .offset(offset);

    options.join?.forEach(({ table: joinTable, on }) => {
      dataQuery.leftJoin(joinTable, on);
    });
    if (options.select) {
      dataQuery.select(...options.select);
    }

    if (options.where) {
      dataQuery.where(options.where);
    }

    if (options.orderBy && options.orderBy.length > 0) {
      options.orderBy.forEach(({ column, direction }) => {
        if (direction === 'desc') {
          dataQuery.orderBy(sql`${column} DESC`);
        } else {
          dataQuery.orderBy(column);
        }
      });
    }
    let data = await dataQuery;

    if (
      options.transformResult &&
      typeof options.transformResult === 'function'
    ) {
      data = options.transformResult(data);
    }

    return {
      perPage,
      page,
      total,
      totalPages: Math.ceil(total / perPage),
      data,
    };
  } catch (error) {
    console.error('Error in pagination:', error);
    throw new Error('Error in pagination');
  }
}