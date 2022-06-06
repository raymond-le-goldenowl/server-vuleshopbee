import { join } from 'path';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';

import config from 'ormconfig';

import { NewsModule } from './news/news.module';
import { MenuModule } from './menu/menu.module';
import { TagsModule } from './tags/tags.module';
import { WardsModule } from './wards/wards.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { CartsModule } from './carts/carts.module';
import { EmailModule } from './email/email.module';
import { StripeModule } from './stripe/stripe.module';
import { SlidesModule } from './slides/slides.module';
import { OrdersModule } from './orders/orders.module';
import { GendersModule } from './genders/genders.module';
import { BannersModule } from './banners/banners.module';
import { AddressModule } from './address/address.module';
import { KeywordsModule } from './keywords/keywords.module';
import { FloatingModule } from './floating/floating.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ProductsModule } from './products/products.module';
import { CartItemModule } from './cart_item/cart_item.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { DiscountsModule } from './discounts/discounts.module';
import { ProvincesModule } from './provinces/provinces.module';
import { DistrictsModule } from './districts/districts.module';
import { PromotionModule } from './promotion/promotion.module';
import { OrderItemModule } from './order_item/order_item.module';
import { BroadcastsModule } from './broadcasts/broadcasts.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductTagModule } from './product_tag/product_tag.module';
import { ProductOptionsModule } from './product-options/product-options.module';
import { ProductAccountsModule } from './product_accounts/product_accounts.module';

import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
import { JsonBodyMiddleware } from './middlewares/json-bodymiddleware';
import { UrlEncodedBodyMiddleware } from './middlewares/url-encoded-body-middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api*'],
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    TagsModule,
    NewsModule,
    MenuModule,
    RolesModule,
    UsersModule,
    WardsModule,
    CartsModule,
    EmailModule,
    StripeModule,
    OrdersModule,
    SlidesModule,
    AddressModule,
    BannersModule,
    GendersModule,
    ProductsModule,
    CartItemModule,
    WishlistModule,
    KeywordsModule,
    FloatingModule,
    SuppliersModule,
    DiscountsModule,
    ProvincesModule,
    DistrictsModule,
    PromotionModule,
    OrderItemModule,
    BroadcastsModule,
    CategoriesModule,
    ProductTagModule,
    ProductOptionsModule,
    ProductAccountsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JsonBodyMiddleware, UrlEncodedBodyMiddleware)
      .exclude({ path: '/api/v1/stripe/webhook', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
