import { MemberView } from '@/Cmune/DataCenter/Common/Entities';
import { UberstrikeMemberView } from '@/UberStrike/DataCenter/Common/Entities';

export default class UberstrikeUserViewModel {
  [key: string]: any;

  public CmuneMemberView: MemberView;
  public UberstrikeMemberView: UberstrikeMemberView;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
