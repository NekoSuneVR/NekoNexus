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

import IAllowList from './Interfaces/IAllowList';

export default class AllowList implements IAllowList {
  private _allowList: string[];

  constructor() {
    this._allowList = [];
  }

  /**
   * Return an instance of a read only collection containing allow list
   */
  public get ToList(): string[] {
    return this._allowList;
  }

  /**
   * Add a word to the profanity allow list. This means a word that is in the allow list
   * can be ignored. All words are treated as case insensitive.
   *
   * @param {string} wordToAllowlist - The word that you want to allow list.
   */
  public Add(wordToAllowlist: string): void {
    if (!wordToAllowlist.trim().length) throw new Error('ArgumentNullException: wordToAllowlist');

    if (!this._allowList.includes(wordToAllowlist.toLowerCase())) {
      this._allowList.push(wordToAllowlist.toLowerCase());
    }
  }

  /**
   * @param {string} wordToCheck -
   * @returns {boolean}
   */
  public Contains(wordToCheck: string): boolean {
    if (!wordToCheck.trim().length) throw new Error('ArgumentNullException: wordToAllowlist');

    return this._allowList.includes(wordToCheck.toLowerCase());
  }

  /**
   * Return the number of items in the allow list.
   *
   * @returns {number} The number of items in the allow list.
   */
  public get Count(): number {
    return this._allowList.length;
  }

  /**
   * Remove all words from the allow list.
   */
  public Clear(): void {
    this._allowList = [];
  }

  /**
   * Remove a word from the profanity allow list. All words are treated as case insensitive.
   *
   * @param {string} wordToRemove - The word that you want to use
   * @returns {boolean} True if the word is successfuly removes, False otherwise.
   */
  public Remove(wordToRemove: string): boolean {
    if (!wordToRemove.trim().length) throw new Error('ArgumentNullException: wordToRemove');

    const index = this._allowList.indexOf(wordToRemove.toLowerCase());
    return index !== -1 ? !!this._allowList.splice(index, 1).length : false;
  }
}
