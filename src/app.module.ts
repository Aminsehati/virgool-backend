import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { CategoryModule } from './modules/category/category.module';
@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: false,
      synchronize: true,
      entities: [
        'dist/**/**/**/*.entity{.ts,.js}',
        'dist/**/**/*.entity{.ts,.js}',
      ]

    }),
    AuthModule,
    UserModule,
    CategoryModule,
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
