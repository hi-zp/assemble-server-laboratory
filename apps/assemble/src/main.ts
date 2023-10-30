import { NestFactory } from '@nestjs/core';
import { AssembleModule } from './assemble.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Configs } from '@assemble/config';
import { AppUtils, HelperService } from '@assemble/common';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { useContainer } from 'class-validator';
import chalk from 'chalk';

declare const module: { hot: { accept: () => void; dispose: (argument: () => Promise<void>) => void } };

const logger = new Logger("Bootstrap");

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AssembleModule,
    new FastifyAdapter()
  );

  const configService = app.get(ConfigService<Configs, true>);

  // =========================================================
  // configure swagger
  // =========================================================

  if (!HelperService.isProd()) AppUtils.setupSwagger(app, configService);

  // =====================================================
  // configure global pipes, filters, interceptors
  // =====================================================

  const globalPrefix = configService.get("app.prefix", { infer: true });

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe(AppUtils.validationPipeOptions()));

  app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // =========================================================
  // configure shutdown hooks
  // =========================================================

  app.enableShutdownHooks();

  useContainer(app.select(AssembleModule), { fallbackOnErrors: true });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const port = process.env.PORT ?? configService.get("app.port", { infer: true })!;

  await app.listen(port);

  const appUrl = `http://localhost:${port}/${globalPrefix}`;

  logger.log(`==========================================================`);
  logger.log(`🚀 Application is running on: ${chalk.green(appUrl)}`);

  logger.log(`==========================================================`);
  logger.log(
    `🚦 Accepting request only from: ${chalk.green(
      `${configService.get("app.allowedOrigins", { infer: true }).toString()}`,
    )}`,
  );

  if (!HelperService.isProd()) {
    const swaggerUrl = `http://localhost:${port}/doc`;
    logger.log(`==========================================================`);
    logger.log(`📑 Swagger is running on: ${chalk.green(swaggerUrl)}`);
  }
}

try {
  (async () => await bootstrap())();
} catch (error) {
  logger.error(error);
}
