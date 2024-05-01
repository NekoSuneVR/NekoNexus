import moment from 'moment';
import { DataTypes, Model, type Sequelize } from 'sequelize';
import PublicProfile from './PublicProfile';
import SteamMember from './SteamMember';

const SESSION_EXPIRE_HOURS = 12;

export interface GameSessionAttributes {
  SessionId?: string;
  Cmid?: number;
  MachineId?: string;
  ExpireTime?: Date;
}

export default class GameSession extends Model<GameSessionAttributes> {
  declare SessionId: string;
  declare Cmid: number;
  declare MachineId: string;
  declare ExpireTime: Date;

  public static initialize(sequelize: Sequelize) {
    GameSession.init(
      {
        SessionId: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        Cmid: DataTypes.INTEGER,
        MachineId: DataTypes.STRING,
        ExpireTime: {
          type: DataTypes.DATE,
          // defaultValue: function() {
          //   var date = new Date();
          //   date.setHours(date.getHours() + SESSION_EXPIRE_HOURS);

          //   return date;
          // }
        },
      },
      {
        sequelize,
        tableName: 'GameSessions',
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }: any) {
    GameSession.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }

  public extendExpireTime(): void {
    this.update({
      ExpireTime: moment(new Date()).add(SESSION_EXPIRE_HOURS, 'hours').toDate(),
    });
  }

  public get Profile(): Promise<PublicProfile | null> {
    return PublicProfile.findOne({ where: { Cmid: this.Cmid } });
  }

  public get SteamMember(): Promise<SteamMember | null> {
    return SteamMember.findOne({ where: { Cmid: this.Cmid } });
  }

  public static getCmidFromSessionId(sessionId: string): number {
    if (!sessionId.trim().length) return -1;
    return Buffer.from([...Buffer.from(sessionId, 'base64')].slice(0, 4)).readInt32LE();
  }

  public static getSteamIdFromSessionId(sessionId: string): bigint {
    if (!sessionId.trim().length) return -1n;
    return Buffer.from([...Buffer.from(sessionId, 'base64')].slice(4, 8)).readBigUInt64LE();
  }
}
