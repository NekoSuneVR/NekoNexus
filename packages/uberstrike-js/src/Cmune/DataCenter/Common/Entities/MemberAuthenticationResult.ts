/* eslint no-shadow: "off" */
enum MemberAuthenticationResult {
  Ok,
  InvalidData,
  InvalidName,
  InvalidEmail,
  InvalidPassword,
  IsBanned,
  InvalidHandle,
  InvalidEsns,
  InvalidCookie,
  IsIpBanned,
  UnknownError,
}

export default MemberAuthenticationResult;
