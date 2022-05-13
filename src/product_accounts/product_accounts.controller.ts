import { Controller } from '@nestjs/common';
import { ProductAccountsService } from './product_accounts.service';

@Controller('product-accounts')
export class ProductAccountsController {
  constructor(
    private readonly productAccountsService: ProductAccountsService,
  ) {}
}
