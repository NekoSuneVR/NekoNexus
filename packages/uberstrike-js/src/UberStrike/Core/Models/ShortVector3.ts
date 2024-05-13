export default class ShortVector3 {
  private value: Vector3;

  public get x(): float {
    return this.value.x;
  }
  public get y(): float {
    return this.value.y;
  }
  public get z(): float {
    return this.value.z;
  }

  constructor(x: float, y: float, z: float) {
    this.value = new Vector3(x, y, z);
  }

  public static multiply(vector: ShortVector3, value: float): ShortVector3 {
    vector.value.x *= value;
    vector.value.y *= value;
    vector.value.z *= value;

    return vector;
  }

  public static add(vector: ShortVector3, value: ShortVector3): ShortVector3 {
    vector.value.x += value.value.x;
    vector.value.y += value.value.y;
    vector.value.z += value.value.z;

    return vector;
  }

  public static subtract(vector: ShortVector3, value: ShortVector3): ShortVector3 {
    vector.value.x -= value.value.x;
    vector.value.y -= value.value.y;
    vector.value.z -= value.value.z;

    return vector;
  }
}
