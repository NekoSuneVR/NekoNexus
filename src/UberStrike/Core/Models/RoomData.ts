import ConnectionAddress from './ConnectionAddress';

export default class RoomData {
  [key: string]: any;

  public Guid: string;
  public Name: string;
  public Server: ConnectionAddress;
  public Number: int;
  public IsPasswordProtected: bool;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
