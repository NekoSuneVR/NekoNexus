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

export default class PlayerCardView {
  Name: string;
  Cmid: number;
  Splats: number;
  Splatted: number;
  Precision: string;
  Ranking: number;
  Shots: bigint;
  Hits: bigint;
  TagName: string;

  constructor(params: Partial<PlayerCardView> = {}) {
    Object.assign(this, params);
  }

  CompareTo(obj: any): number {
    if (obj instanceof PlayerCardView) {
      const playerCardView = obj as PlayerCardView;

      return -(playerCardView.Ranking - this.Ranking);
    }

    throw new Error('ArgumentOutOfRangeException: Parameter is not of the good type');
  }

  toString(): string {
    return `[Player: [Name: ${this.Name}][Cmid: ${this.Cmid}][Splats: ${this.Splats}][Shots: ${this.Shots}][Hits: ${this.Hits}][Splatted: ${this.Splatted}][Precision: ${this.Precision}][Ranking: ${this.Ranking}][TagName: ${this.TagName}]]`;
  }
}
