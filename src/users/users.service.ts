import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Find an existing user by Firebase UID or create a new one with default role
   * @param firebaseUser { uid: string, email?: string, phone?: string }
   */
  async findOrCreateByFirebaseUid(firebaseUser: {
    uid: string;
    email?: string;
    phone?: string;
  }): Promise<User> {
    this.logger.log(`Checking user existence for UID: ${firebaseUser.uid}`);

    let user = await this.userRepository.findOne({
      where: { firebaseUid: firebaseUser.uid },
      relations: ['role'],
    });

    if (!user) {
      this.logger.log(`User already exists with ID: ${user.id}`);
      const defaultRole = await this.roleRepository.findOne({
        where: { name: 'buyer' },
      });
      this.logger.log(`User not found. Creating new user...`);
      if (!defaultRole) {
        this.logger.error(`Default role "buyer" not found`);
        throw new Error('Default role "buyer" not found');
      }

      user = this.userRepository.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        phone: firebaseUser.phone,
        role: defaultRole,
      });
      const savedUser = await this.userRepository.save(user);
      this.logger.log(`New user created with ID: ${savedUser.id}`);
    }

    return user;
  }
}
