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
import DateTimeProxy from './DateTimeProxy';
import Int32Proxy from './Int32Proxy';

export default class MemberWalletViewProxy {
  static Serialize(stream: number[], instance: MemberWalletView): void {
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(memoryStream, instance.Credits);
    DateTimeProxy.Serialize(memoryStream, instance.CreditsExpiration);
    Int32Proxy.Serialize(memoryStream, instance.Points);
    DateTimeProxy.Serialize(memoryStream, instance.PointsExpiration);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): MemberWalletView {
    return new MemberWalletView({
      Cmid: Int32Proxy.Deserialize(bytes),
      Credits: Int32Proxy.Deserialize(bytes),
      CreditsExpiration: DateTimeProxy.Deserialize(bytes),
      Points: Int32Proxy.Deserialize(bytes),
      PointsExpiration: DateTimeProxy.Deserialize(bytes),
    });
  }
}
