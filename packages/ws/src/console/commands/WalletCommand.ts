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

import { getDividerText } from '@/utils';
import { MemberWallet, PublicProfile } from '@festivaldev/nekonexus-models';
import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import NekoNexusCommand from '../NekoNexusCommand';

export default class WalletCommand extends NekoNexusCommand {
  static override Command: string = 'wallet';
  static override Aliases: string[] = [];

  override Description: string = "Manages credits and points in a player's wallet.";
  override HelpString: string = `${WalletCommand.Command}\t\t${this.Description}`;

  override UsageText: string[] = [
    `${WalletCommand.Command}: ${this.Description}`,
    "  info <name>\t\t\tShows the current status of a player's wallet.",
    '  credits',
    "    add <name> <amount>\t\tAdds the specified amount of credits to a players's wallet.",
    "    remove <name> <amount>\tRemoves the specified amount of credits from a players's wallet.",
    '  points',
    "    add <name> <amount>\t\tAdds the specified amount of points to a players's wallet.",
    "    remove <name> <amount>\tRemoves the specified amount of points from a players's wallet.",
  ];

  override MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Moderator;

  override async Run(args: string[]): Promise<any> {
    if (args.length < 2) {
      this.PrintUsageText();
      return;
    }

    switch (args[0].toLocaleLowerCase()) {
      case 'info': {
        const searchString = args[1];

        if (searchString.length < 3) {
          this.WriteLine('Search pattern must contain at least 3 characters.');
          return;
        }

        const profiles = await PublicProfile.getProfiles(searchString);
        const wallets = await MemberWallet.findAll();

        // console.log(profiles)

        if (!profiles) {
          this.WriteLine('Failed to get user profiles.');
        } else if (!profiles.length) {
          this.WriteLine('No user profiles found.');
        }

        if (!wallets) {
          this.WriteLine('Failed to get user wallets.');
        } else if (!wallets.length) {
          this.WriteLine('No user wallets found.');
        }

        if (profiles?.length && wallets?.length) {
          this.WriteLine(`┌${getDividerText(53)}┐`);
          this.WriteLine(
            `│ ${'Username'.padEnd(18)} │ ${'CMID'.padEnd(10)} │ ${'Credits'.padEnd(7)} │ ${'Points'.padEnd(7)} │`,
          );
          this.WriteLine(`├${getDividerText(53)}┤`);

          for (const profile of profiles) {
            const wallet = wallets.find((_) => _.Cmid === profile.Cmid);
            if (wallet) {
              this.WriteLine(
                `| ${profile.Name.padEnd(18)} | ${String(profile.Cmid).padEnd(10)} | ${String(wallet.Credits).padEnd(7)} | ${String(wallet.Points).padEnd(7)} |`,
              );
            }
          }

          this.WriteLine(`└${getDividerText(53)}┘`);
        } else {
          this.WriteLine(`Could not find any player matching ${searchString}.`);
        }
        break;
      }

      case 'credits': {
        if (args.length < 4) {
          this.PrintUsageText();
          return;
        }

        switch (args[1].toLocaleLowerCase()) {
          case 'add': {
            const searchString = args[2];

            if (searchString.length < 3) {
              this.WriteLine('Search pattern must contain at least 3 characters.');
              return;
            }

            const publicProfile = await PublicProfile.getProfile(searchString);

            if (!publicProfile) {
              this.WriteLine(`Failed to add credit(s) to wallet: Could not find player matching ${searchString}.`);
              return;
            }

            let amount = Number(args[3]);
            if (isNaN(amount)) {
              this.WriteLine('Invalid parameter: amount');
              return;
            }

            const memberWallet = await MemberWallet.findOne({ where: { Cmid: publicProfile.Cmid } });
            if (!memberWallet) {
              this.WriteLine('Failed to add credit(s) to wallet: Could not find player wallet.');
              return;
            }

            amount = Math.abs(amount);

            await memberWallet.update({
              Credits: memberWallet.Credits + amount,
            });

            this.WriteLine(`Successfully added ${amount} credit(s) to wallet.`);

            break;
          }

          case 'remove': {
            const searchString = args[2];

            if (searchString.length < 3) {
              this.WriteLine('Search pattern must contain at least 3 characters.');
              return;
            }

            const publicProfile = await PublicProfile.getProfile(searchString);

            if (!publicProfile) {
              this.WriteLine(`Failed to remove credit(s) from wallet: Could not find player matching ${searchString}.`);
              return;
            }

            let amount = Number(args[3]);
            if (isNaN(amount)) {
              this.WriteLine('Invalid parameter: amount');
              return;
            }

            const memberWallet = await MemberWallet.findOne({ where: { Cmid: publicProfile.Cmid } });
            if (!memberWallet) {
              this.WriteLine('Failed to remove credit(s) from wallet: Could not find player wallet.');
              return;
            }

            amount = Math.abs(amount);

            await memberWallet.update({
              Credits: Math.max(memberWallet.Credits - amount, 0),
            });

            this.WriteLine(`Successfully removed ${amount} credit(s) from wallet.`);

            break;
          }
          default:
            this.WriteLine(`${WalletCommand.Command}: unknown command ${args[1]}\n`);
            break;
        }
        break;
      }

      case 'points': {
        if (args.length < 4) {
          this.PrintUsageText();
          return;
        }

        switch (args[1].toLocaleLowerCase()) {
          case 'add': {
            const searchString = args[2];

            if (searchString.length < 3) {
              this.WriteLine('Search pattern must contain at least 3 characters.');
              return;
            }

            const publicProfile = await PublicProfile.getProfile(searchString);

            if (!publicProfile) {
              this.WriteLine(`Failed to add point(s) to wallet: Could not find player matching ${searchString}.`);
              return;
            }

            let amount = Number(args[3]);
            if (isNaN(amount)) {
              this.WriteLine('Invalid parameter: amount');
              return;
            }

            const memberWallet = await MemberWallet.findOne({ where: { Cmid: publicProfile.Cmid } });
            if (!memberWallet) {
              this.WriteLine('Failed to add point(s) to wallet: Could not find player wallet.');
              return;
            }

            amount = Math.abs(amount);

            await memberWallet.update({
              Points: memberWallet.Points + amount,
            });

            this.WriteLine(`Successfully added ${amount} point(s) to wallet.`);

            break;
          }

          case 'remove': {
            const searchString = args[2];

            if (searchString.length < 3) {
              this.WriteLine('Search pattern must contain at least 3 characters.');
              return;
            }

            const publicProfile = await PublicProfile.getProfile(searchString);

            if (!publicProfile) {
              this.WriteLine(`Failed to remove point(s) from wallet: Could not find player matching ${searchString}.`);
              return;
            }

            let amount = Number(args[3]);
            if (isNaN(amount)) {
              this.WriteLine('Invalid parameter: amount');
              return;
            }

            const memberWallet = await MemberWallet.findOne({ where: { Cmid: publicProfile.Cmid } });
            if (!memberWallet) {
              this.WriteLine('Failed to remove point(s) from wallet: Could not find player wallet.');
              return;
            }

            amount = Math.abs(amount);

            await memberWallet.update({
              Points: Math.max(memberWallet.Points - amount, 0),
            });

            this.WriteLine(`Successfully removed ${amount} point(s) from wallet.`);

            break;
          }

          default:
            this.WriteLine(`${WalletCommand.Command}: unknown command ${args[1]}\n`);
            break;
        }
        break;
      }

      default:
        this.WriteLine(`${WalletCommand.Command}: unknown command ${args[0]}\n`);
        break;
    }
  }
}
