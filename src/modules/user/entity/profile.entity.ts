import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../types/user.type';
import { User } from './user.entity';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    nickName: string

    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.NONE, // You can set a default status if needed
    })
    gender: Gender;

    @Column({ nullable: true })
    birthDay: Date

    @Column({ nullable: true })
    linkedinProfile: string

    @Column({ nullable: true })
    xProfile: string

    @Column({ nullable: true })
    bio: string

    @Column({ nullable: true })
    profileImage: string


    @Column({ nullable: true })
    userId: number

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    user: User


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}