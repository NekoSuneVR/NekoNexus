export default class PlayerWeaponStatisticsView {
  public MeleeTotalSplats: int;
  public HandgunTotalSplats: int; // # LEGACY # //
  public MachineGunTotalSplats: int;
  public ShotgunTotalSplats: int;
  public SniperTotalSplats: int;
  public SplattergunTotalSplats: int;
  public CannonTotalSplats: int;
  public LauncherTotalSplats: int;
  public MeleeTotalShotsFired: int;
  public MeleeTotalShotsHit: int;
  public MeleeTotalDamageDone: int;
  public HandgunTotalDamageDone: int; // # LEGACY # //
  public HandgunTotalShotsFired: int; // # LEGACY # //
  public HandgunTotalShotsHit: int; // # LEGACY # //
  public MachineGunTotalShotsFired: int;
  public MachineGunTotalShotsHit: int;
  public MachineGunTotalDamageDone: int;
  public ShotgunTotalShotsFired: int;
  public ShotgunTotalShotsHit: int;
  public ShotgunTotalDamageDone: int;
  public SniperTotalShotsFired: int;
  public SniperTotalShotsHit: int;
  public SniperTotalDamageDone: int;
  public SplattergunTotalShotsFired: int;
  public SplattergunTotalShotsHit: int;
  public SplattergunTotalDamageDone: int;
  public CannonTotalShotsFired: int;
  public CannonTotalShotsHit: int;
  public CannonTotalDamageDone: int;
  public LauncherTotalShotsFired: int;
  public LauncherTotalShotsHit: int;
  public LauncherTotalDamageDone: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[PlayerWeaponStatisticsView: [CannonTotalDamageDone: ${this.CannonTotalDamageDone}][CannonTotalShotsFired: ${this.CannonTotalShotsFired}][CannonTotalShotsHit: ${this.CannonTotalShotsHit}][CannonTotalSplats: ${this.CannonTotalSplats}][HandgunTotalDamageDone: ${this.HandgunTotalDamageDone}][HandgunTotalShotsFired: ${this.HandgunTotalShotsFired}][HandgunTotalShotsHit: ${this.HandgunTotalShotsHit}][HandgunTotalSplats: ${this.HandgunTotalSplats}][LauncherTotalDamageDone: ${this.LauncherTotalDamageDone}][LauncherTotalShotsFired: ${this.LauncherTotalShotsFired}][LauncherTotalShotsHit: ${this.LauncherTotalShotsHit}][LauncherTotalSplats: ${this.LauncherTotalSplats}][MachineGunTotalDamageDone: ${this.MachineGunTotalDamageDone}][MachineGunTotalShotsFired: ${this.MachineGunTotalShotsFired}][MachineGunTotalShotsHit: ${this.MachineGunTotalShotsHit}][MachineGunTotalSplats: ${this.MachineGunTotalSplats}][MeleeTotalDamageDone: ${this.MeleeTotalDamageDone}][MeleeTotalShotsFired: ${this.MeleeTotalShotsFired}][MeleeTotalShotsHit: ${this.MeleeTotalShotsHit}][MeleeTotalSplats: ${this.MeleeTotalSplats}][ShotgunTotalDamageDone: ${this.ShotgunTotalDamageDone}][ShotgunTotalShotsFired: ${this.ShotgunTotalShotsFired}][ShotgunTotalShotsHit: ${this.ShotgunTotalShotsHit}][ShotgunTotalSplats: ${this.ShotgunTotalSplats}][SniperTotalDamageDone: ${this.SniperTotalDamageDone}][SniperTotalShotsFired: ${this.SniperTotalShotsFired}][SniperTotalShotsHit: ${this.SniperTotalShotsHit}][SniperTotalSplats: ${this.SniperTotalSplats}][SplattergunTotalDamageDone: ${this.SplattergunTotalDamageDone}][SplattergunTotalShotsFired: ${this.SplattergunTotalShotsFired}][SplattergunTotalShotsHit: ${this.SplattergunTotalShotsHit}][SplattergunTotalSplats: ${this.SplattergunTotalSplats}]]`;
  }
}
