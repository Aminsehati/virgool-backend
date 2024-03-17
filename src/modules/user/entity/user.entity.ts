import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserStatus, Gender } from '../types/user.type';
import { Profile } from './profile.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, unique: true })
    mobile?: string;

    @Column({ nullable: true, unique: true, })
    email?: string;

    @Column({ nullable: true, unique: true })
    username: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    @Column({ nullable: true })
    profileId: number

    @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn()
    profile: Profile

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.PENDING, // You can set a default status if needed
    })
    status: UserStatus;
}