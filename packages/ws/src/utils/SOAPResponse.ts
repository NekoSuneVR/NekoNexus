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

export default class SOAPResponse {
  static create(method: string, data: any[]): string {
    return `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
\t<s:Body>
\t\t<${method}Response xmlns="http://tempuri.org/">
\t\t\t<${method}Result>${Buffer.from(data).toString('base64')}</${method}Result>
\t\t</${method}Response>
\t</s:Body>
</s:Envelope>`;
  }

  static createFault(action: any = ''): string {
    return `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
\t<s:Body>
\t\t<s:Fault>
\t\t\t<faultcode xmlns:a="http://schemas.microsoft.com/ws/2005/05/addressing/none">a:ActionNotSupported</faultcode>
\t\t\t<faultstring>The message with Action '${action}' cannot be processed at the receiver, due to a ContractFilter mismatch at the EndpointDispatcher. This may be because of either a contract mismatch (mismatched Actions between sender and receiver) or a binding/security mismatch between the sender and the receiver.  Check that sender and receiver have the same contract and the same binding (including security requirements, e.g. Message, Transport, None).</faultstring>
\t\t</s:Fault>
\t</s:Body>
</s:Envelope>`;
  }
}
