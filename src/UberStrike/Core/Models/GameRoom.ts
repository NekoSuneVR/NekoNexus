import ConnectionAddress from './ConnectionAddress';

export default class GameRoom {
  public Server: ConnectionAddress;
  public Number: int;
  public MapId: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
