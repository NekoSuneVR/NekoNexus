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

import { PublicProfile } from '@festivaldev/nekonexus-models';
import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import NekoNexusCommand from '../NekoNexusCommand';

export class DeopCommand extends NekoNexusCommand {
  static override Command: string = 'deop';
  static override Aliases: string[] = [];

  override Description: string = "Resets a user's permission level.";
  override HelpString: string = `${DeopCommand.Command}\t\t${this.Description}`;

  override UsageText: string[] = [
    `${DeopCommand.Command}: ${this.Description}`,
    `Usage: ${DeopCommand.Command} <name>`,
  ];

  override async Run(args: string[]): Promise<any> {
    if (args.length < 1) {
      this.PrintUsageText();
      return;
    }

    const searchString = args[0];

    if (searchString.length < 3) {
      this.WriteLine('Search pattern must contain at least 3 characters.');
      return;
    }

    const targetProfile = await PublicProfile.getProfile(searchString);

    if (targetProfile == null) {
      this.WriteLine(`Failed to add item to inventory: Could not find player matching ${searchString}.`);
      return;
    }

    if (targetProfile.AccessLevel === MemberAccessLevel.Default) {
      this.WriteLine('Failed to reset user permission level: Invalid data.');
      return;
    }

    await targetProfile.update({
      AccessLevel: MemberAccessLevel.Default,
    });

    this.WriteLine('User permission level has been reset successfully.');
  }
}

export class OpCommand extends NekoNexusCommand {
  static override Command: string = 'op';
  static override Aliases: string[] = [];

  override Description: string = "Sets a user's permission level.";
  override HelpString: string = `${OpCommand.Command}\t\t${this.Description}`;

  get UsageText(): string[] {
    const lines: any[] = [`${OpCommand.Command}: ${this.Description}`, `Usage: ${OpCommand.Command} <name> <level>`];

    const values: string[] = [];
    for (const key in Object.keys(MemberAccessLevel)) {
      if (!isNaN(Number(key)) && MemberAccessLevel[key]) {
        values.push(`${key} = ${MemberAccessLevel[key]}`);
      }
    }

    lines.push(`Available levels: ${values.join('; ')}`);

    return lines;
  }

  override async Run(args: string[]): Promise<any> {
    if (args.length < 2) {
      this.PrintUsageText();
      return;
    }

    const searchString = args[0];

    if (searchString.length < 3) {
      this.WriteLine('Search pattern must contain at least 3 characters.');
      return;
    }

    const targetProfile = await PublicProfile.getProfile(searchString);

    if (targetProfile == null) {
      this.WriteLine(`Failed to add item to inventory: Could not find player matching ${searchString}.`);
      return;
    }

    const level = Number(args[1]);
    if (
      isNaN(level) ||
      !MemberAccessLevel[level] ||
      level === MemberAccessLevel.Default ||
      targetProfile.AccessLevel === level
    ) {
      this.WriteLine('Failed to set user permission level: Invalid data.');
      return;
    }

    await targetProfile.update({
      AccessLevel: level,
    });

    this.WriteLine('User permission level has been set successfully.');
  }
}
