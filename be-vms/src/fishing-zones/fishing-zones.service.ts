import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FishingZone } from './entities/fishing-zone.entity';
import { CreateFishingZoneDto } from './dto/create-fishing-zone.dto';
import { UpdateFishingZoneDto } from './dto/update-fishing-zone.dto';
import { SortOrder } from '../utils';

@Injectable()
export class FishingZonesService {
  constructor(
    @InjectRepository(FishingZone)
    private readonly fishingZoneRepository: Repository<FishingZone>,
  ) {}

  async create(
    createFishingZoneDto: CreateFishingZoneDto,
  ): Promise<FishingZone> {
    const fishingZone = this.fishingZoneRepository.create({
      ...createFishingZoneDto,
      published_at: createFishingZoneDto.published_at
        ? new Date(createFishingZoneDto.published_at)
        : undefined,
    });

    return await this.fishingZoneRepository.save(fishingZone);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    enable?: boolean,
    sortBy: string = 'published_at',
    sortOrder: SortOrder = SortOrder.DESC,
  ): Promise<{
    data: FishingZone[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder =
      this.fishingZoneRepository.createQueryBuilder('fishingZone');

    // Apply sorting
    const allowedSortFields = [
      'published_at',
      'created_at',
      'title',
      'total_views',
      'total_clicks',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'published_at';
    queryBuilder.orderBy(`fishingZone.${safeSortBy}`, sortOrder);

    if (enable !== undefined) {
      queryBuilder.andWhere('fishingZone.enable = :enable', { enable });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<FishingZone> {
    const fishingZone = await this.fishingZoneRepository.findOne({
      where: { id },
    });

    if (!fishingZone) {
      throw new NotFoundException(`Fishing zone with ID ${id} not found`);
    }

    return fishingZone;
  }

  async update(
    id: string,
    updateFishingZoneDto: UpdateFishingZoneDto,
  ): Promise<FishingZone> {
    const fishingZone = await this.findOne(id);

    if (updateFishingZoneDto.published_at) {
      updateFishingZoneDto.published_at = new Date(
        updateFishingZoneDto.published_at,
      ) as any;
    }

    Object.assign(fishingZone, updateFishingZoneDto);
    return await this.fishingZoneRepository.save(fishingZone);
  }

  async remove(id: string): Promise<void> {
    const fishingZone = await this.findOne(id);
    await this.fishingZoneRepository.remove(fishingZone);
  }

  async incrementViews(id: string): Promise<void> {
    await this.fishingZoneRepository
      .createQueryBuilder()
      .update(FishingZone)
      .set({ total_views: () => 'total_views + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async incrementClicks(id: string): Promise<void> {
    await this.fishingZoneRepository
      .createQueryBuilder()
      .update(FishingZone)
      .set({ total_clicks: () => 'total_clicks + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async getActiveFishingZones(): Promise<FishingZone[]> {
    return await this.fishingZoneRepository.find({
      where: { enable: true },
      order: { published_at: 'DESC', created_at: 'DESC' },
    });
  }

  async toggleEnable(id: string): Promise<FishingZone> {
    const fishingZone = await this.findOne(id);
    fishingZone.enable = !fishingZone.enable;
    return await this.fishingZoneRepository.save(fishingZone);
  }
}
