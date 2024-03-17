import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CategoryStatus } from '../types/category.type';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, unique: true })
    name?: string;

    @Column({ nullable: true })
    priority: number

    @Column({ unique: true })
    slug: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: CategoryStatus,
        default: CategoryStatus.PENDING, // You can set a default status if needed
    })
    status: CategoryStatus;
}