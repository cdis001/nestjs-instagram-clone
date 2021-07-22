import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Feed } from 'src/feeds/feed.entity';
import { Comment } from 'src/comments/comment.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => User, (user) => user.likes)
  user: User;

  @ManyToOne((type) => Feed, (feed) => feed.likes)
  feed: Feed;

  @ManyToOne((type) => Comment, (commnet) => commnet.likes)
  comment: Comment;

  @Column({default: false})
  active: boolean;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
