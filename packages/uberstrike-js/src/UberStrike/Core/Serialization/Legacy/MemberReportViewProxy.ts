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

import { MemberReportType, MemberReportView } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class MemberReportViewProxy {
  static Serialize(stream: number[], instance: MemberReportView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.ApplicationId);
      if (instance.Context) {
        StringProxy.Serialize(memoryStream, instance.Context);
      } else {
        num |= 1;
      }
      if (instance.IP) {
        StringProxy.Serialize(memoryStream, instance.IP);
      } else {
        num |= 2;
      }
      if (instance.Reason) {
        StringProxy.Serialize(memoryStream, instance.Reason);
      } else {
        num |= 4;
      }
      EnumProxy.Serialize<MemberReportType>(memoryStream, instance.ReportType);
      Int32Proxy.Serialize(memoryStream, instance.SourceCmid);
      Int32Proxy.Serialize(memoryStream, instance.TargetCmid);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): MemberReportView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let memberReportView: MemberReportView | null = null;
    if (num !== 0) {
      memberReportView = new MemberReportView();
      memberReportView.ApplicationId = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        memberReportView.Context = StringProxy.Deserialize(bytes);
      }
      if ((num & 2) !== 0) {
        memberReportView.IP = StringProxy.Deserialize(bytes);
      }
      if ((num & 4) !== 0) {
        memberReportView.Reason = StringProxy.Deserialize(bytes);
      }
      memberReportView.ReportType = EnumProxy.Deserialize<MemberReportType>(bytes);
      memberReportView.SourceCmid = Int32Proxy.Deserialize(bytes);
      memberReportView.TargetCmid = Int32Proxy.Deserialize(bytes);
    }
    return memberReportView;
  }
}
