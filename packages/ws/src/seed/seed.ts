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
import mysql from 'mysql2';
import { type Dialect, Sequelize } from 'sequelize';

import applicationConfiguration from './applicationConfiguration.json';
import maps from './maps.json';
import photonServers from './photonServers.json';
import shop from './shop.json';
import users from './users.json';

export default async function runSeed() {
  const sequelize = new Sequelize(
    ServiceSettings.DatabaseSettings.DatabaseName!,
    ServiceSettings.DatabaseSettings.Username!,
    ServiceSettings.DatabaseSettings.Password,
    {
      host: ServiceSettings.DatabaseSettings.Server,
      port: Number(ServiceSettings.DatabaseSettings.Port),
      dialect: ServiceSettings.DatabaseSettings.Type as Dialect,
      dialectModule: mysql, // bundle mysql2 into the compiled exe (no dynamic require)
      logging: false,
      // Single connection so SET FOREIGN_KEY_CHECKS below applies to every query.
      pool: { max: 1, min: 0 },
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

  // Ensure the schema WITHOUT dropping data: `alter` adds/updates columns in place, so existing
  // players, wallets, stats, friends and any admin customizations are preserved across re-runs.
  // FK checks are toggled around the alter because some column changes touch referenced keys.
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  try {
    await sequelize.sync({ alter: true });
    Log.info('Database schema ensured (alter - no data dropped).');
  } catch (e) {
    Log.error('Failed to ensure database schema (check the DB user has ALTER rights).');
    Log.error(String(e));
    process.exit(1);
  }

  // Seed default/reference data ONLY into tables that are currently empty, so re-running the
  // seed on a live server never wipes anything. To re-seed a specific table, empty it first.
  async function seedIfEmpty<T>(model: any, rows: T[], label: string): Promise<void> {
    const existing = await model.count();
    if (existing > 0) {
      Log.info(`Skipping ${label}: ${existing} row(s) already present.`);
      return;
    }
    if (!rows.length) return;
    await model.bulkCreate(rows as any[]);
    Log.info(`Seeded ${rows.length} ${label}.`);
  }

  await seedIfEmpty(
    models.ApplicationConfiguration,
    applicationConfiguration as Partial<ApplicationConfiguration>[],
    'application configuration',
  );
  await seedIfEmpty(models.PublicProfile, users as Partial<PublicProfile>[], 'default users');

  // Photon servers: the IP is what the GAME CLIENT connects to, so it must be reachable from the
  // player's machine - override with PARADISE_PUBLIC_HOST (your public IP/domain). Only seeded
  // when empty; change/add servers later in the admin dashboard (Servers page).
  const publicHost = process.env.PARADISE_PUBLIC_HOST?.trim();
  const photonRows = (photonServers as Partial<PhotonServer>[]).map((s) =>
    publicHost ? { ...s, IP: publicHost } : s,
  );
  if (publicHost) Log.info(`Realtime server list will use public host: ${publicHost}`);
  await seedIfEmpty(models.PhotonServer, photonRows, 'realtime servers');

  // Shop items + prices.
  await seedIfEmpty(models.ShopFunctionalItem, shop.FunctionalItems as Partial<ShopFunctionalItem>[], 'functional items');
  await seedIfEmpty(models.ShopGearItem, shop.GearItems as Partial<ShopGearItem>[], 'gear items');
  await seedIfEmpty(models.ShopQuickItem, shop.QuickItems as any[] as Partial<ShopQuickItem>[], 'quick items');
  await seedIfEmpty(models.ShopWeaponItem, shop.WeaponItems as Partial<ShopWeaponItem>[], 'weapon items');

  const priceRows = [shop.FunctionalItems, shop.GearItems, shop.QuickItems, shop.WeaponItems].reduce(
    (acc: any[], group: any[]) => {
      for (const item of group) {
        if (item.Prices && item.Prices.length) {
          acc.push(...item.Prices.map((price: any) => ({ ...price, ID: item.ID })));
        }
      }
      return acc;
    },
    [],
  );
  await seedIfEmpty(models.ShopItemPrice, priceRows, 'shop prices');

  // Maps + map settings.
  await seedIfEmpty(models.Map, maps as Partial<Map>[], 'maps');
  const mapSettings = maps.reduce((acc: any[], cur) => {
    Object.entries(cur.Settings).forEach(([key, value]) => {
      acc.push({ ...(value as object), MapId: cur.MapId, GameModeType: key });
    });
    return acc;
  }, []);
  await seedIfEmpty(models.MapSettings, mapSettings, 'map settings');

  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

  Log.info('Database seed complete (existing data preserved).');
  process.exit(0);
}

// Allow running directly: `bun src/seed/seed.ts`
if (import.meta.main) {
  runSeed();
}
