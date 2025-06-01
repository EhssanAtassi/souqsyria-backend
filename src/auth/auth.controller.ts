/**
 * @file auth.controller.ts
 * @description Authentication Controller to handle login using Firebase ID Token.
 * Syncs users with MySQL and returns profile.
 */
import {
  Controller,
  Get,
  UseGuards,
  Logger,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  /**
   * @route POST /auth/register
   * @description Register new user
   */
  @ApiOperation({ summary: 'Register new user with email and password' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return {
      success: true,
      message: 'Registration successful. Please check your email for OTP.',
    };
  }
  /**
   * @route POST /auth/verify
   * @description Verify user OTP
   */

  @ApiOperation({ summary: 'Verify user email using OTP' })
  @Post('verify')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.authService.verifyOtp(verifyOtpDto);
    return {
      success: true,
      message: 'Account verified successfully.',
    };
  }

  /**
   * @route POST /auth/login
   * @description Login user and return JWT
   */
  @ApiOperation({ summary: 'Login with email and password' })
  @Post('email-login')
  async email_login(@Body() loginDto: LoginDto, @Req() request: Request) {
    const token = await this.authService.login(loginDto, request);
    return {
      success: true,
      message: 'Login successful.',
      accessToken: token.accessToken,
    };
  }

  /**
   * @route GET /auth/login
   * @description Sync user from Firebase to MySQL and return profile
   */
  @ApiOperation({ summary: 'Login using Firebase token (optional)' })
  @Get('firebase-login')
  @UseGuards(FirebaseAuthGuard)
  async firebase_login(
    @CurrentUser()
    firebaseUser: {
      uid: string;
      email?: string;
      phone?: string;
    },
  ) {
    this.logger.log(`Login attempt for Firebase UID: ${firebaseUser.uid}`);

    try {
      const user =
        await this.usersService.findOrCreateByFirebaseUid(firebaseUser);
      this.logger.log(`Login successful for user ID: ${user.id}`);
      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          fullName: user.fullName,
          role: user.role?.name,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Login failed',
      };
    }
  }
}
