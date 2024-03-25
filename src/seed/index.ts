// eslint-disable-next-line import/no-named-default
import { ParadiseServiceSettings } from '@/ParadiseServiceSettings';
import models from '@/models';
import { Log } from '@/utils';
import path from 'path';
import { Dialect, Sequelize } from 'sequelize';

(async () => {
  const ServiceSettings: ParadiseServiceSettings = new ParadiseServiceSettings(path.join(process.cwd(), '../../Paradise.Settings.WebServices.yml'));

  const sequelize = new Sequelize(ServiceSettings.DatabaseSettings.DatabaseName!, ServiceSettings.DatabaseSettings.Username!, ServiceSettings.DatabaseSettings.Password, {
    host: ServiceSettings.DatabaseSettings.Server,
    port: Number(ServiceSettings.DatabaseSettings.Port),
    dialect: (ServiceSettings.DatabaseSettings.Type as Dialect),
    logging: false,
  });

  Log.info('Connecting to database...');
  Log.debug(`Type:${ServiceSettings.DatabaseSettings.Type} Database:${ServiceSettings.DatabaseSettings.DatabaseName} Auth:'${ServiceSettings.DatabaseSettings.Username}'@'${ServiceSettings.DatabaseSettings.Server}:${ServiceSettings.DatabaseSettings.Port}' (using password: ${ServiceSettings.DatabaseSettings.Password?.length! > 0 ? 'YES' : 'NO'})`);
  for (const [modelName, model] of Object.entries(models)) {
    model.initialize(sequelize);
  }

  for (const [modelName, model] of Object.entries(models)) {
    model.associate?.(models);
  }

  try {
    await sequelize.sync();
    Log.info('Database opened.');
  } catch { }

  // #region Users
  const users = require('./users.json');
  await models.PublicProfile.destroy({ where: {} });
  await models.PublicProfile.bulkCreate(users);
  // #endregion

  // #region Photon Servers
  const photonServers = require('./photonServers.json');
  await models.PhotonServer.destroy({ where: {} });
  await models.PhotonServer.bulkCreate(photonServers);
  // #endregion

  // #region Shop
  const shop = require('./shop.json');
  await models.ShopFunctionalItem.destroy({ where: {} });
  await models.ShopGearItem.destroy({ where: {} });
  await models.ShopQuickItem.destroy({ where: {} });
  await models.ShopWeaponItem.destroy({ where: {} });

  await models.ShopFunctionalItem.bulkCreate(shop.FunctionalItems);
  await models.ShopGearItem.bulkCreate(shop.GearItems);
  await models.ShopQuickItem.bulkCreate(shop.QuickItems);
  await models.ShopWeaponItem.bulkCreate(shop.WeaponItems);

  await models.ShopItemPrice.destroy({ where: {} });
  await models.ShopItemPrice.bulkCreate(shop.FunctionalItems.reduce((acc, item) => {
    if (!item.Prices || !item.Prices.length) return acc;
    acc.push(...item.Prices.map((price) => ({ ...price, ID: item.ID })));
    return acc;
  }, []));
  await models.ShopItemPrice.bulkCreate(shop.GearItems.reduce((acc, item) => {
    if (!item.Prices || !item.Prices.length) return acc;
    acc.push(...item.Prices.map((price) => ({ ...price, ID: item.ID })));
    return acc;
  }, []));
  await models.ShopItemPrice.bulkCreate(shop.QuickItems.reduce((acc, item) => {
    if (!item.Prices || !item.Prices.length) return acc;
    acc.push(...item.Prices.map((price) => ({ ...price, ID: item.ID })));
    return acc;
  }, []));
  await models.ShopItemPrice.bulkCreate(shop.WeaponItems.reduce((acc, item) => {
    if (!item.Prices || !item.Prices.length) return acc;
    acc.push(...item.Prices.map((price) => ({ ...price, ID: item.ID })));
    return acc;
  }, []));
  // #endregion

  // #region Maps
  const maps = require('./maps.json');
  await models.Map.destroy({ where: {} });

  await models.Map.bulkCreate(maps);
  await models.MapSettings.bulkCreate(maps.reduce((acc, cur) => {
    Object.entries(cur.Settings).forEach(([key, value]) => {
      acc.push({
        ...(value as object),
        MapId: cur.MapId,
        GameModeType: key,
      });
    });

    return acc;
  }, []));
  // #endregion

  process.exit(0);
})();
