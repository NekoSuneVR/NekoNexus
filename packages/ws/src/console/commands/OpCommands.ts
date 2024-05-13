import { PublicProfile } from '@festivaldev/paradise-models';
import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import ParadiseCommand from '../ParadiseCommand';

export class DeopCommand extends ParadiseCommand {
  public static override Command: string = 'deop';
  public static override Aliases: string[] = [];

  public override Description: string = "Resets a user's permission level.";
  public override HelpString: string = `${DeopCommand.Command}\t\t${this.Description}`;

  public override UsageText: string[] = [
    `${DeopCommand.Command}: ${this.Description}`,
    `Usage: ${DeopCommand.Command} <name>`,
  ];

  public override async Run(args: string[]): Promise<any> {
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

export class OpCommand extends ParadiseCommand {
  public static override Command: string = 'op';
  public static override Aliases: string[] = [];

  public override Description: string = "Sets a user's permission level.";
  public override HelpString: string = `${OpCommand.Command}\t\t${this.Description}`;

  public get UsageText(): string[] {
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

  public override async Run(args: string[]): Promise<any> {
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
