import { EnumProxy, Int32Proxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import { WebSocket } from 'ws';
import PacketType from './PacketType';
import WebSocketPayload from './Payload';
import RijndaelCryptoProvider from './RijndaelCryptoProvider';
import { ServerType, WebSocketInfo, WebSocketState } from './WebSocket';

const CONNECT_TIMEOUT = 5;
const RECONNECT_INTERVAL = 10;
const MAX_RECONNECT = 10;
const SEND_TIMEOUT = 3;
const RECEIVE_TIMEOUT = 3;
const PING_INTERVAL = 10;

export default class WebSocketConnection {
  public ConnectionId: string;
  public Socket: WebSocket;
  public Info: WebSocketInfo;
  public CryptoProvider: RijndaelCryptoProvider;
  public DisconnectReason: string;
  public LastResponseTime: Date;

  private sendTask?: Promise<void>;
  private receiveTask?: Promise<void>;

  private pingTask?: ReturnType<typeof setInterval>;
  private pingDisconnect?: ReturnType<typeof setTimeout>;

  constructor(params: any = {}) {
    Object.keys(params).filter((key) => key in this).forEach((key) => { this[key] = params[key]; });
  }

  private connectionState: WebSocketState = WebSocketState.Disconnected;
  public get ConnectionState(): WebSocketState {
    return this.connectionState;
  }

  private set ConnectionState(value: WebSocketState) {
    this.connectionState = value;
  }

  public get RemoteAddress(): string | undefined {
    return this.Socket._socket.remoteAddress;
  }

  public get Identifier(): string {
    return this.Info.SocketId;
  }

  public get Type(): ServerType {
    return this.Info.Type;
  }

  public get IsConnected(): boolean {
    return this.Socket.readyState === WebSocket.OPEN;
  }

  public async SendBytes(bytes: Buffer | byte[] | Uint8Array) {
    if (!this.IsConnected) return;

    if (this.sendTask) await this.sendTask;
    if (this.receiveTask) await this.receiveTask;

    try {
      this.ConnectionState = WebSocketState.Sending;

      this.sendTask = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.sendTask = undefined;
          reject(new Error(`Failed to send data within ${SEND_TIMEOUT} second(s).`));
        }, SEND_TIMEOUT * 1000);

        this.Socket.send(bytes, (error) => {
          clearTimeout(timer);
          if (error) return reject(error);
          return resolve();
        });
      });

      await this.sendTask;
      this.sendTask = undefined;
      this.ConnectionState = WebSocketState.Connected;
    } catch {

    }
  }

  public async SendPacket(type: PacketType) {
    const bytes = [];

    Int32Proxy.Serialize(bytes, 0x42);
    EnumProxy.Serialize<PacketType>(bytes, type);

    await this.SendBytes(bytes);
  }

  public async Send(type: PacketType, payload: any, oneWay: boolean = true, conversationId: string | null = null, serverType: ServerType = ServerType.None) {
    const [bytes, payloadObj] = WebSocketPayload.Encode(type, payload, this.CryptoProvider, oneWay, conversationId, serverType);
    await this.SendBytes(bytes!);

    if (oneWay) return null;
  }

  public OnOpen(): void {
    this.pingTask = setInterval(() => {
      this.SendPacket(PacketType.Ping);

      this.pingDisconnect = setTimeout(() => {
        this.Socket.close();
      }, RECEIVE_TIMEOUT * 1000);
    }, PING_INTERVAL * 1000);
  }

  public OnClose(): void {
    clearInterval(this.pingTask);
  }

  public ResetPingTimeout(): void {
    this.LastResponseTime = new Date();
    clearTimeout(this.pingDisconnect);
  }
}
