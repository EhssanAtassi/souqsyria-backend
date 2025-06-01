import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from './entities/vendor.entity';
import { VendorMembershipEntity } from './entities/vendor-membership.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(VendorEntity)
    private vendorRepository: Repository<VendorEntity>,
    @InjectRepository(VendorMembershipEntity)
    private vendorMembershipRepository: Repository<VendorMembershipEntity>,
  ) {}

  async findAll() {
    return this.vendorRepository.find();
  }

  async findOne(id: number) {
    return this.vendorRepository.findOne({ where: { id } });
  }
}