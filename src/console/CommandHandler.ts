import { v4 as uuid } from 'uuid';
import { CommandOutputArgs } from './ParadiseCommand';

export default class CommandHandler {
  public static Commands: any[] = [];

  public static async HandleCommand(
    command: string,
    args: string[],
    invocationId?: string,
    outputCallback?: (output: string, inline: boolean) => void,
    completedCallback?: (invoker: any, success: boolean, error?: string | undefined | null) => void,
  ): Promise<string> {
    if (!invocationId) invocationId = uuid();

    for (const commandObj of this.Commands) {
      if (
        commandObj.Command.localeCompare(command, undefined, { sensitivity: 'base' }) === 0 ||
        commandObj.Aliases.find((_) => _.localeCompare(command, undefined, { sensitivity: 'base' }) === 0)
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
