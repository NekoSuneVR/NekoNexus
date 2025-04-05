/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export default class DamageEvent {
  Damage: { [key: number]: number };
  BodyPartFlag: number;
  DamageEffectFlag: number;
  DamgeEffectValue: number;

  constructor(params: Partial<DamageEvent> = {}) {
    Object.assign(this, params);
  }

  get Count(): number {
    return this.Damage == null ? 0 : Object.keys(this.Damage).length;
  }

  Clear(): void {
    if (this.Damage == null) {
      this.Damage = {};
    }

    this.BodyPartFlag = 0;

    for (const [key, value] of Object.entries(this.Damage)) {
      delete (this.Damage as any)[key];
    }
  }

  AddDamage(
    angle: number,
    damage: number,
    bodyPart: number,
    damageEffectFlag: number,
    damageEffectValue: number,
  ): void {
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
