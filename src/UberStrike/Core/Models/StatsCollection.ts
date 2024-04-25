export default class StatsCollection {
  public Headshots: int;
  public Nutshots: int;
  public ConsecutiveSnipes: int;
  public Xp: int;
  public Deaths: int;
  public DamageReceived: int;
  public ArmorPickedUp: int;
  public HealthPickedUp: int;
  public MeleeKills: int;
  public MeleeShotsFired: int;
  public MeleeShotsHit: int;
  public MeleeDamageDone: int;
  public HandgunKills: int;
  public HandgunShotsFired: int;
  public HandgunShotsHit: int;
  public HandgunDamageDone: int;
  public MachineGunKills: int;
  public MachineGunShotsFired: int;
  public MachineGunShotsHit: int;
  public MachineGunDamageDone: int;
  public ShotgunSplats: int;
  public ShotgunShotsFired: int;
  public ShotgunShotsHit: int;
  public ShotgunDamageDone: int;
  public SniperKills: int;
  public SniperShotsFired: int;
  public SniperShotsHit: int;
  public SniperDamageDone: int;
  public SplattergunKills: int;
  public SplattergunShotsFired: int;
  public SplattergunShotsHit: int;
  public SplattergunDamageDone: int;
  public CannonKills: int;
  public CannonShotsFired: int;
  public CannonShotsHit: int;
  public CannonDamageDone: int;
  public LauncherKills: int;
  public LauncherShotsFired: int;
  public LauncherShotsHit: int;
  public LauncherDamageDone: int;
  public Suicides: int;
  public Points: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public GetKills(): int {
    return (
      this.MeleeKills +
      this.HandgunKills +
      this.MachineGunKills +
      this.ShotgunSplats +
      this.SniperKills +
      this.SplattergunKills +
      this.CannonKills +
      this.LauncherKills -
      this.Suicides
    );
  }

  public GetShots(): int {
    return (
      this.MeleeShotsFired +
      this.HandgunShotsFired +
      this.MachineGunShotsFired +
      this.ShotgunShotsFired +
      this.SniperShotsFired +
      this.SplattergunShotsFired +
      this.CannonShotsFired +
      this.LauncherShotsFired
    );
  }

  public GetHits(): int {
    return (
      this.MeleeShotsHit +
      this.HandgunShotsHit +
      this.MachineGunShotsHit +
      this.ShotgunShotsHit +
      this.SniperShotsHit +
      this.SplattergunShotsHit +
      this.CannonShotsHit +
      this.LauncherShotsHit
    );
  }

  public GetDamageDealt(): int {
    return (
      this.MeleeDamageDone +
      this.HandgunDamageDone +
      this.MachineGunDamageDone +
      this.ShotgunDamageDone +
      this.SniperDamageDone +
      this.SplattergunDamageDone +
      this.CannonDamageDone +
      this.LauncherDamageDone
    );
  }
}
