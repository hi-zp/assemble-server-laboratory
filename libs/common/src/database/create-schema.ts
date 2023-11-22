import { MikroORM } from '@mikro-orm/core';
import * as Entities from './entities';
import { mikroOrmConfig } from './mikro-orm-cli.config';

(async () => {
  const orm = await MikroORM.init({
    ...mikroOrmConfig,
    entities: Object.values(Entities),
    dbName: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
  });
  const generator = orm.schema;

  const dropDump = await generator.getDropSchemaSQL();
  console.log(dropDump);

  const createDump = await generator.getCreateSchemaSQL();
  console.log(createDump);

  const updateDump = await generator.getUpdateSchemaSQL();
  console.log(updateDump);

  // there is also `generate()` method that returns drop + create queries
  // const dropAndCreateDump = await generator.generate();
  // console.log(dropAndCreateDump);

  // or you can run those queries directly, but be sure to check them first!
  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();

  // in tests it can be handy to use those:
  await generator.refreshDatabase(); // ensure db exists and is fresh
  await generator.clearDatabase(); // removes all data

  await orm.close(true);
})();
