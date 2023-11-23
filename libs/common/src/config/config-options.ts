import { ConfigFactory, ConfigModuleOptions } from '@nestjs/config';
import {
  app,
  appConfigValidationSchema,
  cloudinary,
  cloudinaryConfigValidationSchema,
  database,
  databaseConfigValidationSchema,
  facebookOauth,
  facebookOauthConfigValidationSchema,
  googleOauth,
  googleOauthConfigValidationSchema,
  jwt,
  jwtConfigValidationSchema,
  liteDatabase,
  liteDatabaseConfigValidationSchema,
  mail,
  mailConfigValidationSchema,
  // rabbitmq,
  // rabbitmqConfigValidationSchema,
  redis,
  redisConfigValidationSchema,
  sentry,
  sentryConfigurationValidationSchema,
  // stripe,
  // stripeonfigValidationSchema,
  throttle,
  throttleConfigValidationSchema,
} from './configs';
import Joi from 'joi';
import { HelperService } from '../helpers';
import { envFilePath } from './environment';

export const mergeConfigOptions = (
  getOptions: () => ConfigModuleOptions,
): ConfigModuleOptions => {
  const load: ConfigModuleOptions['load'] = [app, jwt, throttle];
  const validationSchema = {
    ...appConfigValidationSchema,
    ...jwtConfigValidationSchema,
    ...throttleConfigValidationSchema,
  };

  const append = (
    configFactory: ConfigFactory,
    schema: { [key: string]: Joi.Schema },
  ) => {
    load.push(configFactory);
    Object.assign(validationSchema, { ...schema });
  };

  if (HelperService.useSqlite()) {
    append(liteDatabase, liteDatabaseConfigValidationSchema);
  } else {
    append(database, databaseConfigValidationSchema);
  }

  if (process.env.SENTRY_DSN) {
    append(sentry, sentryConfigurationValidationSchema);
  }

  if (process.env.REDIS_HOST) {
    append(redis, redisConfigValidationSchema);
  }

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    append(cloudinary, cloudinaryConfigValidationSchema);
  }

  if (process.env.MAIL_SERVER) {
    append(mail, mailConfigValidationSchema);
  }

  if (process.env.FACEBOOK_CLIENT_ID) {
    append(facebookOauth, facebookOauthConfigValidationSchema);
  }

  if (process.env.GOOGLE_CLIENT_ID) {
    append(googleOauth, googleOauthConfigValidationSchema);
  }

  return {
    ...getOptions(),
    load,
    validationSchema: Joi.object(validationSchema),
    envFilePath: [envFilePath],
  };
};
