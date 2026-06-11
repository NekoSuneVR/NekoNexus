/*
 * NekoNexus admin dashboard user. Stores the admin login (username + bcrypt hash).
 */

import { DataTypes, Model, type Sequelize } from 'sequelize';

interface AdminUserAttributes {
  Id?: number;
  Username?: string;
  PasswordHash?: string;
  LastLogin?: Date;
}

export default class AdminUser extends Model<AdminUserAttributes> {
  declare Id: number;
  declare Username: string;
  declare PasswordHash: string;
  declare LastLogin: Date;

  static initialize(sequelize: Sequelize) {
    AdminUser.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        Username: {
          type: DataTypes.STRING(64),
          allowNull: false,
          unique: true,
        },
        PasswordHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        LastLogin: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'AdminUsers',
        timestamps: true,
      },
    );
  }

  static associate(_: any) {}
}
