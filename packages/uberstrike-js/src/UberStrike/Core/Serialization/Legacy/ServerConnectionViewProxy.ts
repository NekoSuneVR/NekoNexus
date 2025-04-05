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

import { ChannelType } from '@/Cmune/DataCenter/Common/Entities';
import { ServerConnectionView } from '@/UberStrike/Core/ViewModel';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';

export default class ServerConnectionViewProxy {
  static Serialize(stream: number[], instance: ServerConnectionView): void {
    const num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, Number(instance.ApiVersion));
      EnumProxy.Serialize<ChannelType>(memoryStream, instance.Channel);
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): ServerConnectionView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let serverConnectionView: ServerConnectionView | null = null;
    if (num !== 0) {
      serverConnectionView = new ServerConnectionView();
      serverConnectionView.ApiVersion = Int32Proxy.Deserialize(bytes).toString();
      serverConnectionView.Channel = EnumProxy.Deserialize<ChannelType>(bytes);
      serverConnectionView.Cmid = Int32Proxy.Deserialize(bytes);
    }
    return serverConnectionView;
  }
}
