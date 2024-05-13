import { Socket } from 'net';
import * as ws from 'ws';

declare module 'ws' {
  export interface WebSocket extends ws {
    _socket: Socket;
  }
}
