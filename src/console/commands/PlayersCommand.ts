import { ActivePlayer, Clan, ClanMember, PublicProfile, SteamMember } from '@/models';
import { GroupPosition, MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { Op } from 'sequelize';
import ParadiseCommand from '../ParadiseCommand';

export default class PlayersCommand extends ParadiseCommand {
  public static override Command: string = 'players';
  public static override Aliases: string[] = ['player', 'p'];

  public override Description: string = 'List and manage players.';
  public override HelpString: string = `${PlayersCommand.Command}\t\t${this.Description}`;

  public override UsageText: string[] = [
    `${PlayersCommand.Command}: ${this.Description}`,
    '  delete\tDeletes a player.',
    '  list\t\tLists all players that are currently online.',
    '  list-all\tLists all known players.',
    '  search <pattern>\t\tSearches a player by name, CMID, Steam ID or E-Mail address',
  ];

  public override MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Moderator;

  public override async Run(args: string[]): Promise<any> {
    if (args.length < 1) {
      this.PrintUsageText();
      return;
    }

    switch (args[0].toLowerCase()) {
      case 'delete': {
        if (args.length < 2) {
          this.PrintUsageText();
          return;
        }

        const pattern = args[1];

        if (pattern.length < 3) {
          this.WriteLine('Search pattern must contain at least 3 characters.');
          return;
        }

        const playerProfiles = await PublicProfile.findAll({
          where: {
            Cmid: {
              [Op.gt]: 0,
            },
          },
          order: [['name', 'ASC']],
        });
        const steamMembers = await SteamMember.findAll();

        let players = playerProfiles.filter(
          (_) => _.Name.toLowerCase().includes(pattern.toLowerCase()) || _.Cmid.toString().includes(pattern),
        );
        let steamPlayers = steamMembers.filter((_) => _.SteamId.toString().includes(pattern));

        if (players.length) {
          steamPlayers = steamMembers.filter((steamMember) =>
            players.map((player) => player.Cmid).includes(steamMember.Cmid),
          );
        } else if (steamPlayers.length) {
          players = playerProfiles.filter((profile) =>
            steamPlayers.map((steamMember) => steamMember.Cmid).includes(profile.Cmid),
          );
        }

        if (!players.length) {
          this.WriteLine(`Could not find any player matching "${pattern}".`);
        } else if (players.length > 1) {
          this.WriteLine(`Found more than 1 player matching "${pattern}", not deleting.`);
        } else {
          const player = players[0];
          const clan = await Clan.findOne({ where: { OwnerCmid: player.Cmid } });
          if (clan) {
            this.WriteLine('Player owns a clan, finding next player to move ownership to.');

            const clanMembers = await ClanMember.findAll({
              where: {
                Cmid: { [Op.ne]: player.Cmid },
                GroupId: clan.GroupId,
              },
              order: [['Position', 'DESC']],
            });

            if (clanMembers?.length && clanMembers[0]) {
              this.WriteLine('Found new clan owner!');

              await clan.update({
                OwnerCmid: clanMembers[0].Cmid,
              });

              await clanMembers[0].update({
                Position: GroupPosition.Leader,
              });
            } else {
              this.WriteLine('Found no new clan owner, deleting clan.');

              await clan.destroy();
            }
          }
        }

        break;
      }
      case 'list': {
        const playerProfiles = await PublicProfile.findAll({
          where: {
            Cmid: {
              [Op.gt]: 0,
            },
          },
          order: [['name', 'ASC']],
        });
        const steamMembers = await SteamMember.findAll();
        const connectedPeers = await ActivePlayer.findAll();

        if (!connectedPeers?.length) {
          this.WriteLine('There are currently no players online.\n');
          return;
        }

        this.WriteLine(`Players currently online: ${connectedPeers.length}\n`);

        this.WriteLine(' ----------------------------------------------------------------------- ');
        this.WriteLine(
          `| ${'Username'.padEnd(18)} | ${'CMID'.padEnd(10)} | ${'SteamID64'.padEnd(17)} | ${'Rank'.padEnd(15)} |`,
        );
        this.WriteLine('|-----------------------------------------------------------------------|');

        for (const peer of connectedPeers) {
          const profile = playerProfiles.find((_) => _.Cmid === peer.Cmid);
          const steamMember = steamMembers.find((_) => _.Cmid === peer.Cmid);

          this.WriteLine(
            `| ${profile!.Name.padEnd(18)} | ${String(profile!.Cmid).padEnd(10)} | ${String(steamMember!.SteamId).padEnd(17)} | ${MemberAccessLevel[profile!.AccessLevel].padEnd(15)} |`,
          );
        }

        this.WriteLine('|-----------------------------------------------------------------------|');

        break;
      }
      case 'list-all': {
        const playerProfiles = await PublicProfile.findAll({
          where: {
            Cmid: {
              [Op.gt]: 0,
            },
          },
          order: [['name', 'ASC']],
        });
        const steamMembers = await SteamMember.findAll();
        const connectedPeers = await ActivePlayer.findAll();

        this.WriteLine(`Players currently online: ${connectedPeers.length}\n`);

        this.WriteLine(' -------------------------------------------------------------------------------- ');
        this.WriteLine(
          `| ${'Username'.padEnd(18)} | ${'CMID'.padEnd(10)} | ${'SteamID64'.padEnd(17)} | ${'Rank'.padEnd(15)} | ${'Online'.padEnd(6)} |`,
        );
        this.WriteLine('|--------------------------------------------------------------------------------|');

        for (const profile of playerProfiles) {
          const steamMember = steamMembers.find((_) => _.Cmid === profile.Cmid);
          const peer = connectedPeers.find((_) => _.Cmid === profile.Cmid);

          this.WriteLine(
            `| ${profile.Name.padEnd(18)} | ${String(profile.Cmid).padEnd(10)} | ${String(steamMember!.SteamId).padEnd(17)} | ${MemberAccessLevel[profile.AccessLevel].padEnd(15)} | ${String(peer === undefined ? 'No' : 'Yes').padEnd(6)} |`,
          );
        }

        this.WriteLine('|--------------------------------------------------------------------------------|');

        break;
      }
      case 'search': {
        if (args.length < 2) {
          this.PrintUsageText();
          return;
        }

        const pattern = args[1];

        if (pattern.length < 3) {
          this.WriteLine('Search pattern must contain at least 3 characters.');
          return;
        }

        const playerProfiles = await PublicProfile.findAll({
          where: {
            Cmid: {
              [Op.gt]: 0,
            },
          },
          order: [['name', 'ASC']],
        });
        const steamMembers = await SteamMember.findAll();
        const connectedPeers = await ActivePlayer.findAll();

        let players = playerProfiles.filter(
          (_) => _.Name.toLowerCase().includes(pattern.toLowerCase()) || _.Cmid.toString().includes(pattern),
        );
        let steamPlayers = steamMembers.filter((_) => _.SteamId.toString().includes(pattern));

        if (players.length) {
          steamPlayers = steamMembers.filter((steamMember) =>
            players.map((player) => player.Cmid).includes(steamMember.Cmid),
          );
        } else if (steamPlayers.length) {
          players = playerProfiles.filter((profile) =>
            steamPlayers.map((steamMember) => steamMember.Cmid).includes(profile.Cmid),
          );
        }

        if (players.length) {
          this.WriteLine(' -------------------------------------------------------------------------------- ');
          this.WriteLine(
            `| ${'Username'.padEnd(18)} | ${'CMID'.padEnd(10)} | ${'SteamID64'.padEnd(17)} | ${'Rank'.padEnd(15)} | ${'Online'.padEnd(6)} |`,
          );
          this.WriteLine('|--------------------------------------------------------------------------------|');

          for (const profile of players) {
            const steamMember = steamMembers.find((_) => _.Cmid === profile.Cmid);
            const peer = connectedPeers?.find((_) => _.Cmid === profile.Cmid);

            this.WriteLine(
              `| ${profile.Name.padEnd(18)} | ${String(profile.Cmid).padEnd(10)} | ${String(steamMember!.SteamId).padEnd(17)} | ${MemberAccessLevel[profile.AccessLevel].padEnd(15)} | ${String(peer === undefined ? 'No' : 'Yes').padEnd(6)} |`,
            );
          }

          this.WriteLine(' -------------------------------------------------------------------------------- ');
        } else {
          this.WriteLine(`Could not find any player matching "${pattern}".`);
        }

        break;
      }
      default:
        this.WriteLine(`${PlayersCommand.Command}: unknown command ${args[0]} \n`);
        break;
    }
  }
}
