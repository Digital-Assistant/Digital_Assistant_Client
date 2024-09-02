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
import { useEffect, useState } from "react";
import fetchHtmlFormElements from "../util/recording-utils/fetchHtmlFormElements";
const SelectedElement = ({ data, recordData, index, config, storeRecording, }) => {
    let nodeData = JSON.parse(data.objectdata);
    let selectedElement = {
        inputElement: "",
        inputType: "",
        displayName: "Please Select",
        systemTag: "",
    };
    if (nodeData.meta.hasOwnProperty("selectedElement") &&
        nodeData.meta.selectedElement) {
        selectedElement = nodeData.meta.selectedElement;
    }
    const [optionsArray, setOptionsArray] = useState([]);
    const [defaultSelectedValue, setDefaultSelectedValue] = useState(JSON.stringify(selectedElement));
    const { enableNodeTypeSelection } = config;
    useEffect(() => {
        /**
         * To generate selected element dropdown options list
         */
        let tempOptionsArray = [];
        if (selectedElement.inputElement === "") {
            tempOptionsArray.push({
                value: JSON.stringify(selectedElement),
                text: selectedElement.displayName,
            });
        }
        for (let htmlFormElement of fetchHtmlFormElements()) {
            tempOptionsArray.push({
                value: JSON.stringify(htmlFormElement),
                text: htmlFormElement.displayName,
            });
        }
        setOptionsArray(tempOptionsArray);
    }, []);
    const editAndSaveSelectedHtmlElement = (event) => __awaiter(void 0, void 0, void 0, function* () {
        const valueSelected = JSON.parse(event.target.value);
        let nodeData = JSON.parse(data.objectdata);
        if (valueSelected.inputElement === "") {
            return;
        }
        if (nodeData.meta && Object.keys(nodeData.meta).length >= 1) {
            nodeData.meta.selectedElement = valueSelected;
        }
        else {
            nodeData.meta = {};
            nodeData.meta.selectedElement = valueSelected;
        }
        data.objectdata = JSON.stringify(nodeData);
        recordData[index].objectdata = data.objectdata;
        storeRecording(recordData);
    });
    return enableNodeTypeSelection ? (_jsx(_Fragment, { children: _jsxs("div", Object.assign({ className: "flex-card flex-vcenter selectedElement" }, { children: [_jsxs("span", Object.assign({ style: { marginRight: "4px" }, className: "col-3" }, { children: ["Clicked on", " "] })), optionsArray.length > 0 && (_jsx("select", Object.assign({ name: "UDASelectedElement", id: "UDASelectedElement", onChange: editAndSaveSelectedHtmlElement, defaultValue: defaultSelectedValue, className: "col-9" }, { children: optionsArray.map((eachOption) => {
                        return (_jsx("option", Object.assign({ value: eachOption.value }, { children: eachOption.text }), eachOption.text));
                    }) })))] })) })) : null;
};
export default SelectedElement;
//# sourceMappingURL=SelectedElement.js.map