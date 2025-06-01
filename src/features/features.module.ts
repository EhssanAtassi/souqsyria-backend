import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureEntity } from './entities/feature.entity';
import { ProductFeatureEntity } from './entities/product-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureEntity, ProductFeatureEntity])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class FeaturesModule {}
