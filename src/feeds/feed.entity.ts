import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
