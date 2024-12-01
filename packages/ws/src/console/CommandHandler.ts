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

import { CommandOutputArgs } from './ParadiseCommand';

export default class CommandHandler {
  static Commands: any[] = [];

  static async HandleCommand(
    command: string,
    args: string[],
    invocationId?: string,
    outputCallback?: (output: string, inline: boolean) => void,
    completedCallback?: (invoker: any, success: boolean, error?: string | undefined | null) => void,
  ): Promise<string> {
    if (!invocationId) invocationId = crypto.randomUUID();

    for (const commandObj of this.Commands) {
      if (
        commandObj.Command.localeCompare(command, undefined, { sensitivity: 'base' }) === 0 ||
        commandObj.Aliases.find((_: string) => _.localeCompare(command, undefined, { sensitivity: 'base' }) === 0)
      ) {
        /* eslint-disable new-cap */
        const invoker = new commandObj(invocationId);

        invoker.CommandOutput = (sender: any, e: CommandOutputArgs) => {
          outputCallback?.(e.Text, e.Inline);
        };

        await invoker.Run(args);
        completedCallback?.(invoker, true, null);

        return invocationId!;
      }
    }

    if (command.trim().length) {
      completedCallback?.(null, false, `${command}: Unknown command.`);
    }

    return invocationId!;
  }
}
