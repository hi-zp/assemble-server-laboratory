import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Entities from './entities';
import { Configs } from '../config';
import { mikroOrmConfig } from './mikro-orm-cli.config';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configs, true>) => {
        return {
          ...mikroOrmConfig,
          host: configService.get('database.host', { infer: true }),
          port: configService.get('database.port', { infer: true }),
          dbName: configService.get('database.dbName', { infer: true }),
          user: configService.get('database.user', { infer: true }),
          password: configService.get('database.password', { infer: true }),
        } as MikroOrmModuleOptions;
      },
    }),
    MikroOrmModule.forFeature({
      entities: Object.values(Entities),
    }),
  ],
  exports: [MikroOrmModule],
})
export class DatabaseModule {}
