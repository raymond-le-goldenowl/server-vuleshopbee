import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { isURL } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Broadcast } from './entities/broadcast.entity';

import { BroadcastsRepository } from './broadcasts.repository';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { UpdateBroadcastDto } from './dto/update-broadcast.dto';

@Injectable()
export class BroadcastsService {
  constructor(
    @InjectRepository(BroadcastsRepository)
    private broadcastsRepository: BroadcastsRepository,
  ) {}

  async create(createBroadcastDto: CreateBroadcastDto): Promise<Broadcast> {
    createBroadcastDto.text = 'search';

    if (isURL(createBroadcastDto.href)) {
      createBroadcastDto.text = 'url';
    }

    // create path point to images resource
    createBroadcastDto.icon = createBroadcastDto.icon;

    // save and assign a result saved
    const saved = await this.broadcastsRepository.save(createBroadcastDto);

    // if saved fail should be throw new error
    if (!saved) {
      throw new BadRequestException(`Can not save object`);
    }

    return saved;
  }

  async findAll(): Promise<Broadcast[]> {
    const broadcasts = await this.broadcastsRepository.find({
      withDeleted: true,
    });
    return broadcasts;
  }

  async findOneBroadcast(id: string): Promise<Broadcast> {
    // find one Broadcast by id and with deleted
    const broadcast = await this.broadcastsRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    // throw error if deleted fail
    if (!broadcast) {
      throw new NotFoundException(`Broadcast with id "${id}" not found`);
    }

    return broadcast;
  }

  async update(
    id: string,
    updateBroadcastDto: UpdateBroadcastDto,
  ): Promise<Broadcast> {
    // get Broadcast want to update
    const broadcast = await this.findOneBroadcast(id);

    // replace data with new values
    broadcast.icon = updateBroadcastDto.icon;
    broadcast.href = updateBroadcastDto.href;

    broadcast.text = 'search';
    if (isURL(broadcast.href)) {
      broadcast.text = 'url';
    }

    broadcast.deleted_at = null;

    // update with new values
    const broadcastUpdated = await this.broadcastsRepository.save(broadcast);

    return broadcastUpdated;
  }

  async delete(id: string, remove: boolean) {
    // set `DATETIME` for delete column
    let broadcastDeleted;
    if (remove) {
      broadcastDeleted = await this.broadcastsRepository.delete(id);
    } else {
      const broadcast = await this.findOneBroadcast(id);

      // Check if Broadcast deleted
      if (broadcast.deleted_at) {
        throw new ConflictException(`Broadcast deleted before`);
      }

      broadcastDeleted = await this.broadcastsRepository.softDelete(id);
    }

    // throw error if deleted fail
    if (broadcastDeleted.affected < 0) {
      throw new BadRequestException(`Can not delete Broadcast with id "${id}"`);
    }

    return {
      status: true,
      message: 'Delete successfully',
    };
  }

  async deleteAll() {
    const deletedAll = await this.broadcastsRepository.delete({});

    if (deletedAll.affected < 0) {
      throw new BadRequestException(`Can not delete`);
    }

    return deletedAll;
  }
}
