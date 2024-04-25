import { UberstrikeItemType } from '@/UberStrike/Core/Types';
import BaseUberStrikeItemView from './BaseUberStrikeItemView';

export default class UberStrikeItemWeaponView extends BaseUberStrikeItemView {
  private _accuracySpread: int;
  private _combatRange: int;
  private _criticalStrikeBonus: int;
  private _damageKnockback: int;
  private _damagePerProjectile: int;
  private _defaultZoomMultiplier: int;
  private _hasAutoFire: bool;
  private _maxAmmo: int;
  private _maxZoomMultiplier: int;
  private _minZoomMultiplier: int;
  private _missileBounciness: int;
  private _missileForceImpulse: int;
  private _missileTimeToDetonate: int;
  private _projectileSpeed: int;
  private _projectilesPerShot: int;
  private _rateOfFire: int;
  private _recoilKickback: int;
  private _recoilMovement: int;
  private _secondaryActionReticle: int;
  private _splashRadius: int;
  private _startAmmo: int;
  private _tier: int;
  private _weaponSecondaryAction: int;

  public override get ItemType(): UberstrikeItemType {
    return UberstrikeItemType.Weapon;
  }

  public get DamageKnockback(): int {
    return this._damageKnockback;
  }
  public set DamageKnockback(value: int) {
    this._damageKnockback = value;
  }

  public get DamagePerProjectile(): int {
    return this._damagePerProjectile;
  }
  public set DamagePerProjectile(value: int) {
    this._damagePerProjectile = value;
  }

  public get AccuracySpread(): int {
    return this._accuracySpread;
  }
  public set AccuracySpread(value: int) {
    this._accuracySpread = value;
  }

  public get RecoilKickback(): int {
    return this._recoilKickback;
  }
  public set RecoilKickback(value: int) {
    this._recoilKickback = value;
  }

  public get StartAmmo(): int {
    return this._startAmmo;
  }
  public set StartAmmo(value: int) {
    this._startAmmo = value;
  }

  public get MaxAmmo(): int {
    return this._maxAmmo;
  }
  public set MaxAmmo(value: int) {
    this._maxAmmo = value;
  }

  public get MissileTimeToDetonate(): int {
    return this._missileTimeToDetonate;
  }
  public set MissileTimeToDetonate(value: int) {
    this._missileTimeToDetonate = value;
  }

  public get MissileForceImpulse(): int {
    return this._missileForceImpulse;
  }
  public set MissileForceImpulse(value: int) {
    this._missileForceImpulse = value;
  }

  public get MissileBounciness(): int {
    return this._missileBounciness;
  }
  public set MissileBounciness(value: int) {
    this._missileBounciness = value;
  }

  public get SplashRadius(): int {
    return this._splashRadius;
  }
  public set SplashRadius(value: int) {
    this._splashRadius = value;
  }

  public get ProjectilesPerShot(): int {
    return this._projectilesPerShot;
  }
  public set ProjectilesPerShot(value: int) {
    this._projectilesPerShot = value;
  }

  public get ProjectileSpeed(): int {
    return this._projectileSpeed;
  }
  public set ProjectileSpeed(value: int) {
    this._projectileSpeed = value;
  }

  public get RateOfFire(): int {
    return this._rateOfFire;
  }
  public set RateOfFire(value: int) {
    this._rateOfFire = value;
  }

  public get RecoilMovement(): int {
    return this._recoilMovement;
  }
  public set RecoilMovement(value: int) {
    this._recoilMovement = value;
  }

  public get CombatRange(): int {
    return this._combatRange;
  }
  public set CombatRange(value: int) {
    this._combatRange = value;
  }

  public get Tier(): int {
    return this._tier;
  }
  public set Tier(value: int) {
    this._tier = value;
  }

  public get SecondaryActionReticle(): int {
    return this._secondaryActionReticle;
  }
  public set SecondaryActionReticle(value: int) {
    this._secondaryActionReticle = value;
  }

  public get WeaponSecondaryAction(): int {
    return this._weaponSecondaryAction;
  }
  public set WeaponSecondaryAction(value: int) {
    this._weaponSecondaryAction = value;
  }

  public get CriticalStrikeBonus(): int {
    return this._criticalStrikeBonus;
  }
  public set CriticalStrikeBonus(value: int) {
    this._criticalStrikeBonus = value;
  }

  public get DamagePerSecond(): float {
    return this.RateOfFire === 0 ? 0 : (this.DamagePerProjectile * this.ProjectilesPerShot) / this.RateOfFire;
  }

  public get HasAutomaticFire(): bool {
    return this._hasAutoFire;
  }
  public set HasAutomaticFire(value: bool) {
    this._hasAutoFire = value;
  }

  public get DefaultZoomMultiplier(): int {
    return this._defaultZoomMultiplier;
  }
  public set DefaultZoomMultiplier(value: int) {
    this._defaultZoomMultiplier = value;
  }

  public get MinZoomMultiplier(): int {
    return this._minZoomMultiplier;
  }
  public set MinZoomMultiplier(value: int) {
    this._minZoomMultiplier = value;
  }

  public get MaxZoomMultiplier(): int {
    return this._maxZoomMultiplier;
  }
  public set MaxZoomMultiplier(value: int) {
    this._maxZoomMultiplier = value;
  }
}
