import { Module } from '@nestjs/common';
import { NestConfigModule } from './config';
import { CommonService } from './common.service';
import { NestLoggerModule } from './logger';
import { NestI18nModule } from './i18n';
import { NestServeStaticModule } from './serve-static';
import { DatabaseModule } from './database';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    NestConfigModule,
    NestLoggerModule,
    NestI18nModule,
    NestServeStaticModule,
    DatabaseModule,
  ],
})
export class CommonModule {}
