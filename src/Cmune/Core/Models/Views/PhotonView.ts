import { PhotonUsageType, RegionType } from '@/Cmune/DataCenter/Common/Entities';

export default class PhotonView {
  public PhotonId: int;
  public IP: string;
  public Name: string;
  public Region: RegionType;
  public Port: int;
  public UsageType: PhotonUsageType;
  public MinLatency: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
