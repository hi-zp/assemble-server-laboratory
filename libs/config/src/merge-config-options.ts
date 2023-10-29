import { ConfigModuleOptions } from '@nestjs/config';
import { resolve } from 'node:path';
import * as dotenv from 'dotenv';
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

export const mergeConfigOptions = (
  options: ConfigModuleOptions,
): ConfigModuleOptions => {
  const envFilePath = resolve(
    process.cwd(),
    `env/.env.${process.env.NODE_ENV}`,
  );

  const load: ConfigModuleOptions['load'] = [app, jwt, throttle];
  const validationSchema = {
    ...appConfigValidationSchema,
    ...jwtConfigValidationSchema,
    ...throttleConfigValidationSchema,
  };

  const variables = dotenv.parse(envFilePath) as NodeJS.ProcessEnv;

  if (variables.DB_ENGINE != 'sqlite') {
    load.push(database);
    Object.assign(validationSchema, { ...databaseConfigValidationSchema });
  }

  if (variables.SENTRY_DSN) {
    load.push(sentry);
    Object.assign(validationSchema, { ...sentryConfigurationValidationSchema });
  }

  if (variables.REDIS_HOST) {
    load.push(redis);
    Object.assign(validationSchema, { ...redisConfigValidationSchema });
  }

  if (variables.CLOUDINARY_CLOUD_NAME) {
    load.push(cloudinary);
    Object.assign(validationSchema, { ...cloudinaryConfigValidationSchema });
  }

  if (variables.MAIL_SERVER) {
    load.push(mail);
    Object.assign(validationSchema, { ...mailConfigValidationSchema });
  }

  if (variables.FACEBOOK_CLIENT_ID) {
    load.push(facebookOauth);
    Object.assign(validationSchema, { ...facebookOauthConfigValidationSchema });
  }

  if (variables.GOOGLE_CLIENT_ID) {
    load.push(googleOauth);
    Object.assign(validationSchema, { ...googleOauthConfigValidationSchema });
  }

  return {
    ...options,
    load,
    validationSchema: Joi.object(validationSchema),
    envFilePath: [envFilePath],
  };
};
