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

import { PlayerInventoryItem, PlayerLoadout, PublicProfile } from '@festivaldev/paradise-models';
import { MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { LoadoutSlotType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { Op } from 'sequelize';
import ParadiseCommand from '../ParadiseCommand';

export default class InventoryCommand extends ParadiseCommand {
  static override Command: string = 'inventory';
  static override Aliases: string[] = ['inv'];

  override Description: string = "Adds or removes items from a player's inventory.";
  override HelpString: string = `${InventoryCommand.Command}\t${this.Description}`;

  override UsageText: string[] = [
    `${InventoryCommand.Command}: ${this.Description}`,
    "  give <name> <item> [<amount>]\t\tAdds the specified item to a player's inventory.",
    "  take <name> <item>\t\tRemoves the specified item from a player's inventory.",
    '  set <name> <slot> <item>\tSets the specified inventory slot to a specific item.',
  ];

  override MinimumAccessLevel: MemberAccessLevel = MemberAccessLevel.Moderator;

  override async Run(args: string[]): Promise<any> {
    if (args.length < 3) {
      this.PrintUsageText();
      return;
    }

    switch (args[0].toLocaleLowerCase()) {
      case 'add':
      case 'give': {
        const searchString = args[1];

        if (searchString.length < 3) {
          this.WriteLine('Search pattern must contain at least 3 characters.');
          return;
        }

        const publicProfile = await PublicProfile.getProfile(searchString);

        if (publicProfile == null) {
          this.WriteLine(`Failed to add item to inventory: Could not find player matching ${searchString}.`);
          return;
        }

        const itemId = Number(args[2]);
        if (Number.isNaN(itemId)) {
          this.WriteLine('Invalid parameter: item');
          return;
        }

        if (await this.hasInventoryItem(publicProfile.Cmid, itemId)) {
          this.WriteLine('Failed to add item to inventory: Item is already in inventory.');
          return;
        }

        let amount = Number(args[3]);
        if (Number.isNaN(itemId)) {
          amount = -1;
        }

        PlayerInventoryItem.create({
          Cmid: publicProfile.Cmid,
          ItemId: itemId,
          AmountRemaining: -1,
        });

        this.WriteLine(`${UberstrikeInventoryItem[itemId]} added to player inventory.`);

        break;
      }
      case 'remove':
      case 'take': {
        const searchString = args[1];

        if (searchString.length < 3) {
          this.WriteLine('Search pattern must contain at least 3 characters.');
          return;
        }

        const publicProfile = await PublicProfile.getProfile(searchString);

        if (publicProfile == null) {
          this.WriteLine(`Failed to add item to inventory: Could not find player matching ${searchString}.`);
          return;
        }

        const itemId = Number(args[2]);
        if (Number.isNaN(itemId)) {
          this.WriteLine('Invalid parameter: item');
          return;
        }

        if (!(await this.hasInventoryItem(publicProfile.Cmid, itemId))) {
          this.WriteLine('Failed to remove item from inventory: Item is not in inventory.');
          return;
        }

        await PlayerInventoryItem.destroy({
          where: {
            Cmid: publicProfile.Cmid,
            ItemId: itemId,
          },
        });

        const playerLoadout = await PlayerLoadout.findOne({ where: { Cmid: publicProfile.Cmid } });

        if (playerLoadout) {
          await playerLoadout.update({
            Head: (playerLoadout.Head === itemId ? 0 : playerLoadout.Head) as UberstrikeInventoryItem,
            Gloves: (playerLoadout.Gloves === itemId ? 0 : playerLoadout.Gloves) as UberstrikeInventoryItem,
            UpperBody: (playerLoadout.UpperBody === itemId ? 0 : playerLoadout.UpperBody) as UberstrikeInventoryItem,
            LowerBody: (playerLoadout.LowerBody === itemId ? 0 : playerLoadout.LowerBody) as UberstrikeInventoryItem,
            Boots: (playerLoadout.Boots === itemId ? 0 : playerLoadout.Boots) as UberstrikeInventoryItem,
            Face: (playerLoadout.Face === itemId ? 0 : playerLoadout.Face) as UberstrikeInventoryItem,
            Webbing: (playerLoadout.Webbing === itemId ? 0 : playerLoadout.Webbing) as UberstrikeInventoryItem,
            MeleeWeapon: (playerLoadout.MeleeWeapon === itemId
              ? 0
              : playerLoadout.MeleeWeapon) as UberstrikeInventoryItem,
            Weapon1: (playerLoadout.Weapon1 === itemId ? 0 : playerLoadout.Weapon1) as UberstrikeInventoryItem,
            Weapon2: (playerLoadout.Weapon2 === itemId ? 0 : playerLoadout.Weapon2) as UberstrikeInventoryItem,
            Weapon3: (playerLoadout.Weapon3 === itemId ? 0 : playerLoadout.Weapon3) as UberstrikeInventoryItem,
            QuickItem1: (playerLoadout.QuickItem1 === itemId ? 0 : playerLoadout.QuickItem1) as UberstrikeInventoryItem,
            QuickItem2: (playerLoadout.QuickItem2 === itemId ? 0 : playerLoadout.QuickItem2) as UberstrikeInventoryItem,
            QuickItem3: (playerLoadout.QuickItem3 === itemId ? 0 : playerLoadout.QuickItem3) as UberstrikeInventoryItem,
            FunctionalItem1: (playerLoadout.FunctionalItem1 === itemId
              ? 0
              : playerLoadout.FunctionalItem1) as UberstrikeInventoryItem,
            FunctionalItem2: (playerLoadout.FunctionalItem2 === itemId
              ? 0
              : playerLoadout.FunctionalItem2) as UberstrikeInventoryItem,
            FunctionalItem3: (playerLoadout.FunctionalItem3 === itemId
              ? 0
              : playerLoadout.FunctionalItem3) as UberstrikeInventoryItem,
          });
        }

        this.WriteLine(`${UberstrikeInventoryItem[itemId]} removed from player inventory.`);

        break;
      }
      case 'set': {
        if (args.length < 4) {
          this.PrintUsageText();
          return;
        }

        const searchString = args[1];

        if (searchString.length < 3) {
          this.WriteLine('Search pattern must contain at least 3 characters.');
          return;
        }

        const publicProfile = await PublicProfile.getProfile(searchString);

        if (publicProfile == null) {
          this.WriteLine(`Failed to add item to inventory: Could not find player matching ${searchString}.`);
          return;
        }

        const forbiddenSlots: string[] = [
          'LoadoutID',
          'Backpack',
          'Cmid',
          'Type',
          'Weapon1Mod1',
          'Weapon1Mod2',
          'Weapon1Mod3',
          'Weapon2Mod1',
          'Weapon2Mod2',
          'Weapon2Mod3',
          'Weapon3Mod1',
          'Weapon3Mod2',
          'Weapon3Mod3',
        ];

        if (forbiddenSlots.includes(args[2] as string) || !LoadoutSlotType[args[2] as keyof typeof LoadoutSlotType]) {
          this.WriteLine('Invalid parameter: slot');
          return;
        }

        const itemId = Number(args[3]);
        if (Number.isNaN(itemId)) {
          this.WriteLine('Invalid parameter: item');
          return;
        }

        if (itemId !== 0 && !(await this.hasInventoryItem(publicProfile.Cmid, itemId))) {
          this.WriteLine('Failed to set loadout slot: Item is not in inventory.');
          return;
        }

        const playerLoadout = await PlayerLoadout.findOne({ where: { Cmid: publicProfile.Cmid } });

        const slot = !isNaN(Number(args[2])) ? LoadoutSlotType[args[2] as keyof typeof LoadoutSlotType] : args[2];
        await playerLoadout!.update({
          [slot]: itemId,
        });

        this.WriteLine(`Slot ${slot} has been set to ${itemId === 0 ? 'NULL' : UberstrikeInventoryItem[itemId]}.`);

        break;
      }
      default:
        this.WriteLine(`${InventoryCommand.Command}: unknown command ${args[0]}\n`);
        break;
    }
  }

  private async hasInventoryItem(cmid: number, itemId: number): Promise<boolean> {
    const item = await PlayerInventoryItem.findOne({
      where: {
        Cmid: cmid,
        ItemId: itemId,
        [Op.or]: [
          {
            ExpirationDate: { [Op.gt]: new Date() },
          },
          {
            ExpirationDate: null,
          },
        ],
      },
    });

    return item != null;
  }
}
