import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  entity: string;

  @Column('uuid', { nullable: true })
  entityId: string;

  @CreateDateColumn()
  timestamp: Date;
}
