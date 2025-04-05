export default class Color {
  r: number;
  g: number;
  b: number;
  a?: number = 1;

  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static get red() {
    return new Color(1, 0, 0, 1);
  }

  static get green() {
    return new Color(0, 1, 0, 1);
  }

  static get blue() {
    return new Color(0, 0, 1, 1);
  }

  static get white() {
    return new Color(1, 1, 1, 1);
  }

  static get black() {
    return new Color(0, 0, 0, 1);
  }

  static get yellow() {
    return new Color(1, 47 / 51, 0.0156862754, 1);
  }

  static get cyan() {
    return new Color(0, 1, 1, 1);
  }

  static get magenta() {
    return new Color(1, 0, 1, 1);
  }

  static get gray() {
    return new Color(0.5, 0.5, 0.5, 1);
  }

  static get grey() {
    return new Color(0.5, 0.5, 0.5, 1);
  }

  static get clear() {
    return new Color(0, 0, 0, 0);
  }
}
