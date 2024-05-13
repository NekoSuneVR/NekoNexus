export default class GroupInvitationView {
  [key: string]: any;

  public InviterName: string;
  public InviterCmid: int;
  public GroupId: int;
  public GroupName: string;
  public GroupTag: string;
  public GroupInvitationId: int;
  public InviteeName: string;
  public InviteeCmid: int;
  public Message: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[GroupInvitationDisplayView: [InviterCmid: ${this.InviterCmid}][InviterName: ${this.InviterName}][GroupName: ${this.GroupName}][GroupTag: ${this.GroupTag}][GroupId: ${this.GroupId}][GroupInvitationId: ${this.GroupInvitationId}][InviteeCmid: ${this.InviteeCmid}][InviteeName: ${this.InviteeName}][Message:${this.Message}]]`;
  }
}
