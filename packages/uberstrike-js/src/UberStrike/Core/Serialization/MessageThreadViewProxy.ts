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

import { MessageThreadView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import DateTimeProxy from './DateTimeProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class MessageThreadViewProxy {
  static Serialize(stream: number[], instance: MessageThreadView): void {
    let num = 0;

    const memoryStream: number[] = [];
    BooleanProxy.Serialize(memoryStream, instance.HasNewMessages);

    if (instance.LastMessagePreview) {
      StringProxy.Serialize(memoryStream, instance.LastMessagePreview);
    } else {
      num |= 1;
    }

    DateTimeProxy.Serialize(memoryStream, instance.LastUpdate);
    Int32Proxy.Serialize(memoryStream, instance.MessageCount);
    Int32Proxy.Serialize(memoryStream, instance.ThreadId);

    if (instance.ThreadName) {
      StringProxy.Serialize(memoryStream, instance.ThreadName);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): MessageThreadView {
    const num = Int32Proxy.Deserialize(bytes);
    const messageThreadView = new MessageThreadView();
    messageThreadView.HasNewMessages = BooleanProxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      messageThreadView.LastMessagePreview = StringProxy.Deserialize(bytes);
    }

    messageThreadView.LastUpdate = DateTimeProxy.Deserialize(bytes);
    messageThreadView.MessageCount = Int32Proxy.Deserialize(bytes);
    messageThreadView.ThreadId = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      messageThreadView.ThreadName = StringProxy.Deserialize(bytes);
    }

    return messageThreadView;
  }
}
