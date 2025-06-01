import { Module } from '@nestjs/common';
import { AddressesService } from './service/addresses.service';
import { AddressesController } from './controller/addresses.controller';
import { CountryModule } from './country/country.module';
import { RegionModule } from './region/region.module';
import { CityModule } from './city/city.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { User } from '../users/entities/user.entity';
import { Country } from './country/entities/country.entity';
import { Region } from './region/entities/region.entity';
import { City } from './city/entities/city.entity';

@Module({
  providers: [AddressesService],
  controllers: [AddressesController],
  imports: [
    TypeOrmModule.forFeature([Address, User, Country, Region, City]),
    CountryModule,
    RegionModule,
    CityModule,

  ],
  exports: [AddressesService],
})
export class AddressesModule {}
