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

import { MemberWalletView } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from '../DateTimeProxy';
import Int32Proxy from '../Int32Proxy';

export default class MemberWalletViewProxy {
  static Serialize(stream: number[], instance: MemberWalletView): void {
    const num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      Int32Proxy.Serialize(memoryStream, instance.Credits);
      DateTimeProxy.Serialize(memoryStream, instance.CreditsExpiration);
      Int32Proxy.Serialize(memoryStream, instance.Points);
      DateTimeProxy.Serialize(memoryStream, instance.PointsExpiration);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): MemberWalletView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let memberWalletView: MemberWalletView | null = null;
    if (num !== 0) {
      memberWalletView = new MemberWalletView();
      memberWalletView.Cmid = Int32Proxy.Deserialize(bytes);
      memberWalletView.Credits = Int32Proxy.Deserialize(bytes);
      memberWalletView.CreditsExpiration = DateTimeProxy.Deserialize(bytes);
      memberWalletView.Points = Int32Proxy.Deserialize(bytes);
      memberWalletView.PointsExpiration = DateTimeProxy.Deserialize(bytes);
    }
    return memberWalletView;
  }
}
