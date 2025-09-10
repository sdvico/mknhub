import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherReport } from './entities/weather-report.entity';
import { CreateWeatherReportDto } from './dto/create-weather-report.dto';
import { UpdateWeatherReportDto } from './dto/update-weather-report.dto';
import { SortOrder } from '../utils';

@Injectable()
export class WeatherReportsService {
  constructor(
    @InjectRepository(WeatherReport)
    private readonly weatherReportRepository: Repository<WeatherReport>,
  ) {}

  async create(
    createWeatherReportDto: CreateWeatherReportDto,
  ): Promise<WeatherReport> {
    const now = new Date();
    const weatherReport = this.weatherReportRepository.create({
      ...createWeatherReportDto,
      published_at: createWeatherReportDto.published_at
        ? new Date(createWeatherReportDto.published_at)
        : undefined,
      created_at: now,
      updated_at: now,
    });
    return await this.weatherReportRepository.save(weatherReport);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    enable?: boolean,
    region?: string,
  ): Promise<{
    data: WeatherReport[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.weatherReportRepository
      .createQueryBuilder('weatherReport')
      .orderBy('weatherReport.published_at', 'DESC')
      .addOrderBy('weatherReport.created_at', 'DESC');

    if (enable !== undefined) {
      queryBuilder.andWhere('weatherReport.enable = :enable', { enable });
    }

    if (region) {
      queryBuilder.andWhere('weatherReport.region LIKE :region', {
        region: `%${region}%`,
      });
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

  async findOne(id: string): Promise<WeatherReport> {
    const weatherReport = await this.weatherReportRepository.findOne({
      where: { id },
    });

    if (!weatherReport) {
      throw new NotFoundException(`Weather report with ID ${id} not found`);
    }

    return weatherReport;
  }

  async update(
    id: string,
    updateWeatherReportDto: UpdateWeatherReportDto,
  ): Promise<WeatherReport> {
    const weatherReport = await this.findOne(id);

    if (updateWeatherReportDto.published_at) {
      updateWeatherReportDto.published_at = new Date(
        updateWeatherReportDto.published_at,
      ) as any;
    }

    Object.assign(weatherReport, {
      ...updateWeatherReportDto,
      updated_at: new Date(),
    });
    return await this.weatherReportRepository.save(weatherReport);
  }

  async remove(id: string): Promise<void> {
    const weatherReport = await this.findOne(id);
    await this.weatherReportRepository.remove(weatherReport);
  }

  async incrementViews(id: string): Promise<void> {
    await this.weatherReportRepository
      .createQueryBuilder()
      .update(WeatherReport)
      .set({ total_views: () => 'total_views + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async incrementClicks(id: string): Promise<void> {
    await this.weatherReportRepository
      .createQueryBuilder()
      .update(WeatherReport)
      .set({ total_clicks: () => 'total_clicks + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async getActiveWeatherReports(): Promise<WeatherReport[]> {
    return await this.weatherReportRepository.find({
      where: { enable: true },
      order: { published_at: 'DESC', created_at: 'DESC' },
    });
  }

  async getWeatherReportsByRegion(region: string): Promise<WeatherReport[]> {
    return await this.weatherReportRepository.find({
      where: { region, enable: true },
      order: { published_at: 'DESC', created_at: 'DESC' },
    });
  }

  async toggleEnable(id: string): Promise<WeatherReport> {
    const weatherReport = await this.findOne(id);
    weatherReport.enable = !weatherReport.enable;
    return await this.weatherReportRepository.save(weatherReport);
  }

  async getRegions(): Promise<string[]> {
    const regions = await this.weatherReportRepository
      .createQueryBuilder('weatherReport')
      .select('DISTINCT weatherReport.region', 'region')
      .where('weatherReport.enable = :enable', { enable: true })
      .getRawMany();

    return regions.map((r) => r.region);
  }

  async findWeatherReportsWithPagination(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
    enable?: boolean,
    region?: string,
    q?: string,
    keySearch?: string,
  ): Promise<[any[], number]> {
    const queryBuilder =
      this.weatherReportRepository.createQueryBuilder('weatherReport');

    // Apply filters
    if (enable !== undefined) {
      queryBuilder.andWhere('weatherReport.enable = :enable', { enable });
    }

    if (region) {
      queryBuilder.andWhere('weatherReport.region LIKE :region', {
        region: `%${region}%`,
      });
    }

    // Apply search filters
    if (q) {
      queryBuilder.andWhere(
        '(weatherReport.region LIKE :q OR weatherReport.summary LIKE :q OR weatherReport.advice LIKE :q)',
        { q: `%${q}%` },
      );
    }

    if (keySearch) {
      queryBuilder.andWhere(`weatherReport.${keySearch} LIKE :keySearch`, {
        keySearch: `%${keySearch}%`,
      });
    }

    // Apply sorting
    const allowedSortFields = [
      'created_at',
      'updated_at',
      'published_at',
      'region',
      'total_views',
      'total_clicks',
    ];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    queryBuilder.orderBy(`weatherReport.${safeSortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Execute queries
    const [entities, total] = await queryBuilder.getManyAndCount();

    // Map to response format
    const weatherReports = entities.map((weatherReport) => ({
      ...weatherReport,
      id: weatherReport.id,
      region: weatherReport.region,
      summary: weatherReport.summary,
      advice: weatherReport.advice,
      link: weatherReport.link,
      total_views: weatherReport.total_views,
      total_clicks: weatherReport.total_clicks,
      enable: weatherReport.enable,
      published_at: weatherReport.published_at,
      created_at: weatherReport.created_at,
      updated_at: weatherReport.updated_at,
    }));

    return [weatherReports, total];
  }
}
