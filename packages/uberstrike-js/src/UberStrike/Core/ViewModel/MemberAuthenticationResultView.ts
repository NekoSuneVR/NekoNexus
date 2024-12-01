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

import {
  LuckyDrawUnityView,
  MemberAuthenticationResult,
  MemberView,
  WeeklySpecialView,
} from '@/Cmune/DataCenter/Common/Entities';
import { PlayerStatisticsView } from '@/UberStrike/DataCenter/Common/Entities';

export default class MemberAuthenticationResultView {
  MemberAuthenticationResult: MemberAuthenticationResult;
  MemberView: MemberView;
  PlayerStatisticsView: PlayerStatisticsView;
  ServerTime: Date = new Date();
  IsAccountComplete: boolean;
  LuckyDraw: LuckyDrawUnityView;
  AuthToken: string;
  IsTutorialComplete: boolean; // # LEGACY # //
  WeeklySpecial: WeeklySpecialView; // # LEGACY # //

  constructor(params: Partial<MemberAuthenticationResultView> = {}) {
    Object.assign(this, params);
  }
}
