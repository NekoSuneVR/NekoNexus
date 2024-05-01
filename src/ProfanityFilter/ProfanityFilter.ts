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

/* eslint-disable no-dupe-class-members */

import AllowList from './AllowList';
import IAllowList from './Interfaces/IAllowList';
import IProfanityFilter from './Interfaces/IProfanityFilter';
import ProfanityBase from './ProfanityBase';

function IsPunctuation(c: string): boolean {
  return !!c.match(/\p{Punctuation}/);
}

/**
 * This class will detect profanity and racial slurs contained within some text and return an indication flag.
 * All words are treated as case insensitive.
 */
export default class ProfanityFilter extends ProfanityBase implements IProfanityFilter {
  /**
   * Constructor that allows you to construct the filter with either
   * the default or a customer profanity list.
   */
  constructor(profanityList?: string[]) {
    super(profanityList);

    this.AllowList = new AllowList();
  }

  /**
   * Return the allow list;
   */
  public AllowList: IAllowList;

  /**
   * Check whether a specific word is in the profanity list. IsProfanity will first
   * check if the word exists on the allow list. If it is on the allow list, then false
   * will be returned.
   *
   * @param {string} word - The word to check in the profanity list.
   * @return {boolean} True if the word is considered a profanity, False otherwise.
   */
  public IsProfanity(word: string): boolean {
    if (!word?.trim().length) {
      return false;
    }

    // Check if the word is in the allow list.
    if (this.AllowList.Contains(word.toLowerCase())) {
      return false;
    }

    return this._profanities.includes(word.toLowerCase());
  }

  /**
   *
   * @param {string} sentence -
   * @returns
   */
  public DetectAllProfanities(sentence: string): string[];
  /**
   * For a given sentence, return a list of all the detected profanities.
   *
   * @param {string} sentence - The sentence to check for profanities.
   * @param {boolean} - Remove duplicate partial matches.
   * @returns {string[]} A read only list of detected profanities.
   */
  public DetectAllProfanities(sentence: string, removePartialMatches: boolean = false): string[] {
    if (!sentence?.trim().length) {
      return [];
    }

    sentence = sentence.toLowerCase();
    sentence = sentence.replace('.', '');
    sentence = sentence.replace(',', '');

    const words = sentence.split(' ');
    const postAllowList = this.FilterWordListByAllowList(words);
    let swearList: string[] = [];

    // Catch whether multi-word profanities are in the allow list filtered sentence.
    this.AddMultiWordProfanities(swearList, ProfanityFilter.ConvertWordListToSentence(postAllowList));

    // Deduplicate any partial matches, ie, if the word "twatting" is in a sentence, don't include "twat" if part of the same word.
    if (removePartialMatches) {
      // swearList.RemoveAll(x => swearList.Any(y => x != y && y.Contains(x)));
      swearList = swearList.filter((x) => swearList.some((y) => x !== y && y.includes(x)));
    }

    return this.FilterSwearListForCompleteWordsOnly(sentence, swearList).filter(
      (value, index, array) => array.indexOf(value) === index,
    );
  }

  /**
   * For any given string, censor any profanities from the list using the default
   * censoring character of an asterix.
   *
   * @param {string} sentence - The string to censor.
   * @returns
   */
  public CensorString(sentence: string): string;

  /**
   * For any given string, censor any profanities from the list using the specified
   * censoring character.
   *
   * @param {string} sentence - The string to censor.
   * @param {string} censorCharacter - The character to use for censoring.
   * @returns
   */
  public CensorString(sentence: string, censorCharacter: string): string;

  /**
   * For any given string, censor any profanities from the list using the specified
   * censoring character.
   *
   * @param {string} sentence - The string to censor.
   * @param {string} censorCharacter - The character to use for censoring.
   * @param {boolean} Ignore any numbers that appear in a word.
   * @returns
   */
  public CensorString(sentence: string, censorCharacter: string = '*', ignoreNumbers: boolean = false): string {
    if (!sentence?.trim().length) {
      return '';
    }

    let noPunctuation = sentence.trim();
    noPunctuation = noPunctuation.toLowerCase();
    noPunctuation = noPunctuation.replace(/[^\w\s]/g, '');

    const words = noPunctuation.split(' ');

    const postAllowList = this.FilterWordListByAllowList(words);
    const swearList: string[] = [];

    // Catch whether multi-word profanities are in the allow list filtered sentence.
    this.AddMultiWordProfanities(swearList, ProfanityFilter.ConvertWordListToSentence(postAllowList));

    return this.CensorStringByProfanityList(
      censorCharacter,
      swearList,
      String(sentence),
      String(sentence),
      ignoreNumbers,
    );
  }

