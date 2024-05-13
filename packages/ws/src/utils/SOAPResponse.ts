export default class SOAPResponse {
  public static create(method: string, data: any[]): string {
    return `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
\t<s:Body>
\t\t<${method}Response xmlns="http://tempuri.org/">
\t\t\t<${method}Result>${Buffer.from(data).toString('base64')}</${method}Result>
\t\t</${method}Response>
\t</s:Body>
</s:Envelope>`;
  }

  public static createFault(action: any = ''): string {
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
