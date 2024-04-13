import { ChannelType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ActivePlayerAttributes {
  Cmid?: number;
  IPAddress?: string;
  Channel?: ChannelType
  CommServerId?: number | null;
  GameServerId?: number | null;
  GameRoomId?: number | null;
}

export default class ActivePlayer extends Model<ActivePlayerAttributes> {
  declare Cmid: number;
  declare IPAddress: string;
  declare Channel: ChannelType;
  declare CommServerId: number | null;
  declare GameServerId: number | null;
  declare GameRoomId: number | null;

  public static initialize(sequelize: Sequelize) {
    ActivePlayer.init({
      Cmid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      IPAddress: DataTypes.STRING,
      Channel: DataTypes.INTEGER,
      CommServerId: DataTypes.INTEGER,
      GameServerId: DataTypes.INTEGER,
      GameRoomId: DataTypes.INTEGER,
    }, {
      sequelize,
      timestamps: false,
    });
  }

  public static associate({ PublicProfile, PhotonServer, GameRoom }) {
    ActivePlayer.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
