import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

    @CreateDateColumn() createdAt: Date;
  
    @UpdateDateColumn() updatedAt: Date;
}