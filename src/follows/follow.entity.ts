import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/users/user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => User, (user) => user.followers, { nullable: false })
  follower: User;

  @ManyToOne((type) => User, (user) => user.followings, { nullable: false })
  following: User;

  @Column({ default: false })
  checked: boolean;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
