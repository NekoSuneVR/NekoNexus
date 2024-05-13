import CommandHandler from '../CommandHandler';
import ParadiseCommand from '../ParadiseCommand';

export default class HelpCommand extends ParadiseCommand {
  public static override Command: string = 'help';
  public static override Aliases: string[] = ['h'];

  public override Description: string = 'Shows this help text. (Alias: h)';
  public override HelpString: string = `${HelpCommand.Command}\t\t${this.Description}`;

  public override UsageText: string[] = [];

  public override async Run(args: string[]): Promise<any> {
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
