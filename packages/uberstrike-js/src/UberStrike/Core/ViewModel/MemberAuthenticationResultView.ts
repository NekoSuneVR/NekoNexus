import {
  LuckyDrawUnityView,
  MemberAuthenticationResult,
  MemberView,
  WeeklySpecialView,
} from '@/Cmune/DataCenter/Common/Entities';
import { PlayerStatisticsView } from '@/UberStrike/DataCenter/Common/Entities';

export default class MemberAuthenticationResultView {
  [key: string]: any;

  public MemberAuthenticationResult: MemberAuthenticationResult;
  public MemberView: MemberView;
  public PlayerStatisticsView: PlayerStatisticsView;
  public ServerTime: DateTime = new Date();
  public IsAccountComplete: bool;
  public LuckyDraw: LuckyDrawUnityView;
  public AuthToken: string;
  public IsTutorialComplete: bool; // # LEGACY # //
  public WeeklySpecial: WeeklySpecialView; // # LEGACY # //

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
