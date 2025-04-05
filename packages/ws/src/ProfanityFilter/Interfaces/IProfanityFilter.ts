import IAllowList from './IAllowList';

interface IProfanityFilter {
  IsProfanity(word: string): boolean;
  DetectAllProfanities(sentence: string, removePartialMatches: boolean): string[];
  ContainsProfanity(term: string): boolean;

  get AllowList(): IAllowList;
  CensorString(sentence: string, censorCharacter: string, ignoreNumbers: boolean): string;
  GetCompleteWord(toCheck: string, profanity: string): [number, number, string] | null;

  AddProfanity(profanity: string): void;
  AddProfanities(profanityList: string[]): void;

  RemoveProfanity(profanity: string): boolean;
  RemoveProfanities(profanities: string[]): boolean;

  Clear(): void;
  get Count(): number;
}

export default IProfanityFilter;
