import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface DiscordUserAttributes {
  Cmid?: number;
  DiscordUserId?: string | null;
  Nonce?: string | null;
  Completed?: boolean;
}

export default class DiscordUser extends Model<DiscordUserAttributes> {
  declare Cmid: number;
  declare DiscordUserId: string | null;
  declare Nonce: string | null;
  declare Completed: boolean;

  public static initialize(sequelize: Sequelize) {
    DiscordUser.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        DiscordUserId: DataTypes.STRING,
        Nonce: {
          type: DataTypes.TEXT,
          unique: true,
        },
        Completed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }) {
    DiscordUser.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
