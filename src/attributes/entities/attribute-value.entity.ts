/**
 * @file attribute-value.entity.ts
 * @description Value options under each Attribute (e.g., Red, 128GB, Size XL)
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity('attribute_values')
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attribute, (attribute) => attribute.values, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attribute_id' })
  attribute: Attribute;

  @Column()
  value: string; // e.g., Red, Blue, 128GB, XL

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
