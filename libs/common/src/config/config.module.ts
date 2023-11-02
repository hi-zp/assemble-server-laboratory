import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mergeConfigOptions } from './merge-config-options';
import { HelperService } from '../helpers';

@Module({
  imports: [
    ConfigModule.forRoot(
      mergeConfigOptions(() => ({
        cache: true,
        isGlobal: true,
        expandVariables: true,
        validationOptions: {
          abortEarly: true,
          cache: !HelperService.isProd(),
          debug: !HelperService.isProd(),
          stack: !HelperService.isProd(),
        },
      })),
    ),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class NestConfigModule {}
