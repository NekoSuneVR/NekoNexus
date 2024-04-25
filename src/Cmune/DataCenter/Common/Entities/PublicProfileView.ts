import EmailAddressStatus from './EmailAddressStatus';
import MemberAccessLevel from './MemberAccessLevel';

export default class PublicProfileView {
  public Cmid: int;
  public Name: string;
  public IsChatDisabled: bool;
  public AccessLevel: MemberAccessLevel;
  public GroupTag: string;
  public LastLoginDate: DateTime;
  public EmailAddressStatus: EmailAddressStatus;
  public FacebookId: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[Public profile: [Member name: ${this.Name}][CMID: ${this.Cmid}][Is banned from chat: ${this.IsChatDisabled}][Access level: ${this.AccessLevel}][Group tag: ${this.GroupTag}][Last login date: ${this.LastLoginDate}][EmailAddressStatus: ${this.EmailAddressStatus}][FacebookId: ${this.FacebookId}]]`;
  }
}
