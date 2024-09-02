var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setToStore } from "./util";
import { recordUserClickData } from "./services";
export class UdanSearchModule {
    constructor(config) {
        this.config = config;
        this.searchResults = [];
        this.fetchingInProgress = false;
        this.enableScroll = false;
        this.initializeModule();
    }
    initializeModule() {
        if (this.config.analyticsCallback) {
            this.config.analyticsCallback("/search", "Search page loaded");
        }
    }
    updateSearchResults(newResults, hasMorePages) {
        this.searchResults = [...this.searchResults, ...newResults];
        this.enableScroll = hasMorePages;
    }
    clearSearchResults() {
        this.searchResults = [];
    }
    selectItem(item, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield recordUserClickData('viewRecording', '', item.id);
            setToStore(item, this.config.storeKey, false);
            if (callback) {
                callback(item);
            }
        });
    }
    loadSearchResults(loadMoreCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enableScroll && !this.fetchingInProgress) {
                this.enableScroll = false;
                this.fetchingInProgress = true;
                yield loadMoreCallback();
                this.fetchingInProgress = false;
            }
        });
    }
    getSearchResults() {
        return this.searchResults;
    }
    getEnableScroll() {
        return this.enableScroll;
    }
}
