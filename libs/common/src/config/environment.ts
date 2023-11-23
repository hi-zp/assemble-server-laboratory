import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import dotEnvExpand from 'dotenv-expand';

const logger = new Logger('NestConfig');

export const envFilePath = `${process.cwd()}/env/.env.${process.env.NODE_ENV}`;

const environment = dotenv.config({ path: envFilePath });

dotEnvExpand.expand(environment);

logger.log(`🛠️ Using env ${envFilePath}\n`);
