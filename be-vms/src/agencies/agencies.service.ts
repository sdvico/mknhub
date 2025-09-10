import { Injectable, ConflictException } from '@nestjs/common';
import { AgencyRepository } from './infrastructure/persistence/relational/repositories/agency.repository';
import { Agency } from './domain/agency';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { NullableType } from '../utils/types/nullable.type';
import { SortOrder } from '../utils';

@Injectable()
export class AgenciesService {
  constructor(private readonly agencyRepository: AgencyRepository) {}

  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    // Check if code already exists
    const existingAgency = await this.agencyRepository.findByCode(
      createAgencyDto.code,
    );
    if (existingAgency) {
      throw new ConflictException('Agency code already exists');
    }

    return this.agencyRepository.create(createAgencyDto);
  }

  async findAll(): Promise<Agency[]> {
    return this.agencyRepository.findAll();
  }

  async findById(id: string): Promise<NullableType<Agency>> {
    return this.agencyRepository.findById(id);
  }

  async findByCode(code: string): Promise<NullableType<Agency>> {
    return this.agencyRepository.findByCode(code);
  }

  async update(
    id: string,
    updateAgencyDto: UpdateAgencyDto,
  ): Promise<Agency | null> {
    // Check if code already exists (if code is being updated)
    if (updateAgencyDto.code) {
      const existingAgency = await this.agencyRepository.findByCode(
        updateAgencyDto.code,
      );
      if (existingAgency && existingAgency.id !== id) {
        throw new ConflictException('Agency code already exists');
      }
    }

    return this.agencyRepository.update(id, updateAgencyDto);
  }

  async remove(id: string): Promise<void> {
    await this.agencyRepository.deleteById(id);
  }

  async findAgenciesWithPagination(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
    q?: string,
  ): Promise<[Agency[], number]> {
    return this.agencyRepository.findAgenciesWithPagination(
      page,
      limit,
      sortBy,
      sortOrder,
      q,
    );
  }
}
