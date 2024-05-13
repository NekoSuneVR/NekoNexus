import ContactRequestStatus from './ContactRequestStatus';

export default class ContactRequestView {
  [key: string]: any;

  public RequestId: int;
  public InitiatorCmid: int;
  public InitiatorName: string;
  public ReceiverCmid: int;
  public InitiatorMessage: string;
  public Status: ContactRequestStatus;
  public SentDate: DateTime;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[Request contact: [Request ID: ${this.RequestId}][Initiator Cmid :${this.InitiatorCmid}][Initiator Name:${this.InitiatorName}][Receiver Cmid: ${this.ReceiverCmid}][InitiatorMessage: ${this.InitiatorMessage}][Status: ${this.Status}][Sent Date: ${this.SentDate}]]`;
  }
}
