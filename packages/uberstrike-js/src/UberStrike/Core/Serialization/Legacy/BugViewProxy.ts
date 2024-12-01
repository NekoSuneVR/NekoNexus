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

import { BugView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class BugViewProxy {
  static Serialize(stream: number[], instance: BugView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      if (instance.Content) {
        StringProxy.Serialize(memoryStream, instance.Content);
      } else {
        num |= 1;
      }
      if (instance.Subject) {
        StringProxy.Serialize(memoryStream, instance.Subject);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): BugView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let bugView: BugView | null = null;
    if (num !== 0) {
      bugView = new BugView();
      if ((num & 1) !== 0) {
        bugView.Content = StringProxy.Deserialize(bytes);
      }
      if ((num & 2) !== 0) {
        bugView.Subject = StringProxy.Deserialize(bytes);
      }
    }
    return bugView;
  }
}
