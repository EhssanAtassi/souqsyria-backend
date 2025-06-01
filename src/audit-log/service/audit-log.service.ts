import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';

/**
 * The AuditLogService is a globally available service
 * to log actions across modules.
 */
@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  /**
   * Create a new log entry in the audit log table.
   * Should be called after every important or sensitive change.
   */
  async log(createDto: CreateAuditLogDto): Promise<AuditLog> {
    const entry = this.repo.create(createDto);
    return this.repo.save(entry);
  }

  /**
   * Return all audit logs in the system.
   */
  async findAll(): Promise<AuditLog[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Return logs filtered by actor (admin/user/vendor)
   */
  async findByActor(actorId: number): Promise<AuditLog[]> {
    return this.repo.find({ where: { actorId }, order: { createdAt: 'DESC' } });
  }
}
