// Type aliases for easier C# interoperability
type byte = number;
type decimal = number;
type float = number;
type int = number;
type long = bigint;
type short = number;
type ushort = number;

type bool = boolean;

type DateTime = Date;
type Stream = byte[];
type MemoryStream = byte[];

type List<T> = T[];
type Dictionary<S extends string | number, T> = { [key: S]: T };

// Pretend to write stream to other stream
interface Array<T> {
  WriteTo(stream: Array<T>): void;
}

// Math function
interface Math {
  clamp(value, min, max): number;
  randomInt(min = 1, max = 2147483647): number;
}

// Unity Types
class Color {
  public r: float;
  public g: float;
  public b: float;

  constructor(r: float, g: float, b: float) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class Vector3 {
  public x: float;
  public y: float;
  public z: float;

  constructor(x: float, y: float, z: float) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Quaternion {
  public x: float;
  public y: float;
  public z: float;
  public w: float;

  constructor(x: float, y: float, z: float, w: float) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  public static get Identity(): Quaternion {
    return new Quaternion(0, 0, 0, 1);
  }
}
