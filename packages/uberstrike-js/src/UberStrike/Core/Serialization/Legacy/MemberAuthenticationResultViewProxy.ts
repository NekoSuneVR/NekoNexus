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
import BooleanProxy from '../BooleanProxy';
import DateTimeProxy from '../DateTimeProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import LuckyDrawUnityViewProxy from './LuckyDrawUnityViewProxy';
import MemberViewProxy from './MemberViewProxy';
import PlayerStatisticsViewProxy from './PlayerStatisticsViewProxy';
import WeeklySpecialViewProxy from './WeeklySpecialViewProxy';

export default class MemberAuthenticationResultViewProxy {
  static Serialize(stream: number[], instance: MemberAuthenticationResultView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      BooleanProxy.Serialize(memoryStream, instance.IsAccountComplete);
      BooleanProxy.Serialize(memoryStream, instance.IsTutorialComplete);
      if (instance.LuckyDraw) {
        LuckyDrawUnityViewProxy.Serialize(memoryStream, instance.LuckyDraw);
      } else {
        num |= 1;
      }
      EnumProxy.Serialize<MemberAuthenticationResult>(memoryStream, instance.MemberAuthenticationResult);
      if (instance.MemberView) {
        MemberViewProxy.Serialize(memoryStream, instance.MemberView);
      } else {
        num |= 2;
      }
      if (instance.PlayerStatisticsView) {
        PlayerStatisticsViewProxy.Serialize(memoryStream, instance.PlayerStatisticsView);
      } else {
        num |= 4;
      }
      DateTimeProxy.Serialize(memoryStream, instance.ServerTime);
      if (instance.WeeklySpecial) {
        WeeklySpecialViewProxy.Serialize(memoryStream, instance.WeeklySpecial);
      } else {
        num |= 8;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): MemberAuthenticationResultView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let memberAuthenticationResultView: MemberAuthenticationResultView | null = null;
    if (num !== 0) {
      memberAuthenticationResultView = new MemberAuthenticationResultView();
      memberAuthenticationResultView.IsAccountComplete = BooleanProxy.Deserialize(bytes);
      memberAuthenticationResultView.IsTutorialComplete = BooleanProxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        memberAuthenticationResultView.LuckyDraw = LuckyDrawUnityViewProxy.Deserialize(bytes)!;
      }
      memberAuthenticationResultView.MemberAuthenticationResult =
        EnumProxy.Deserialize<MemberAuthenticationResult>(bytes);
      if ((num & 2) !== 0) {
        memberAuthenticationResultView.MemberView = MemberViewProxy.Deserialize(bytes)!;
      }
      if ((num & 4) !== 0) {
        memberAuthenticationResultView.PlayerStatisticsView = PlayerStatisticsViewProxy.Deserialize(bytes)!;
      }
      memberAuthenticationResultView.ServerTime = DateTimeProxy.Deserialize(bytes);
      if ((num & 8) !== 0) {
        memberAuthenticationResultView.WeeklySpecial = WeeklySpecialViewProxy.Deserialize(bytes)!;
      }
    }
    return memberAuthenticationResultView;
  }
}
