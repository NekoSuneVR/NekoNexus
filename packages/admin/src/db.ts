import models from '@festivaldev/paradise-models';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2';
import { Sequelize } from 'sequelize';
import { type AdminConfig } from './config';

export let sequelize: Sequelize;

export async function initDatabase(cfg: AdminConfig) {
  sequelize = new Sequelize(cfg.db.database, cfg.db.user, cfg.db.password, {
    host: cfg.db.host,
    port: cfg.db.port,
    dialect: 'mysql',
    dialectModule: mysql,
    logging: false,
  });

  // Initialize all models against this connection (so associations/columns line up with the
  // tables the web service created).
  for (const model of Object.values(models) as any[]) model.initialize?.(sequelize);
  for (const model of Object.values(models) as any[]) model.associate?.(models);

  await sequelize.authenticate();

  // Ensure our tables (and the new PhotonServer.Enabled column) exist without dropping any
  // game data: alter-sync only the tables we own/extend.
  await models.AdminUser.sync({ alter: true });
  await models.CreditPackage.sync({ alter: true });
  await models.PaymentOrder.sync({ alter: true });
  try {
    await models.PhotonServer.sync({ alter: true });
  } catch {
    /* PhotonServers may be managed by the web service seed; ignore alter conflicts */
  }

  await ensureDefaultAdmin();
}

// Create a default admin/admin login on first run. The user is prompted to change it.
async function ensureDefaultAdmin() {
  const count = await models.AdminUser.count();
  if (count === 0) {
    const hash = await bcrypt.hash('admin', 10);
    await models.AdminUser.create({ Username: 'admin', PasswordHash: hash } as any);
    // eslint-disable-next-line no-console
    console.log('[admin] Created default admin account -> username: admin  password: admin  (change this!)');
  }
}
