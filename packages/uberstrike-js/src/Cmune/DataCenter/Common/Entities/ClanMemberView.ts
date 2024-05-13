import GroupPosition from './GroupPosition';

export default class ClanMemberView {
  [key: string]: any;

  public Name: string;
  public Cmid: int;
  public Position: GroupPosition;
  public JoiningDate: DateTime;
  public Lastlogin: DateTime;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[Clan member: [Name: ${this.Name}][Cmid: ${this.Cmid}][Position: ${this.Position}][JoiningDate: ${this.JoiningDate}][Lastlogin: ${this.Lastlogin}]]`;
  }
}
