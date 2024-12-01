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

import { UberstrikeUserViewModel } from '@/UberStrike/Core/ViewModel';
import { Int32Proxy, MemberViewProxy, UberstrikeMemberViewProxy } from '.';

export default class UberstrikeUserViewModelProxy {
  static Serialize(stream: number[], instance: UberstrikeUserViewModel) {
    let num = 0;

    const memoryStream: number[] = [];
    if (instance.CmuneMemberView) {
      MemberViewProxy.Serialize(memoryStream, instance.CmuneMemberView);
    } else {
      num |= 1;
    }

    if (instance.UberstrikeMemberView) {
      UberstrikeMemberViewProxy.Serialize(memoryStream, instance.UberstrikeMemberView);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): UberstrikeUserViewModel {
    const num = Int32Proxy.Deserialize(bytes);
    const uberstrikeUserViewModel = new UberstrikeUserViewModel();

    if ((num & 1) !== 0) {
      uberstrikeUserViewModel.CmuneMemberView = MemberViewProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      uberstrikeUserViewModel.UberstrikeMemberView = UberstrikeMemberViewProxy.Deserialize(bytes);
    }

    return uberstrikeUserViewModel;
  }
}
