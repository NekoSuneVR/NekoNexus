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

import { ChannelType, CurrencyDepositView, PaymentProviderType } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import DateTimeProxy from './DateTimeProxy';
import DecimalProxy from './DecimalProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class CurrencyDepositViewProxy {
  static Serialize(stream: number[], instance: CurrencyDepositView): void {
    let num = 0;
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.ApplicationId);

    if (instance.BundleId) {
      const stream2 = memoryStream;
      const bundleId = instance.BundleId;
      Int32Proxy.Serialize(stream2, Number.isNaN(bundleId) ? 0 : bundleId);
    } else {
      num |= 1;
    }

    if (instance.BundleName) {
      StringProxy.Serialize(memoryStream, instance.BundleName);
    } else {
      num |= 2;
    }

    DecimalProxy.Serialize(memoryStream, instance.Cash);
    EnumProxy.Serialize<ChannelType>(memoryStream, instance.ChannelId);
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(memoryStream, instance.Credits);
    Int32Proxy.Serialize(memoryStream, instance.CreditsDepositId);

    if (instance.CurrencyLabel) {
      StringProxy.Serialize(memoryStream, instance.CurrencyLabel);
    } else {
      num |= 4;
    }

    DateTimeProxy.Serialize(memoryStream, instance.DepositDate);
    BooleanProxy.Serialize(memoryStream, instance.IsAdminAction);
    EnumProxy.Serialize<PaymentProviderType>(memoryStream, instance.PaymentProviderId);
    Int32Proxy.Serialize(memoryStream, instance.Points);

    if (instance.TransactionKey) {
      StringProxy.Serialize(memoryStream, instance.TransactionKey);
    } else {
      num |= 8;
    }

    DecimalProxy.Serialize(memoryStream, instance.UsdAmount);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): CurrencyDepositView {
    const num = Int32Proxy.Deserialize(bytes);
    const currencyDepositView = new CurrencyDepositView();
    currencyDepositView.ApplicationId = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      currencyDepositView.BundleId = Int32Proxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      currencyDepositView.BundleName = StringProxy.Deserialize(bytes);
    }

    currencyDepositView.Cash = DecimalProxy.Deserialize(bytes);
    currencyDepositView.ChannelId = EnumProxy.Deserialize<ChannelType>(bytes);
    currencyDepositView.Cmid = Int32Proxy.Deserialize(bytes);
    currencyDepositView.Credits = Int32Proxy.Deserialize(bytes);
    currencyDepositView.CreditsDepositId = Int32Proxy.Deserialize(bytes);

    if ((num & 4) !== 0) {
      currencyDepositView.CurrencyLabel = StringProxy.Deserialize(bytes);
    }

    currencyDepositView.DepositDate = DateTimeProxy.Deserialize(bytes);
    currencyDepositView.IsAdminAction = BooleanProxy.Deserialize(bytes);
    currencyDepositView.PaymentProviderId = EnumProxy.Deserialize<PaymentProviderType>(bytes);
    currencyDepositView.Points = Int32Proxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      currencyDepositView.TransactionKey = StringProxy.Deserialize(bytes);
    }

    currencyDepositView.UsdAmount = DecimalProxy.Deserialize(bytes);

    return currencyDepositView;
  }
}
