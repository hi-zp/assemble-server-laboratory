import { NestFactory } from '@nestjs/core';
import { AssembleModule } from './assemble.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Configs } from '@assemble/config';
import { AppUtils, HelperService } from '@assemble/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AssembleModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService<Configs, true>);

  // =========================================================
  // configure swagger
  // =========================================================

  if (!HelperService.isProd()) AppUtils.setupSwagger(app, configService);

  await app.listen(3000);
}
bootstrap();
