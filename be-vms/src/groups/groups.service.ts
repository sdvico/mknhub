import { Injectable } from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { Group } from './domain/group';
import { GroupUserRepository } from './infrastructure/persistence/relational/repositories/group-user.repository';
import { GroupRepository } from './infrastructure/persistence/relational/repositories/group.repository';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly groupUserRepository: GroupUserRepository,
  ) {}

  async findById(id: string): Promise<NullableType<Group>> {
    return this.groupRepository.findById(id);
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepository.findAll();
  }

  async create(data: Omit<Group, 'id'>): Promise<Group> {
    return this.groupRepository.create(data);
  }

  async update(
    id: string,
    payload: Partial<Omit<Group, 'id'>>,
  ): Promise<Group | null> {
    return this.groupRepository.update(id, payload);
  }

  async deleteById(id: string): Promise<void> {
    return this.groupRepository.deleteById(id);
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const groupUsers = await this.groupUserRepository.findUserGroups(userId);
    const groupIds = groupUsers.map((gu) => gu.groupid);

    if (groupIds.length === 0) {
      return [];
    }

    const groups: Group[] = [];
    for (const groupId of groupIds) {
      const group = await this.findById(groupId);
      if (group) {
        groups.push(group);
      }
    }

    return groups;
  }
}
