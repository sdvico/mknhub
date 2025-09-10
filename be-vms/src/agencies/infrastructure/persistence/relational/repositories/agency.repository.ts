import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgencyEntity } from '../entities/agency.entity';
import { Agency } from '../../../../domain/agency';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SortOrder } from '../../../../../utils';

@Injectable()
export class AgencyRepository {
  constructor(
    @InjectRepository(AgencyEntity)
    private readonly agencyRepository: Repository<AgencyEntity>,
  ) {}

  private toDomain(entity: AgencyEntity): Agency {
    return new Agency({
      id: entity.id,
      name: entity.name,
      code: entity.code,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  private toEntity(domain: Agency): AgencyEntity {
    const entity = new AgencyEntity();
    if (domain.id) entity.id = domain.id;
    entity.name = domain.name;
    entity.code = domain.code;
    if (domain.created_at) entity.created_at = domain.created_at;
    if (domain.updated_at) entity.updated_at = domain.updated_at;
    return entity;
  }

  async findById(id: string): Promise<NullableType<Agency>> {
    const entity = await this.agencyRepository.findOne({
      where: { id },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByCode(code: string): Promise<NullableType<Agency>> {
    const entity = await this.agencyRepository.findOne({
      where: { code },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Agency[]> {
    const entities = await this.agencyRepository.find({
      order: { created_at: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async create(data: Omit<Agency, 'id'>): Promise<Agency> {
    const entity = this.toEntity(data as Agency);
    const savedEntity = await this.agencyRepository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(
    id: string,
    payload: Partial<Omit<Agency, 'id'>>,
  ): Promise<Agency | null> {
    const entity = await this.agencyRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, payload);
    const updatedEntity = await this.agencyRepository.save(entity);
    return this.toDomain(updatedEntity);
  }

  async deleteById(id: string): Promise<void> {
    await this.agencyRepository.delete({ id });
  }

  async findAgenciesWithPagination(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
    q?: string,
  ): Promise<[Agency[], number]> {
    const queryBuilder = this.agencyRepository.createQueryBuilder('agency');

    // Apply search filters
    if (q) {
      queryBuilder.where('(agency.name LIKE :q OR agency.code LIKE :q)', {
        q: `%${q}%`,
      });
    }

    // Apply sorting
    const allowedSortFields = ['name', 'code', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    queryBuilder.orderBy(`agency.${safeSortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [entities, total] = await queryBuilder.getManyAndCount();
    const agencies = entities.map((entity) => this.toDomain(entity));

    return [agencies, total];
  }
}
