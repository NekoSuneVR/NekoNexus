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

import packageJson from '../../package.json';

export default class ConsoleHelper {
  static PrintConsoleHeader(): void {
    console.log(`Paradise Web Services [Version ${packageJson.version}]`);
    console.log(`(c) 2017, 2022-${new Date().getFullYear()} Team FESTIVAL. All rights reserved.`);
    console.log(`Made with \u2665 using Bun ${Bun.version}.\n`);
  }

  static PrintConsoleHeaderSubtitle(): void {
    console.log('\r\nType "help" (or "h") to see available commands.');
  }
}
