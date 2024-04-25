import GroupColor from './GroupColor';
import GroupFontStyle from './GroupFontStyle';
import GroupType from './GroupType';

export default class BasicClanView {
  public GroupId: int;
  public MembersCount: int;
  public Description: string;
  public Name: string;
  public Motto: string;
  public Address: string;
  public FoundingDate: DateTime;
  public Picture: string;
  public Type: GroupType;
  public LastUpdated: DateTime;
  public Tag: string;
  public MembersLimit: int;
  public ColorStyle: GroupColor;
  public FontStyle: GroupFontStyle;
  public ApplicationId: int;
  public OwnerCmid: int;
  public OwnerName: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[Clan: [Id: ${this.GroupId}][Members count: ${this.MembersCount}][Description: ${this.Description}][Name: ${this.Name}][Motto: ${this.Motto}][Address: ${this.Address}][Creation date: ${this.FoundingDate}][Picture: ${this.Picture}][Tyoe: ${this.Type}][Last updated: ${this.LastUpdated}][Tag: ${this.Tag}][Members limit: ${this.MembersLimit}][Color style: ${this.ColorStyle}][Font style: ${this.FontStyle}][Application id: ${this.ApplicationId}][Owner Cmid: ${this.OwnerCmid}][Owner name: ${this.OwnerName}]]`;
  }
}
