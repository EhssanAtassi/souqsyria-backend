import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { User } from '../../users/entities/user.entity';
import { CreateAddressDto, AddressType } from '../dto/create-address.dto';
import { Country } from '../country/entities/country.entity';
import { Region } from '../region/entities/region.entity';
import { City } from '../city/entities/city.entity';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {}

  /**
   * Create a new address for a user, handling relations and default flag.
   */
  async create(user: User, dto: CreateAddressDto): Promise<Address> {
    const country = await this.countryRepo.findOne({
      where: { id: dto.countryId },
    });
    if (!country) throw new BadRequestException('Invalid country');

    let region = null;
    if (dto.regionId) {
      region = await this.regionRepo.findOne({
        where: { id: dto.regionId, country: { id: country.id } },
      });
      if (!region) throw new BadRequestException('Invalid region for country');
    }

    let city = null;
    if (dto.cityId) {
      city = await this.cityRepo.findOne({
        where: { id: dto.cityId, country: { id: country.id } },
      });
      if (!city) throw new BadRequestException('Invalid city for country');
    }

    // If isDefault, unset default for this user/type
    if (dto.isDefault) {
      await this.addressRepo.update(
        {
          user: { id: user.id },
          addressType: dto.addressType || AddressType.SHIPPING,
        },
        { isDefault: false },
      );
    }

    const address = this.addressRepo.create({
      ...dto,
      user,
      country,
      region,
      city,
      isDefault: dto.isDefault || false,
      addressType: dto.addressType || AddressType.SHIPPING,
    });

    return this.addressRepo.save(address);
  }

  /**
   * Update an existing address (only if user owns it).
   */
  async update(
    user: User,
    addressId: number,
    dto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.addressRepo.findOne({
      where: { id: addressId, user: { id: user.id } },
      relations: ['country', 'region', 'city'],
    });
    if (!address) throw new NotFoundException('Address not found');

    // If updating country, region, city, revalidate them
    if (dto.countryId) {
      address.country = await this.countryRepo.findOne({
        where: { id: dto.countryId },
      });
      if (!address.country) throw new BadRequestException('Invalid country');
    }
    if (dto.regionId) {
      address.region = await this.regionRepo.findOne({
        where: { id: dto.regionId },
      });
      if (!address.region) throw new BadRequestException('Invalid region');
    }
    if (dto.cityId) {
      address.city = await this.cityRepo.findOne({ where: { id: dto.cityId } });
      if (!address.city) throw new BadRequestException('Invalid city');
    }

    Object.assign(address, dto);

    // If isDefault is being set, unset others
    if (dto.isDefault) {
      await this.addressRepo.update(
        { user: { id: user.id }, addressType: address.addressType },
        { isDefault: false },
      );
      address.isDefault = true;
    }

    return this.addressRepo.save(address);
  }

  /**
   * Remove (soft-delete) an address (only if user owns it).
   */
  async remove(user: User, addressId: number): Promise<void> {
    const address = await this.addressRepo.findOne({
      where: { id: addressId, user: { id: user.id } },
    });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressRepo.softRemove(address);
  }

  /**
   * Get all addresses for a user (optionally filter by type).
   */
  async findAll(user: User, type?: AddressType): Promise<Address[]> {
    return this.addressRepo.find({
      where: { user: { id: user.id }, ...(type ? { addressType: type } : {}) },
      relations: ['country', 'region', 'city'],
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Set an address as default for a user (per type).
   */
  async setDefault(user: User, addressId: number): Promise<Address> {
    const address = await this.addressRepo.findOne({
      where: { id: addressId, user: { id: user.id } },
    });
    if (!address) throw new NotFoundException('Address not found');

    await this.addressRepo.update(
      { user: { id: user.id }, addressType: address.addressType },
      { isDefault: false },
    );
    address.isDefault = true;
    return this.addressRepo.save(address);
  }

  /**
   * Get a single address by ID (if owned by user).
   */
  async findOne(user: User, addressId: number): Promise<Address> {
    const address = await this.addressRepo.findOne({
      where: { id: addressId, user: { id: user.id } },
      relations: ['country', 'region', 'city'],
    });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }
}
