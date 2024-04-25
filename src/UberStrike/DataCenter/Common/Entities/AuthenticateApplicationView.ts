import { PhotonView } from '@/Cmune/Core/Models/Views';

export default class AuthenticateApplicationView {
  public GameServers: List<PhotonView>;
  public CommServer: PhotonView;
  public WarnPlayer: bool;
  public IsEnabled: bool;
  public EncryptionInitVector: string;
  public EncryptionPassPhrase: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
