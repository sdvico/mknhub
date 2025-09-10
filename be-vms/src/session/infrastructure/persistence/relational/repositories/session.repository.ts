import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';
import { Session } from '../../../../domain/session';
import { SessionMapper } from '../mappers/session.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly sessionMapper: SessionMapper,
  ) {}

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const entity = await this.sessionRepository.findOne({
      where: { id: id as string },
      relations: ['user'],
    });
    return entity ? this.sessionMapper.toDomain(entity) : null;
  }

  async findByToken(token: string): Promise<NullableType<Session>> {
    const entity = await this.sessionRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    return entity ? this.sessionMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const entities = await this.sessionRepository.find({
      where: { userid: userId },
      relations: ['user'],
    });
    return entities.map((entity) => this.sessionMapper.toDomain(entity));
  }

  async create(data: Omit<Session, 'id'>): Promise<Session> {
    const entity = this.sessionMapper.toEntity(data as Session);
    const savedEntity = await this.sessionRepository.save(entity);
    return this.sessionMapper.toDomain(savedEntity);
  }

  async update(
    id: Session['id'],
    payload: Partial<Omit<Session, 'id'>>,
  ): Promise<Session | null> {
    const entity = await this.sessionRepository.findOne({
      where: { id: id as string },
    });

    if (!entity) {
      return null;
    }

    Object.assign(entity, payload);
    const updatedEntity = await this.sessionRepository.save(entity);
    return this.sessionMapper.toDomain(updatedEntity);
  }

  async deleteById(id: Session['id']): Promise<void> {
    await this.sessionRepository.delete({ id: id as string });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.sessionRepository.delete({ userid: userId });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.sessionRepository.delete({ token });
  }

  async deleteExpiredSessions(): Promise<void> {
    const now = new Date();
    await this.sessionRepository
      .createQueryBuilder()
      .delete()
      .where('expired_date < :now', { now })
      .execute();
  }
}
