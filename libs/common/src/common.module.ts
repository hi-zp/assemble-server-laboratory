import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { NestLoggerModule } from './logger';
import { NestI18nModule } from './i18n';
import { NestServeStaticModule } from './serve-static';
import { NestConfigModule } from './config';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    NestConfigModule,
    NestLoggerModule,
    NestI18nModule,
    NestServeStaticModule,
  ],
})
export class CommonModule {}
