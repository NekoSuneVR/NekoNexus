interface IAllowList {
  Add(wordToAllowlist: string): void;
  Contains(wordToCheck: string): boolean;
  Remove(wordToRemove: string): boolean;
  Clear(): void;
  get Count(): number;
  get ToList(): string[];
}

export default IAllowList;
