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

import { PhotonView } from '@/Cmune/Core/Models/Views';
import { AuthenticateApplicationView } from '@/UberStrike/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import PhotonViewProxy from './PhotonViewProxy';

export default class AuthenticateApplicationViewProxy {
  static Serialize(stream: number[], instance: AuthenticateApplicationView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      if (instance.CommServer) {
        PhotonViewProxy.Serialize(memoryStream, instance.CommServer);
      } else {
        num |= 1;
      }
      if (instance.EncryptionInitVector) {
        StringProxy.Serialize(memoryStream, instance.EncryptionInitVector);
      } else {
        num |= 2;
      }
      if (instance.EncryptionPassPhrase) {
        StringProxy.Serialize(memoryStream, instance.EncryptionPassPhrase);
      } else {
        num |= 4;
      }
      if (instance.GameServers) {
        ListProxy.Serialize<PhotonView>(memoryStream, instance.GameServers, PhotonViewProxy.Serialize);
      } else {
        num |= 8;
      }
      BooleanProxy.Serialize(memoryStream, instance.IsEnabled);
      BooleanProxy.Serialize(memoryStream, instance.WarnPlayer);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): AuthenticateApplicationView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let authenticateApplicationView: AuthenticateApplicationView | null = null;
    if (num !== 0) {
      authenticateApplicationView = new AuthenticateApplicationView();
      if ((num & 1) !== 0) {
        authenticateApplicationView.CommServer = PhotonViewProxy.Deserialize(bytes)!;
      }
      if ((num & 2) !== 0) {
        authenticateApplicationView.EncryptionInitVector = StringProxy.Deserialize(bytes);
      }
      if ((num & 4) !== 0) {
        authenticateApplicationView.EncryptionPassPhrase = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        authenticateApplicationView.GameServers = ListProxy.Deserialize<PhotonView>(bytes, PhotonViewProxy.Deserialize);
      }
      authenticateApplicationView.IsEnabled = BooleanProxy.Deserialize(bytes);
      authenticateApplicationView.WarnPlayer = BooleanProxy.Deserialize(bytes);
    }
    return authenticateApplicationView;
  }
}