  /**
   * For a given sentence, look for the specified profanity. If it is found, look to see
   * if it is part of a containing word. If it is, then return the containing work and the start
   * and end positions of that word in the string.
   *
   * For example, if the string contains "scunthorpe" and the passed in profanity is "cunt",
   * then this method will find "cunt" and work out that it is part of an enclosed word.
   *
   * @param {string} toCheck - Sentence to check.
   * @param {string} profanity - Profanity to look for.
   * @returns {[int, int, string] | null} Tuple of the following format (start character, end character, found enclosed word).
   * If no enclosed word is found then return null.
   */
  public GetCompleteWord(toCheck: string, profanity: string): [number, number, string] | null {
    if (!toCheck?.trim().length) {
      return null;
    }

    const profanityLowerCase = profanity.toLowerCase();
    const toCheckLowerCase = toCheck.toLowerCase();

    if (toCheckLowerCase.includes(profanityLowerCase)) {
      let startIndex = toCheckLowerCase.indexOf(profanityLowerCase);
      let endIndex = startIndex;

      // Work backwards in string to get to the start of the word.
      while (startIndex > 0) {
        if (toCheck[startIndex - 1] === ' ' || IsPunctuation(toCheck[startIndex - 1])) {
          break;
        }

        startIndex -= 1;
      }

      // Work forwards to get to the end of the word.
      while (endIndex < toCheck.length) {
        if (toCheck[endIndex] === ' ' || IsPunctuation(toCheck[endIndex])) {
          break;
        }

        endIndex += 1;
      }

      return [startIndex, endIndex, toCheckLowerCase.substring(startIndex, endIndex - startIndex).toLowerCase()];
    }

    return null;
  }

  /**
   * Check whether a given term matches an entry in the profanity list. ContainsProfanity will first
   * check if the word exists on the allow list. If it is on the allow list, then false
   * will be returned.
   *
   * @param {string} term - Term to check.
   * @returns {boolean} True if the term contains a profanity, False otherwise.
   */
  public ContainsProfanity(term: string): boolean {
    if (!term?.trim().length) {
      return false;
    }

    const potentialProfanities = this._profanities.map((word) => word.length <= term.length);

    // We might have a very short phrase coming in, resulting in no potential matches even before the regex
    if (potentialProfanities.length === 0) {
      return false;
    }

    const regex = new RegExp(`(?:${potentialProfanities.join('|')})`, 'i');
    // eslint-disable-next-line consistent-return
    term.match(regex)?.forEach((profanity) => {
      // if any matches are found and aren't in the allowed list, we can return true here without checking further
      if (!this.AllowList.Contains(profanity.toLowerCase())) {
        return true;
      }
    });

    return false;
  }

  private CensorStringByProfanityList(
    censorCharacter: string,
    swearList: string[],
    censored: string,
    tracker: string,
    ignoreNumeric: boolean,
  ) {
    for (const word of swearList.sort((a, b) => b.length - a.length)) {
      let result: [number, number, string] | null = [0, 0, ''];
      const multiword = word.split(' ');

      if (multiword.length === 1) {
        do {
          result = this.GetCompleteWord(tracker, word);

          if (result) {
            let filtered = result[2];

            if (ignoreNumeric) {
              filtered = result[2].replace(/[d-]/g, '');
            }

            if (filtered === word) {
              for (let i = result[0]; i < result[1]; i++) {
                censored = censored.substring(0, i) + censorCharacter + censored.substring(i + 1);
                tracker = tracker.substring(0, i) + censorCharacter + tracker.substring(i + 1);
              }
            } else {
              for (let i = result[0]; i < result[1]; i++) {
                tracker = tracker.substring(0, i) + censorCharacter + tracker.substring(i + 1);
              }
            }
          }
        } while (result);
      } else {
        censored = censored.replace(word, ProfanityFilter.CreateCensoredString(word, censorCharacter));
      }
    }

    return censored;
  }

  private FilterSwearListForCompleteWordsOnly(sentence: string, swearList: string[]): string[] {
    const filteredSwearList: string[] = [];
    let tracker = String(sentence);

    for (const word of swearList.sort((a, b) => b.length - a.length)) {
      let result: [number, number, string] | null = [0, 0, ''];
      const multiword = word.split(' ');

      if (multiword.length === 1) {
        do {
          result = this.GetCompleteWord(tracker, word);

          if (result) {
            if (result[2] === word) {
              filteredSwearList.push(word);

              for (let i = result[0]; i < result[1]; i++) {
                tracker = `${tracker.substring(0, i)}*${tracker.substring(i + 1)}`;
              }
              break;
            }

            for (let i = result[0]; i < result[1]; i++) {
              tracker = `${tracker.substring(0, i)}*${tracker.substring(i + 1)}`;
            }
          }
        } while (result);
      } else {
        filteredSwearList.push(word);
        tracker.replace(word, ' ');
      }
    }

    return filteredSwearList;
  }

  private FilterWordListByAllowList(words: string[]): string[] {
    const postAllowList: string[] = [];
    for (const word of words) {
      if (word?.trim().length) {
        if (!this.AllowList.Contains(word.toLowerCase())) {
          postAllowList.push(word);
        }
      }
    }

    return postAllowList;
  }

  private static ConvertWordListToSentence(postAllowList: string[]): string {
    // Reconstruct sentence excluding allow listed words.
    let postAllowListSentence = '';

    for (const w in postAllowList) {
      postAllowListSentence = `${postAllowListSentence + w} `;
    }

    return postAllowListSentence;
  }

  private AddMultiWordProfanities(swearList: string[], postAllowListSentence: string): void {
    swearList.push(...this._profanities.filter((profanity) => postAllowListSentence.toLowerCase().includes(profanity)));
  }

  private static CreateCensoredString(word: string, censorCharacter: string): string {
    let censoredWord = '';

    for (let i = 0; i < word.length; i++) {
      if (word[i] !== ' ') {
        censoredWord += censorCharacter;
      } else {
        censoredWord += ' ';
      }
    }

    return censoredWord;
  }
}
