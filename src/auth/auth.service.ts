/**
 * @file auth.service.ts
 * @description Business logic for user registration, login, OTP verification, and JWT token generation.
 */
import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginLog } from './entity/login-log.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(LoginLog)
    private readonly loginLogRepository: Repository<LoginLog>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user with email/password
   */
  async register(registerDto: RegisterDto): Promise<void> {
    const { email, password } = registerDto;
    this.logger.log(`Registering new user: ${email}`);

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit OTP

    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'buyer' },
    });
    if (!defaultRole) {
      throw new Error('Default role buyer not found');
    }

    const user = this.userRepository.create({
      email,
      passwordHash,
      otpCode,
      isVerified: false,
      role: defaultRole,
    });

    await this.userRepository.save(user);

    // Here: send OTP to email via external service (mocked for now)
    this.logger.log(
      `User registered. OTP sent to email: ${email}. OTP: ${otpCode}`,
    );
  }

  /**
   * Verify user OTP
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<void> {
    const { email, otpCode } = verifyOtpDto;
    this.logger.log(`Verifying OTP for email: ${email}`);

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Invalid email.');
    }

    if (user.isVerified) {
      throw new BadRequestException('Account already verified.');
    }

    if (user.otpCode !== otpCode) {
      throw new BadRequestException('Invalid OTP code.');
    }

    user.isVerified = true;
    user.otpCode = null;
    await this.userRepository.save(user);

    this.logger.log(`Email verified successfully for: ${email}`);
  }

  /**
   * Authenticate a user using email and password.
   * Validates credentials, ensures account is verified,
   * and returns a signed JWT access token upon success.
   * Also logs the login attempt.
   */
  async login(
    loginDto: LoginDto,
    request: Request,
  ): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    this.logger.log(`Login attempt for email: ${email}`);

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
    // Block access for soft-deleted users
    if (!user || user.deletedAt) {
      throw new UnauthorizedException(
        'Invalid credentials or deleted account.',
      );
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your account first.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    /**
     * Block login for banned users and optionally warn for suspended users.
     * These checks help prevent access from malicious or misbehaving accounts.
     */
    if (user.isBanned) {
      this.logger.warn(`Login blocked for banned user: ${email}`);
      throw new UnauthorizedException('This account has been banned.');
    }

    if (user.isSuspended) {
      this.logger.warn(`Login attempt from suspended user: ${email}`);
      // Optionally allow login but disable access to protected features
      // For now we allow login, you can restrict access in guards or controllers
    }

    const payload = { sub: user.id, role: user.role.name, email: user.email };

    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Login successful for user ID: ${user.id}`);

    /**
     * Update the user's last login timestamp and prepare to save the login audit log.
     * This is essential for auditing and detecting unusual login activity.
     */
    // Save the login log (in real use, request context should pass IP and user-agent)
    await this.loginLogRepository.save({
      user,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'] || 'unknown',
    });

    // Optionally update lastLoginAt
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return { accessToken };
  }
}
