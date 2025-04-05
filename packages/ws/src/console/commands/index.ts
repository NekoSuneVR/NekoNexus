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

import { BanCommand, UnbanCommand } from './BanCommands';
import ClearCommand from './ClearCommand';
import HelpCommand from './HelpCommand';
import InventoryCommand from './InventoryCommand';
import { DeopCommand, OpCommand } from './OpCommands';
import PlayersCommand from './PlayersCommand';
import QuitCommand from './QuitCommand';
import RoomsCommand from './RoomsCommand';
import ServerCommand from './ServerCommand';
import WalletCommand from './WalletCommand';
import XpCommand from './XpCommand';

export default [
  BanCommand,
  ClearCommand,
  DeopCommand,
  HelpCommand,
  InventoryCommand,
  OpCommand,
  PlayersCommand,
  QuitCommand,
  RoomsCommand,
  ServerCommand,
  UnbanCommand,
  WalletCommand,
  XpCommand,
];
