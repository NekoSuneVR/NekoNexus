import { PhotonView } from '@/Cmune/Core/Models/Views';
import BuildType from './BuildType';
import ChannelType from './ChannelType';

export default class ApplicationView {
  [key: string]: any;

  public ApplicationVersionId: int;
  public Version: string;
  public Build: BuildType;
  public Channel: ChannelType;
  public FileName: string;
  public ReleaseDate: DateTime;
  public ExpirationDate?: DateTime;
  public RemainingTime: int;
  public IsCurrent: bool;
  public Servers: List<PhotonView> = [];
  public SupportUrl: string;
  public PhotonGroupId: int;
  public PhotonGroupName: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });

    let num = -1;

    if (params.ExpirationDate != null) {
      const value = params.ExpirationDate;

      if (value.getTime() - new Date().getTime() <= 0) {
        num = 0;
      } else {
        num = Math.floor((new Date().getTime() - value.getTime()) / 1000 / 60);
      }

      this.RemainingTime = num;
    }
  }

  public toString(): string {
    return `[Application: [ID: ${this.ApplicationVersionId}][version: ${this.Version}][Builld: ${this.Build}][Channel: ${this.Channel}][File name: ${this.FileName}][Release date: ${this.ReleaseDate}][Expiration date: ${this.ExpirationDate}][Remaining time: ${this.RemainingTime}][Is current: ${this.IsCurrent}][Support URL: ${this.SupportUrl}][Servers]${this.Servers.map((_) => _.toString()).join('')}[/Servers]]`;
  }
}
