import { GuaranteePolicy } from './entities/guarantee_policy.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductsService } from 'src/products/products.service';
import { GuaranteePolicyRepository } from './guarantee_policy.repository';
import { CreateGuaranteePolicyDto } from './dto/create-guarantee_policy.dto';
import { UpdateGuaranteePolicyDto } from './dto/update-guarantee_policy.dto';

@Injectable()
export class GuaranteePolicyService {
  constructor(
    @InjectRepository(GuaranteePolicyRepository)
    private guaranteePolicyRepository: GuaranteePolicyRepository,
    private productsService: ProductsService,
  ) {}

  async create(
    createGuaranteePolicyDto: CreateGuaranteePolicyDto,
  ): Promise<GuaranteePolicy> {
    const { text, value, product_id } = createGuaranteePolicyDto;
    const product = await this.productsService.findOne(product_id);

    const guaranteePolicy = await this.guaranteePolicyRepository.create({
      text,
      value,
      product,
    });

    if (!product) {
      throw new NotFoundException();
    }

    const saved = await this.guaranteePolicyRepository.save(guaranteePolicy);

    if (!saved) {
      throw new BadRequestException();
    }

    return guaranteePolicy;
  }

  async findAll(withDeleted: boolean): Promise<GuaranteePolicy[]> {
    let list: GuaranteePolicy[];

    if (withDeleted) {
      list = await this.guaranteePolicyRepository.find({ withDeleted: true });
    } else {
      list = await this.guaranteePolicyRepository.find({});
    }

    return list;
  }

  async findOne(id: string, withDeleted: boolean) {
    let guarantee_policy: GuaranteePolicy;

    if (withDeleted) {
      guarantee_policy = await this.guaranteePolicyRepository.findOne({
        where: { id },
        withDeleted: true,
      });
    } else {
      guarantee_policy = await this.guaranteePolicyRepository.findOne(id);
    }

    if (!guarantee_policy) {
      throw new NotFoundException();
    }

    return guarantee_policy;
  }

  async update(
    id: string,
    updateGuaranteePolicyDto: UpdateGuaranteePolicyDto,
  ): Promise<GuaranteePolicy> {
    const guarantee_policy = await this.findOne(id, true);
    const product = await this.productsService.findOne(
      updateGuaranteePolicyDto.product_id,
    );
    if (!guarantee_policy) {
      throw new NotFoundException();
    }

    guarantee_policy.text = updateGuaranteePolicyDto.text;
    guarantee_policy.value = updateGuaranteePolicyDto.value;
    guarantee_policy.product = product;

    const saved = await this.guaranteePolicyRepository.save(guarantee_policy);

    return saved;
  }

  async remove(id: string, remove: boolean) {
    const guarantee_policy = await this.findOne(id, true);

    if (remove) {
      await this.guaranteePolicyRepository.delete(guarantee_policy.id);
    } else {
      await this.guaranteePolicyRepository.softDelete(guarantee_policy.id);
    }
  }
}
