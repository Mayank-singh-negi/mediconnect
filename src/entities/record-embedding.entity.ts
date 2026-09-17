import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('record_embeddings')
export class RecordEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  recordId: string;

  @Column({ nullable: true })
  vectorId: string;
}
