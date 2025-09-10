import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback, FeedbackStatus } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { SortOrder } from '../utils';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return await this.feedbackRepository.save(feedback);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: FeedbackStatus,
    reporter_id?: string,
  ): Promise<{ data: Feedback[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.reporter', 'reporter')
      .orderBy('feedback.created_at', 'DESC');

    if (status) {
      queryBuilder.andWhere('feedback.status = :status', { status });
    }

    if (reporter_id) {
      queryBuilder.andWhere('feedback.reporter_id = :reporter_id', {
        reporter_id,
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

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['reporter'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    const feedback = await this.findOne(id);
    Object.assign(feedback, updateFeedbackDto);
    return await this.feedbackRepository.save(feedback);
  }

  async remove(id: string): Promise<void> {
    const feedback = await this.findOne(id);
    await this.feedbackRepository.remove(feedback);
  }

  async updateStatus(id: string, status: FeedbackStatus): Promise<Feedback> {
    const feedback = await this.findOne(id);
    feedback.status = status;
    return await this.feedbackRepository.save(feedback);
  }

  async getFeedbacksByReporter(reporter_id: string): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      where: { reporter_id },
      relations: ['reporter'],
      order: { created_at: 'DESC' },
    });
  }

  async getFeedbackStats(): Promise<{
    total: number;
    new: number;
    in_progress: number;
    resolved: number;
  }> {
    const [total, newCount, inProgressCount, resolvedCount] = await Promise.all(
      [
        this.feedbackRepository.count(),
        this.feedbackRepository.count({
          where: { status: FeedbackStatus.NEW },
        }),
        this.feedbackRepository.count({
          where: { status: FeedbackStatus.IN_PROGRESS },
        }),
        this.feedbackRepository.count({
          where: { status: FeedbackStatus.RESOLVED },
        }),
      ],
    );

    return {
      total,
      new: newCount,
      in_progress: inProgressCount,
      resolved: resolvedCount,
    };
  }

  async findFeedbacksWithPagination(
    userId: string,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder,
    status?: FeedbackStatus,
    q?: string,
    keySearch?: string,
  ): Promise<[any[], number]> {
    const queryBuilder = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.reporter', 'reporter');

    // Optional filter by userId
    if (userId) {
      queryBuilder.andWhere('feedback.reporter_id = :userId', { userId });
    }

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('feedback.status = :status', { status });
    }

    // Apply search filters
    if (q) {
      queryBuilder.andWhere(
        '(feedback.content LIKE :q OR reporter.username LIKE :q OR reporter.fullname LIKE :q)',
        { q: `%${q}%` },
      );
    }

    if (keySearch) {
      queryBuilder.andWhere(`feedback.${keySearch} LIKE :keySearch`, {
        keySearch: `%${keySearch}%`,
      });
    }

    // Apply sorting
    const allowedSortFields = ['created_at', 'updated_at', 'status', 'content'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    queryBuilder.orderBy(`feedback.${safeSortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Execute queries
    const [entities, total] = await queryBuilder.getManyAndCount();

    // Map to response format
    const feedbacks = entities.map((feedback) => ({
      id: feedback.id,
      content: feedback.content,
      status: feedback.status,
      created_at: feedback.created_at,
      updated_at: feedback.updated_at,
      reporter: feedback.reporter
        ? {
            id: feedback.reporter.id,
            username: feedback.reporter.username,
            fullname: feedback.reporter.fullname,
            phone: feedback.reporter.phone,
          }
        : null,
    }));

    return [feedbacks, total];
  }
}
