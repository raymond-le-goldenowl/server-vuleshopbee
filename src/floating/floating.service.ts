import { Injectable } from '@nestjs/common';
import { CreateFloatingDto } from './dto/create-floating.dto';
import { UpdateFloatingDto } from './dto/update-floating.dto';

@Injectable()
export class FloatingService {
  create(createFloatingDto: CreateFloatingDto) {
    return 'This action adds a new floating';
  }

  findAll() {
    return `This action returns all floating`;
  }

  findOne(id: number) {
    return `This action returns a #${id} floating`;
  }

  update(id: number, updateFloatingDto: UpdateFloatingDto) {
    return `This action updates a #${id} floating`;
  }

  remove(id: number) {
    return `This action removes a #${id} floating`;
  }
}
