import GroupPosition from './GroupPosition';

export default class MemberPositionUpdateView {
  [key: string]: any;

  public GroupId: int;
  public AuthToken: string;
  public MemberCmid: int;
  public Position: GroupPosition;
  public CmidMakingAction: int; // # LEGACY # //

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[MemberPositionUpdateView: [GroupId:${this.GroupId}][AuthToken:${this.AuthToken}][MemberCmid:${this.MemberCmid}][Position:${this.Position}]]`;
  }
}
