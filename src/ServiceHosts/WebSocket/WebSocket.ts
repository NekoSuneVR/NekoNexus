import { PublicProfileView } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';

export enum ServerType {
  None,
  MasterServer,
  Comm,
  Game,
}

export class WebSocketInfo {
  [key: string]: any;

  public SocketId: string;
  public Type: ServerType;
  public PhotonId: number;
  public IsClient: boolean;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}

export enum WebSocketState {
  Disconnected,
  Connecting,
  Connected,
  Sending,
  Receiving,
  Disconnecting,
}

export class WebSocketConnectionStatus {
  [key: string]: any;

  public Connected: boolean;
  public Rejected: boolean;
  public DisconnectReason: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}

export class WebSocketChatMessage {
  [key: string]: any;

  public Cmid: int;
  public Name: string;
  public Message: string;
  public RoomNumber: number;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}

export class WebSocketCommand {
  public Command: string;
  public Arguments: string[];
  public Invoker: PublicProfileView;
}

export class RealtimeError {
  public Type: ServerType;
  public ExceptionType: any;
  public Message: string;
  public StackTrace: string;
}
