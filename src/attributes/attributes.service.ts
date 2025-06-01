import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepository: Repository<AttributeValue>,
  ) {}

  async findAll() {
    return this.attributeRepository.find();
  }

  async findOne(id: number) {
    return this.attributeRepository.findOne({ where: { id } });
  }

  async findAttributeValues(attributeId: number) {
    return this.attributeValueRepository.find({
      where: { attribute: { id: attributeId } },
    });
  }
}