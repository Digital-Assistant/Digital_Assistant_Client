export declare class List {
    words: string[];
    onListChanged: () => void;
    get empty(): boolean;
    constructor(onListChanged: () => void);
    removeWords(words: string[]): void;
    addWords(words: string[]): void;
}
