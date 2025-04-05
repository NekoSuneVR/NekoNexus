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

import { MemberView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import MemberWalletViewProxy from './MemberWalletViewProxy';
import PublicProfileViewProxy from './PublicProfileViewProxy';

export default class MemberViewProxy {
  static Serialize(stream: number[], instance: MemberView): void {
    let num = 0;

    const memoryStream: number[] = [];
    if (instance.MemberItems) {
      ListProxy.Serialize<int>(memoryStream, instance.MemberItems, Int32Proxy.Serialize);
    } else {
      num |= 1;
    }

    if (instance.MemberWallet) {
      MemberWalletViewProxy.Serialize(memoryStream, instance.MemberWallet);
    } else {
      num |= 2;
    }

    if (instance.PublicProfile) {
      PublicProfileViewProxy.Serialize(memoryStream, instance.PublicProfile);
    } else {
      num |= 4;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): MemberView {
    const num = Int32Proxy.Deserialize(bytes);
    const memberView = new MemberView();

    if ((num & 1) !== 0) {
      memberView.MemberItems = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
    }

    if ((num & 2) !== 0) {
      memberView.MemberWallet = MemberWalletViewProxy.Deserialize(bytes);
    }

    if ((num & 4) !== 0) {
      memberView.PublicProfile = PublicProfileViewProxy.Deserialize(bytes);
    }

    return memberView;
  }
}
