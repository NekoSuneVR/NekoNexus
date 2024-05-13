import ConsoleHelper from '../ConsoleHelper';
import ParadiseCommand from '../ParadiseCommand';

export default class ClearCommand extends ParadiseCommand {
  public static override Command: string = 'clear';
  public static override Aliases: string[] = [];

  public override Description: string = 'Clears the console, obviously.';
  public override HelpString: string = `${ClearCommand.Command}\t\t${this.Description}`;

  public override UsageText: string[] = [];

  public override async Run(args: string[]): Promise<any> {
    process.stdout.write('\x1bc');

    ConsoleHelper.PrintConsoleHeader();
    ConsoleHelper.PrintConsoleHeaderSubtitle();
  }
}
