import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface SteamMemberAttributes {
  SteamId?: string;
  Cmid?: number;
  AuthToken?: string;
  MachineId?: string;
}

export default class SteamMember extends Model<SteamMemberAttributes> {
  declare SteamId: string;
  declare Cmid: number;
  declare AuthToken: string;
  declare MachineId: string;

  public static initialize(sequelize: Sequelize) {
    SteamMember.init(
      {
        SteamId: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        Cmid: DataTypes.INTEGER,
        AuthToken: DataTypes.STRING,
        MachineId: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'SteamMembers',
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }: any) {
    SteamMember.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
