import {Column, PrimaryGeneratedColumn } from "typeorm";

export class AbstractEntity<T> {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;
  
    @Column({ default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    constructor(entity: Partial<T>){
        Object.assign(this, entity);
    }
}