/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import MemberReportType from './MemberReportType';

export default class MemberReportView {
  ReportId: number;
  SourceCmid: number;
  TargetCmid: number;
  ReportType: MemberReportType;
  Reason: string;
  Context: string;
  ApplicationId: number;
  IP: string;

  constructor(params: Partial<MemberReportView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[Member report: [Source CMID: ${this.SourceCmid}][Target CMID: ${this.TargetCmid}][Type: ${this.ReportType}][Reason: ${this.Reason}][Context: ${this.Context}][Application ID: ${this.ApplicationId}][IP: ${this.IP}]]`;
  }
}
