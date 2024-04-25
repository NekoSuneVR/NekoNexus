export default class DamageEvent {
  public Damage: Dictionary<byte, byte>;
  public BodyPartFlag: byte;
  public DamageEffectFlag: int;
  public DamgeEffectValue: float;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public get Count(): int {
    return this.Damage == null ? 0 : Object.keys(this.Damage).length;
  }

  public Clear(): void {
    if (this.Damage == null) {
      this.Damage = {};
    }

    this.BodyPartFlag = 0;

    for (const [key, value] of Object.entries(this.Damage)) {
      delete (this.Damage as any)[key];
    }
  }

  public AddDamage(angle: byte, damage: short, bodyPart: byte, damageEffectFlag: int, damageEffectValue: float): void {
    if (this.Damage == null) this.Damage = {};

    if ((this.Damage as any)[angle] !== undefined) {
      let damage1;
      let key;
      (damage1 = this.Damage as any)[(key = angle)] = damage1[key] + damage;
    } else {
      (this.Damage as any)[angle] = damage;
    }

    this.BodyPartFlag |= bodyPart;
    this.DamageEffectFlag = damageEffectFlag;
    this.DamgeEffectValue = damageEffectValue;
  }
}
