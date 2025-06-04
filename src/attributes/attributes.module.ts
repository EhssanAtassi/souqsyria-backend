import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { User } from '../users/entities/user.entity';
import { Route } from '../access-control/entities/route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Attribute, AttributeValue,
  User,Route
  ])],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [TypeOrmModule],
})
export class AttributesModule {}
