/**
 * @file syrian-address.entity.ts
 * @description Syrian address system with governorates, cities, and districts
 * 
 * SYRIAN LOCALIZATION FEATURES:
 * - Official Syrian governorates and administrative divisions
 * - Bilingual support (Arabic/English) for all address components
 * - Postal code system compatible with Syrian postal service
 * - Geographic coordinates for delivery optimization
 * - Address validation and normalization
 * - Support for diaspora addresses with country-specific formats
 * 
 * @author SouqSyria Development Team
 * @since 2025-05-31
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';

/**
 * Address types for different use cases
 */
export enum AddressType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  GOVERNMENTAL = 'governmental',
  EDUCATIONAL = 'educational',
  MEDICAL = 'medical',
  DIPLOMATIC = 'diplomatic',
}

/**
 * Address status for validation and verification
 */
export enum AddressStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_VERIFICATION = 'pending_verification',
  VERIFIED = 'verified',
  DISPUTED = 'disputed',
}

/**
 * Syrian Governorates (المحافظات السورية)
 * Based on official Syrian administrative divisions
 */
@Entity('syrian_governorates')
@Index(['code'], { unique: true })
export class SyrianGovernorateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Official governorate code
   */
  @Column({ length: 3, unique: true })
  @Index()
  code: string;

  /**
   * Governorate name in English
   */
  @Column({ length: 100 })
  nameEn: string;

  /**
   * Governorate name in Arabic
   */
  @Column({ length: 100 })
  nameAr: string;

  /**
   * Capital city of the governorate
   */
  @Column({ length: 100 })
  capitalEn: string;

  /**
   * Capital city in Arabic
   */
  @Column({ length: 100 })
  capitalAr: string;

  /**
   * Geographic coordinates of governorate center
   */
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  /**
   * Population estimate
   */
  @Column({ type: 'int', nullable: true })
  population: number;

  /**
   * Area in square kilometers
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  areaKm2: number;

  /**
   * Current security and accessibility status
   */
  @Column({ type: 'json', nullable: true })
  status: {
    accessibilityLevel: 'full' | 'partial' | 'limited' | 'restricted';
    deliverySupported: boolean;
    lastUpdated: Date;
    notes?: string;
    alternativeRoutes?: string[];
  };

  /**
   * Economic and demographic data
   */
  @Column({ type: 'json', nullable: true })
  demographics: {
    urbanPopulation?: number;
    ruralPopulation?: number;
    mainIndustries?: string[];
    economicStatus?: 'active' | 'recovering' | 'limited';
    infrastructureLevel?: 'good' | 'fair' | 'poor';
  };

  /**
   * Display order for UI
   */
  @Column({ type: 'int', default: 100 })
  displayOrder: number;

  /**
   * Whether this governorate is currently active for services
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Cities in this governorate
   */
  @OneToMany(() => SyrianCityEntity, city => city.governorate)
  cities: SyrianCityEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

/**
 * Syrian Cities and Towns (المدن والبلدات السورية)
 */
@Entity('syrian_cities')
@Index(['governorate', 'nameEn'])
@Index(['governorate', 'nameAr'])
export class SyrianCityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Parent governorate
   */
  @ManyToOne(() => SyrianGovernorateEntity, governorate => governorate.cities)
  @JoinColumn({ name: 'governorate_id' })
  governorate: SyrianGovernorateEntity;

  /**
   * City name in English
   */
  @Column({ length: 100 })
  nameEn: string;

  /**
   * City name in Arabic
   */
  @Column({ length: 100 })
  nameAr: string;

  /**
   * Alternative names and spellings
   */
  @Column({ type: 'json', nullable: true })
  alternativeNames: {
    en?: string[];
    ar?: string[];
    transliterations?: string[];
    historicalNames?: string[];
  };

  /**
   * City type classification
   */
  @Column({
    type: 'enum',
    enum: ['city', 'town', 'village', 'suburb', 'district'],
    default: 'city',
  })
  cityType: string;

  /**
   * Geographic coordinates
   */
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  /**
   * Postal code prefix for this city
   */
  @Column({ length: 10, nullable: true })
  postalCodePrefix: string;

  /**
   * Population estimate
   */
  @Column({ type: 'int', nullable: true })
  population: number;

  /**
   * Delivery and logistics information
   */
  @Column({ type: 'json', nullable: true })
  logistics: {
    deliverySupported: boolean;
    averageDeliveryTime: number; // hours
    deliveryZones?: string[];
    restrictions?: string[];
    preferredCarriers?: string[];
    lastMileOptions?: ('standard' | 'express' | 'pickup_point')[];
  };

  /**
   * Economic and infrastructure data
   */
  @Column({ type: 'json', nullable: true })
  infrastructure: {
    hasPostOffice: boolean;
    hasBank: boolean;
    hasInternet: boolean;
    hasMobileNetwork: boolean;
    roadQuality: 'good' | 'fair' | 'poor';
    publicTransport: boolean;
  };

  /**
   * Display order within governorate
   */
  @Column({ type: 'int', default: 100 })
  displayOrder: number;

  /**
   * Whether this city is currently active for services
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Districts in this city
   */
  @OneToMany(() => SyrianDistrictEntity, district => district.city)
  districts: SyrianDistrictEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

