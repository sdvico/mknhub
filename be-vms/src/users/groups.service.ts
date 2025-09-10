import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from '../groups/infrastructure/persistence/relational/entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async create(data: { name: string }): Promise<GroupEntity> {
    const group = this.groupRepository.create(data);
    return await this.groupRepository.save(group);
  }
}
