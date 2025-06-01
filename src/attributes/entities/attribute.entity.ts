/**
 * @file attribute.entity.ts
 * @description Defines configurable product options like Color, Size.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AttributeValue } from './attribute-value.entity';

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., Color, Storage

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => AttributeValue, (value) => value.attribute)
  values: AttributeValue[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
