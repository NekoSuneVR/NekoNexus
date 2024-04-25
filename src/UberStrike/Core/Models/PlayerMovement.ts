import ShortVector3 from './ShortVector3';

export default class PlayerMovement {
  public Number: byte;
  public Position: ShortVector3;
  public Velocity: ShortVector3;
  public HorizontalRotation: byte;
  public VerticalRotation: byte;
  public KeyState: byte;
  public MovementState: byte;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
