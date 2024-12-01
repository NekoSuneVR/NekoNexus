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

import { XpPointsUtil } from '@/utils';
import { PlayerStatistics, PublicProfile } from '@festivaldev/paradise-models';
import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import ParadiseCommand from '../ParadiseCommand';

export default class XpCommand extends ParadiseCommand {
  static override Command: string = 'xp';
  static override Aliases: string[] = [];

  override Description: string = "Increases or decreases a player's level.";
  override HelpString: string = `${XpCommand.Command}\t\t${this.Description}`;

  override UsageText: string[] = [
    `${XpCommand.Command}: ${this.Description}`,
    "  give <cmid> <amount>\t\tAdds the specified amount of experience to increase a player's level.",
    "  take <cmid> <amount>\t\tRemoves the specified amount of experience to decrease a player's level.",
  ];

  override MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Moderator;

  override async Run(args: string[]): Promise<any> {
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
