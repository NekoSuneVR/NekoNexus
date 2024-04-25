import { ModerationFlag } from '@/utils';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ModerationActionAttributes {
  id?: number;
  ModerationFlag?: ModerationFlag;
  SourceCmid?: number;
  SourceName?: string;
  TargetCmid?: number;
  TargetName?: string;
  ActionDate?: Date;
  ExpireTime?: Date | null;
  Reason?: string;
}

export default class ModerationAction extends Model<ModerationActionAttributes> {
  declare id: number;
  declare ModerationFlag: ModerationFlag;
  declare SourceCmid: number;
  declare SourceName: string;
  declare TargetCmid: number;
  declare TargetName: string;
  declare ActionDate: Date;
  declare ExpireTime: Date | null;
  declare Reason: string;

  public static initialize(sequelize: Sequelize) {
    ModerationAction.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        ModerationFlag: DataTypes.INTEGER,
        SourceCmid: DataTypes.INTEGER,
        SourceName: DataTypes.STRING(18),
        TargetCmid: DataTypes.INTEGER,
        TargetName: DataTypes.STRING(18),
        ActionDate: DataTypes.DATE,
        ExpireTime: DataTypes.DATE,
        Reason: DataTypes.TEXT,
      },
      {
        sequelize,
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }) {
    ModerationAction.belongsTo(PublicProfile, {
      foreignKey: 'SourceCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    ModerationAction.belongsTo(PublicProfile, {
      foreignKey: 'TargetCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
