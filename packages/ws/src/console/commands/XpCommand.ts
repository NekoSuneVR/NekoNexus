import { XpPointsUtil } from '@/utils';
import { PlayerStatistics, PublicProfile } from '@festivaldev/paradise-models';
import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import ParadiseCommand from '../ParadiseCommand';

export default class XpCommand extends ParadiseCommand {
  public static override Command: string = 'xp';
  public static override Aliases: string[] = [];

  public override Description: string = "Increases or decreases a player's level.";
  public override HelpString: string = `${XpCommand.Command}\t\t${this.Description}`;

  public override UsageText: string[] = [
    `${XpCommand.Command}: ${this.Description}`,
    "  give <cmid> <amount>\t\tAdds the specified amount of experience to increase a player's level.",
    "  take <cmid> <amount>\t\tRemoves the specified amount of experience to decrease a player's level.",
  ];

  public override MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Moderator;

  public override async Run(args: string[]): Promise<any> {
    if (args.length < 3) {
      this.PrintUsageText();
      return;
    }

    switch (args[0]) {
      case 'give': {
        const searchString = args[1];

        if (searchString.length < 3) {
          this.WriteLine('Search pattern must contain at least 3 characters.');
          return;
        }

        const publicProfile = await PublicProfile.getProfile(searchString);

        if (publicProfile == null) {
          this.WriteLine(`Failed to increase player experience: Could not find player matching ${searchString}.`);
          return;
        }

        let xpAmount = Number(args[2]);
        if (Number.isNaN(xpAmount)) {
          this.WriteLine('Invalid parameter: xp');
          return;
        }

        const playerStatistics = await PlayerStatistics.findOne({ where: { Cmid: publicProfile.Cmid } });
        if (!playerStatistics) {
          this.WriteLine('Failed to increase player experience: Player statistics not found.');
          return;
        }

        xpAmount = Math.abs(xpAmount);

        await playerStatistics.update({
          Xp: playerStatistics.Xp + xpAmount,
          Level: XpPointsUtil.GetLevelForXp(playerStatistics.Xp + xpAmount),
        });

        this.WriteLine(
          `Successfully added ${xpAmount} XP to player (total: ${playerStatistics.Xp}, level: ${playerStatistics.Level})`,
        );

        break;
      }
      case 'take': {
        const searchString = args[1];

        if (searchString.length < 3) {
          this.WriteLine('Search pattern must contain at least 3 characters.');
          return;
        }

        const publicProfile = await PublicProfile.getProfile(searchString);

        if (!publicProfile) {
          this.WriteLine(`Failed to decrease player experience: Could not find player matching ${searchString}.`);
          return;
        }

        let xpAmount = Number(args[2]);
        if (Number.isNaN(xpAmount)) {
          this.WriteLine('Invalid parameter: xp');
          return;
        }

        const playerStatistics = await PlayerStatistics.findOne({ where: { Cmid: publicProfile.Cmid } });
        if (!playerStatistics) {
          this.WriteLine('Failed to decrease player experience: Player statistics not found.');
          return;
        }

        xpAmount = Math.min(playerStatistics.Xp, Math.abs(xpAmount));

        await playerStatistics.update({
          Xp: playerStatistics.Xp - xpAmount,
          Level: XpPointsUtil.GetLevelForXp(playerStatistics.Xp - xpAmount),
        });

        this.WriteLine(
          `Successfully added ${xpAmount} XP to player (total: ${playerStatistics.Xp}, level: ${playerStatistics.Level})`,
        );

        break;
      }
      default:
        this.WriteLine(`${XpCommand.Command}: unknown command ${args[0]}\n`);
        break;
    }
  }
}
