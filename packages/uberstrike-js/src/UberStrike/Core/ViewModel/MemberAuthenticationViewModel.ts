import { MemberAuthenticationResult, MemberView } from '@/Cmune/DataCenter/Common/Entities';

export default class MemberAuthenticationViewModel {
  [key: string]: any;

  public MemberAuthenticationResult: MemberAuthenticationResult;
  public MemberView: MemberView;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
