import { Log } from '@/utils';
import {
  ArrayProxy, ByteProxy, CommActorInfoProxy, DictionaryProxy, EndOfMatchDataProxy, GameActorInfoProxy, GameRoomDataProxy, Int32Proxy, StringProxy,
} from 'uberstrike-js/dist/UberStrike/Core/Serialization';
import { v4 as uuid } from 'uuid';
import WebSocketPacketType from './PacketType';
import RijndaelCryptoProvider from './RijndaelCryptoProvider';
import { ServerType } from './WebSocket';

enum PayloadFlags {
  IsSerialized = 1 << 0,
  IsEncrypted = 1 << 1,
  IsOneWay = 1 << 2
}

export default class WebSocketPayload {
  public Type: WebSocketPacketType;
  public Data: string;
  public ServerType: ServerType;
  public Flags: PayloadFlags;
  public ConversationId: string;

  public get IsSerialized(): bool {
    return (this.Flags & PayloadFlags.IsSerialized) === PayloadFlags.IsSerialized;
  }
  private set IsSerialized(value: bool) {
    if (value) {
      this.Flags |= PayloadFlags.IsSerialized;
    } else {
      this.Flags &= ~PayloadFlags.IsSerialized;
    }
  }

  public get IsEncrypted(): bool {
    // return false;
    return (this.Flags & PayloadFlags.IsEncrypted) === PayloadFlags.IsEncrypted;
  }
  private set IsEncrypted(value: bool) {
    if (value) {
      this.Flags |= PayloadFlags.IsEncrypted;
    } else {
      this.Flags &= ~PayloadFlags.IsEncrypted;
    }
  }

  public get IsOneWay(): bool {
    return (this.Flags & PayloadFlags.IsOneWay) === PayloadFlags.IsOneWay;
  }
  private set IsOneWay(value: bool) {
    if (value) {
      this.Flags |= PayloadFlags.IsOneWay;
    } else {
      this.Flags &= ~PayloadFlags.IsOneWay;
    }
  }

  constructor(params: any = {}) {
    Object.keys(params).filter((key) => key in this).forEach((key) => { this[key] = params[key]; });
  }

  public static Encode(type: WebSocketPacketType, data: any, crypto: RijndaelCryptoProvider | null, oneWay: boolean = false, conversationId: string | null = null, serverType: ServerType = ServerType.None): [byte[] | null, WebSocketPayload | null] {
    if (!conversationId) {
      conversationId = uuid();
    }

    const payloadObj = new WebSocketPayload({
      Type: type,
      ServerType: serverType,
      ConversationId: conversationId,
      IsOneWay: oneWay,
    });

    const outputBytes: any[] = [];
    const bytes: any[] = [];

    switch (type) {
      case WebSocketPacketType.MagicBytes:
      case WebSocketPacketType.Ping:
      case WebSocketPacketType.Pong:
        break;
      case WebSocketPacketType.ClientInfo:
      case WebSocketPacketType.ConnectionStatus:
        StringProxy.Serialize(bytes, JSON.stringify(data));
        break;
      case WebSocketPacketType.Command:
      case WebSocketPacketType.Error:
      case WebSocketPacketType.ChatMessage:
        payloadObj.IsEncrypted = true;

        StringProxy.Serialize(bytes, JSON.stringify(data));
        break;
      case WebSocketPacketType.RoomChatMessage: {
        payloadObj.IsEncrypted = true;

        const list = data as any[];
        StringProxy.Serialize(bytes, JSON.stringify(data));
        GameRoomDataProxy.Serialize(bytes, list[0]);
        break;
      }
      case WebSocketPacketType.CommandOutput:
        payloadObj.IsEncrypted = true;

        StringProxy.Serialize(bytes, data);
        break;
      case WebSocketPacketType.Monitoring:
      case WebSocketPacketType.BanPlayer:
        payloadObj.IsEncrypted = true;

        DictionaryProxy.Serialize<string, object>(bytes, data, StringProxy.Serialize, (stream, instance) => {
          StringProxy.Serialize(stream, JSON.stringify(instance));
        });
        break;
      case WebSocketPacketType.PlayerList:
        /// TODO
        break;
      case WebSocketPacketType.PlayerJoined:
      case WebSocketPacketType.PlayerLeft:
        payloadObj.IsEncrypted = true;

        CommActorInfoProxy.Serialize(bytes, data);
        break;
      case WebSocketPacketType.RoomOpened:
      case WebSocketPacketType.RoomClosed:
        payloadObj.IsEncrypted = true;

        GameRoomDataProxy.Serialize(bytes, data);
        break;
      case WebSocketPacketType.PlayerJoinedRoom:
      case WebSocketPacketType.PlayerLeftRoom: {
        payloadObj.IsEncrypted = true;

        const list = data as any[];
        GameActorInfoProxy.Serialize(bytes, list[0]);
        GameRoomDataProxy.Serialize(bytes, list[1]);
        break;
      }
      case WebSocketPacketType.RoundStarted: {
        payloadObj.IsEncrypted = true;

        const list = data as any[];
        GameRoomDataProxy.Serialize(bytes, list[0]);
        break;
      }
      case WebSocketPacketType.RoundEnded: {
        payloadObj.IsEncrypted = true;

        const list = data as any[];
        GameRoomDataProxy.Serialize(bytes, list[0]);
        EndOfMatchDataProxy.Serialize(bytes, list[1]);
        break;
      }
      case WebSocketPacketType.OpenRoom:
        /// TODO
        break;
      case WebSocketPacketType.CloseRoom:
        payloadObj.IsEncrypted = true;

        Int32Proxy.Serialize(bytes, data);
        break;
      default:
        Log.warn(`Rejecting to encode payload of type ${WebSocketPacketType[type]}: Unknown type.`);
        return [null, null];
    }

    if (crypto != null && payloadObj.IsEncrypted) {
      payloadObj.Data = crypto.encrypt(Buffer.from(bytes)).toString('base64');
    } else {
      payloadObj.Data = Buffer.from(bytes).toString('base64');
    }

    ArrayProxy.Serialize<byte>(outputBytes, [...Buffer.from(JSON.stringify(payloadObj))], ByteProxy.Serialize);

    return [[...Buffer.from(JSON.stringify(payloadObj))], payloadObj];
  }

