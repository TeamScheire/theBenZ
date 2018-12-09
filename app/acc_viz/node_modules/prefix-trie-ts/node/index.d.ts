export declare class Trie {
    constructor(input?: string[]);
    getIndex(): any;
    setIndex(trie: any): void;
    addWord(word: string): this;
    removeWord(word: string): this;
    getWords(): string[];
    getPrefix(strPrefix: string): string[];
}
