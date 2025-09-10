import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from '../entities/group.entity';
import { Group } from '../../../../domain/group';
import { GroupMapper } from '../mappers/group.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly groupMapper: GroupMapper,
  ) {}

  async findById(id: string): Promise<NullableType<Group>> {
    const entity = await this.groupRepository.findOne({
      where: { id },
    });
    return entity ? this.groupMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Group[]> {
    const entities = await this.groupRepository.find();
    return entities.map((entity) => this.groupMapper.toDomain(entity));
  }

  async create(data: Omit<Group, 'id'>): Promise<Group> {
    const entity = this.groupMapper.toEntity(data as Group);
    const savedEntity = await this.groupRepository.save(entity);
    return this.groupMapper.toDomain(savedEntity);
  }

  async update(
    id: string,
    payload: Partial<Omit<Group, 'id'>>,
  ): Promise<Group | null> {
    const entity = await this.groupRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, payload);
    const updatedEntity = await this.groupRepository.save(entity);
    return this.groupMapper.toDomain(updatedEntity);
  }

  async deleteById(id: string): Promise<void> {
    await this.groupRepository.delete({ id });
  }
}
