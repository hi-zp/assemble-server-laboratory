import { LoadStrategy, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger, NotFoundException } from '@nestjs/common';

import * as Entities from '../entities';
import { HelperService } from '../helpers';
import { BaseRepository } from './base.repository';

/**
 *
 * `MikroOrmConfig` is a configuration object for `MikroORM` that is used to
 * This is required to run mikro-orm cli
 *
 * @see https://mikro-orm.io/docs/configuration
 * @see https://mikro-orm.io/docs/cli
 *
 */

const logger = new Logger('MikroORM');

export const mikroOrmConfig: Options = {
  entities: Object.values(Entities),
  discovery: { disableDynamicFileAccess: true },
  driver: HelperService.useSqlite() ? BetterSqliteDriver : PostgreSqlDriver,
  findOneOrFailHandler: (entityName: string, key: any) => {
    return new NotFoundException(`${entityName} not found for ${key}`);
  },
  entityRepository: BaseRepository,
  logger: logger.log.bind(logger),
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  debug: true,
  loadStrategy: LoadStrategy.JOINED,
  forceUtcTimezone: true,
  pool: { min: 2, max: 10 },
};
