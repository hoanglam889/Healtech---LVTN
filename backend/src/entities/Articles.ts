import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './Users';

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

  @Column('text', { name: 'image_url', nullable: true })
  image_url: string;

  @Column('varchar', { name: 'author_name', length: 100, nullable: true })
  author_name: string;

  @Column('boolean', { name: 'is_published', default: true })
  is_published: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column('int', { name: 'user_id', nullable: true })
  user_id: number;

  @ManyToOne(() => Users, (users) => users.articles, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
