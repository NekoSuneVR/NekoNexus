export default class PrivateMessageView {
  public PrivateMessageId: int;
  public FromCmid: int;
  public FromName: string;
  public ToCmid: int;
  public DateSent: DateTime;
  public ContentText: string;
  public IsRead: bool;
  public HasAttachment: bool;
  public IsDeletedBySender: bool;
  public IsDeletedByReceiver: bool;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[Private Message: [ID:${this.PrivateMessageId},][From:${this.FromCmid}][To:${this.ToCmid}][Date:${this.DateSent}][[Content:${this.ContentText}][Is Read:${this.IsRead}][Has attachment:${this.HasAttachment}][Is deleted by sender:${this.IsDeletedBySender}][Is deleted by receiver:${this.IsDeletedByReceiver}]]`;
  }
}
