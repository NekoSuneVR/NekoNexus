import { PhotonView } from '@/Cmune/Core/Models/Views';

export default class GameApplicationView {
  public Version: string;
  public GameServers: List<PhotonView>;
  public CommServer: PhotonView;
  public SupportUrl: string;
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
