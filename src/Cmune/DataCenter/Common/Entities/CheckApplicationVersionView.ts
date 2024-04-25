import ApplicationView from './ApplicationView';

export default class CheckApplicationVersionView {
  public ClientVersion: ApplicationView;
  public CurrentVersion: ApplicationView;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[CheckApplicationVersionView: [ClientVersion: ${this.ClientVersion}][CurrentVersion: ${this.CurrentVersion}]]`;
  }
}
