var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render recorded sequences
 * Associated Route/Usage: *
 */
import { useEffect, useState } from "react";
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import { getObjData, setToStore } from "../util";
import { postRecordSequenceData, profanityCheck, recordClicks } from "../services/recordService";
import { CONFIG } from "../config";
import SelectedElement from "./SelectedElement";
import TSON from "typescript-json";
import { translate } from "../util/translation";
import { isHighlightNode } from "../util/checkNode";
import { Alert, Progress, Space, Switch } from "antd";
import { UDAErrorLogger } from "../config/error-log";
import { addNotification } from "../util/addNotification";
/**
 * To render recorded sequence elements
 * @returns HTML Elements
 */
export const RecordedData = (props) => {
    var _a, _b;
    const [name, setName] = useState("");
    const [labels, setLabels] = useState([]);
    const [disableForm, setDisableForm] = useState(false);
    const [recordData, setRecordData] = useState(props.data || []);
    const [advBtnShow, setAdvBtnShow] = useState(false);
    const [tmpPermissionsObj, setTmpPermissionsObj] = useState({});
    const [inputAlert, setInputAlert] = useState({});
    const [inputError, setInputError] = useState({});
    const [tooltip, setToolTip] = useState("");
    const [disableTooltipSubmitBtn, setDisableTooltipSubmitBtn] = useState(false);
    const [inputAt, setInputAt] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);
    const [checkingProfanity, setCheckingProfanity] = useState(false);
    // variable for uploading percentage data
    const [savedClickedDataPercent, setSavedClickedDataPercent] = useState(0);
    const [savingError, setSavingError] = useState(false);
    const [slowPlayback, setSlowPlayback] = useState(false);
    const [delayPlaybackTime, setDelayPlaybackTime] = useState(1);
    useEffect(() => {
        setRecordData([...(props.data || [])]);
    }, [props.data]);
    /**
     * @param data
     */
    useEffect(() => {
        var _a;
        let permissions = Object.assign({}, (_a = props === null || props === void 0 ? void 0 : props.config) === null || _a === void 0 ? void 0 : _a.permissions);
        setTmpPermissionsObj(permissions);
    }, [props.config.permissions]);
    const storeRecording = (data) => {
        setRecordData([...data]);
        setToStore(data, CONFIG.RECORDING_SEQUENCE, false);
    };
    const setEdit = (index) => {
        if (props.config.enableEditClickedName === true) {
            recordData[index].editable = true;
            storeRecording(recordData);
        }
    };
    const checkProfanity = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
        if (!props.config.enableProfanity)
            return keyword.trim();
        yield setCheckingProfanity(true);
        const response = yield profanityCheck(keyword);
        if (response.Terms && response.Terms.length > 0) {
            response.Terms.forEach(function (term) {
                keyword = keyword.replaceAll(term.Term, '');
            });
        }
        yield setCheckingProfanity(false);
        if (formSubmit === true) {
            submitRecording();
        }
        return keyword.trim();
    });
    /**check profanity for input text */
    const validateClickedInputName = (index, inputValue) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        let valid = true;
        if (!validateInput(inputValue)) {
            setInputError(Object.assign(Object.assign({}, inputError), { clickedNodeName: true }));
            valid = false;
        }
        else {
            setInputError(Object.assign(Object.assign({}, inputError), { clickedNodeName: false }));
            valid = true;
        }
        yield setInputAt('clickedNodeName');
        const _objData = getObjData((_c = recordData[index]) === null || _c === void 0 ? void 0 : _c.objectdata);
        _objData.meta.displayText = inputValue;
        recordData[index].objectdata = TSON.stringify(_objData);
        storeRecording(recordData);
        setRecordData([...recordData]);
        return valid;
    });
    /**
     * Check for each extra label entered in the
     * @param index
     * @param inputValue
     */
    const checkProfanityForGivenLabel = (index, inputValue) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        if (!inputValue || inputValue === '') {
            return;
        }
        if (inputValue.trim() === '') {
            return;
        }
        let changedName = yield checkProfanity(inputValue);
        if (inputValue.trim() !== changedName) {
            setInputAlert(Object.assign(Object.assign({}, inputAlert), { clickedInputNameProfanity: true }));
        }
        else {
            setInputAlert(Object.assign(Object.assign({}, inputAlert), { clickedInputNameProfanity: false }));
        }
        changedName = changedName.trim();
        yield validateClickedInputName(index, changedName);
        if (changedName !== '') {
            delete recordData[index].profanity;
            yield setInputAt('');
            const _objData = getObjData((_d = recordData[index]) === null || _d === void 0 ? void 0 : _d.objectdata);
            _objData.meta.displayText = inputValue;
            recordData[index].objectdata = TSON.stringify(_objData);
            if (!_.isEmpty(_objData)) {
                _objData.meta.displayText = changedName.trim();
                recordData[index].objectdata = TSON.stringify(_objData);
                storeRecording(recordData);
                yield setRecordData([...recordData]);
                return true;
            }
        }
        else {
            return false;
        }
    });
    const handlePersonal = (index) => () => __awaiter(void 0, void 0, void 0, function* () {
        yield updatePersonalOrSkipPlay("isPersonal", index);
    });
    const handleSkipPlay = (index) => () => __awaiter(void 0, void 0, void 0, function* () {
        yield updatePersonalOrSkipPlay("skipDuringPlay", index);
    });
    const updatePersonalOrSkipPlay = (key, index) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const _objData = getObjData((_e = recordData[index]) === null || _e === void 0 ? void 0 : _e.objectdata);
        if (_objData) {
            if (_objData.meta[key] === undefined)
                _objData.meta[key] = false;
            _objData.meta[key] = !_objData.meta[key];
            recordData[index].objectdata = TSON.stringify(_objData);
            storeRecording(recordData);
        }
    });
    const addLabel = () => {
        labels.push({ label: "" });
    };
    /**
     * remove added label
     * @param index
     */
    const removeLabel = (index) => {
        labels.splice(index, 1);
        setLabels([...labels]);
    };
    const resetForm = () => __awaiter(void 0, void 0, void 0, function* () {
        yield setDisableForm(false);
        yield setName("");
        yield setLabels([]);
        yield setToolTip('');
        global.udanSelectedNodes = [];
        global.clickedNode = null;
        setSavedClickedDataPercent(0);
        setSavingError(false);
    });
    /**
     * cancel recording
     */
    const cancelRecording = () => __awaiter(void 0, void 0, void 0, function* () {
        yield resetForm();
        if (props.recordHandler) {
            props.recordHandler("cancel");
        }
        setToStore([], CONFIG.RECORDING_SEQUENCE, false);
    });
    /**
     * submit the clicked input record to backend
     */
    const submitRecording = () => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        yield setFormSubmit(true);
        //validate given input and check for profanity for all elements.
        if (checkingProfanity) {
            return false;
        }
        if (inputAt === 'mainLabel') {
            yield checkMainLabelProfanity(name);
        }
        if (labels.length) {
            const _extraLabels = labels.map((label, index) => __awaiter(void 0, void 0, void 0, function* () {
                if (label.label) {
                    if (inputAt === 'label' + index) {
                        yield onExtraLabelChange(index, label.label);
                    }
                }
            }));
        }
        if (inputAt === 'clickedNodeName') {
            let index = (recordData === null || recordData === void 0 ? void 0 : recordData.length) - 1;
            const _objData = getObjData((_f = recordData[index]) === null || _f === void 0 ? void 0 : _f.objectdata);
            let clickedName = _objData.meta.displayText ? _objData.meta.displayText : _objData.clickednodename;
            yield checkProfanityForGivenLabel(index, clickedName);
        }
        if (name === "") {
            setInputAlert(Object.assign(Object.assign({}, inputAlert), { name: true }));
            return false;
        }
        else {
            setInputAlert(Object.assign(Object.assign({}, inputAlert), { name: false }));
        }
        if (name !== '') {
            if (!validateInput(name)) {
                setInputError(Object.assign(Object.assign({}, inputError), { name: true }));
                return false;
            }
        }
        if (inputError.clickedNodeName) {
            return false;
        }
        setDisableForm(true);
        // props.showLoader(true);
        let validInput = true;
        let _labels = [name];
        if (labels.length) {
            const _extraLabels = labels.map((label) => {
                if (label.label) {
                    if (!validateInput(label.label)) {
                        validInput = false;
                    }
                    return label.label;
                }
            });
            _labels = [..._labels, ..._extraLabels];
        }
        if (!validInput) {
            return false;
        }
        const _payload = {
            name: TSON.stringify(_labels),
        };
        //if additional params available send them part of payload
        if (!_.isEmpty(tmpPermissionsObj)) {
            _payload.additionalParams = tmpPermissionsObj;
        }
        // Save the original domain in which the recording has happened if enableForAllDomains flag is true
        if (global.UDAGlobalConfig.enableForAllDomains) {
            console.log('parsing');
            if (_payload.hasOwnProperty('additionalParams')) {
                _payload.additionalParams = Object.assign({ enableForAllDomains: true, recordedDomain: window.location.host }, _payload.additionalParams);
            }
            else {
                _payload.additionalParams = {
                    enableForAllDomains: true,
                    recordedDomain: window.location.host
                };
            }
        }
        // save delay playback time
        if (props.config.enableSlowReplay && slowPlayback) {
            if (_payload.hasOwnProperty('additionalParams')) {
                _payload.additionalParams = Object.assign(Object.assign({}, _payload.additionalParams), { slowPlaybackTime: delayPlaybackTime });
            }
            else {
                _payload.additionalParams = { slowPlaybackTime: delayPlaybackTime };
            }
        }
        /**
         * code for saving all the clicks from local storage to server. Looping all the clicked elements and sending to
         * server and
         */
        let totalClicks = recordData.length + 1;
        let savedClicks = 0;
        let failed = false;
        for (const [index, clickData] of Object.entries(recordData)) {
            if (clickData.hasOwnProperty('id')) {
                savedClicks++;
                setSavedClickedDataPercent((prevState) => {
                    return Math.ceil((savedClicks / totalClicks) * 100);
                });
                continue;
            }
            let resp = yield recordClicks(clickData);
            if (resp && resp.id) {
                recordData[index] = resp;
                savedClicks++;
                setSavedClickedDataPercent((prevState) => {
                    return Math.ceil((savedClicks / totalClicks) * 100);
                });
            }
            else {
                yield UDAErrorLogger.error('Failed to record the data.' + JSON.stringify(clickData));
                setSavingError(true);
                failed = true;
            }
        }
        storeRecording(recordData);
        if (failed) {
            setDisableForm(false);
            return;
        }
        const instance = yield postRecordSequenceData(_payload);
        yield resetForm();
        yield setFormSubmit(false);
        setSavedClickedDataPercent((prevState) => {
            return Math.ceil(((savedClicks + 1) / totalClicks) * 100);
        });
        if (instance && (props === null || props === void 0 ? void 0 : props.refetchSearch)) {
            addNotification(translate('savedSequence'), translate('savedSequenceDescription'), 'success');
            setTimeout(() => {
                props.refetchSearch("on");
            }, CONFIG.indexInterval);
        }
        else {
            addNotification(translate('savedSequenceError'), translate('savedSequenceErrorDescription'), 'error');
        }
        if (props.recordHandler)
            props.recordHandler("cancel");
        setToStore(false, CONFIG.RECORDING_SWITCH_KEY, true);
        setToStore([], CONFIG.RECORDING_SEQUENCE, false);
    });
    const [timer, setTimer] = useState(null);
    /**
     * validate and update of first label
     * @param e
     */
    const validateChange = (value) => __awaiter(void 0, void 0, void 0, function* () {
        yield setName(value);
        if (!validateInput(value)) {
            yield setInputError(Object.assign(Object.assign({}, inputError), { name: true }));
            return false;
        }
        else {
            yield setInputAlert(Object.assign(Object.assign({}, inputAlert), { name: false }));
            yield setInputError(Object.assign(Object.assign({}, inputError), { name: false }));
            return true;
        }
    });
    /**
     * validate for profanity words and remove them
     * @param e
     */
    const checkMainLabelProfanity = (value) => __awaiter(void 0, void 0, void 0, function* () {
        if (value.trim() === '') {
            return;
        }
        let changedName = yield checkProfanity(value);
        if (value.trim() !== changedName) {
            yield setInputAlert(Object.assign(Object.assign({}, inputAlert), { mainLabelProfanity: true }));
        }
        else {
            yield setInputAlert(Object.assign(Object.assign({}, inputAlert), { mainLabelProfanity: false }));
        }
        yield setInputAt('');
        changedName = changedName.trim();
        yield setName(changedName);
        return yield validateChange(changedName);
    });
    /**
     * Validate and check profanity of label input
     * @param index
     */
    const onExtraLabelChange = (index, value) => __awaiter(void 0, void 0, void 0, function* () {
        let label;
        if (inputError['label' + index]) {
            label = inputError['label' + index];
        }
        else {
            inputError['label' + index] = { error: false };
            label = inputError['label' + index];
            yield setInputError(Object.assign({}, inputError));
        }
        labels[index].label = value;
        yield setLabels([...labels]);
        if (!validateInput(value)) {
            label.error = true;
            inputError['label' + index] = label;
            yield setInputError(Object.assign({}, inputError));
            return false;
        }
        else {
            label.error = false;
            inputError['label' + index] = label;
            yield setInputError(Object.assign({}, inputError));
            return true;
        }
    });
    /**
     * validate for profanity words and remove them
     * @param index
     */
    const checkLabelProfanity = (index, value) => __awaiter(void 0, void 0, void 0, function* () {
        if (value.trim() === '') {
            return;
        }
        labels[index].label = yield checkProfanity(value);
        labels[index].label = labels[index].label.trim();
        labels[index].profanity = false;
        if (value.trim() !== labels[index].label) {
            labels[index].profanity = true;
        }
        else {
            labels[index].profanity = false;
        }
        yield setLabels([...labels]);
        yield setInputAt('');
        return yield onExtraLabelChange(index, labels[index].label);
    });
    /**
     * Validate input of given string
     * @param value
     */
    const validateInput = (value) => {
        if (value.length > 100) {
            return false;
        }
        let validateCondition = new RegExp("^[0-9A-Za-z _.-]+$");
        return (validateCondition.test(value));
    };
    /**
     * validate input change of tooltip
     * @param value string
     */
    const validateTooltip = (value) => __awaiter(void 0, void 0, void 0, function* () {
        yield setToolTip(value);
        if (!validateInput(value)) {
            yield setInputError(Object.assign(Object.assign({}, inputError), { tooltip: true }));
            return false;
        }
        else {
            yield setInputError(Object.assign(Object.assign({}, inputError), { tooltip: false }));
            return true;
        }
    });
    const validateDelayTime = (value) => __awaiter(void 0, void 0, void 0, function* () {
        if (!isNaN(value)) {
            setDelayPlaybackTime(value);
        }
    });
    /**
     *
     * @param value string
     * checking profanity words and removing them.
     */
    const onChangeTooltip = (value) => __awaiter(void 0, void 0, void 0, function* () {
        let changedName = yield checkProfanity(value);
        changedName = changedName.trim();
        yield setToolTip(changedName);
        return yield validateTooltip(changedName);
    });
    /**
     * Add custom tooltip to the clicked element
     * @param key
     * @param index
     */
    const updateTooltip = (key, index) => __awaiter(void 0, void 0, void 0, function* () {
        var _g;
        if (!validateInput(tooltip)) {
            yield setInputError(Object.assign(Object.assign({}, inputError), { tooltip: true }));
            yield setDisableForm(true);
            return;
        }
        props.showLoader(true);
        yield setDisableTooltipSubmitBtn(true);
        const _objData = getObjData((_g = recordData[index]) === null || _g === void 0 ? void 0 : _g.objectdata);
        if (_objData) {
            if (_objData.meta[key] === undefined)
                _objData.meta[key] = tooltip;
            _objData.meta[key] = tooltip;
            recordData[index].objectdata = TSON.stringify(_objData);
            storeRecording(recordData);
            setToolTip('');
        }
        yield setDisableTooltipSubmitBtn(false);
        props.showLoader(false);
    });
    const renderData = () => {
        if (!props.isShown)
            return;
        else
            return recordData === null || recordData === void 0 ? void 0 : recordData.map((item, index) => {
                var _a, _b, _c, _d;
                let objectData = getObjData(item === null || item === void 0 ? void 0 : item.objectdata);
                let clickedName = (objectData.meta.hasOwnProperty('displayText')) ? objectData.meta.displayText : item.clickednodename;
                if ((recordData === null || recordData === void 0 ? void 0 : recordData.length) - 1 === index) {
                    // validateClickedInputName(index, clickedName);
                }
                return (_jsxs("li", Object.assign({ className: "uda-recorded-label-editable completed" }, { children: [_jsxs("div", Object.assign({ className: "flex-card flex-center", style: { alignItems: "center" } }, { children: [(recordData === null || recordData === void 0 ? void 0 : recordData.length) - 1 != index &&
                                    _jsx("span", Object.assign({ id: "uda-display-clicked-text", style: { flex: 2 } }, { children: (objectData.meta.hasOwnProperty('displayText')) ? objectData.meta.displayText : item.clickednodename })), (recordData === null || recordData === void 0 ? void 0 : recordData.length) - 1 === index && (_jsxs("span", Object.assign({ id: "uda-display-clicked-text", style: { flex: 2 } }, { children: [_jsx("input", { type: "text", id: "uda-edited-name", name: "uda-edited-name", className: `uda-form-input uda_exclude ${!item.editable ? "non-editable" : ""} ${item.profanity ? "profanity" : ""}`, placeholder: "Enter Name", 
                                            // onChange={onLabelChange(index)}
                                            onChange: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                yield validateClickedInputName(index, e.target.value);
                                            }), 
                                            // onChange={updateInput(index)}
                                            onBlur: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                yield checkProfanityForGivenLabel(index, e.target.value);
                                            }), readOnly: !item.editable, style: { width: "85%! important" }, 
                                            // onKeyDown={handleLabelChange(index)}
                                            onClick: () => {
                                                setEdit(index);
                                            }, value: (objectData.meta.hasOwnProperty('displayText')) ? objectData.meta.displayText : item.clickednodename }), (inputAlert.clickedInputNameProfanity) &&
                                            _jsxs("span", Object.assign({ className: `uda-alert` }, { children: [" ", translate('profanityDetected')] })), inputError.clickedNodeName &&
                                            _jsxs("span", Object.assign({ className: `uda-alert` }, { children: [" ", translate('inputError')] }))] }))), _jsx("br", {})] })), (recordData === null || recordData === void 0 ? void 0 : recordData.length) - 1 === index && (_jsxs(_Fragment, { children: [props.config.enableSkipDuringPlay &&
                                    _jsx(_Fragment, { children: _jsxs("div", Object.assign({ className: "flex-card flex-vcenter small-text" }, { children: [_jsx("input", { type: "checkbox", id: "UDA-skip-duringPlay", className: "uda-checkbox flex-vcenter uda_exclude", value: (objectData.meta.hasOwnProperty('skipDuringPlay') && objectData.meta.skipDuringPlay) ? 1 : 0, checked: (objectData.meta.hasOwnProperty('skipDuringPlay') && objectData.meta.skipDuringPlay), onChange: handleSkipPlay(index) }), _jsx("label", Object.assign({ className: "uda-checkbox-label" }, { children: "Skip during play" })), _jsx("span", Object.assign({ className: "info-icon ms-1 ", title: translate('skipInfo') }, { children: _jsx(InfoCircleOutlined, {}) }))] })) }), _jsx(_Fragment, { children: _jsxs("div", Object.assign({ className: "flex-card flex-vcenter small-text" }, { children: [_jsx("input", { type: "checkbox", id: "isPersonal", className: "uda-checkbox uda_exclude", value: (objectData.meta.hasOwnProperty('isPersonal') && objectData.meta.isPersonal) ? 1 : 0, checked: (objectData.meta.hasOwnProperty('isPersonal') && objectData.meta.isPersonal), onChange: handlePersonal(index) }), _jsx("label", Object.assign({ className: "uda-checkbox-label" }, { children: translate('personalInfoLabel') })), _jsx("span", Object.assign({ className: "info-icon", title: translate('personalInfoTooltip') }, { children: _jsx(InfoCircleOutlined, {}) }))] })) }), (props.config.enableTooltipAddition === true && isHighlightNode(objectData)) &&
                                    _jsx(_Fragment, { children: _jsxs("div", Object.assign({ className: "uda-recording uda_exclude", style: { textAlign: "center" } }, { children: [(((_a = objectData.meta) === null || _a === void 0 ? void 0 : _a.tooltipInfo) && !tooltip) &&
                                                    _jsx(_Fragment, { children: _jsx("input", { type: "text", id: "uda-edited-tooltip", name: "uda-edited-tooltip", className: "uda-form-input uda_exclude", placeholder: translate('toolTipPlaceHolder'), style: { width: "68% !important" }, onChange: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                                yield validateTooltip(e.target.value);
                                                            }), onBlur: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                                yield onChangeTooltip(e.target.value);
                                                            }), value: (_b = objectData.meta) === null || _b === void 0 ? void 0 : _b.tooltipInfo }) }), (!((_c = objectData.meta) === null || _c === void 0 ? void 0 : _c.tooltipInfo) || tooltip) &&
                                                    _jsx(_Fragment, { children: _jsx("input", { type: "text", id: "uda-edited-tooltip", name: "uda-edited-tooltip", className: "uda-form-input uda_exclude", placeholder: translate('toolTipPlaceHolder'), style: { width: "68% !important" }, onChange: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                                yield validateTooltip(e.target.value);
                                                            }), onBlur: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                                yield onChangeTooltip(e.target.value);
                                                            }), value: tooltip }) }), inputError.tooltip && _jsxs("span", Object.assign({ className: `uda-alert` }, { children: [" ", translate('inputError')] })), _jsx("span", { children: _jsx("button", Object.assign({ className: `uda-tutorial-btn uda_exclude ${(disableTooltipSubmitBtn) ? "disabled" : ""}`, style: { color: "#fff", marginTop: "10px" }, id: "uda-tooltip-save", disabled: disableTooltipSubmitBtn, onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                                                            yield updateTooltip('tooltipInfo', index);
                                                        }) }, { children: (!((_d = objectData.meta) === null || _d === void 0 ? void 0 : _d.tooltipInfo)) ? translate('submitTooltip') : translate('updateTooltip') })) })] })) }), _jsx(SelectedElement, { data: item, index: index, recordData: recordData, config: props.config, storeRecording: storeRecording })] }))] }), `rec-seq-${index}`));
            });
    };
    const toggleAdvanced = () => __awaiter(void 0, void 0, void 0, function* () {
        yield setAdvBtnShow(!advBtnShow);
    });
    const handlePermissions = (obj) => () => __awaiter(void 0, void 0, void 0, function* () {
        let permissions = tmpPermissionsObj;
        if (permissions[obj.key]) {
            delete permissions[obj.key];
        }
        else {
            permissions[obj.key] = obj[obj.key];
        }
        yield setTmpPermissionsObj(Object.assign({}, permissions));
    });
    const displayKeyValue = (key, value) => {
        return _jsxs("span", { children: [key, ":", value] });
    };
    return (props === null || props === void 0 ? void 0 : props.isShown) ? (_jsxs(_Fragment, { children: [disableForm &&
                _jsx(_Fragment, { children: _jsx("div", Object.assign({ className: "uda-card-details" }, { children: _jsx(Space, Object.assign({ wrap: true }, { children: _jsx(Progress, { type: "circle", percent: savedClickedDataPercent, status: savingError ? 'exception' : 'normal' }) })) })) }), !disableForm &&
                _jsx(_Fragment, { children: _jsxs("div", Object.assign({ className: "uda-card-details" }, { children: [savingError && _jsx(Alert, { message: translate('savingError'), type: "error" }), _jsxs("h5", { children: [_jsx(Space, { children: _jsx("span", Object.assign({ className: "pulse" }, { children: _jsx(InfoCircleOutlined, {}) })) }), translate('recordSequenceHeading')] }), _jsx("hr", { style: { border: "1px solid #969696", width: "100%" } }), _jsx("ul", Object.assign({ className: "uda-recording", id: "uda-recorded-results" }, { children: renderData() })), _jsx("hr", { style: { border: "1px solid #969696", width: "100%" } }), props.config.enableSlowReplay && _jsx(_Fragment, { children: _jsxs("div", Object.assign({ id: "uda-play-slow-section" }, { children: [_jsxs("div", Object.assign({ className: "flex-card flex-vcenter selectedElement" }, { children: [_jsx("span", Object.assign({ className: "col-6" }, { children: "Enable slow replay" })), _jsx("span", Object.assign({ className: "uda_exclude col-6" }, { children: _jsx(Switch, { defaultChecked: slowPlayback, onChange: () => { setSlowPlayback(!slowPlayback); } }) }))] })), (slowPlayback === true) &&
                                            _jsxs("div", Object.assign({ className: "flex-card flex-vcenter selectedElement" }, { children: [_jsxs("span", Object.assign({ style: { marginRight: "4px" }, className: "col-6" }, { children: ["Number of seconds to delay", " "] })), _jsx("input", { type: "text", id: "uda-add-slowplay", name: "uda-edited-tooltip", className: "uda-form-input uda_exclude col-6", placeholder: translate('delayTimePlaceHolder'), style: { width: "68% !important" }, onChange: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                            yield validateDelayTime(e.target.value);
                                                        }), onBlur: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                            yield validateDelayTime(e.target.value);
                                                        }), value: delayPlaybackTime })] }))] })) }), _jsxs("div", Object.assign({ style: { textAlign: "left" } }, { children: [_jsx("input", { type: "text", id: "uda-recorded-name", name: "uda-save-recorded[]", className: `uda-form-input uda_exclude`, placeholder: "Enter Label", onChange: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                            yield validateChange(e.target.value);
                                            yield setInputAt('mainLabel');
                                        }), onBlur: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                            yield checkMainLabelProfanity(e.target.value);
                                        }), value: name }), (inputAlert.mainLabelProfanity) &&
                                        _jsxs("span", Object.assign({ className: `uda-alert` }, { children: [" ", translate('profanityDetected')] })), inputAlert.name && _jsxs("span", Object.assign({ className: `uda-alert` }, { children: [" ", translate('inputMandatory')] })), inputError.name && _jsxs("span", Object.assign({ className: `uda-alert` }, { children: [" ", translate('inputError')] })), _jsx("div", Object.assign({ id: "uda-sequence-names" }, { children: labels === null || labels === void 0 ? void 0 : labels.map((item, index) => {
                                            return (_jsxs("div", { children: [_jsxs("div", Object.assign({ className: "flex-card flex-center" }, { children: [_jsx("input", { type: "text", id: "uda-recorded-name", name: "uda-save-recorded[]", className: `uda-form-input uda-form-input-reduced uda_exclude ${item.profanity ? "profanity" : ""}`, placeholder: "Enter Label", onChange: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                                    yield onExtraLabelChange(index, e.target.value);
                                                                    yield setInputAt('label' + index);
                                                                }), onBlur: (e) => __awaiter(void 0, void 0, void 0, function* () {
                                                                    yield checkLabelProfanity(index, e.target.value);
                                                                }), value: item.label }), _jsx("button", Object.assign({ className: "delete-btn uda-remove-row uda_exclude", onClick: () => removeLabel(index) }, { children: _jsx(DeleteOutlined, {}) }))] })), _jsxs("div", Object.assign({ className: "flex-card flex-center" }, { children: [(item.profanity) &&
                                                                _jsxs("span", Object.assign({ className: `uda-alert` }, { children: [" ", translate('profanityDetected'), _jsx("br", {})] })), (inputError['label' + index] && inputError['label' + index].error) &&
                                                                _jsxs("span", Object.assign({ className: `uda-alert` }, { children: [" ", translate('inputError')] }))] }))] }, `label-${index}`));
                                        }) })), _jsx("div", Object.assign({ className: " add_lebel_btn_wrap" }, { children: _jsxs("button", Object.assign({ className: "add-btn uda_exclude", onClick: () => addLabel() }, { children: ["+ ", translate('addLabel')] })) })), ((_a = props === null || props === void 0 ? void 0 : props.config) === null || _a === void 0 ? void 0 : _a.enablePermissions) && (_jsxs("div", Object.assign({ id: "uda-permissions-section", style: { padding: "30px 0px" } }, { children: [_jsx("br", {}), _jsx("div", { children: _jsx("button", Object.assign({ className: "add-btn uda_exclude", onClick: () => toggleAdvanced() }, { children: advBtnShow ? translate('hidePermissions') : translate('showPermissions') })) }), advBtnShow &&
                                                _jsx("div", { children: Object.entries((_b = props === null || props === void 0 ? void 0 : props.config) === null || _b === void 0 ? void 0 : _b.permissions).map(([key, value]) => {
                                                        return _jsxs("div", { children: [_jsx("input", { type: "checkbox", id: "uda-recorded-name", className: "uda_exclude", checked: tmpPermissionsObj[key] !== undefined, onChange: handlePermissions({ [key]: value, key }) }), displayKeyValue(key, value)] }, key);
                                                    }) })] }))), _jsxs("div", Object.assign({ className: "flex-card flex-center", style: { clear: "both", marginTop: 50 } }, { children: [_jsx("div", Object.assign({ className: "flex-card flex-start", style: { flex: 1 } }, { children: _jsx("button", Object.assign({ className: "uda-record-btn uda_exclude", onClick: () => {
                                                        cancelRecording();
                                                    }, style: { flex: 1 }, disabled: disableForm }, { children: _jsx("span", Object.assign({ className: "uda_exclude" }, { children: translate('cancelRecording') })) })) })), _jsx("div", Object.assign({ className: "flex-card flex-end", style: { flex: 1 } }, { children: _jsx("button", Object.assign({ className: `uda-tutorial-btn uda_exclude ${disableForm ? "disabled" : ""}`, onClick: () => submitRecording(), disabled: disableForm, style: { flex: 1, marginLeft: "5px" } }, { children: translate('submitButton') })) }))] }))] }))] })) })] })) : null;
};
//# sourceMappingURL=RecordedData.js.map