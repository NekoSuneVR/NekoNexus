/* eslint no-shadow: "off" */
enum PlayerStates {
  None = 0,
  Spectator = 1,
  Dead = 2,
  Paused = 4,
  Sniping = 8,
  Shooting = 16,
  Ready = 32,
  Offline = 64,
}

export default PlayerStates;
