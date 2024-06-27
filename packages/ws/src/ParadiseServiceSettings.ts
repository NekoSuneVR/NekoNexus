import { ServerType } from '@/ServiceHosts/WebSocket';
import { DiscordSettings } from '@/discord/DiscordSettings';
import { Log } from '@/utils';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

export class ServerPassPhrase {
  public Name: string;
  public Type: ServerType;
  public Id: string;
  public Passphrase: string;
}

export class DatabaseSettings {
  public Server: string;
  public Type: string = 'mysql';
  public Port: number = 3306;
  public Username: string;
  public Password: string;
  public DatabaseName: string = 'paradise';
}

export class ParadiseServiceSettings {
  [key: string]: any;

  public Hostname: string = '127.0.0.1';

  public WebServicePort: number = 8080;
  public FileServerPort: number = 8081;
  public SocketPort: number = 8082;

  public DatabaseSettings: DatabaseSettings = new DatabaseSettings();

  public WebServicePrefix: string = 'UberStrike.DataCenter.WebService.CWS.';
  public WebServiceSuffix: string = 'Contract.svc';
  public EncryptionInitVector: string = 'aaaaBBBBccccDDDD'; // Must be 16 characters
  public EncryptionPassPhrase: string = 'mysupersecretpassphrase';
  public ServerCredentials: ServerPassPhrase[] = [];

  public FileServerRoot: string = 'wwwroot';

  /**
   * @deprecated Use a reverse proxy to provide SSL encryption
   */
  public EnableSSL: boolean = false;

  /**
   * @deprecated Use a reverse proxy to provide SSL encryption
   */
  public SSLCertificateName: string = '';

  public DiscordSettings: DiscordSettings = new DiscordSettings();

  constructor(path: string) {
    if (!fs.existsSync(path)) {
      Log.warn(`No config file found at ${path}, using fallback config.`);
      return;
    }

    try {
      let settings;

      if (Bun.env.PARADISE_SETTINGS) {
        settings = YAML.parse(Bun.env.PARADISE_SETTINGS);
      } else {
        settings = YAML.parse(fs.readFileSync(path, 'utf-8'));
      }

      for (const key of Object.keys(settings)) {
        if (key in this) {
          this[key] = settings[key];
        }
      }
    } catch (error: any) {
      Log.error('There was an error parsing the settings file.', error);
    }
  }
}

export default new ParadiseServiceSettings(path.join(process.cwd(), 'Paradise.Settings.WebServices.yml'));
