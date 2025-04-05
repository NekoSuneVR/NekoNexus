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

import { MemberAuthenticationResult } from '@/Cmune/DataCenter/Common/Entities';
import { MemberAuthenticationResultView } from '@/UberStrike/Core/ViewModel';
import BooleanProxy from './BooleanProxy';
import DateTimeProxy from './DateTimeProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import LuckyDrawUnityViewProxy from './LuckyDrawUnityViewProxy';
import MemberViewProxy from './MemberViewProxy';
import PlayerStatisticsViewProxy from './PlayerStatisticsViewProxy';
import StringProxy from './StringProxy';

export default class MemberAuthenticationResultViewProxy {
  static Serialize(stream: number[], instance: MemberAuthenticationResultView): void {
    let num = 0;

    const memoryStream: number[] = [];
    if (instance.AuthToken) {
      StringProxy.Serialize(memoryStream, instance.AuthToken);
    } else {
      num |= 1;
    }

    BooleanProxy.Serialize(memoryStream, instance.IsAccountComplete);

    if (instance.LuckyDraw) {
      LuckyDrawUnityViewProxy.Serialize(memoryStream, instance.LuckyDraw);
    } else {
      num |= 2;
    }

    EnumProxy.Serialize<MemberAuthenticationResult>(memoryStream, instance.MemberAuthenticationResult);

    if (instance.MemberView) {
      MemberViewProxy.Serialize(memoryStream, instance.MemberView);
    } else {
      num |= 4;
    }

    if (instance.PlayerStatisticsView) {
      PlayerStatisticsViewProxy.Serialize(memoryStream, instance.PlayerStatisticsView);
    } else {
      num |= 8;
    }

    DateTimeProxy.Serialize(memoryStream, instance.ServerTime);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): MemberAuthenticationResultView {
    const num = Int32Proxy.Deserialize(bytes);
    const memberAuthenticationResultView = new MemberAuthenticationResultView();

    if ((num & 1) !== 0) {
      memberAuthenticationResultView.AuthToken = StringProxy.Deserialize(bytes);
    }

    memberAuthenticationResultView.IsAccountComplete = BooleanProxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      memberAuthenticationResultView.LuckyDraw = LuckyDrawUnityViewProxy.Deserialize(bytes);
    }

    memberAuthenticationResultView.MemberAuthenticationResult =
      EnumProxy.Deserialize<MemberAuthenticationResult>(bytes);

    if ((num & 4) !== 0) {
      memberAuthenticationResultView.MemberView = MemberViewProxy.Deserialize(bytes);
    }

    if ((num & 8) !== 0) {
      memberAuthenticationResultView.PlayerStatisticsView = PlayerStatisticsViewProxy.Deserialize(bytes);
    }

    memberAuthenticationResultView.ServerTime = DateTimeProxy.Deserialize(bytes);

    return memberAuthenticationResultView;
  }
}
