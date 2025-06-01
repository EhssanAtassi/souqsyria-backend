/**
 * @file user.entity.ts
 * @description User table synced from Firebase Auth. Used to assign app-specific roles and preferences.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Address } from '../../addresses/entities/address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firebase_uid', nullable: true, unique: true })
  firebaseUid: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;
  /**
   * * All addresses belonging to this user (address book)
   * */
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @Column({ nullable: true })
  fullName: string;
  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string; // ✅ For email/password login

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean; // ✅ After OTP verified

  @Column({ name: 'otp_code', nullable: true })
  otpCode: string; // ✅ Temporary OTP code

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role; // ✅ Normal Buyer / VendorEntity role

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'assigned_role_id' })
  assignedRole: Role; // ✅ Staff role (Marketing, Support, Accounting)
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'is_banned', default: false })
  isBanned: boolean; // ❌ Prevent login completely

  @Column({ name: 'is_suspended', default: false })
  isSuspended: boolean; // ⚠️ Allow limited read-only access if needed

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>; // 🧠 Optional dynamic data
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date; // 🧹 Soft delete support

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
