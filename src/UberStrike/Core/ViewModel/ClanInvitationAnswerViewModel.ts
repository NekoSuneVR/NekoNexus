export default class ClanInvitationAnswerViewModel {
  [key: string]: any;

  public ReturnValue: int;
  public GroupInvitationId: int;
  public IsInvitationAccepted: bool;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
