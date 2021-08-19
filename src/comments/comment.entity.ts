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
  import { Feed } from 'src/feeds/feed.entity';
  import { Like } from 'src/likes/like.entity';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn()
    id: string;
  
    @ManyToOne((type) => User, (user) => user.comments, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne((type) => Feed, (feed) => feed.comments, { nullable: false })
    @JoinColumn({ name: 'feed_id' })
    feed!: Feed;

    @OneToMany((type) => Like, (like) => like.feed)
    likes!: Like[];
  
    @Column({ nullable: false })
    contents: string;
    
    @CreateDateColumn() createdAt: Date;
  
    @UpdateDateColumn() updatedAt: Date;
  }
  