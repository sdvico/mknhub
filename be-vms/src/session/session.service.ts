import { Injectable } from '@nestjs/common';
import { SessionRepository } from './infrastructure/persistence/relational/repositories/session.repository';
import { Session } from './domain/session';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  findById(id: Session['id']): Promise<NullableType<Session>> {
    return this.sessionRepository.findById(id);
  }

  findByToken(token: string): Promise<NullableType<Session>> {
    return this.sessionRepository.findByToken(token);
  }

  findByUserId(userId: string): Promise<Session[]> {
    return this.sessionRepository.findByUserId(userId);
  }

  create(data: Omit<Session, 'id'>): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  update(
    id: Session['id'],
    payload: Partial<Omit<Session, 'id'>>,
  ): Promise<Session | null> {
    return this.sessionRepository.update(id, payload);
  }

  deleteById(id: Session['id']): Promise<void> {
    return this.sessionRepository.deleteById(id);
  }

  deleteByUserId(userId: string): Promise<void> {
    return this.sessionRepository.deleteByUserId(userId);
  }

  deleteByToken(token: string): Promise<void> {
    return this.sessionRepository.deleteByToken(token);
  }

  deleteExpiredSessions(): Promise<void> {
    return this.sessionRepository.deleteExpiredSessions();
  }
}
