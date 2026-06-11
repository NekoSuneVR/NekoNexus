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

import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import NekoNexusCommand from '../NekoNexusCommand';

export default class RoomsCommand extends NekoNexusCommand {
  static override Command: string = 'rooms';
  static override Aliases: string[] = ['room'];

  override Description: string = 'List and manage game rooms.';
  override HelpString: string = `${RoomsCommand.Command}\t\t${this.Description}`;

  override UsageText: string[] = [
    `${RoomsCommand.Command}: ${this.Description}`,
    '  list\t\tList all rooms that are currently open.',
    '  close <roomId>\t\tCloses an open room if it exists.',
  ];

  override MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Moderator;

  override async Run(args: string[]): Promise<any> {
    console.log('run');
  }
}
