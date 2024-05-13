import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';

export default class ServerConnectionView {
  public ApiVersion: string;
  public Cmid: int;
  public Channel: ChannelType;
  public AccessLevel: MemberAccessLevel;

  constructor(params: any = {}) {
    Object.assign(params);
  }
}
