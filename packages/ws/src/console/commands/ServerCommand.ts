import ParadiseService from '@/ParadiseService';
import { ServerType } from '@/ServiceHosts/WebSocket';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import ParadiseCommand from '../ParadiseCommand';

export default class ServerCommand extends ParadiseCommand {
  public static override Command: string = 'server';
  public static override Aliases: string[] = [];

  public override Description: string = 'Manage server credentials.';
  public override HelpString: string = `${ServerCommand.Command}\t\t${this.Description}`;

  public override UsageText: string[] = [
    `${ServerCommand.Command}: ${this.Description}`,
    '  list\t\t\tList all known credentials',
    '  generate <name> <type>\tGenerates credentials for a new server.',
  ];

  public override async Run(args: string[]): Promise<any> {
    if (args.length < 1) {
      this.PrintUsageText();
      return;
    }

    switch (args[0].toLocaleLowerCase()) {
      case 'list':
        for (const serverCredential of ParadiseService.Instance.ServiceSettings.ServerCredentials) {
          this.WriteLine(`Name: ${serverCredential.Name}`);
          this.WriteLine(`Type: ${serverCredential.Type} (${ServerType[serverCredential.Type]})`);
          this.WriteLine(`Server ID: ${serverCredential.Id}`);
          this.WriteLine(`Passphrase: ${serverCredential.Passphrase}\n`);
        }
        break;
      case 'gen':
      case 'generate': {
        const serverName = args[1];

        if (serverName.length < 3) {
          this.WriteLine('Server name must contain at least 3 characters.');
          return;
        }

        const serverType: ServerType = parseInt(args[2], 10) as ServerType;

        if (!ServerType[serverType] || serverType < 2) {
          this.WriteLine('Invalid server type.');
          return;
        }

        const serverId = uuid();
        const passphrase = crypto.createHash('SHA512').update(`${serverId}_${new Date().getTime()}`).digest('base64');

        this.WriteLine(`- Name: '${serverName}'`);
        this.WriteLine(`  Type: ${serverType} # ${ServerType[serverType]}`);
        this.WriteLine(`  Id: ${serverId}`);
        this.WriteLine(`  Passphrase: ${passphrase}`);

        break;
      }
      default:
        this.WriteLine(`${ServerCommand.Command}: unknown command ${args[0]}\n`);
        break;
    }
  }
}
