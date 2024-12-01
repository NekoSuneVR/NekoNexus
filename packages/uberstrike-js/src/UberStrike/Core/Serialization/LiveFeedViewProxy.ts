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

import { LiveFeedView } from '@/UberStrike/DataCenter/Common/Entities';
import DateTimeProxy from './DateTimeProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class LiveFeedViewProxy {
  static Serialize(stream: number[], instance: LiveFeedView): void {
    let num = 0;

    const memoryStream: number[] = [];
    DateTimeProxy.Serialize(memoryStream, instance.Date);

    if (instance.Description) {
      StringProxy.Serialize(memoryStream, instance.Description);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.LivedFeedId);
    Int32Proxy.Serialize(memoryStream, instance.Priority);

    if (instance.Url) {
      StringProxy.Serialize(memoryStream, instance.Url);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): LiveFeedView {
    const num = Int32Proxy.Deserialize(bytes);
    const liveFeedView = new LiveFeedView();
    liveFeedView.Date = DateTimeProxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      liveFeedView.Description = StringProxy.Deserialize(bytes);
    }

    liveFeedView.LivedFeedId = Int32Proxy.Deserialize(bytes);
    liveFeedView.Priority = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      liveFeedView.Url = StringProxy.Deserialize(bytes);
    }

    return liveFeedView;
  }
}
