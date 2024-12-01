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

export default class PrivateMessageView {
  PrivateMessageId: number;
  FromCmid: number;
  FromName: string;
  ToCmid: number;
  DateSent: Date;
  ContentText: string;
  IsRead: boolean;
  HasAttachment: boolean;
  IsDeletedBySender: boolean;
  IsDeletedByReceiver: boolean;

  constructor(params: Partial<PrivateMessageView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[Private Message: [ID:${this.PrivateMessageId},][From:${this.FromCmid}][To:${this.ToCmid}][Date:${this.DateSent}][[Content:${this.ContentText}][Is Read:${this.IsRead}][Has attachment:${this.HasAttachment}][Is deleted by sender:${this.IsDeletedBySender}][Is deleted by receiver:${this.IsDeletedByReceiver}]]`;
  }
}
