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

import ChannelType from './ChannelType';
import PaymentProviderType from './PaymentProviderType';

export default class CurrencyDepositView {
  CreditsDepositId: number;
  DepositDate: Date;
  Credits: number;
  Points: number;
  Cash: number;
  CurrencyLabel: string;
  Cmid: number;
  IsAdminAction: boolean;
  PaymentProviderId: PaymentProviderType;
  TransactionKey: string;
  ApplicationId: number;
  ChannelId: ChannelType;
  UsdAmount: number;
  BundleId?: number;
  BundleName: string;

  constructor(params: Partial<CurrencyDepositView> = {}) {
    Object.assign(this, params);
  }
}
