import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SortOrder } from '../dto/common-query.dto';

export function ApiQueryCommon() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (max: 100)',
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Sort field',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: SortOrder,
      description: 'Sort order',
      example: SortOrder.DESC,
    }),
    ApiQuery({
      name: 'q',
      required: false,
      type: String,
      description: 'Search query text',
      example: 'search term',
    }),
    ApiQuery({
      name: 'keySearch',
      required: false,
      type: String,
      description: 'Search by specific column',
      example: 'name',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      type: String,
      description: 'Filter by status',
      example: 'active',
    }),
    ApiQuery({
      name: 'dateFrom',
      required: false,
      type: String,
      description: 'Filter by date from (ISO string)',
      example: '2024-01-01T00:00:00.000Z',
    }),
    ApiQuery({
      name: 'dateTo',
      required: false,
      type: String,
      description: 'Filter by date to (ISO string)',
      example: '2024-12-31T23:59:59.999Z',
    }),
  );
}

export function ApiQueryPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (max: 100)',
      example: 10,
    }),
  );
}

export function ApiQuerySorting() {
  return applyDecorators(
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Sort field',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: SortOrder,
      description: 'Sort order',
      example: SortOrder.DESC,
    }),
  );
}

export function ApiQuerySearch() {
  return applyDecorators(
    ApiQuery({
      name: 'q',
      required: false,
      type: String,
      description: 'Search query text',
      example: 'search term',
    }),
    ApiQuery({
      name: 'keySearch',
      required: false,
      type: String,
      description: 'Search by specific column',
      example: 'name',
    }),
  );
}

export function ApiQueryFilter() {
  return applyDecorators(
    ApiQuery({
      name: 'status',
      required: false,
      type: String,
      description: 'Filter by status',
      example: 'active',
    }),
    ApiQuery({
      name: 'dateFrom',
      required: false,
      type: String,
      description: 'Filter by date from (ISO string)',
      example: '2024-01-01T00:00:00.000Z',
    }),
    ApiQuery({
      name: 'dateTo',
      required: false,
      type: String,
      description: 'Filter by date to (ISO string)',
      example: '2024-12-31T23:59:59.999Z',
    }),
  );
}