/**
 * Syrian Districts and Neighborhoods (الأحياء والمناطق)
 */
@Entity('syrian_districts')
@Index(['city', 'nameEn'])
export class SyrianDistrictEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Parent city
   */
  @ManyToOne(() => SyrianCityEntity, city => city.districts)
  @JoinColumn({ name: 'city_id' })
  city: SyrianCityEntity;

  /**
   * District name in English
   */
  @Column({ length: 100 })
  nameEn: string;

  /**
   * District name in Arabic
   */
  @Column({ length: 100 })
  nameAr: string;

  /**
   * District type
   */
  @Column({
    type: 'enum',
    enum: ['district', 'neighborhood', 'quarter', 'suburb', 'area'],
    default: 'district',
  })
  districtType: string;

  /**
   * Postal code for this district
   */
  @Column({ length: 10, nullable: true })
  postalCode: string;

  /**
   * Geographic boundaries
   */
  @Column({ type: 'json', nullable: true })
  boundaries: {
    centerLatitude?: number;
    centerLongitude?: number;
    boundingBox?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
    landmarks?: string[];
  };

  /**
   * Characteristics of the district
   */
  @Column({ type: 'json', nullable: true })
  characteristics: {
    residentialType: 'mixed' | 'residential' | 'commercial' | 'industrial';
    densityLevel: 'high' | 'medium' | 'low';
    developmentLevel: 'developed' | 'developing' | 'underdeveloped';
    safetyLevel: 'high' | 'medium' | 'low';
    averageIncomeLevel: 'high' | 'medium' | 'low';
  };

  /**
   * Display order within city
   */
  @Column({ type: 'int', default: 100 })
  displayOrder: number;

  /**
   * Whether this district is currently active for services
   */
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

/**
 * Enhanced address entity with Syrian localization
 */
@Entity('syrian_addresses')
@Index(['governorate', 'city'])
@Index(['postalCode'])
@Index(['latitude', 'longitude'])
export class SyrianAddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Address type classification
   */
  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.RESIDENTIAL,
  })
  addressType: AddressType;

  /**
   * Governorate
   */
  @ManyToOne(() => SyrianGovernorateEntity)
  @JoinColumn({ name: 'governorate_id' })
  governorate: SyrianGovernorateEntity;

  /**
   * City
   */
  @ManyToOne(() => SyrianCityEntity)
  @JoinColumn({ name: 'city_id' })
  city: SyrianCityEntity;

  /**
   * District (optional)
   */
  @ManyToOne(() => SyrianDistrictEntity, { nullable: true })
  @JoinColumn({ name: 'district_id' })
  district: SyrianDistrictEntity;

  /**
   * Street name in English
   */
  @Column({ length: 200, nullable: true })
  streetEn: string;

  /**
   * Street name in Arabic
   */
  @Column({ length: 200, nullable: true })
  streetAr: string;

  /**
   * Building number or name
   */
  @Column({ length: 50, nullable: true })
  buildingNumber: string;

  /**
   * Floor number
   */
  @Column({ length: 20, nullable: true })
  floor: string;

  /**
   * Apartment or office number
   */
  @Column({ length: 50, nullable: true })
  apartmentNumber: string;

  /**
   * Postal code
   */
  @Column({ length: 10, nullable: true })
  @Index()
  postalCode: string;

  /**
   * Additional address details in English
   */
  @Column({ type: 'text', nullable: true })
  additionalDetailsEn: string;

  /**
   * Additional address details in Arabic
   */
  @Column({ type: 'text', nullable: true })
  additionalDetailsAr: string;

  /**
   * Landmark references
   */
  @Column({ type: 'json', nullable: true })
  landmarks: {
    nearby?: string[];
    directions?: string;
    publicTransport?: string[];
    emergencyServices?: string[];
  };

  /**
   * Geographic coordinates for delivery optimization
   */
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  /**
   * Address verification status
   */
  @Column({
    type: 'enum',
    enum: AddressStatus,
    default: AddressStatus.PENDING_VERIFICATION,
  })
  status: AddressStatus;

  /**
   * Delivery instructions
   */
  @Column({ type: 'json', nullable: true })
  deliveryInstructions: {
    preferredTimeSlots?: string[];
    accessInstructions?: string;
    contactPreferences?: ('call' | 'sms' | 'whatsapp')[];
    alternativeContact?: string;
    securityCode?: string;
    restrictions?: string[];
  };

  /**
   * Address validation metadata
   */
  @Column({ type: 'json', nullable: true })
  validation: {
    verifiedBy?: string;
    verifiedAt?: Date;
    verificationMethod?: 'automated' | 'manual' | 'customer';
    confidenceScore?: number; // 0-100
    issues?: string[];
    corrections?: Record<string, any>;
  };

  /**
   * Usage statistics
   */
  @Column({ type: 'json', nullable: true })
  usage: {
    deliveryCount?: number;
    lastDeliveryAt?: Date;
    successfulDeliveryRate?: number;
    averageDeliveryTime?: number;
    customerSatisfactionScore?: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}