import ParadiseService from '@/ParadiseService';
import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import ParadiseCommand from '../ParadiseCommand';

export default class QuitCommand extends ParadiseCommand {
  public static override Command: string = 'quit';
  public static override Aliases: string[] = ['q'];

  public override Description: string = 'Quits the application.';
  public override HelpString: string = `${QuitCommand.Command}\t\t${this.Description}`;

  public override UsageText: string[] = [`${QuitCommand.Command}: ${this.Description}`];

  public override MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Admin;

  public override async Run(args: string[]): Promise<any> {
    ParadiseService.Instance.Teardown();
  }
}
