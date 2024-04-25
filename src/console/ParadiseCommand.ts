import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';

export class CommandOutputArgs {
  public InvocationId: string;
  public Text: string;
  public Inline: boolean = false;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}

export default abstract class ParadiseCommand {
  public static readonly Command: string;
  public static readonly Aliases: string[];

  public abstract Description: string;
  public abstract HelpString: string;
  public abstract UsageText: string[];

  public MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Admin;

  public InvocationId?: string;

  constructor(invocationId?: string) {
    this.InvocationId = invocationId;
  }

  public abstract Run(args: string[]): Promise<any>;

  public CommandOutput: (sender: any, args: CommandOutputArgs) => void;
  private readonly OutputBuffer: string[] = [];
  public get Output(): string {
    return this.OutputBuffer.join('\n');
  }

  public ClearOutputBuffer(): void {
    this.OutputBuffer.length = 0;
  }

  protected WriteLine(text: string): void {
    this.OutputBuffer.push(text);

    this.CommandOutput?.(
      this,
      new CommandOutputArgs({
        InvocationId: this.InvocationId,
        Text: text,
      }),
    );
  }

  protected Write(text: string): void {
    if (this.OutputBuffer.length > 0) {
      this.OutputBuffer[this.OutputBuffer.length - 1] = this.OutputBuffer[this.OutputBuffer.length - 1].concat(
        '',
        text,
      );
    } else {
      this.OutputBuffer.push(text);
    }

    this.CommandOutput?.(
      this,
      new CommandOutputArgs({
        InvocationId: this.InvocationId,
        Text: text,
        Inline: true,
      }),
    );
  }

  protected PrintUsageText(): void {
    for (const line of this.UsageText) {
      this.WriteLine(line);
    }
  }
}
