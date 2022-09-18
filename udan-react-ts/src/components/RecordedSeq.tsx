/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render recorded sequences
 * Associated Route/Usage: *
 */

import React, { useCallback, useEffect } from "react";
import "../App.scss";
import { BsFillPencilFill } from "react-icons/bs";
import _, { debounce } from "lodash";
import { setToStore, postRecordSequenceData } from "../util";
import { updateRecordClicks } from "../services/recordService";
import { CONFIG } from "../config";

export interface MProps {
  sequenceName?: string;
  isShown?: boolean;
  hide?: () => void;
  data?: any;
  refetchSearch?: Function;
  recordHandler?: Function;
}

/**
 * To render recorded sequence elements
 * @returns HTML Elements
 */

export const RecordedSeq = (props: MProps) => {
  const [name, setName] = React.useState<string>("");
  const [recordData, setRecordData] = React.useState<any>(props.data);

  React.useEffect(() => {
    setRecordData([...props.data]);
  }, [props.data]);

  const storeRecording = (data: any) => {
    setRecordData([...data]);
    setToStore(data, CONFIG.RECORDING_SEQUENCE, false);
  };

  const setEdit = (index: number) => {
    recordData[index].editable = true;
    storeRecording(recordData);
  };

  const getObjData = (obj: string) => {
    try {
      const _objData = JSON.parse(obj);
      if (_objData && _objData.meta === undefined) _objData.meta = {};
      return _objData;
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  const handleDebounceFn = async (index: number, inputValue: string) => {
    console.log("handle", props?.data);
    const _objData: any = getObjData(props?.data?.[index]?.objectdata);
    console.log("handle", _objData);
    if (_objData) {
      setRecordData([...props?.data]);
      _objData.meta.displayText = inputValue;
      recordData[index].objectdata = JSON.stringify(_objData);
      storeRecording(recordData);
      await updateRecordClicks(recordData[index]);
    }
  };

  const debounceFn = useCallback(debounce(handleDebounceFn, 1000), [
    props?.data,
  ]);

  const handleChange = (index: number) => (event: any) => {
    debounceFn(index, event.target.value);
  };

  const handlePersonal = (index: number) => (event: any) => {
    const _objData = getObjData(recordData[index]?.objectdata);
    if (_objData) {
      if (_objData.meta.isPersonal === undefined)
        _objData.meta.isPersonal = false;
      _objData.meta.isPersonal = !_objData.meta.isPersonal;
      recordData[index].objectdata = JSON.stringify(_objData);
      storeRecording(recordData);
      updateRecordClicks(recordData[index]);
    }
  };

  const addLabel = () => {
    console.log("add label");
  };

  const cancelRecording = () => {
    if (props.recordHandler) props.recordHandler("cancel");
    setToStore([], CONFIG.RECORDING_SEQUENCE, false);
  };

  const submitRecording = async () => {
    const instance = await postRecordSequenceData({
      name: JSON.stringify([name]),
    });
    if (instance && props?.refetchSearch) {
      props.refetchSearch("on");
    }
    setToStore([], CONFIG.RECORDING_SEQUENCE, false);
  };

  const onChange = async (e: any) => {
    setName(e.target.value);
  };

  const renderData = () => {
    if (!props.isShown) return;
    else
      return recordData?.map((item: any, index: number) => {
        return (
          <li className="uda-recorded-label-editable completed">
            <div
              className="flex-card flex-center"
              style={{ alignItems: "center" }}
            >
              <span id="uda-display-clicked-text" style={{ flex: 2 }}>
                <input
                  type="text"
                  id="uda-edited-name"
                  name="uda-edited-name"
                  className={`uda-form-input ${
                    !item.editable ? "non-editable" : ""
                  }`}
                  placeholder="Enter Name"
                  // onChange={onLabelChange(index)}
                  onChange={handleChange(index)}
                  defaultValue={item?.clickednodename}
                  readOnly={item.editable ? false : true}
                  style={{ width: "85%! important" }}
                  // onKeyDown={handleLabelChange(index)}
                  onClick={() => {
                    setEdit(index);
                  }}
                />
              </span>

              {/* <span className="halign-right">
                <button
                  className="uda-tutorial-btn"
                  style={{ padding: "0px", width: 24 }}
                  type="button"
                  id="uda-edit-clickedname"
                >
                  <BsFillPencilFill
                    onClick={() => {
                      setEdit(index);
                    }}
                  />
                </button>
              </span> */}
              <span></span>
              <br />
            </div>
            {/* <button
              className="uda-tutorial-btn"
              style={{
                display: "none",
                padding: "5px !important",
                height: "40px",
              }}
              type="button"
              id="uda-edit-clickedname-submit"
            >
              save
            </button> */}
            &nbsp; &nbsp;{" "}
            <input
              type="checkbox"
              id="isPersonal"
              // checked={getObjData(item?.objectdata)?.meta?.isPersonal}
              onClick={handlePersonal(index)}
            />
            <label style={{ fontSize: "14px" }}>Personal Information</label>
            <span style={{ position: "relative", top: "0px" }}>
              <img
                src="https://digital-assistant.github.io/Digital_Assistant_Client/chrome-plugin/images/icons/info.png"
                title="select this box if this field / text contains personal information like name / username. We need to ignore personal information while processing."
              />
            </span>
          </li>
        );
      });
  };

  return props?.isShown ? (
    <div className="uda-card-details">
      <h5>Recorded Sequence</h5>
      <hr style={{ border: "1px solid #969696", width: "100%" }} />
      <ul className="uda-recording" id="uda-recorded-results">
        {renderData()}
      </ul>
      <hr style={{ border: "1px solid #969696", width: "100%" }} />
      <div style={{ textAlign: "left" }}>
        <input
          type="text"
          id="uda-recorded-name"
          name="uda-save-recorded[]"
          className="uda-form-input"
          placeholder="Enter Label"
          onChange={onChange}
        />
        <div id="uda-sequence-names" />
        <div style={{ marginBottom: "10px" }}>
          <button className="add-btn uda_exclude" onClick={() => addLabel()}>
            + Add Label
          </button>
        </div>
        <br />
        <br />
        <br />
        <br />
        <div style={{ marginTop: "10px", maxWidth: "100%" }}>
          <button className="uda-record-btn" onClick={() => cancelRecording()}>
            <span className="uda_exclude">Cancel and Exit</span>
          </button>
          <button
            className="uda-tutorial-btn uda_exclude"
            onClick={() => submitRecording()}
            style={{ float: "right", padding: "5px 20px" }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
