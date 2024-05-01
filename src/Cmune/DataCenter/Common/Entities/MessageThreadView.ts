export default class MessageThreadView {
  [key: string]: any;

  public ThreadId: int;
  public ThreadName: string;
  public HasNewMessages: bool;
  public MessageCount: int;
  public LastMessagePreview: string;
  public LastUpdate: DateTime;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
