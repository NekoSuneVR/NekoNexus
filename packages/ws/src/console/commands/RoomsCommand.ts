import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import ParadiseCommand from '../ParadiseCommand';

export default class RoomsCommand extends ParadiseCommand {
  public static override Command: string = 'rooms';
  public static override Aliases: string[] = ['room'];

  public override Description: string = 'List and manage game rooms.';
  public override HelpString: string = `${RoomsCommand.Command}\t\t${this.Description}`;

  public override UsageText: string[] = [
    `${RoomsCommand.Command}: ${this.Description}`,
    '  list\t\tList all rooms that are currently open.',
    '  close <roomId>\t\tCloses an open room if it exists.',
  ];

  public override MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Moderator;

  public override async Run(args: string[]): Promise<any> {
    console.log('run');
  }
}
