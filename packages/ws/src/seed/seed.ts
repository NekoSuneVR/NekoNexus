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

// eslint-disable-next-line import/no-named-default
import { default as ServiceSettings } from '@/ParadiseServiceSettings';
import { Log } from '@/utils';
import models, {
  type ApplicationConfiguration,
  type Map,
  type PhotonServer,
  type PublicProfile,
  type ShopFunctionalItem,
  type ShopGearItem,
  type ShopQuickItem,
  type ShopWeaponItem,
} from '@festivaldev/paradise-models';
import { type Dialect, Sequelize } from 'sequelize';

import applicationConfiguration from './applicationConfiguration.json';
import maps from './maps.json';
import photonServers from './photonServers.json';
import shop from './shop.json';
import users from './users.json';

(async () => {
  const sequelize = new Sequelize(
    ServiceSettings.DatabaseSettings.DatabaseName!,
    ServiceSettings.DatabaseSettings.Username!,
    ServiceSettings.DatabaseSettings.Password,
    {
      host: ServiceSettings.DatabaseSettings.Server,
      port: Number(ServiceSettings.DatabaseSettings.Port),
      dialect: ServiceSettings.DatabaseSettings.Type as Dialect,
      logging: false,
    },
  );

  Log.info('Connecting to database...');
  Log.debug(
    `Type:${ServiceSettings.DatabaseSettings.Type} Database:${ServiceSettings.DatabaseSettings.DatabaseName} Auth:'${ServiceSettings.DatabaseSettings.Username}'@'${ServiceSettings.DatabaseSettings.Server}:${ServiceSettings.DatabaseSettings.Port}' (using password: ${ServiceSettings.DatabaseSettings.Password?.length! > 0 ? 'YES' : 'NO'})`,
  );
  for (const [modelName, model] of Object.entries(models)) {
    model.initialize(sequelize);
  }

  for (const [modelName, model] of Object.entries(models)) {
    model.associate?.(models);
  }

  try {
    await sequelize.sync();
    Log.info('Database opened.');
  } catch {}

  // #region Application Configuration
  await models.ApplicationConfiguration.destroy({ where: {} });
  await models.ApplicationConfiguration.bulkCreate(applicationConfiguration as Partial<ApplicationConfiguration>[]);
  // #endregion

  // #region Users
  await models.PublicProfile.destroy({ where: {} });
  await models.PublicProfile.bulkCreate(users as Partial<PublicProfile>[]);
  // #endregion

  // #region Photon Servers
  await models.PhotonServer.destroy({ where: {} });
  await models.PhotonServer.bulkCreate(photonServers as Partial<PhotonServer>[]);
  // #endregion

  // #region Shop
  await models.ShopFunctionalItem.destroy({ where: {} });
  await models.ShopGearItem.destroy({ where: {} });
  await models.ShopQuickItem.destroy({ where: {} });
  await models.ShopWeaponItem.destroy({ where: {} });

  await models.ShopFunctionalItem.bulkCreate(shop.FunctionalItems as Partial<ShopFunctionalItem>[]);
  await models.ShopGearItem.bulkCreate(shop.GearItems as Partial<ShopGearItem>[]);
  await models.ShopQuickItem.bulkCreate(shop.QuickItems as any[] as Partial<ShopQuickItem>[]);
  await models.ShopWeaponItem.bulkCreate(shop.WeaponItems as Partial<ShopWeaponItem>[]);

  await models.ShopItemPrice.destroy({ where: {} });
  await models.ShopItemPrice.bulkCreate(
    shop.FunctionalItems.reduce((acc: any[], item) => {
      if (!item.Prices || !item.Prices.length) return acc;
      acc.push(...item.Prices.map((price) => ({ ...price, ID: item.ID })));
      return acc;
    }, []),
  );
  await models.ShopItemPrice.bulkCreate(
    shop.GearItems.reduce((acc: any[], item) => {
      if (!item.Prices || !item.Prices.length) return acc;
      acc.push(...item.Prices.map((price) => ({ ...price, ID: item.ID })));
      return acc;
    }, []),
  );
  await models.ShopItemPrice.bulkCreate(
    shop.QuickItems.reduce((acc: any[], item) => {
      if (!item.Prices || !item.Prices.length) return acc;
      acc.push(...item.Prices.map((price) => ({ ...price, ID: item.ID })));
      return acc;
    }, []),
  );
  await models.ShopItemPrice.bulkCreate(
    shop.WeaponItems.reduce((acc: any[], item) => {
      if (!item.Prices || !item.Prices.length) return acc;
      acc.push(...item.Prices.map((price) => ({ ...price, ID: item.ID })));
      return acc;
    }, []),
  );
  // #endregion

  // #region Maps
  await models.Map.destroy({ where: {} });

  await models.Map.bulkCreate(maps as Partial<Map>[]);
  await models.MapSettings.bulkCreate(
    maps.reduce((acc: any[], cur) => {
      Object.entries(cur.Settings).forEach(([key, value]) => {
        acc.push({
          ...(value as object),
          MapId: cur.MapId,
          GameModeType: key,
        });
      });

      return acc;
    }, []),
  );
  // #endregion

  process.exit(0);
})();
