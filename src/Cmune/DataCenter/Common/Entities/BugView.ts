export default class BugView {
  public Content: string;
  public Subject: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[Bug: [Subject: ${this.Subject}][Content :${this.Content}]]`;
  }
}
