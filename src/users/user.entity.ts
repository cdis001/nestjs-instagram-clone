import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Feed } from 'src/feeds/feed.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToMany((type) => Feed, (feed) => feed.user)
  feeds: Feed[];

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column()
  userName: string;

  @Column({ nullable: false, unique: true })
  accountName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  birthday: string;

  // Exclude를 이용해 민감한 데이터를 응답에서 제외
  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
