import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { Report } from '../reports/entities/report.entity';
import { UserPushTokenEntity } from '../user-push-tokens/infrastructure/persistence/relational/entities/user-push-token.entity';
import { NullableType } from '../utils/types/nullable.type';
import { User } from './domain/user';
import { UserRepository } from './infrastructure/persistence/relational/repositories/user.repository';
import { FindAllUsersOptions, FindAllUsersResult } from './types';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(UserPushTokenEntity)
    private readonly pushTokenRepository: Repository<UserPushTokenEntity>,
  ) {}

  findAll(options: FindAllUsersOptions): Promise<FindAllUsersResult> {
    return this.userRepository.findAll(options);
  }

  async findUsersWithPagination(
    page: number,
    limit: number,
    sortBy: string = 'id',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<[User[], number]> {
    const options: FindAllUsersOptions = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    const result = await this.userRepository.findAll(options);
    return [result.data, result.total];
  }

  findById(id: string): Promise<NullableType<User>> {
    return this.userRepository.findById(id);
  }

  findByUsername(username: string): Promise<NullableType<User>> {
    return this.userRepository.findByUsername(username);
  }

  findByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<NullableType<User>> {
    return this.userRepository.findByUsernameAndPassword(username, password);
  }

  findByPhoneAndPassword(
    phone: string,
    password: string,
  ): Promise<NullableType<User>> {
    return this.userRepository.findByPhoneAndPassword(phone, password);
  }

  findByPhone(phone: string): Promise<NullableType<User>> {
    return this.userRepository.findByPhone(phone);
  }

  create(data: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.create(data);
  }

  update(id: string, payload: Partial<Omit<User, 'id'>>): Promise<User | null> {
    return this.userRepository.update(id, payload);
  }

  deleteById(id: string): Promise<void> {
    return this.userRepository.deleteById(id);
  }

  async toggleAccountStatus(userId: string): Promise<User> {
    return this.userRepository.toggleAccountStatus(userId);
  }

  async getUserStatistics(): Promise<{
    total_users: number;
    online_users: number;
    users_with_reports: number;
    users_with_feedbacks: number;
  }> {
    // total users
    const { total: total_users } = await this.userRepository.findAll({
      page: 1,
      limit: 1,
    });

    // users with push tokens (distinct by userid)
    const onlineUsersRaw = await this.pushTokenRepository
      .createQueryBuilder('upt')
      .select('COUNT(DISTINCT upt.userid)', 'count')
      .getRawOne<{ count: string }>();
    const online_users = parseInt(onlineUsersRaw?.count || '0', 10);

    // users that have at least one report
    const usersWithReportsRaw = await this.reportRepository
      .createQueryBuilder('r')
      .select('COUNT(DISTINCT r.reporter_user_id)', 'count')
      .where('r.reporter_user_id IS NOT NULL')
      .getRawOne<{ count: string }>();
    const users_with_reports = parseInt(usersWithReportsRaw?.count || '0', 10);

    // users that have at least one feedback
    const usersWithFeedbacksRaw = await this.feedbackRepository
      .createQueryBuilder('f')
      .select('COUNT(DISTINCT f.reporter_id)', 'count')
      .getRawOne<{ count: string }>();
    const users_with_feedbacks = parseInt(
      usersWithFeedbacksRaw?.count || '0',
      10,
    );

    return {
      total_users,
      online_users,
      users_with_reports,
      users_with_feedbacks,
    };
  }
}
