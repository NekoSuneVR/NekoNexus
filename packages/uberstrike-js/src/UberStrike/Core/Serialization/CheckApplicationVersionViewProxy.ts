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

import { CheckApplicationVersionView } from '@/Cmune/DataCenter/Common/Entities';
import ApplicationViewProxy from './ApplicationViewProxy';
import Int32Proxy from './Int32Proxy';

export default class CheckApplicationVersionViewProxy {
  static Serialize(stream: number[], instance: CheckApplicationVersionView): void {
    let num = 0;
    const memoryStream: number[] = [];

    if (instance.ClientVersion) {
      ApplicationViewProxy.Serialize(memoryStream, instance.ClientVersion);
    } else {
      num |= 1;
    }

    if (instance.CurrentVersion) {
      ApplicationViewProxy.Serialize(memoryStream, instance.CurrentVersion);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): CheckApplicationVersionView {
    const num = Int32Proxy.Deserialize(bytes);
    const checkApplicationVersionView = new CheckApplicationVersionView();

    if ((num & 1) !== 0) {
      checkApplicationVersionView.ClientVersion = ApplicationViewProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      checkApplicationVersionView.CurrentVersion = ApplicationViewProxy.Deserialize(bytes);
    }

    return checkApplicationVersionView;
  }
}
