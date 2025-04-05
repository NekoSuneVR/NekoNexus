export default class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static get zero() {
    return new Vector3(0, 0, 0);
  }

  static get one() {
    return new Vector3(1, 1, 1);
  }

  static get forward() {
    return new Vector3(0, 0, 1);
  }

  static get back() {
    return new Vector3(0, 0, -1);
  }

  static get up() {
    return new Vector3(0, 1, 0);
  }

  static get down() {
    return new Vector3(0, -1, 0);
  }

  static get left() {
    return new Vector3(1, 0, 0);
  }

  static get right() {
    return new Vector3(-1, 0, 0);
  }
}
