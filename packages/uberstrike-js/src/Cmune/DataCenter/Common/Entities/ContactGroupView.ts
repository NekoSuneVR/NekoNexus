import PublicProfileView from './PublicProfileView';

export default class ContactGroupView {
  [key: string]: any;

  public GroupId: int;
  public GroupName: string;
  public Contacts: List<PublicProfileView>;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[Contact group: [Group ID: ${this.GroupId}][Group Name: ${this.GroupName}}][Contacts: ${this.Contacts.map((_) => `[Contact: ${_.toString()}]`)}]]`;
  }
}
