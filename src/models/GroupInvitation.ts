import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface GroupInvitationAttributes {
  InviterName?: string;
  InviterCmid?: number;
  GroupId?: number;
  GroupName?: string;
  GroupTag?: string;
  GroupInvitationId?: number;
  InviteeName?: string;
  InviteeCmid?: number;
  Message?: string;
}

export default class GroupInvitation extends Model<GroupInvitationAttributes> {
  declare InviterName: string;
  declare InviterCmid: number;
  declare GroupId: number;
  declare GroupName: string;
  declare GroupTag: string;
  declare GroupInvitationId: number;
  declare InviteeName: string;
  declare InviteeCmid: number;
  declare Message: string;

  public static initialize(sequelize: Sequelize) {
    GroupInvitation.init(
      {
        InviterName: DataTypes.STRING(18),
        InviterCmid: DataTypes.INTEGER,
        GroupId: DataTypes.INTEGER,
        GroupName: DataTypes.STRING(25),
        GroupTag: DataTypes.STRING(5),
        GroupInvitationId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        InviteeName: DataTypes.STRING(18),
        InviteeCmid: DataTypes.INTEGER,
        Message: DataTypes.TEXT,
      },
      {
        sequelize,
        tableName: 'GroupInvitations',
        timestamps: false,
      },
    );
  }

  public static associate({ Clan, PublicProfile }: any) {
    GroupInvitation.belongsTo(Clan, {
      foreignKey: 'GroupId',
      targetKey: 'GroupId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    GroupInvitation.belongsTo(PublicProfile, {
      foreignKey: 'InviterCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    GroupInvitation.belongsTo(PublicProfile, {
      foreignKey: 'InviteeCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
