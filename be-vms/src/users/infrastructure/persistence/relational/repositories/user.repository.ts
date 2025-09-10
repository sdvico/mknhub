import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../../../domain/user';
import { UserMapper } from '../mappers/user.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FindAllUsersOptions, FindAllUsersResult } from '../../../../types';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userMapper: UserMapper,
  ) {}

  async findById(id: string): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });
    return entity ? this.userMapper.toDomain(entity) : null;
  }

  async findByUsername(username: string): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { username },
    });
    return entity ? this.userMapper.toDomain(entity) : null;
  }

  async findByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { username, password, enable: true },
    });
    return entity ? this.userMapper.toDomain(entity) : null;
  }

  async findByPhoneAndPassword(
    phone: string,
    password: string,
  ): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { phone, password, enable: true },
    });
    return entity ? this.userMapper.toDomain(entity) : null;
  }

  async toggleAccountStatus(id: string): Promise<User> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    entity.enable = !entity.enable;
    const savedEntity = await this.userRepository.save(entity);
    return this.userMapper.toDomain(savedEntity);
  }

  async findByPhone(phone: string): Promise<NullableType<User>> {
    const entity = await this.userRepository.findOne({
      where: { phone },
    });
    return entity ? this.userMapper.toDomain(entity) : null;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const entity = this.userMapper.toEntity(data as User);
    const savedEntity = await this.userRepository.save(entity);
    return this.userMapper.toDomain(savedEntity);
  }

  async update(
    id: string,
    payload: Partial<Omit<User, 'id'>>,
  ): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, payload);
    const updatedEntity = await this.userRepository.save(entity);
    return this.userMapper.toDomain(updatedEntity);
  }

  async deleteById(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }

  async findAll(options: FindAllUsersOptions): Promise<FindAllUsersResult> {
    const {
      page,
      limit,
      sortBy = 'id',
      sortOrder = 'ASC',
      search,
      username,
    } = options;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (username) {
      queryBuilder.where('(user.username LIKE :username)', {
        username: `%${username}%`,
      });
    }

    // Search functionality
    if (search) {
      queryBuilder.where(
        '(user.username LIKE :search OR user.fullname LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    const allowedSortFields = ['id', 'username', 'fullname', 'phone', 'state'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    queryBuilder.orderBy(`user.${safeSortBy}`, sortOrder);

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Execute queries
    const [entities, total] = await queryBuilder.getManyAndCount();

    // Map to domain objects
    const users = entities.map((entity) => this.userMapper.toDomain(entity));

    return {
      data: users,
      total,
    };
  }
}
