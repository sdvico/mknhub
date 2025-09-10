import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupUserEntity } from '../entities/group-user.entity';
import { GroupUser } from '../../../../domain/group-user';
import { GroupUserMapper } from '../mappers/group-user.mapper';

@Injectable()
export class GroupUserRepository {
  constructor(
    @InjectRepository(GroupUserEntity)
    private readonly groupUserRepository: Repository<GroupUserEntity>,
    private readonly groupUserMapper: GroupUserMapper,
  ) {}

  async findByUserId(userId: string): Promise<GroupUser[]> {
    const entities = await this.groupUserRepository.find({
      where: { userid: userId },
      relations: ['group'],
    });
    return entities.map((entity) => this.groupUserMapper.toDomain(entity));
  }

  async findByGroupId(groupId: string): Promise<GroupUser[]> {
    const entities = await this.groupUserRepository.find({
      where: { groupid: groupId },
      relations: ['user'],
    });
    return entities.map((entity) => this.groupUserMapper.toDomain(entity));
  }

  async findUserGroups(userId: string): Promise<GroupUser[]> {
    const entities = await this.groupUserRepository.find({
      where: { userid: userId },
      relations: ['group'],
    });
    return entities.map((entity) => this.groupUserMapper.toDomain(entity));
  }

  async create(data: Omit<GroupUser, 'id'>): Promise<GroupUser> {
    const entity = this.groupUserMapper.toEntity(data as GroupUser);
    const savedEntity = await this.groupUserRepository.save(entity);
    return this.groupUserMapper.toDomain(savedEntity);
  }

  async deleteByUserIdAndGroupId(
    userId: string,
    groupId: string,
  ): Promise<void> {
    await this.groupUserRepository.delete({ userid: userId, groupid: groupId });
  }
}
