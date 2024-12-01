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
import { ApplicationView, BuildType, ChannelType } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import DateTimeProxy from '../DateTimeProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import PhotonViewProxy from './PhotonViewProxy';

export default class ApplicationViewProxy {
  static Serialize(stream: number[], instance: ApplicationView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.ApplicationVersionId);
      EnumProxy.Serialize<BuildType>(memoryStream, instance.Build);
      EnumProxy.Serialize<ChannelType>(memoryStream, instance.Channel);
      if (instance.ExpirationDate) {
        DateTimeProxy.Serialize(memoryStream, instance.ExpirationDate);
      } else {
        num |= 1;
      }
      if (instance.FileName) {
        StringProxy.Serialize(memoryStream, instance.FileName);
      } else {
        num |= 2;
      }
      BooleanProxy.Serialize(memoryStream, instance.IsCurrent);
      Int32Proxy.Serialize(memoryStream, instance.PhotonGroupId);
      if (instance.PhotonGroupName) {
        StringProxy.Serialize(memoryStream, instance.PhotonGroupName);
      } else {
        num |= 4;
      }
      DateTimeProxy.Serialize(memoryStream, instance.ReleaseDate);
      Int32Proxy.Serialize(memoryStream, instance.RemainingTime);
      if (instance.Servers) {
        ListProxy.Serialize<PhotonView>(memoryStream, instance.Servers, PhotonViewProxy.Serialize);
      } else {
        num |= 8;
      }
      if (instance.SupportUrl) {
        StringProxy.Serialize(memoryStream, instance.SupportUrl);
      } else {
        num |= 16;
      }
      if (instance.Version) {
        StringProxy.Serialize(memoryStream, instance.Version);
      } else {
        num |= 32;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): ApplicationView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let applicationView: ApplicationView | null = null;
    if (num !== 0) {
      applicationView = new ApplicationView();
      applicationView.ApplicationVersionId = Int32Proxy.Deserialize(bytes);
      applicationView.Build = EnumProxy.Deserialize<BuildType>(bytes);
      applicationView.Channel = EnumProxy.Deserialize<ChannelType>(bytes);
      if ((num & 1) !== 0) {
        applicationView.ExpirationDate = DateTimeProxy.Deserialize(bytes);
      }
      if ((num & 2) !== 0) {
        applicationView.FileName = StringProxy.Deserialize(bytes);
      }
      applicationView.IsCurrent = BooleanProxy.Deserialize(bytes);
      applicationView.PhotonGroupId = Int32Proxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        applicationView.PhotonGroupName = StringProxy.Deserialize(bytes);
      }
      applicationView.ReleaseDate = DateTimeProxy.Deserialize(bytes);
      applicationView.RemainingTime = Int32Proxy.Deserialize(bytes);
      if ((num & 8) !== 0) {
        applicationView.Servers = ListProxy.Deserialize<PhotonView>(bytes, PhotonViewProxy.Deserialize);
      }
      if ((num & 16) !== 0) {
        applicationView.SupportUrl = StringProxy.Deserialize(bytes);
      }
      if ((num & 32) !== 0) {
        applicationView.Version = StringProxy.Deserialize(bytes);
      }
    }
    return applicationView;
  }
}