  public static Decode<T>(json: string, crypto: RijndaelCryptoProvider | null): [T | null, WebSocketPayload | null] {
    if (!json.trim().length) return [null, null];

    let payloadObj;
    try {
      payloadObj = new WebSocketPayload(JSON.parse(json));
    } catch (e: any) {
      Log.info(json);
      Log.error(e);

      return [null, null];
    }

    if (!payloadObj) return [null, null];

    let data = Buffer.from(payloadObj.Data, 'base64');
    if (crypto != null && payloadObj.IsEncrypted) {
      data = crypto.decrypt(data);
    }

    const bytes = [...data];
    let result: any;
    switch (payloadObj.Type) {
      case WebSocketPacketType.MagicBytes:
      case WebSocketPacketType.Ping:
      case WebSocketPacketType.Pong:
        break;
      case WebSocketPacketType.ClientInfo:
      case WebSocketPacketType.ConnectionStatus:
      case WebSocketPacketType.Command:
      case WebSocketPacketType.Error:
      case WebSocketPacketType.CommandOutput:
      case WebSocketPacketType.ChatMessage:
        result = JSON.parse(StringProxy.Deserialize(bytes));
        break;
      case WebSocketPacketType.RoomChatMessage:
        result = [
          JSON.parse(StringProxy.Deserialize(bytes)),
          GameRoomDataProxy.Deserialize(bytes),
        ];

        break;
      case WebSocketPacketType.Monitoring:
      case WebSocketPacketType.BanPlayer:
        result = DictionaryProxy.Deserialize<string, object>(bytes, StringProxy.Deserialize, (stream) => JSON.parse(StringProxy.Deserialize(stream)));
        break;
      case WebSocketPacketType.PlayerList:
        /// TODO;
        break;
      case WebSocketPacketType.PlayerJoined:
      case WebSocketPacketType.PlayerLeft:
        result = CommActorInfoProxy.Deserialize(bytes);
        break;
      case WebSocketPacketType.RoomOpened:
      case WebSocketPacketType.RoomClosed:
        result = GameRoomDataProxy.Deserialize(bytes);
        break;
      case WebSocketPacketType.PlayerJoinedRoom:
      case WebSocketPacketType.PlayerLeftRoom:
        result = [
          GameActorInfoProxy.Deserialize(bytes),
          GameRoomDataProxy.Deserialize(bytes),
        ];
        break;
      case WebSocketPacketType.RoundStarted:
        result = [
          GameRoomDataProxy.Deserialize(bytes),
        ];
        break;
      case WebSocketPacketType.RoundEnded:
        result = [
          GameRoomDataProxy.Deserialize(bytes),
          EndOfMatchDataProxy.Deserialize(bytes),
        ];
        break;
      case WebSocketPacketType.OpenRoom:
        /// TODO
        break;
      case WebSocketPacketType.CloseRoom:
        result = Int32Proxy.Deserialize(bytes);
        break;
      default:
        Log.warn(`Rejecting to decode payload of type ${WebSocketPacketType[payloadObj.Type]}: Unknown type.`);
        break;
    }

    return [result as T, payloadObj];
  }
}
