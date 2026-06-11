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

import CommandHandler from '../CommandHandler';
import NekoNexusCommand from '../NekoNexusCommand';

export default class HelpCommand extends NekoNexusCommand {
  static override Command: string = 'help';
  static override Aliases: string[] = ['h'];

  override Description: string = 'Shows this help text. (Alias: h)';
  override HelpString: string = `${HelpCommand.Command}\t\t${this.Description}`;

  override UsageText: string[] = [];

  override async Run(args: string[]): Promise<any> {
    if (args.length) {
      const commandObj = CommandHandler.Commands.find(
        (_) => _.Command.localeCompare(args[0], undefined, { sensitivity: 'base' }) === 0,
      );

      if (commandObj) {
        /* eslint-disable new-cap */
        const cmd = new commandObj('');

        for (const line of cmd.UsageText) {
          this.WriteLine(line);
        }
      }
    } else {
      this.WriteLine('Use "help <command>" to get help for a specific command.');
      this.WriteLine('Available commands:\n');

      for (const commandObj of CommandHandler.Commands.toSorted((a, b) =>
        a.Command.localeCompare(b.Command, undefined, { sensitivity: 'base' }),
      )) {
        /* eslint-disable new-cap */
        const cmd = new commandObj('');
        this.WriteLine(cmd.HelpString);
      }
    }
  }
}
