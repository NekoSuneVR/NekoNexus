import { type WebSocket } from 'ws';
import WebSocketConnection from './Connection';
import WebSocketPacketType from './PacketType';
import WebSocketPayload from './Payload';
import { ServerType, WebSocketInfo } from './WebSocket';

export class WebSocketConnectedEventArgs {
  public Socket: WebSocket;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}

export class WebSocketDisconnectedEventArgs {
  public Info: WebSocketInfo;
  public Socket: WebSocket;
  public Code: number;
  public Reason: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}

export class WebSocketDataReceivedEventArgs {
  public Socket: WebSocketConnection;
  public BytesReceived: number;

  public Payload: WebSocketPayload;
  public Data: any;
  public ServerType: ServerType;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public get Type(): WebSocketPacketType {
    return this.Payload.Type;
  }
}

export class WebSocketPacketReceivedEventArgs {
  public Socket: WebSocketConnection;
  public PacketType: WebSocketPacketType;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}

export class WebSocketDataSentEventArgs {
  public Socket: WebSocket;
  public BytesSent: number;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}

export class WebSocketConnectionRejectedEventArgs {
  public Info: WebSocketInfo;
  public Socket: WebSocket;
  public Reason: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}

export class WebSocketStateChangedEventArgs {
  public Socket: WebSocket;
  // public State: SocketState;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
