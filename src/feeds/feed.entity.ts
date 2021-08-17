import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';
import { Like } from 'src/likes/like.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => User, (user) => user.feeds, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany((type) => Comment, (comment) => comment.feed)
  comments: Comment[];
  
  @OneToMany((type) => Like, (like) => like.feed)
  likes!: Like[];

  @Column('text', { nullable: false, array: true })
  files: string[];

  @Column({ nullable: true })
  contents: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: false })
  isHide: boolean;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
