/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import models from '@festivaldev/nekonexus-models';
import mysql from 'mysql2';
import { type Dialect, type QueryOptions, type QueryOptionsWithType, QueryTypes, Sequelize } from 'sequelize';
import { type DatabaseSettings } from './NekoNexusServiceSettings';
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
