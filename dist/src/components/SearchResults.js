var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render search results
 * Associated Route/Usage: *
 */
import { useEffect, useState } from "react";
import { Button, Empty, List } from "antd";
import { PlayCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { setToStore } from "../util";
import InfiniteScroll from "react-infinite-scroller";
import { CONFIG } from "../config";
import { getRowObject } from "../util/getRowObject";
import { recordUserClickData } from "../services";
import ReactGA from "react-ga4";
let globalSearchResults = [];
/**
 * To render search result elements
 * @returns HTML Elements
 */
export const SearchResults = (props) => {
    const [searchResults, setSearchResults] = useState([]);
    const [fetchingInProgress, setFetchingInProgress] = useState(false);
    const [enableScroll, setEnableScroll] = useState(false);
    useEffect(() => {
        // Send pageview with a custom path
        ReactGA.send({ hitType: "pageview", page: "/search", title: "Search page loaded" });
    }, []);
    useEffect(() => {
        if (props === null || props === void 0 ? void 0 : props.searchKeyword)
            globalSearchResults = [];
        globalSearchResults = [...globalSearchResults, ...props === null || props === void 0 ? void 0 : props.data];
        setSearchResults([...globalSearchResults]);
    }, [props === null || props === void 0 ? void 0 : props.data]);
    useEffect(() => {
        if (props.hasMorePages)
            setEnableScroll(true);
        else
            setEnableScroll(false);
    }, [props]);
    const selectItem = (item, play = false) => __awaiter(void 0, void 0, void 0, function* () {
        yield recordUserClickData('viewRecording', '', item.id);
        setToStore(item, CONFIG.SELECTED_RECORDING, false);
        if (props === null || props === void 0 ? void 0 : props.showDetails)
            props.showDetails(item);
        if (play) {
            props.playHandler("on");
        }
    });
    const loadSearchResults = () => __awaiter(void 0, void 0, void 0, function* () {
        if (props.hasMorePages && (props === null || props === void 0 ? void 0 : props.searchHandler) && !fetchingInProgress) {
            setEnableScroll(false);
            setFetchingInProgress(true);
            yield props.searchHandler(((props.page === 0) ? 1 : props.page + 1), true, true);
            setFetchingInProgress(false);
        }
    });
    const renderData = () => {
        var _a;
        if (!(props === null || props === void 0 ? void 0 : props.visibility))
            return _jsx(_Fragment, {});
        return !(props === null || props === void 0 ? void 0 : props.visibility) ? null : !((_a = props === null || props === void 0 ? void 0 : props.data) === null || _a === void 0 ? void 0 : _a.length) ? (_jsx(Empty, { description: "No results found" })) : (_jsx(List, { itemLayout: "horizontal", dataSource: props === null || props === void 0 ? void 0 : props.data, renderItem: (item) => {
                var _a, _b;
                return (_jsx(List.Item, Object.assign({ className: "uda_exclude", actions: [
                        _jsx(Button, { shape: "circle", icon: _jsx(PlayCircleOutlined, { className: "secondary" }), onClick: () => selectItem(item, true) }),
                        _jsx(Button, Object.assign({ shape: "round", icon: _jsx(EyeOutlined, { className: "secondary" }), onClick: () => selectItem(item) }, { children: "View" }))
                    ] }, { children: _jsx(List.Item.Meta, { title: (_a = getRowObject(item)) === null || _a === void 0 ? void 0 : _a.sequenceName, description: (_b = getRowObject(item)) === null || _b === void 0 ? void 0 : _b.path }) })));
            } }));
    };
    // return renderData();
    return (_jsxs(_Fragment, { children: [!(searchResults === null || searchResults === void 0 ? void 0 : searchResults.length) && (_jsx("div", Object.assign({ className: "uda-no-results" }, { children: _jsx(Empty, { description: "No results found" }) }))), (searchResults === null || searchResults === void 0 ? void 0 : searchResults.length) > 0 && (_jsx(InfiniteScroll, Object.assign({ initialLoad: false, pageStart: 0, threshold: 250, loadMore: loadSearchResults, hasMore: enableScroll, useWindow: false }, { children: renderData() })))] }));
};
//# sourceMappingURL=SearchResults.js.map