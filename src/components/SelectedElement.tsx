import React, { useEffect, useState } from "react";
import { updateRecordClicks } from "../services/recordService";
import fetchHtmlFormElements from "../util/recording-utils/fetchHtmlFormElements";

const SelectedElement = ({
    data,
    recordData,
    index,
    config,
    storeRecording,
}) => {
    let nodeData = JSON.parse(data.objectdata);
    let selectedElement = {
        inputElement: "",
        inputType: "",
        displayName: "Please Select",
        systemTag: "",
    };
    if (
        nodeData.meta.hasOwnProperty("selectedElement") &&
        nodeData.meta.selectedElement
    ) {
        selectedElement = nodeData.meta.selectedElement;
    }

    const [optionsArray, setOptionsArray] = useState([]);
    const [defaultSelectedValue, setDefaultSelectedValue] = useState(
        JSON.stringify(selectedElement)
    );
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

    const editAndSaveSelectedHtmlElement = async (event) => {
        const valueSelected = JSON.parse(event.target.value);
        let nodeData = JSON.parse(data.objectdata);
        if (valueSelected.inputElement === "") {
            return;
        }
        if (nodeData.meta && Object.keys(nodeData.meta).length >= 1) {
            nodeData.meta.selectedElement = valueSelected;
        } else {
            nodeData.meta = {};
            nodeData.meta.selectedElement = valueSelected;
        }
        data.objectdata = JSON.stringify(nodeData);
        recordData[index].objectdata = data.objectdata;
        storeRecording(recordData);
        await updateRecordClicks(data);
    };

    return enableNodeTypeSelection ? (
        <>
            <div className="flex-card flex-vcenter selectedElement">
                <span style={{ marginRight: "4px" }} className="col-3">
                    Clicked on{" "}
                </span>
                {optionsArray.length > 0 && (
                    <select
                        name="UDASelectedElement"
                        id="UDASelectedElement"
                        onChange={editAndSaveSelectedHtmlElement}
                        defaultValue={defaultSelectedValue}
                        className="col-9"
                    >
                        {optionsArray.map((eachOption) => {
                            return (
                                <option
                                    key={eachOption.text}
                                    value={eachOption.value}
                                >
                                    {eachOption.text}
                                </option>
                            );
                        })}
                    </select>
                )}
                {/* <div className="clearfix"></div> */}
            </div>
        </>
    ) : null;
};

export default SelectedElement;
