import { Controller } from '@nestjs/common';
import { ProductAccountsService } from './product_accounts.service';

@Controller('v1/product-accounts')
export class ProductAccountsController {
  constructor(
    private readonly productAccountsService: ProductAccountsService,
  ) {}
}
