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
import Int32Proxy from '../Int32Proxy';
import MemberViewProxy from './MemberViewProxy';
import UberstrikeMemberViewProxy from './UberstrikeMemberViewProxy';

export default class UberstrikeUserViewModelProxy {
  static Serialize(stream: number[], instance: UberstrikeUserViewModel): void {
    let num = 0;
    if (instance) {
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
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): UberstrikeUserViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberstrikeUserViewModel: UberstrikeUserViewModel | null = null;
    if (num !== 0) {
      uberstrikeUserViewModel = new UberstrikeUserViewModel();
      if ((num & 1) !== 0) {
        uberstrikeUserViewModel.CmuneMemberView = MemberViewProxy.Deserialize(bytes)!;
      }
      if ((num & 2) !== 0) {
        uberstrikeUserViewModel.UberstrikeMemberView = UberstrikeMemberViewProxy.Deserialize(bytes)!;
      }
    }
    return uberstrikeUserViewModel;
  }
}
