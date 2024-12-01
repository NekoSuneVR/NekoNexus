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

import { WeeklySpecialView } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from '../DateTimeProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class WeeklySpecialViewProxy {
  static Serialize(stream: number[], instance: WeeklySpecialView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      if (instance.EndDate) {
        DateTimeProxy.Serialize(memoryStream, instance.EndDate);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.Id);
      if (instance.ImageUrl) {
        StringProxy.Serialize(memoryStream, instance.ImageUrl);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.ItemId);
      DateTimeProxy.Serialize(memoryStream, instance.StartDate);
      if (instance.Text) {
        StringProxy.Serialize(memoryStream, instance.Text);
      } else {
        num |= 4;
      }
      if (instance.Title) {
        StringProxy.Serialize(memoryStream, instance.Title);
      } else {
        num |= 8;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): WeeklySpecialView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let weeklySpecialView: WeeklySpecialView | null = null;
    if (num !== 0) {
      weeklySpecialView = new WeeklySpecialView();
      if ((num & 1) !== 0) {
        weeklySpecialView.EndDate = DateTimeProxy.Deserialize(bytes);
      }
      weeklySpecialView.Id = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        weeklySpecialView.ImageUrl = StringProxy.Deserialize(bytes);
      }
      weeklySpecialView.ItemId = Int32Proxy.Deserialize(bytes);
      weeklySpecialView.StartDate = DateTimeProxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        weeklySpecialView.Text = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        weeklySpecialView.Title = StringProxy.Deserialize(bytes);
      }
    }
    return weeklySpecialView;
  }
}
