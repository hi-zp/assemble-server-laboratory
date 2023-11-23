import { NestFactory } from '@nestjs/core';
import { AssembleModule } from './assemble.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import {
  AppUtils,
  Configs,
  HelperService,
  createLogger,
} from '@assemble/common';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { useContainer } from 'class-validator';
import chalk from 'chalk';
import csrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { SWAGGER_API_ENDPOINT } from '@assemble/constant';

declare const module: {
  hot: { accept: () => void; dispose: (argument: () => Promise<void>) => void };
};

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AssembleModule,
    new FastifyAdapter(),
    {
      logger: await createLogger(),
      snapshot: true,
    },
  );

  const configService = app.get(ConfigService<Configs, true>);

  // ======================================================
  // security and middlewares
  // ======================================================

  await app.register(csrf);
  await app.register(helmet, {
    contentSecurityPolicy: false,
    // When using apollo-server-fastify and @fastify/helmet, there may be a problem with CSP on the GraphQL playground, to solve this collision, configure the CSP as shown below:
    // contentSecurityPolicy: {
    //   directives: {
    //     defaultSrc: [`'self'`, 'unpkg.com'],
    //     styleSrc: [
    //       `'self'`,
    //       `'unsafe-inline'`,
    //       'cdn.jsdelivr.net',
    //       'fonts.googleapis.com',
    //       'unpkg.com',
    //     ],
    //     fontSrc: [`'self'`, 'fonts.gstatic.com', 'data:'],
    //     imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
    //     scriptSrc: [
    //       `'self'`,
    //       `https: 'unsafe-inline'`,
    //       `cdn.jsdelivr.net`,
    //       `'unsafe-eval'`,
    //     ],
    //   },
    // },
  });

  // app.enable("trust proxy");
  // app.set("etag", "strong");
  // app.use(
  //   bodyParser.json({ limit: "10mb" }),
  //   bodyParser.urlencoded({ limit: "10mb", extended: true }),
  // );

  if (!HelperService.isProd()) {
    // app.use(compression());
    // app.use(helmet());
    app.enableCors({
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      maxAge: 3600,
      origin: configService.get('app.allowedOrigins', { infer: true }),
    });
  }

  // =====================================================
  // configure global pipes, filters, interceptors
  // =====================================================

  const globalPrefix = configService.get('app.prefix', { infer: true });

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe(AppUtils.validationPipeOptions()));

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // =========================================================
  // configure shutdown hooks
  // =========================================================

  app.enableShutdownHooks();

  useContainer(app.select(AssembleModule), { fallbackOnErrors: true });

  // =========================================================
  // configure swagger
  // =========================================================

  if (!HelperService.isProd()) AppUtils.setupSwagger(app, configService);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const port =
    process.env.PORT ?? configService.get('app.port', { infer: true })!;

  await app.listen(port);

  const appUrl = `http://localhost:${port}/${globalPrefix}`;

  logger.log(`==========================================================`);
  logger.log(`🚀 Application is running on: ${chalk.green(appUrl)}`);

  logger.log(`==========================================================`);
  logger.log(
    `🚦 Accepting request only from: ${chalk.green(
      `${configService.get('app.allowedOrigins', { infer: true }).toString()}`,
    )}`,
  );

  if (!HelperService.isProd()) {
    const swaggerUrl = `http://localhost:${port}/${SWAGGER_API_ENDPOINT}`;
    logger.log(`==========================================================`);
    logger.log(`📑 Swagger is running on: ${chalk.green(swaggerUrl)}`);
  }
}

try {
  (async () => await bootstrap())();
} catch (error) {
  logger.error(error);
}
