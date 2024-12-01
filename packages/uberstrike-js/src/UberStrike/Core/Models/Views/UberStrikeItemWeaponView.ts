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

import { UberstrikeItemType } from '@/UberStrike/Core/Types';
import BaseUberStrikeItemView from './BaseUberStrikeItemView';

export default class UberStrikeItemWeaponView extends BaseUberStrikeItemView {
  private _accuracySpread: number;
  private _combatRange: number;
  private _criticalStrikeBonus: number;
  private _damageKnockback: number;
  private _damagePerProjectile: number;
  private _defaultZoomMultiplier: number;
  private _hasAutoFire: boolean;
  private _maxAmmo: number;
  private _maxZoomMultiplier: number;
  private _minZoomMultiplier: number;
  private _missileBounciness: number;
  private _missileForceImpulse: number;
  private _missileTimeToDetonate: number;
  private _projectileSpeed: number;
  private _projectilesPerShot: number;
  private _rateOfFire: number;
  private _recoilKickback: number;
  private _recoilMovement: number;
  private _secondaryActionReticle: number;
  private _splashRadius: number;
  private _startAmmo: number;
  private _tier: number;
  private _weaponSecondaryAction: number;

  override get ItemType(): UberstrikeItemType {
    return UberstrikeItemType.Weapon;
  }

  get DamageKnockback(): number {
    return this._damageKnockback;
  }
  set DamageKnockback(value: number) {
    this._damageKnockback = value;
  }

  get DamagePerProjectile(): number {
    return this._damagePerProjectile;
  }
  set DamagePerProjectile(value: number) {
    this._damagePerProjectile = value;
  }

  get AccuracySpread(): number {
    return this._accuracySpread;
  }
  set AccuracySpread(value: number) {
    this._accuracySpread = value;
  }

  get RecoilKickback(): number {
    return this._recoilKickback;
  }
  set RecoilKickback(value: number) {
    this._recoilKickback = value;
  }

  get StartAmmo(): number {
    return this._startAmmo;
  }
  set StartAmmo(value: number) {
    this._startAmmo = value;
  }

  get MaxAmmo(): number {
    return this._maxAmmo;
  }
  set MaxAmmo(value: number) {
    this._maxAmmo = value;
  }

  get MissileTimeToDetonate(): number {
    return this._missileTimeToDetonate;
  }
  set MissileTimeToDetonate(value: number) {
    this._missileTimeToDetonate = value;
  }

  get MissileForceImpulse(): number {
    return this._missileForceImpulse;
  }
  set MissileForceImpulse(value: number) {
    this._missileForceImpulse = value;
  }

  get MissileBounciness(): number {
    return this._missileBounciness;
  }
  set MissileBounciness(value: number) {
    this._missileBounciness = value;
  }

  get SplashRadius(): number {
    return this._splashRadius;
  }
  set SplashRadius(value: number) {
    this._splashRadius = value;
  }

  get ProjectilesPerShot(): number {
    return this._projectilesPerShot;
  }
  set ProjectilesPerShot(value: number) {
    this._projectilesPerShot = value;
  }

  get ProjectileSpeed(): number {
    return this._projectileSpeed;
  }
  set ProjectileSpeed(value: number) {
    this._projectileSpeed = value;
  }

  get RateOfFire(): number {
    return this._rateOfFire;
  }
  set RateOfFire(value: number) {
    this._rateOfFire = value;
  }

  get RecoilMovement(): number {
    return this._recoilMovement;
  }
  set RecoilMovement(value: number) {
    this._recoilMovement = value;
  }

  get CombatRange(): number {
    return this._combatRange;
  }
  set CombatRange(value: number) {
    this._combatRange = value;
  }

  get Tier(): number {
    return this._tier;
  }
  set Tier(value: number) {
    this._tier = value;
  }

  get SecondaryActionReticle(): number {
    return this._secondaryActionReticle;
  }
  set SecondaryActionReticle(value: number) {
    this._secondaryActionReticle = value;
  }

  get WeaponSecondaryAction(): number {
    return this._weaponSecondaryAction;
  }
  set WeaponSecondaryAction(value: number) {
    this._weaponSecondaryAction = value;
  }

  get CriticalStrikeBonus(): number {
    return this._criticalStrikeBonus;
  }
  set CriticalStrikeBonus(value: number) {
    this._criticalStrikeBonus = value;
  }

  get DamagePerSecond(): number {
    return this.RateOfFire === 0 ? 0 : (this.DamagePerProjectile * this.ProjectilesPerShot) / this.RateOfFire;
  }

  get HasAutomaticFire(): boolean {
    return this._hasAutoFire;
  }
  set HasAutomaticFire(value: boolean) {
    this._hasAutoFire = value;
  }

  get DefaultZoomMultiplier(): number {
    return this._defaultZoomMultiplier;
  }
  set DefaultZoomMultiplier(value: number) {
    this._defaultZoomMultiplier = value;
  }

  get MinZoomMultiplier(): number {
    return this._minZoomMultiplier;
  }
  set MinZoomMultiplier(value: number) {
    this._minZoomMultiplier = value;
  }

  get MaxZoomMultiplier(): number {
    return this._maxZoomMultiplier;
  }
  set MaxZoomMultiplier(value: number) {
    this._maxZoomMultiplier = value;
  }
}
