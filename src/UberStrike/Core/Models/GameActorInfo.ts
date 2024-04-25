import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import BodyPart from './BodyPart';
import FireMode from './FireMode';
import PlayerStates from './PlayerStates';
import SurfaceType from './SurfaceType';
import TeamID from './TeamID';

export default class GameActorInfo {
  public Cmid: int;
  public PlayerName: string;
  public AccessLevel: MemberAccessLevel;
  public Channel: ChannelType;
  public ClanTag: string;
  public Rank: byte;
  public PlayerId: byte;
  public PlayerState: PlayerStates;
  public Health: byte;
  public TeamID: TeamID;
  public Level: int;
  public Ping: ushort;
  public CurrentWeaponSlot: byte;
  public CurrentFiringMode: FireMode;
  public ArmorPoints: byte;
  public ArmorPointCapacity: byte;
  public SkinColor: Color;
  public Kills: short;
  public Deaths: short;
  public Weapons: int[] = [0, 0, 0, 0];
  public Gear: int[] = [0, 0, 0, 0, 0, 0, 0];
  public FunctionalItems: int[] = [0, 0, 0];
  public QuickItems: int[] = [0, 0, 0];
  public StepSound: SurfaceType;

  public get IsFiring(): bool {
    return this.Is(PlayerStates.Shooting);
  }

  public get IsReadyForGame(): bool {
    return this.Is(PlayerStates.Ready);
  }

  public get IsOnline(): bool {
    return !this.Is(PlayerStates.Offline);
  }

  public CurrentWeaponID(): int {
    return this.Weapons == null || this.Weapons.length <= this.CurrentWeaponSlot
      ? 0
      : this.Weapons[this.CurrentWeaponSlot];
  }

  public get IsAlive(): bool {
    return (this.PlayerState & PlayerStates.Dead) === 0;
  }

  public get IsSpectator(): bool {
    return (this.PlayerState & PlayerStates.Spectator) !== 0;
  }

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public Is(state: PlayerStates): bool {
    return (this.PlayerState & state) !== 0;
  }

  public GetAbsorptionRate(): float {
    return 0.66;
  }

  public Damage(damage: short, part: BodyPart, healthDamage: short, armorDamage: short): void {
    if (this.ArmorPoints > 0) {
      const num = Math.ceil(this.GetAbsorptionRate() * damage);
      armorDamage = Math.clamp(num, 0, this.ArmorPoints);
      healthDamage = damage - armorDamage;
    } else {
      armorDamage = 0;
      healthDamage = damage;
    }
  }
}
