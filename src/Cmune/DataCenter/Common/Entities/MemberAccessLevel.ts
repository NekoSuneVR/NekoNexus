/* eslint no-shadow: "off" */
enum MemberAccessLevel {
  Default,
  QA = 3,
  Moderator,
  SeniorQA = 6,
  SeniorModerator,
  Admin = 10,
}

export default MemberAccessLevel;
