"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
class List {
    constructor(onListChanged) {
        this.onListChanged = onListChanged;
        this.words = [];
    }
    get empty() {
        return !this.words.length;
    }
    removeWords(words) {
        this.words = this.words.filter((x) => !words.includes(x));
        this.onListChanged();
    }
    addWords(words) {
        this.words = this.words.concat(words);
        this.onListChanged();
    }
}
exports.List = List;
//# sourceMappingURL=list.js.map