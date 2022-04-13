import { Supplier } from 'src/suppliers/entities/supplier.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { config } from './file-interceptor.config';
import { Observable, of } from 'rxjs';
import { join } from 'path';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  create(
    @UploadedFile() image,
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    return this.suppliersService.create(image, createSupplierDto);
  }

  @Get()
  findAll(@Query('with_deleted') with_deleted: boolean): Promise<Supplier[]> {
    return this.suppliersService.findAll(with_deleted);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('with_deleted') with_deleted: boolean,
  ): Promise<Supplier> {
    return this.suppliersService.findOne(id, with_deleted);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  update(
    @UploadedFile() image,
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(image, id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('remove') remove: boolean) {
    return this.suppliersService.remove(id, remove);
  }

  @Get('images/:imageName')
  serveAvatar(@Param('imageName') imageName, @Res() res): Observable<any> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/suppliers/' + imageName)),
    );
  }
}
