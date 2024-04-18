import MemberReportType from './MemberReportType';

export default class MemberReportView {
  public ReportId: int;
  public SourceCmid: int;
  public TargetCmid: int;
  public ReportType: MemberReportType;
  public Reason: string;
  public Context: string;
  public ApplicationId: int;
  public IP: string;

  constructor(params: any = {}) {
    Object.keys(params).filter((key) => key in this).forEach((key) => { this[key] = params[key]; });
  }

  public toString(): string {
    return `[Member report: [Source CMID: ${this.SourceCmid}][Target CMID: ${this.TargetCmid}][Type: ${this.ReportType}][Reason: ${this.Reason}][Context: ${this.Context}][Application ID: ${this.ApplicationId}][IP: ${this.IP}]]`;
  }
}
