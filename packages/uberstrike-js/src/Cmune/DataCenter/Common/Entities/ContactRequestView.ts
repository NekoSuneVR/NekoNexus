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

import ContactRequestStatus from './ContactRequestStatus';

export default class ContactRequestView {
  RequestId: number;
  InitiatorCmid: number;
  InitiatorName: string;
  ReceiverCmid: number;
  InitiatorMessage: string;
  Status: ContactRequestStatus;
  SentDate: Date;

  constructor(params: Partial<ContactRequestView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[Request contact: [Request ID: ${this.RequestId}][Initiator Cmid :${this.InitiatorCmid}][Initiator Name:${this.InitiatorName}][Receiver Cmid: ${this.ReceiverCmid}][InitiatorMessage: ${this.InitiatorMessage}][Status: ${this.Status}][Sent Date: ${this.SentDate}]]`;
  }
}
