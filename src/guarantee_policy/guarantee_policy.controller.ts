import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GuaranteePolicyService } from './guarantee_policy.service';
import { CreateGuaranteePolicyDto } from './dto/create-guarantee_policy.dto';
import { UpdateGuaranteePolicyDto } from './dto/update-guarantee_policy.dto';

@Controller('guarantee-policy')
export class GuaranteePolicyController {
  constructor(
    private readonly guaranteePolicyService: GuaranteePolicyService,
  ) {}

  @Post()
  create(@Body() createGuaranteePolicyDto: CreateGuaranteePolicyDto) {
    return this.guaranteePolicyService.create(createGuaranteePolicyDto);
  }

  @Get()
  findAll(@Query('with_deleted') withDeleted: boolean) {
    return this.guaranteePolicyService.findAll(withDeleted);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted') withDeleted: boolean,
  ) {
    return this.guaranteePolicyService.findOne(id, withDeleted);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGuaranteePolicyDto: UpdateGuaranteePolicyDto,
  ) {
    return this.guaranteePolicyService.update(id, updateGuaranteePolicyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.guaranteePolicyService.remove(id, remove);
  }
}
