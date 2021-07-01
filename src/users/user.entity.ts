import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

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