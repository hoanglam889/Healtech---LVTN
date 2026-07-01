import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('articles')
export class Articles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('varchar', { length: 100 })
  category: string;

  @Column('longtext')
  content: string;

  @Column('text', { nullable: true })
  imageUrl: string;

  @Column('varchar', { length: 100, nullable: true })
  authorName: string;

  @Column('boolean', { default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
