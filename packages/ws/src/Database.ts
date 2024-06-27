import models from '@festivaldev/paradise-models';
import mysql from 'mysql2';
import { Dialect, QueryOptions, QueryOptionsWithType, QueryTypes, Sequelize } from 'sequelize';
import { type DatabaseSettings } from './ParadiseServiceSettings';
import { Log } from './utils';

const Database = {
  initialized: false,
  initialize: async (dbSettings: DatabaseSettings) => {
    if (Database.initialized) return;

    Log.info('Connecting to database...');
    Log.debug(
      `Type:${dbSettings.Type} \
Database:${dbSettings.DatabaseName} \
Auth:'${dbSettings.Username}'@'${dbSettings.Server}:${dbSettings.Port}' \
(using password: ${dbSettings.Password?.length! > 0 ? 'YES' : 'NO'})`,
    );

    const sequelize = new Sequelize(dbSettings.DatabaseName!, dbSettings.Username!, dbSettings.Password, {
      host: dbSettings.Server,
      port: dbSettings.Port,
      dialect: dbSettings.Type as Dialect,
      dialectModule: mysql,
      logging: false,
    });

    sequelize.query = async function (
      sql: string | { query: string; values: unknown[] },
      options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW> | undefined,
    ): Promise<any> {
      try {
        return await Sequelize.prototype.query.apply(this, [sql, options]);
      } catch (err: any) {
        console.error(err);
      }

      return null;
    };

    for (const [modelName, model] of Object.entries(models)) {
      model.initialize(sequelize);
    }

    for (const [modelName, model] of Object.entries(models)) {
      model.associate?.(models);
    }

    await sequelize.sync();
    Database.initialized = true;
  },
};

export default Database;
