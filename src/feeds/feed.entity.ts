import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/users/user.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne((type) => User, (user) => user.feeds)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ nullable: false })
  contents: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
