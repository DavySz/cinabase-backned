export interface Encrypter {
  encrypt: (value: string) => Promise<string>;
  compare: (hash: string, valueToCompare: string) => Promise<boolean>;
}
