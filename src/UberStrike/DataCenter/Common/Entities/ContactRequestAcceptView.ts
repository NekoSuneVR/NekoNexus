import { PublicProfileView } from '@/Cmune/DataCenter/Common/Entities';

export default class ContactRequestAcceptView {
  [key: string]: any;

  public ActionResult: int;
  public Contact: PublicProfileView | null;
  public RequestId: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
