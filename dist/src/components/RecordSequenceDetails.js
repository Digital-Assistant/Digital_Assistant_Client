var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, List, Popconfirm, Row, Checkbox } from "antd";
import { DeleteOutlined, DislikeFilled, DislikeOutlined, LeftOutlined, LikeFilled, LikeOutlined, PauseCircleOutlined, PlayCircleOutlined, ShareAltOutlined, CopyFilled } from "@ant-design/icons";
import { getCurrentPlayItem, getFromStore, getObjData, setToStore, } from "../util";
import { deleteRecording, recordUserClickData, updateRecording } from "../services/recordService";
import { getUserId } from "../services/userService";
import { matchNode } from "../util/invokeNode";
import { CONFIG } from "../config";
import { off, on, trigger } from "../util/events";
import { translate } from "../util/translation";
import { removeToolTip } from "../util/addToolTip";
import { getClickedNodeLabel } from "../util/getClickedNodeLabel";
import { getVoteRecord, vote } from "../services/userVote";
import { addNotification } from "../util/addNotification";
/**
 * To render record sequence details
 * @returns HTML Element
 */
export const RecordSequenceDetails = (props) => {
    var _a, _b;
    const [advBtnShow, setAdvBtnShow] = useState(false);
    const [permissions, setPermissions] = useState({});
    const [selectedRecordingDetails, setSelectedRecordingDetails] = React.useState(props.data);
    /**
     * Every time isPlaying state changes, and status is "on", play continues
     */
    useEffect(() => {
        if ((props === null || props === void 0 ? void 0 : props.isPlaying) == "on") {
            autoPlay();
        }
    }, [props.isPlaying]);
    useEffect(() => {
        on("UDAPlayNext", autoPlay);
        on("ContinuePlay", autoPlay);
        on("BackToSearchResults", backNav);
        on("PausePlay", pause);
        return () => {
            off("UDAPlayNext", autoPlay);
            off("ContinuePlay", autoPlay);
            off("BackToSearchResults", backNav);
            off("PausePlay", pause);
        };
    }, []);
    useEffect(() => {
        if (props.data) {
            setSelectedRecordingDetails(props.data);
            setTmpPermissionsObj(props.data.additionalParams);
        }
    }, [props.data]);
    /**
     * Record player(auto play)
     */
    const autoPlay = (data = null) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        if (getFromStore(CONFIG.RECORDING_IS_PLAYING, true) !== "on") {
            return;
        }
        const playItem = getCurrentPlayItem();
        if (playItem.node) {
            if (matchNode(playItem)) {
                updateStatus(playItem.index);
            }
            else {
                yield recordUserClickData('playBackError', getName(), selectedRecordingDetails.id);
                pause();
                removeToolTip();
                trigger("openPanel", { action: 'openPanel' });
            }
        }
        else {
            yield recordUserClickData('playCompleted', getName(), selectedRecordingDetails.id);
            pause();
            removeToolTip();
            if (!((_c = props === null || props === void 0 ? void 0 : props.config) === null || _c === void 0 ? void 0 : _c.enableHidePanelAfterCompletion)) {
                trigger("openPanel", { action: 'openPanel' });
            }
            else {
                addNotification(translate('autoplayCompletedTitle'), translate('autoplayCompleted'), 'success');
                backNav(true, false);
            }
        }
    });
    /**
     * updates node status(to completed) by index
     * @param index
     */
    const updateStatus = (index) => {
        selectedRecordingDetails.userclicknodesSet[index].status = "completed";
        setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
        setSelectedRecordingDetails(Object.assign({}, selectedRecordingDetails));
    };
    /**
     * Updates all recorded nodes status to 'none'
     */
    const resetStatus = () => {
        var _a;
        (_a = selectedRecordingDetails === null || selectedRecordingDetails === void 0 ? void 0 : selectedRecordingDetails.userclicknodesSet) === null || _a === void 0 ? void 0 : _a.forEach((element) => {
            element.status = "none";
        });
        setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
        setSelectedRecordingDetails(Object.assign({}, selectedRecordingDetails));
        setUserVote({ upvote: 0, downvote: 0 });
    };
    /**
     *
     * @returns name/label of the recording
     */
    const getName = () => {
        var _a;
        let name = "";
        if (props.data) {
            try {
                // name = JSON.parse(props?.data?.name)?.join(",");
                let names = JSON.parse((_a = props === null || props === void 0 ? void 0 : props.data) === null || _a === void 0 ? void 0 : _a.name);
                name = names[0] ? names[0] : 'NA';
            }
            catch (e) {
            }
        }
        return name;
    };
    /**
     * Navigates back to search results card
     */
    const backNav = (forceRefresh = false, openPanel = true) => __awaiter(void 0, void 0, void 0, function* () {
        yield recordUserClickData('backToSearchResults', getName(), selectedRecordingDetails.id);
        if (openPanel) {
            trigger("openPanel", { action: 'openPanel' });
        }
        resetStatus();
        removeToolTip();
        if (props.cancelHandler)
            props.cancelHandler(forceRefresh);
    });
    /**
     * Auto play button handler
     */
    const play = () => __awaiter(void 0, void 0, void 0, function* () {
        yield recordUserClickData('play', getName(), selectedRecordingDetails.id);
        trigger("closePanel", { action: 'closePanel' });
        if (props.playHandler)
            props.playHandler("on");
        // autoPlay();
    });
    /**
     * Pause the autoplay
     */
    const pause = () => {
        if (props.playHandler)
            props.playHandler("off");
    };
    const playNode = (item, index) => {
        if (matchNode({ node: item, index, additionalParams: selectedRecordingDetails === null || selectedRecordingDetails === void 0 ? void 0 : selectedRecordingDetails.additionalParams })) {
            updateStatus(index);
        }
    };
    const removeRecording = () => __awaiter(void 0, void 0, void 0, function* () {
        yield recordUserClickData('delete', getName(), selectedRecordingDetails.id);
        props.showLoader(true);
        yield deleteRecording({ id: selectedRecordingDetails.id });
        setTimeout(() => {
            backNav(true);
        }, CONFIG.indexInterval);
    });
    const manageVote = (type = 'up') => __awaiter(void 0, void 0, void 0, function* () {
        let record = yield vote({ id: selectedRecordingDetails.id }, type);
        selectedRecordingDetails.upVoteCount = record.upVoteCount;
        selectedRecordingDetails.downVoteCount = record.downVoteCount;
        setSelectedRecordingDetails(Object.assign({}, selectedRecordingDetails));
        if (type === 'up') {
            setUserVote({ upvote: 1, downvote: 0 });
        }
        else {
            setUserVote({ upvote: 0, downvote: 1 });
        }
    });
    const [userId, setUserId] = useState(null);
    /**
     * setting the user vote record
     */
    const [userVote, setUserVote] = useState({ upvote: 0, downvote: 0 });
    const fetchUserVote = () => __awaiter(void 0, void 0, void 0, function* () {
        let userRecord = yield getVoteRecord({ id: selectedRecordingDetails.id });
        if (userRecord) {
            setUserVote(userRecord);
        }
    });
    useEffect(() => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            setUserId(yield getUserId());
            yield fetchUserVote();
        }))();
    }, []);
    const addSkipClass = (item) => {
        if (item.status !== 'completed') {
            return 'uda_exclude';
        }
        let nodeData = getObjData(item.objectdata);
        if (nodeData.meta.hasOwnProperty('skipDuringPlay') && nodeData.meta.skipDuringPlay) {
            return 'skipped uda_exclude';
        }
        return item.status + ' uda_exclude';
    };
    const ref = useRef();
    const [copied, setCopied] = useState(false);
    const displayKeyValue = (key, value) => {
        return _jsxs("span", { children: [key, " ", value] });
    };
    function copy() {
        const el = document.createElement("input");
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set(CONFIG.UDA_URL_Param, selectedRecordingDetails.id);
        let path = window.location.href.split('?')[0];
        el.value = path + '?' + searchParams.toString();
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
    }
    /**
     * Toggles the advanced mode.
     *
     * @return {Promise<void>} A promise that resolves when the advanced mode is toggled.
     */
    const toggleAdvanced = () => __awaiter(void 0, void 0, void 0, function* () {
        if (advBtnShow) {
            props.showLoader(true);
            yield updateRecording({ id: selectedRecordingDetails.id, additionalParams: tmpPermissionsObj });
            selectedRecordingDetails.additionalParams = tmpPermissionsObj;
            setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
            yield setAdvBtnShow(!advBtnShow);
            props.showLoader(false);
        }
        else {
            yield setAdvBtnShow(!advBtnShow);
        }
    });
    const [tmpPermissionsObj, setTmpPermissionsObj] = useState({});
    /**
     * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
     *
     * @param {any} obj - The object parameter used in the function.
     * @return {Promise<void>} A promise that resolves to nothing.
     */
    const handlePermissions = (obj) => () => __awaiter(void 0, void 0, void 0, function* () {
        let permissions = Object.assign({}, tmpPermissionsObj);
        if (permissions[obj.key]) {
            delete permissions[obj.key];
        }
        else {
            permissions[obj.key] = obj[obj.key];
        }
        yield setTmpPermissionsObj(Object.assign({}, permissions));
    });
    return (props === null || props === void 0 ? void 0 : props.recordSequenceDetailsVisibility) ? (_jsxs(_Fragment, { children: [_jsxs("div", Object.assign({ className: "uda-card-details", style: {
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                }, ref: ref }, { children: [_jsxs("div", Object.assign({ className: "uda-card-btns" }, { children: [_jsx(Button, Object.assign({ type: "primary", shape: "circle", size: "small", style: { position: "absolute", top: 12, left: 0 }, className: "uda_exclude", onClick: () => backNav(false) }, { children: _jsx(LeftOutlined, {}) })), (props === null || props === void 0 ? void 0 : props.isPlaying) == "off" && (_jsx(PlayCircleOutlined, { className: "large secondary uda_exclude", onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                                    yield play();
                                }) })), (props === null || props === void 0 ? void 0 : props.isPlaying) == "on" && (_jsx(PauseCircleOutlined, { className: "large secondary uda_exclude", onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                                    yield recordUserClickData('stopPlay', getName(), selectedRecordingDetails.id);
                                    pause();
                                }) }))] })), _jsx("h5", { children: getName() }), _jsx("hr", {}), _jsx("ul", Object.assign({ className: "uda-suggestion-list", id: "uda-sequence-steps" }, { children: (props === null || props === void 0 ? void 0 : props.data) && (_jsx(List, { itemLayout: "horizontal", dataSource: selectedRecordingDetails === null || selectedRecordingDetails === void 0 ? void 0 : selectedRecordingDetails.userclicknodesSet, renderItem: (item, index) => (_jsx("li", Object.assign({ className: addSkipClass(item), onClick: () => playNode(item, index) }, { children: _jsx("i", { children: getClickedNodeLabel(item) }) }))) })) }))] })), _jsxs("div", Object.assign({ className: "uda-details-footer" }, { children: [_jsxs(Row, Object.assign({ style: { textAlign: "center" } }, { children: [_jsxs(Col, Object.assign({ span: 8 }, { children: [_jsxs(Button, Object.assign({ onClick: () => manageVote("up"), className: "uda_exclude" }, { children: [(userVote && (userVote === null || userVote === void 0 ? void 0 : userVote.upvote) === 1) &&
                                                _jsx(LikeFilled, { width: 33, className: "secondary" }), ((userVote && (userVote === null || userVote === void 0 ? void 0 : userVote.upvote) === 0) || !userVote) &&
                                                _jsx(LikeOutlined, { width: 33, className: "secondary" })] })), _jsxs(Button, Object.assign({ onClick: () => manageVote("down"), className: "uda_exclude" }, { children: [(userVote && (userVote === null || userVote === void 0 ? void 0 : userVote.downvote) === 1) &&
                                                _jsx(DislikeFilled, { width: 33, className: "secondary" }), ((userVote && (userVote === null || userVote === void 0 ? void 0 : userVote.downvote) === 0) || (!userVote)) &&
                                                _jsx(DislikeOutlined, { width: 33, className: "secondary" })] }))] })), _jsx(Col, Object.assign({ span: 8 }, { children: _jsxs(Button, Object.assign({ onClick: copy }, { children: [!copied && _jsxs(_Fragment, { children: [_jsx(ShareAltOutlined, {}), " Share link"] }), " : ", copied && _jsxs(_Fragment, { children: [" ", _jsx(CopyFilled, {}), " Copied!"] })] })) })), _jsx(Col, Object.assign({ span: 8 }, { children: (selectedRecordingDetails.usersessionid === userId) &&
                                    _jsx(Popconfirm, Object.assign({ title: translate('deleteRecording'), onConfirm: removeRecording, className: "uda_exclude" }, { children: _jsx(Button, Object.assign({ className: "uda_exclude" }, { children: _jsx(DeleteOutlined, { width: 33, className: "secondary uda_exclude" }) })) })) }))] })), (((_a = props === null || props === void 0 ? void 0 : props.config) === null || _a === void 0 ? void 0 : _a.enablePermissions) && (selectedRecordingDetails.usersessionid === userId)) && (_jsxs("div", Object.assign({ id: "uda-permissions-section", style: { padding: "25px", display: 'flex' } }, { children: [_jsx("div", { children: _jsx("button", Object.assign({ className: "add-btn uda_exclude", style: { color: 'white' }, onClick: () => toggleAdvanced() }, { children: advBtnShow ? 'Update Permissions' : 'Edit Permissions' })) }), _jsx("div", { children: advBtnShow && Object.entries((_b = props === null || props === void 0 ? void 0 : props.config) === null || _b === void 0 ? void 0 : _b.permissions).map(([key, value]) => {
                                    if (tmpPermissionsObj[key] !== undefined) {
                                        return _jsxs("div", Object.assign({ style: { marginLeft: 30 } }, { children: [_jsx(Checkbox, { id: "uda-recorded-name", className: "uda_exclude", checked: true, onChange: handlePermissions({ [key]: value, key }) }), displayKeyValue(key, value)] }), key);
                                    }
                                    else {
                                        return _jsxs("div", Object.assign({ style: { marginLeft: 30 } }, { children: [_jsx(Checkbox, { id: "uda-recorded-name", className: "uda_exclude", onChange: handlePermissions({ [key]: value, key }) }), displayKeyValue(key, value)] }), key);
                                    }
                                }) })] })))] }))] })) : null;
};
//# sourceMappingURL=RecordSequenceDetails.js.map