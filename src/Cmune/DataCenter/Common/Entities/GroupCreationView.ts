export default class GroupCreationView {
  public Name: string;
  public Description: string;
  public Motto: string;
  public Address: string;
  public HasPicture: bool;
  public ApplicationId: int;
  public AuthToken: string;
  public Tag: string;
  public Locale: string;
  public Cmid: int; // # LEGACY # //

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
  public toString(): string {
    return `[GroupCreationView: [name:${this.Name}][description:${this.Description}][Motto:${this.Motto}][Address:${this.Address}][Has picture:${this.HasPicture}][Application Id:${this.ApplicationId}][AuthToken:${this.AuthToken}][Tag:${this.Tag}][Locale:${this.Locale}]]`;
  }
}
