/**
 * @file syrian-payment-methods.service.ts
 * @description Syrian local payment methods service
 * 
 * SYRIAN PAYMENT FEATURES:
 * - Cash on Delivery (COD) - Primary payment method
 * - Bank transfers to Syrian banks
 * - Mobile payment solutions
 * - Installment payment plans
 * - Hawala and traditional transfer methods
 * - Diaspora-friendly payment options
 * 
 * @author SouqSyria Development Team
 * @since 2025-05-31
 */

import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

/**
 * Syrian payment method types
 */
export enum SyrianPaymentType {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_PAYMENT = 'mobile_payment',
  INSTALLMENTS = 'installments',
  HAWALA = 'hawala',
  CRYPTOCURRENCY = 'cryptocurrency',
  REMITTANCE = 'remittance',
  BARTER = 'barter',
}

/**
 * Payment status for Syrian context
 */
export enum SyrianPaymentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_TRANSIT = 'in_transit',
  RECEIVED = 'received',
  VERIFIED = 'verified',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded',
}

/**
 * Syrian bank information
 */
@Entity('syrian_banks')
export class SyrianBankEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Bank name in English
   */
  @Column({ length: 200 })
  nameEn: string;

  /**
   * Bank name in Arabic
   */
  @Column({ length: 200 })
  nameAr: string;

  /**
   * Bank code (SWIFT or local)
   */
  @Column({ length: 20, unique: true })
  @Index()
  bankCode: string;

  /**
   * Bank branches information
   */
  @Column({ type: 'json' })
  branches: Array<{
    name: string;
    nameAr: string;
    city: string;
    address: string;
    addressAr: string;
    phone?: string;
    isActive: boolean;
  }>;

  /**
   * Supported services
   */
  @Column({ type: 'json' })
  services: {
    domesticTransfers: boolean;
    internationalTransfers: boolean;
    usdAccounts: boolean;
    eurAccounts: boolean;
    onlineBanking: boolean;
    mobileBanking: boolean;
    atmNetwork: boolean;
  };

  /**
   * Transfer fees and limits
   */
  @Column({ type: 'json' })
  transferInfo: {
    domesticFee: number;        // SYP
    internationalFeeUSD: number; // USD
    dailyLimit: number;         // SYP
    monthlyLimit: number;       // SYP
    processingTime: string;     // "1-3 days"
    cutoffTime: string;         // "14:00"
  };

  /**
   * Current operational status
   */
  @Column({ type: 'json' })
  status: {
    isOperational: boolean;
    lastChecked: Date;
    restrictions?: string[];
    alternativeInstructions?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

/**
 * Syrian payment method configuration
 */
@Entity('syrian_payment_methods')
@Index(['type', 'isActive'])
export class SyrianPaymentMethodEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Payment method type
   */
  @Column({
    type: 'enum',
    enum: SyrianPaymentType,
  })
  @Index()
  type: SyrianPaymentType;

  /**
   * Method name in English
   */
  @Column({ length: 100 })
  nameEn: string;

  /**
   * Method name in Arabic
   */
  @Column({ length: 100 })
  nameAr: string;

  /**
   * Description in English
   */
  @Column({ type: 'text' })
  descriptionEn: string;

  /**
   * Description in Arabic
   */
  @Column({ type: 'text' })
  descriptionAr: string;

  /**
   * Associated bank (if applicable)
   */
  @ManyToOne(() => SyrianBankEntity, { nullable: true })
  @JoinColumn({ name: 'bank_id' })
  bank: SyrianBankEntity;

  /**
   * Configuration specific to this payment method
   */
  @Column({ type: 'json' })
  configuration: {
    minimumAmount?: number;     // SYP
    maximumAmount?: number;     // SYP
    processingFee?: number;     // SYP or percentage
    processingTime?: string;    // "immediate", "1-3 days"
    
    // For COD
    codFee?: number;
    codMaxAmount?: number;
    codAvailableAreas?: string[];
    
    // For bank transfers
    accountNumber?: string;
    iban?: string;
    swiftCode?: string;
    beneficiaryName?: string;
    
    // For mobile payments
    phoneNumber?: string;
    providerId?: string;
    
    // For installments
    installmentPlans?: Array<{
      months: number;
      interestRate: number;
      minimumAmount: number;
    }>;
    
    // For hawala
    hawalaAgents?: Array<{
      name: string;
      location: string;
      contactInfo: string;
    }>;
    
    // For remittance
    supportedCountries?: string[];
    exchangeRateMargin?: number;
  };

  /**
   * Supported currencies
   */
  @Column({ type: 'json', default: '["SYP"]' })
  supportedCurrencies: string[];

  /**
   * Geographic availability
   */
  @Column({ type: 'json' })
  availability: {
    governorates: string[];
    cities?: string[];
    restrictions?: string[];
    specialInstructions?: Record<string, string>;
  };

  /**
   * Risk and compliance settings
   */
  @Column({ type: 'json' })
  compliance: {
    kycRequired: boolean;
    documentationRequired: string[];
    transactionLimits: {
      daily: number;
      monthly: number;
      annual: number;
    };
    sanctionsCompliance: boolean;
    amlChecks: boolean;
  };

  /**
   * User experience settings
   */
  @Column({ type: 'json' })
  userExperience: {
    displayOrder: number;
    icon: string;
    color: string;
    trustLevel: number; // 1-10
    popularityScore: number;
    userRating: number;
    estimatedPopularity: string; // "very_high", "high", "medium", "low"
  };

  /**
   * Integration details
   */
  @Column({ type: 'json', nullable: true })
  integration: {
    apiEndpoint?: string;
    webhookUrl?: string;
    credentials?: Record<string, string>;
    testMode?: boolean;
    lastHealthCheck?: Date;
    uptime?: number; // percentage
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

/**
 * Payment method selection result
 */
interface PaymentMethodSelection {
  method: SyrianPaymentMethodEntity;
  isAvailable: boolean;
  estimatedCost: number;
  processingTime: string;
  requirements: string[];
  instructions: {
    en: string;
    ar: string;
  };
  warnings?: string[];
}

@Injectable()
export class SyrianPaymentMethodsService {
  private readonly logger = new Logger(SyrianPaymentMethodsService.name);

  constructor(
    @InjectRepository(SyrianBankEntity)
    private bankRepo: Repository<SyrianBankEntity>,

    @InjectRepository(SyrianPaymentMethodEntity)
    private paymentMethodRepo: Repository<SyrianPaymentMethodEntity>,
  ) {
    this.initializeSyrianPaymentMethods();
  }

  /**
   * Initialize Syrian payment methods
   */
  private async initializeSyrianPaymentMethods(): Promise<void> {
    try {
      const existingMethods = await this.paymentMethodRepo.count();
      if (existingMethods > 0) {
        this.logger.log('Syrian payment methods already initialized');
        return;
      }

      // Initialize banks first
      await this.initializeSyrianBanks();

      // Initialize payment methods
      const paymentMethods = [
        {
          type: SyrianPaymentType.CASH_ON_DELIVERY,
          nameEn: 'Cash on Delivery',
          nameAr: 'الدفع عند الاستلام',
          descriptionEn: 'Pay in cash when you receive your order. Most trusted payment method in Syria.',
          descriptionAr: 'ادفع نقداً عند استلام طلبك. الطريقة الأكثر أماناً وثقة في سوريا.',
          configuration: {
            codFee: 500, // 500 SYP
            codMaxAmount: 5000000, // 5M SYP
            codAvailableAreas: ['Damascus', 'Aleppo', 'Homs', 'Hama', 'Latakia', 'Tartus'],
            processingTime: 'immediate',
          },
          supportedCurrencies: ['SYP'],
          availability: {
            governorates: ['DIM', 'ALE', 'HMS', 'HAM', 'LAT', 'TAR', 'DAR'],
          },
          compliance: {
            kycRequired: false,
            documentationRequired: [],
            transactionLimits: {
              daily: 2000000,
              monthly: 10000000,
              annual: 50000000,
            },
            sanctionsCompliance: false,
            amlChecks: false,
          },
          userExperience: {
            displayOrder: 1,
            icon: 'cash',
            color: '#28a745',
            trustLevel: 10,
            popularityScore: 95,
            userRating: 4.8,
            estimatedPopularity: 'very_high',
          },
        },
        {
          type: SyrianPaymentType.BANK_TRANSFER,
          nameEn: 'Bank Transfer',
          nameAr: 'حوالة مصرفية',
          descriptionEn: 'Transfer money directly to our Syrian bank account. Secure and traceable.',
          descriptionAr: 'حول الأموال مباشرة إلى حسابنا المصرفي السوري. آمن وقابل للتتبع.',
          configuration: {
            minimumAmount: 50000, // 50K SYP
            maximumAmount: 50000000, // 50M SYP
            processingFee: 1000, // 1K SYP
            processingTime: '1-3 days',
            accountNumber: '123456789',
            beneficiaryName: 'SouqSyria Trading Company',
          },
          supportedCurrencies: ['SYP', 'USD'],
          availability: {
            governorates: ['DIM', 'ALE', 'HMS', 'HAM', 'LAT', 'TAR'],
          },
          compliance: {
            kycRequired: true,
            documentationRequired: ['ID copy', 'Bank statement'],
            transactionLimits: {
              daily: 10000000,
              monthly: 50000000,
              annual: 200000000,
            },
            sanctionsCompliance: true,
            amlChecks: true,
          },
          userExperience: {
            displayOrder: 2,
            icon: 'bank',
            color: '#007bff',
            trustLevel: 9,
            popularityScore: 70,
            userRating: 4.3,
            estimatedPopularity: 'high',
          },
        },
        {
          type: SyrianPaymentType.MOBILE_PAYMENT,
          nameEn: 'Mobile Payment',
          nameAr: 'الدفع عبر الهاتف المحمول',
          descriptionEn: 'Pay using your mobile phone. Quick and convenient for small amounts.',
          descriptionAr: 'ادفع باستخدام هاتفك المحمول. سريع ومريح للمبالغ الصغيرة.',
          configuration: {
            minimumAmount: 1000, // 1K SYP
            maximumAmount: 1000000, // 1M SYP
            processingFee: 100, // 100 SYP
            processingTime: 'immediate',
            phoneNumber: '+963-XX-XXXX-XXX',
            providerId: 'syrian_mobile_pay',
          },
          supportedCurrencies: ['SYP'],
          availability: {
            governorates: ['DIM', 'ALE'],
            restrictions: ['Limited coverage area'],
          },
          compliance: {
            kycRequired: false,
            documentationRequired: ['Phone verification'],
            transactionLimits: {
              daily: 500000,
              monthly: 2000000,
              annual: 10000000,
            },
            sanctionsCompliance: false,
            amlChecks: false,
          },
          userExperience: {
            displayOrder: 3,
            icon: 'mobile',
            color: '#17a2b8',
            trustLevel: 7,
            popularityScore: 40,
            userRating: 4.0,
            estimatedPopularity: 'medium',
          },
        },
        {
          type: SyrianPaymentType.INSTALLMENTS,
          nameEn: 'Installment Payment',
          nameAr: 'الدفع بالأقساط',
          descriptionEn: 'Pay in monthly installments. Perfect for larger purchases.',
          descriptionAr: 'ادفع على أقساط شهرية. مثالي للمشتريات الكبيرة.',
          configuration: {
            minimumAmount: 500000, // 500K SYP
            maximumAmount: 20000000, // 20M SYP
            processingFee: 5, // 5% processing fee
            processingTime: '1-5 days',
            installmentPlans: [
              { months: 3, interestRate: 0, minimumAmount: 500000 },
              { months: 6, interestRate: 2, minimumAmount: 1000000 },
              { months: 12, interestRate: 5, minimumAmount: 2000000 },
            ],
          },
          supportedCurrencies: ['SYP'],
          availability: {
            governorates: ['DIM', 'ALE', 'HMS'],
          },
          compliance: {
            kycRequired: true,
            documentationRequired: ['ID copy', 'Income proof', 'Employment certificate'],
            transactionLimits: {
              daily: 5000000,
              monthly: 20000000,
              annual: 100000000,
            },
            sanctionsCompliance: true,
            amlChecks: true,
          },
          userExperience: {
            displayOrder: 4,
            icon: 'calendar',
            color: '#ffc107',
            trustLevel: 8,
            popularityScore: 25,
            userRating: 4.2,
            estimatedPopularity: 'medium',
          },
        },
        {
          type: SyrianPaymentType.HAWALA,
          nameEn: 'Hawala Transfer',
          nameAr: 'حوالة تقليدية',
          descriptionEn: 'Traditional money transfer system. Widely trusted in Syrian communities.',
          descriptionAr: 'نظام الحوالات التقليدي. موثوق به في المجتمعات السورية.',
          configuration: {
            minimumAmount: 10000, // 10K SYP
            maximumAmount: 10000000, // 10M SYP
            processingFee: 2, // 2%
            processingTime: '1-2 days',
            hawalaAgents: [
              { name: 'Al-Amin Hawala', location: 'Damascus Old City', contactInfo: '+963-XX-XXX-XXXX' },
              { name: 'Aleppo Money Exchange', location: 'Aleppo Souq', contactInfo: '+963-XX-XXX-XXXX' },
            ],
          },
          supportedCurrencies: ['SYP', 'USD'],
          availability: {
            governorates: ['DIM', 'ALE', 'HMS', 'HAM'],
            specialInstructions: {
              'DIM': 'Available in Old Damascus and Mezzeh areas',
              'ALE': 'Available in traditional markets',
            },
          },
          compliance: {
            kycRequired: true,
            documentationRequired: ['ID copy', 'Contact verification'],
            transactionLimits: {
              daily: 5000000,
              monthly: 20000000,
              annual: 100000000,
            },
            sanctionsCompliance: true,
            amlChecks: true,
          },
          userExperience: {
            displayOrder: 5,
            icon: 'handshake',
            color: '#fd7e14',
            trustLevel: 9,
            popularityScore: 60,
            userRating: 4.5,
            estimatedPopularity: 'high',
          },
        },
      ];

      for (const methodData of paymentMethods) {
        const method = this.paymentMethodRepo.create(methodData);
        await this.paymentMethodRepo.save(method);
      }

      this.logger.log(`Initialized ${paymentMethods.length} Syrian payment methods`);
    } catch (error) {
      this.logger.error('Failed to initialize Syrian payment methods', error.stack);
    }
  }

  /**
   * Initialize Syrian banks
   */
  private async initializeSyrianBanks(): Promise<void> {
    const syrianBanks = [
      {
        nameEn: 'Central Bank of Syria',
        nameAr: 'مصرف سوريا المركزي',
        bankCode: 'CBS001',
        branches: [
          { 
            name: 'Main Branch', 
            nameAr: 'الفرع الرئيسي',
            city: 'Damascus', 
            address: 'Sabaa Bahrat Square', 
            addressAr: 'ساحة السبع بحرات',
            isActive: true 
          },
        ],
        services: {
          domesticTransfers: true,
          internationalTransfers: true,
          usdAccounts: true,
          eurAccounts: false,
          onlineBanking: false,
          mobileBanking: false,
          atmNetwork: true,
        },
        transferInfo: {
          domesticFee: 500,
          internationalFeeUSD: 25,
          dailyLimit: 5000000,
          monthlyLimit: 50000000,
          processingTime: '1-3 days',
          cutoffTime: '14:00',
        },
        status: {
          isOperational: true,
          lastChecked: new Date(),
        },
      },
      {
        nameEn: 'Commercial Bank of Syria',
        nameAr: 'المصرف التجاري السوري',
        bankCode: 'CBS002',
        branches: [
          { 
            name: 'Damascus Branch', 
            nameAr: 'فرع دمشق',
            city: 'Damascus', 
            address: 'Martyrs Square', 
            addressAr: 'ساحة الشهداء',
            isActive: true 
          },
          { 
            name: 'Aleppo Branch', 
            nameAr: 'فرع حلب',
            city: 'Aleppo', 
            address: 'Aziziyeh District', 
            addressAr: 'حي العزيزية',
            isActive: true 
          },
        ],
        services: {
          domesticTransfers: true,
          internationalTransfers: false,
          usdAccounts: true,
          eurAccounts: false,
          onlineBanking: true,
          mobileBanking: false,
          atmNetwork: true,
        },
        transferInfo: {
          domesticFee: 300,
          internationalFeeUSD: 0,
          dailyLimit: 2000000,
          monthlyLimit: 20000000,
          processingTime: '1-2 days',
          cutoffTime: '15:00',
        },
        status: {
          isOperational: true,
          lastChecked: new Date(),
        },
      },
    ];

    for (const bankData of syrianBanks) {
      const bank = this.bankRepo.create(bankData);
      await this.bankRepo.save(bank);
    }
  }

  /**
   * Get available payment methods for an order
   */
  async getAvailablePaymentMethods(
    amount: number,
    currency: string = 'SYP',
    customerLocation?: { governorate: string; city?: string },
  ): Promise<PaymentMethodSelection[]> {
    const activeMethods = await this.paymentMethodRepo.find({
      where: { isActive: true },
      relations: ['bank'],
      order: { userExperience: { displayOrder: 'ASC' } },
    });

    const availableMethods: PaymentMethodSelection[] = [];

    for (const method of activeMethods) {
      const selection = await this.evaluatePaymentMethod(
        method,
        amount,
        currency,
        customerLocation,
      );
      
      if (selection.isAvailable) {
        availableMethods.push(selection);
      }
    }

    return availableMethods;
  }

  /**
   * Get specific payment method details
   */
  async getPaymentMethodDetails(id: number): Promise<SyrianPaymentMethodEntity> {
    const method = await this.paymentMethodRepo.findOne({
      where: { id, isActive: true },
      relations: ['bank'],
    });

    if (!method) {
      throw new NotFoundException(`Payment method ${id} not found`);
    }

    return method;
  }

  /**
   * Calculate payment fees
   */
  async calculatePaymentFees(
    methodId: number,
    amount: number,
    currency: string = 'SYP',
  ): Promise<{ baseFee: number; percentageFee: number; totalFee: number }> {
    const method = await this.getPaymentMethodDetails(methodId);
    
    let baseFee = 0;
    let percentageFee = 0;

    if (method.configuration.processingFee) {
      if (typeof method.configuration.processingFee === 'number') {
        if (method.configuration.processingFee < 1) {
          // Percentage fee
          percentageFee = amount * method.configuration.processingFee;
        } else {
          // Fixed fee
          baseFee = method.configuration.processingFee;
        }
      }
    }

    // Add method-specific fees
    if (method.type === SyrianPaymentType.CASH_ON_DELIVERY) {
      baseFee += method.configuration.codFee || 0;
    }

    const totalFee = baseFee + percentageFee;

    return {
      baseFee: Math.round(baseFee),
      percentageFee: Math.round(percentageFee),
      totalFee: Math.round(totalFee),
    };
  }

  /**
   * Get popular payment methods
   */
  async getPopularPaymentMethods(): Promise<SyrianPaymentMethodEntity[]> {
    return this.paymentMethodRepo.find({
      where: { isActive: true },
      order: { 
        userExperience: { popularityScore: 'DESC' },
      },
      take: 5,
    });
  }

  /**
   * PRIVATE METHODS
   */

  private async evaluatePaymentMethod(
    method: SyrianPaymentMethodEntity,
    amount: number,
    currency: string,
    customerLocation?: { governorate: string; city?: string },
  ): Promise<PaymentMethodSelection> {
    const config = method.configuration;
    const warnings: string[] = [];
    let isAvailable = true;

    // Check currency support
    if (!method.supportedCurrencies.includes(currency)) {
      isAvailable = false;
    }

    // Check amount limits
    if (config.minimumAmount && amount < config.minimumAmount) {
      isAvailable = false;
    }
    if (config.maximumAmount && amount > config.maximumAmount) {
      isAvailable = false;
    }

    // Check geographic availability
    if (customerLocation && method.availability.governorates) {
      if (!method.availability.governorates.includes(customerLocation.governorate)) {
        isAvailable = false;
      }
    }

    // Calculate fees
    const fees = await this.calculatePaymentFees(method.id, amount, currency);

    // Generate instructions
    const instructions = this.generatePaymentInstructions(method, amount, currency);

    // Add warnings for special conditions
    if (method.type === SyrianPaymentType.CASH_ON_DELIVERY && amount > 1000000) {
      warnings.push('Large COD orders may require additional verification');
    }

    return {
      method,
      isAvailable,
      estimatedCost: fees.totalFee,
      processingTime: config.processingTime || 'Unknown',
      requirements: method.compliance.documentationRequired,
      instructions,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  private generatePaymentInstructions(
    method: SyrianPaymentMethodEntity,
    amount: number,
    currency: string,
  ): { en: string; ar: string } {
    const config = method.configuration;

    switch (method.type) {
      case SyrianPaymentType.CASH_ON_DELIVERY:
        return {
          en: `Prepare ${amount} ${currency} in cash. Our delivery agent will collect payment upon delivery.`,
          ar: `احضر ${amount} ${currency} نقداً. سيقوم مندوب التوصيل بتحصيل المبلغ عند التسليم.`,
        };

      case SyrianPaymentType.BANK_TRANSFER:
        return {
          en: `Transfer ${amount} ${currency} to account: ${config.accountNumber}. Bank: ${method.bank?.nameEn || 'N/A'}`,
          ar: `حول ${amount} ${currency} إلى الحساب: ${config.accountNumber}. البنك: ${method.bank?.nameAr || 'غير محدد'}`,
        };

      case SyrianPaymentType.MOBILE_PAYMENT:
        return {
          en: `Send ${amount} ${currency} to mobile number: ${config.phoneNumber}`,
          ar: `أرسل ${amount} ${currency} إلى رقم الهاتف: ${config.phoneNumber}`,
        };

      default:
        return {
          en: `Follow the payment instructions for ${method.nameEn}`,
          ar: `اتبع تعليمات الدفع لـ ${method.nameAr}`,
        };
    }
  }
}