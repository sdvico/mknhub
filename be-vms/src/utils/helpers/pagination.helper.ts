import { SelectQueryBuilder } from 'typeorm';
import { PaginationMetaDto, SortOrder } from '../dto/common-query.dto';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
  q?: string;
  keySearch?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function applyPagination<T extends Record<string, any>>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginationOptions,
  allowedSortFields: string[] = [],
  allowedSearchFields: string[] = [],
): SelectQueryBuilder<T> {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    q,
    keySearch,
    status,
    dateFrom,
    dateTo,
  } = options;

  // Apply pagination
  const offset = (page - 1) * limit;
  queryBuilder.skip(offset).take(limit);

  // Apply sorting
  if (sortBy && allowedSortFields.includes(sortBy)) {
    queryBuilder.orderBy(`"${sortBy}"`, sortOrder);
  } else {
    // Default sorting
    queryBuilder.orderBy('"createdAt"', SortOrder.DESC);
  }

  // Apply search
  if (q && q.trim()) {
    if (keySearch && allowedSearchFields.includes(keySearch)) {
      // Search by specific column
      queryBuilder.andWhere(`"${keySearch}" ILIKE :searchTerm`, {
        searchTerm: `%${q.trim()}%`,
      });
    } else {
      // Search across multiple columns
      const searchConditions = allowedSearchFields.map(
        (field) => `"${field}" ILIKE :searchTerm`,
      );
      if (searchConditions.length > 0) {
        queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`, {
          searchTerm: `%${q.trim()}%`,
        });
      }
    }
  }

  // Apply status filter
  if (status && status.trim()) {
    queryBuilder.andWhere('"status" = :status', { status: status.trim() });
  }

  // Apply date range filter
  if (dateFrom) {
    queryBuilder.andWhere('"createdAt" >= :dateFrom', { dateFrom });
  }
  if (dateTo) {
    queryBuilder.andWhere('"createdAt" <= :dateTo', { dateTo });
  }

  return queryBuilder;
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMetaDto {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function normalizeQueryParams(query: any): PaginationOptions {
  return {
    page: Math.max(1, parseInt(query.page) || 1),
    limit: Math.min(100, Math.max(1, parseInt(query.limit) || 10)),
    sortBy: query.sortBy || 'createdAt',
    sortOrder: (query.sortOrder?.toUpperCase() || 'DESC') as SortOrder,
    q: query.q?.trim(),
    keySearch: query.keySearch?.trim(),
    status: query.status?.trim(),
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  pagination: PaginationMetaDto,
  message?: string,
) {
  return {
    success: true,
    data,
    pagination,
    message,
  };
}
