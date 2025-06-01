import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessControlModule } from '../../access-control/access-control.module';
import { CountryService } from './service/country.service';
import { CountryController } from './controller/country.controller';
import { Country } from './entities/country.entity'; // Import your ACL module!

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    AccessControlModule, // <-- Fix: Import here!
  ],
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService],
})
export class CountryModule {}
