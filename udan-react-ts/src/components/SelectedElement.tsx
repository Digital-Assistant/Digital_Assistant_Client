import React, { useEffect, useRef } from "react";
import { CONFIG } from "../config";
import { updateRecordClicks } from "../services/recordService";
import fetchHtmlFormElements from "../util/recording-utils/fetchHtmlFormElements";

const SelectedElement = ({ data }) => {
  const { enableNodeTypeChangeSelection } = CONFIG;
  let nodeData = JSON.parse(data.objectdata);
  let optionsArray = [];

  const editAndSaveSelectedHtmlElement = (event) => {
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
    // var outputdata = JSON.stringify(data);
    updateRecordClicks(data);
  };

  const getOptions = () => {
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
    if (selectedElement.inputElement === "") {
      optionsArray.push({
        value: JSON.stringify(selectedElement),
        text: selectedElement.displayName,
        selected: true,
      });
    }
    for (let htmlFormElement of fetchHtmlFormElements()) {
      optionsArray.push({
        value: JSON.stringify(htmlFormElement),
        text: htmlFormElement.displayName,
        selected: htmlFormElement.systemTag === selectedElement.systemTag,
      });
    }
    return optionsArray.map((eachOption) => {
      return (
        <option key={eachOption.text} value={eachOption.value} selected={eachOption.selected}>
          {eachOption.text}
        </option>
      );
    });
  };

  return enableNodeTypeChangeSelection ? (
    <>
      <span style={{marginRight:"4px"}}>Clicked on </span>
      <select
        name="UDASelectedElement"
        id="UDASelectedElement"
        onChange={editAndSaveSelectedHtmlElement}
      >
        {getOptions()}
      </select>
    </>
  ) : null;
};

export default SelectedElement;
