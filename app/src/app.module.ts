import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import entities from '@util/entity';
import { AppService } from '@service/app.service';
import { envConfig } from '@config/config';
import { AuthModule } from '@module/auth.module';
import { UserModule } from '@module/user.module';
import { TestModule } from '@module/test.moule';
import GatewayModule from '@module/gateway.module';
import ServiceModule from '@module/service.module';
import SessionModule from '@module/session.module';

@Module({
  imports: [
    AuthModule,
    JwtModule,
    UserModule,
    TestModule,
    GatewayModule,
    ServiceModule,
    SessionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [envConfig],
      // validationSchema: envValidation(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('dbConfig.host'),
        port: configService.get<number>('dbConfig.port'),
        username: configService.get<string>('dbConfig.name'),
        password: configService.get<string>('dbConfig.password'),
        database: configService.get<string>('dbConfig.dbname'),
        entities: [...entities],
        synchronize: true,
      }),
    }),
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //미들웨어
    // consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}
