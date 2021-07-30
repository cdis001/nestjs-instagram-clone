import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { User } from 'src/users/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @Column('text', { nullable: true, array: true })
  photo: string[];

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthday: string;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
