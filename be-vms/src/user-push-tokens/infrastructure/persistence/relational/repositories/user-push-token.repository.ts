import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPushTokenEntity } from '../entities/user-push-token.entity';
import { UserPushToken } from '../../../../domain/user-push-token';
import { UserPushTokenMapper } from '../mappers/user-push-token.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class UserPushTokenRepository {
  constructor(
    @InjectRepository(UserPushTokenEntity)
    private readonly userPushTokenRepository: Repository<UserPushTokenEntity>,
    private readonly userPushTokenMapper: UserPushTokenMapper,
  ) {}

  async findById(id: string): Promise<NullableType<UserPushToken>> {
    const entity = await this.userPushTokenRepository.findOne({
      where: { id },
    });
    return entity ? this.userPushTokenMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<UserPushToken[]> {
    const entities = await this.userPushTokenRepository.find({
      where: { userid: userId },
    });
    return entities.map((entity) => this.userPushTokenMapper.toDomain(entity));
  }

  async findByPushToken(
    pushToken: string,
  ): Promise<NullableType<UserPushToken>> {
    const entity = await this.userPushTokenRepository.findOne({
      where: { push_token: pushToken },
    });
    return entity ? this.userPushTokenMapper.toDomain(entity) : null;
  }

  async create(data: Omit<UserPushToken, 'id'>): Promise<UserPushToken> {
    const entity = this.userPushTokenMapper.toEntity(data as UserPushToken);
    const savedEntity = await this.userPushTokenRepository.save(entity);
    return this.userPushTokenMapper.toDomain(savedEntity);
  }

  async update(
    id: string,
    payload: Partial<Omit<UserPushToken, 'id'>>,
  ): Promise<UserPushToken | null> {
    const entity = await this.userPushTokenRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, payload);
    const updatedEntity = await this.userPushTokenRepository.save(entity);
    return this.userPushTokenMapper.toDomain(updatedEntity);
  }

  async deleteById(id: string): Promise<void> {
    await this.userPushTokenRepository.delete({ id });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.userPushTokenRepository.delete({ userid: userId });
  }
}
