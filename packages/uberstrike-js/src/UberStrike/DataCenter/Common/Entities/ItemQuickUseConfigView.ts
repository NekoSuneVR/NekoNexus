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

import { QuickItemLogic } from '@/UberStrike/Core/Types';

export default class ItemQuickUseConfigView {
  ItemId: number;
  LevelRequired: number;
  UsesPerLife: number;
  UsesPerRound: number;
  UsesPerGame: number;
  CoolDownTime: number;
  WarmUpTime: number;
  BehaviourType: QuickItemLogic;

  constructor(params: Partial<ItemQuickUseConfigView> = {}) {
    Object.assign(this, params);
  }
}
