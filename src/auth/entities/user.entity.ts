import { timestamp } from "rxjs";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    hash: string;

    @Column()
    hashRt: string;

    @Column(timestamp)
    createdAt: Date;

    @Column(timestamp)
    updatedAt: Date;
}