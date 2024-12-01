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

import ConsoleHelper from '../ConsoleHelper';
import ParadiseCommand from '../ParadiseCommand';

export default class ClearCommand extends ParadiseCommand {
  static override Command: string = 'clear';
  static override Aliases: string[] = [];

  override Description: string = 'Clears the console, obviously.';
  override HelpString: string = `${ClearCommand.Command}\t\t${this.Description}`;

  override UsageText: string[] = [];

  override async Run(args: string[]): Promise<any> {
    process.stdout.write('\x1bc');

    ConsoleHelper.PrintConsoleHeader();
    ConsoleHelper.PrintConsoleHeaderSubtitle();
  }
}
