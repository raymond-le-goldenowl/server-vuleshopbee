import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';

import { NewsModule } from './news/news.module';
import { MenuModule } from './menu/menu.module';
import { TagsModule } from './tags/tags.module';
import { WardsModule } from './wards/wards.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { CartsModule } from './carts/carts.module';
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
import { OrderStatusCodeModule } from './order_status_code/order_status_code.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    BannersModule,
    SlidesModule,
    NewsModule,
    KeywordsModule,
    FloatingModule,
    BroadcastsModule,
    GendersModule,
    RolesModule,
    CategoriesModule,
    MenuModule,
    ProductsModule,
    SuppliersModule,
    DiscountsModule,
    TagsModule,
    UsersModule,
    AddressModule,
    ProvincesModule,
    DistrictsModule,
    WardsModule,
    WishlistModule,
    PromotionModule,
    CartsModule,
    CartItemModule,
    OrderStatusCodeModule,
    OrdersModule,
    OrderItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
