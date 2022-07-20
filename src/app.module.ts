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

import { NewsModule } from './models/news/news.module';
import { MenuModule } from './models/menu/menu.module';
import { TagsModule } from './models/tags/tags.module';
import { WardsModule } from './models/wards/wards.module';
import { RolesModule } from './models/roles/roles.module';
import { AuthModule } from './authentication/auth.module';
import { CartsModule } from './models/carts/carts.module';
import { EmailModule } from './mails/email.module';
import { StripeModule } from './models/stripe/stripe.module';
import { SlidesModule } from './models/slides/slides.module';
import { OrdersModule } from './models/orders/orders.module';
import { GendersModule } from './models/genders/genders.module';
import { BannersModule } from './models/banners/banners.module';
import { AddressModule } from './models/address/address.module';
import { KeywordsModule } from './models/keywords/keywords.module';
import { FloatingModule } from './models/floating/floating.module';
import { WishlistModule } from './models/wishlist/wishlist.module';
import { ProductsModule } from './models/products/products.module';
import { CartItemModule } from './models/cart_item/cart_item.module';
import { SuppliersModule } from './models/suppliers/suppliers.module';
import { DiscountsModule } from './models/discounts/discounts.module';
import { ProvincesModule } from './models/provinces/provinces.module';
import { DistrictsModule } from './models/districts/districts.module';
import { PromotionModule } from './models/promotion/promotion.module';
import { OrderItemModule } from './models/order_item/order_item.module';
import { BroadcastsModule } from './models/broadcasts/broadcasts.module';
import { CategoriesModule } from './models/categories/categories.module';
import { ProductTagModule } from './models/product_tag/product_tag.module';
import { ProductOptionsModule } from './models/product-options/product-options.module';
import { ProductAccountsModule } from './models/product_accounts/product_accounts.module';

import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { JsonBodyMiddleware } from './middlewares/json-body.middleware';
import { UrlEncodedBodyMiddleware } from './middlewares/url-encoded-body.middleware';

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
    AuthModule,
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
