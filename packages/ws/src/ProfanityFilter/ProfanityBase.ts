/*
MIT License
Copyright (c) 2019
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Ported to TypeScript by Team FESTIVAL.
*/

import WordList from './WordList';

export default class ProfanityBase {
  protected _profanities: string[];

  /**
   * Constructor that allows you to insert a custom array or profanities.
   * This list will replace the default list.
   * If the list is null, the default list will be used instead.
   *
   * @param {string[]} [profanityList] - Array of words considered profanities.
   */
  constructor(profanityList?: string[]) {
    if (profanityList) {
      this._profanities = [...profanityList];
    } else {
      this._profanities = [...WordList];
    }
  }

  /**
   * Add a custom profanity to the list.
   *
   * @param {string} profanity - The profanity to add.
   */
  public AddProfanity(profanity: string): void {
    if (!profanity.trim().length) throw new Error('ArgumentNullException: profanity');
    this._profanities.push(profanity);
  }

  /**
   * Add a custom array profanities to the defaultl list. This adds to the
   * default list, and does not replace it.
   *
   * @param {string[]} profanityList - The array of profanities to add.
   */
  public AddProfanities(profanityList: string[]): void {
    if (!profanityList) throw new Error('ArgumentNullException: profanityList');
    this._profanities.push(...profanityList);
  }

  /**
   * Remove a profanity from the current loaded list of profanities.
   *
   * @param {string} profanity - The profanity to remove from the list.
   * @returns {bool} True of the profanity was removed. False otherwise.
   */
  public RemoveProfanity(profanity: string): boolean {
    if (!profanity.trim().length) throw new Error('ArgumentNullException: profanity');

    const index = this._profanities.indexOf(profanity.toLowerCase());
    return index !== -1 ? !!this._profanities.splice(index, 1).length : false;
  }

  /**
   * Remove an array of profanities from the current loaded list of profanities.
   *
   * @param {string[]} profanities - The array of profanities to remove from the list.
   * @returns {bool} True if the profanities were removed. False otherwise.
   */
  public RemoveProfanities(profanities: string[]): boolean {
    if (!profanities) throw new Error('ArgumentNullException: profanities');

    for (const naughtyWord in profanities) {
      if (!this.RemoveProfanity(naughtyWord)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Remove all profanities from the current loaded list.
   */
  public Clear(): void {
    this._profanities = [];
  }

  /**
   * Return the number of profanities in the system.
   */
  public get Count(): number {
    return this._profanities.length;
  }
}
