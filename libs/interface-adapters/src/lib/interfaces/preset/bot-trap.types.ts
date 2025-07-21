export interface BotTrap {
  url: string;
  type:
    | 'first-spec-symbol'
    | 'last-spec-symbol'
    | 'first-word-first-sentence'
    | 'last-word-first-sentence'
    | 'first-word-last-sentence'
    | 'last-word-last-sentence';
}
