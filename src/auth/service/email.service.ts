import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  /**
   * Send password reset email with reset token
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    this.logger.log(`📧 Sending password reset email to: ${email}`);

    // TODO: We'll add the implementation here
    try {
      // 🔧 For now, log to console (since no SMTP configured)
      console.log('=== PASSWORD RESET EMAIL ===');
      console.log(`To: ${email}`);
      console.log(`Subject: SouqSyria - Password Reset Request`);
      console.log(`Reset Token: ${resetToken}`);
      console.log(`Expires: 15 minutes`);
      console.log('===========================');

      this.logger.log(`✅ Password reset email sent successfully to: ${email}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to send password reset email to: ${email}`,
        error.message,
      );
    }
  }

  /**
   * Send email verification with OTP code
   */
  async sendVerificationEmail(email: string, otpCode: string): Promise<void> {
    this.logger.log(`📧 Sending verification email to: ${email}`);
    try {
      // 🔧 For now, log to console (since no SMTP configured)
      console.log('=== VERIFICATION EMAIL ===');
      console.log(`To: ${email}`);
      console.log(`Subject: SouqSyria - Verify Your Email`);
      console.log(`OTP Code: ${otpCode}`);
      console.log('=========================');

      this.logger.log(`✅ Verification email sent successfully to: ${email}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to send verification email to: ${email}`,
        error.message,
      );
    }
    // TODO: We'll add the implementation here
  }
}
