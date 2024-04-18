import { PublicProfileView } from '@/Cmune/DataCenter/Common/Entities';

export default class ContactRequestAcceptView {
  public ActionResult: int;
  public Contact: PublicProfileView | null;
  public RequestId: int;
}
