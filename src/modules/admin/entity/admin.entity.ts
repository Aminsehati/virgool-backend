import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AdminRole, AdminStatus } from '../types/admin.type';
@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ unique: true })
    mobile?: string;

    @Column({ nullable: true })
    email?: string;

    @Column({})
    username: string

    @Column({
        type: 'enum',
        enum: AdminRole,
        default: AdminRole.ADMIN, // You can set a default status if needed
    })
    role: AdminRole;

    @Column({ nullable: true })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: AdminStatus,
        default: AdminStatus.PENDING, // You can set a default status if needed
    })
    status: AdminStatus;

}