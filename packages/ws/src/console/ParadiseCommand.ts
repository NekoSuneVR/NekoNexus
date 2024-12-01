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

import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';

export class CommandOutputArgs {
  InvocationId: string;
  Text: string;
  Inline: boolean = false;

  constructor(params: Partial<CommandOutputArgs> = {}) {
    Object.assign(this, params);
  }
}

export default abstract class ParadiseCommand {
  static readonly Command: string;
  static readonly Aliases: string[];

  abstract Description: string;
  abstract HelpString: string;
  abstract UsageText: string[];

  MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Admin;

  InvocationId?: string;

  constructor(invocationId?: string) {
    this.InvocationId = invocationId;
  }

  abstract Run(args: string[]): Promise<any>;

  CommandOutput: (sender: any, args: CommandOutputArgs) => void;

  private readonly OutputBuffer: string[] = [];

  get Output(): string {
    return this.OutputBuffer.join('\n');
  }

  ClearOutputBuffer(): void {
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
