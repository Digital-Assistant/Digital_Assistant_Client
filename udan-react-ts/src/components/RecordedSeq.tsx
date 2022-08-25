/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render common modal/lite window
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../App.scss";

import { setToStore, getFromStore } from "../util";
import { CONFIG } from "../config";

export interface MProps {
  isShown?: boolean;
  hide?: () => void;
  data?: any;
  recordHandler?: Function;
}

export const RecordedSeq = (props: MProps) => {
  const renderData = () => {
    if (!props.isShown) return;
    else
      return props.data?.map((item: any) => {
        return (
          <li className="uda-recorded-label-editable">
            <i>
              <span id="uda-display-clicked-text">{item?.clickednodename}</span>
              <span>
                <button
                  className="uda-tutorial-btn"
                  style={{ padding: "0px" }}
                  type="button"
                  id="uda-edit-clickedname"
                >
                  <img src="https://digital-assistant.github.io/Digital_Assistant_Client/chrome-plugin/images/icons/edit.png" />
                </button>
              </span>
              <input
                type="text"
                id="uda-edited-name"
                name="uda-edited-name"
                className="uda-form-input"
                placeholder="Enter Name"
                defaultValue="Issues"
                style={{ display: "none", width: "85%! important" }}
              />
              <span>
                <button
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
                </button>
              </span>
              <br />
            </i>
            {/* &nbsp; &nbsp; <input type="checkbox" id="isPersonal" />
              <label style={{ fontSize: "14px" }}>Personal Information</label>
              <span style={{ position: "relative", top: "0px" }}>
                <img
                  src="https://digital-assistant.github.io/Digital_Assistant_Client/chrome-plugin/images/icons/info.png"
                  title="select this box if this field / text contains personal information like name / username. We need to ignore personal information while processing."
                />
              </span>
              <br />
              <br /> */}
          </li>
        );
      });
  };

  const addLabel = () => {
    console.log("add label");
  };

  const cancelRecording = () => {
    if (props.recordHandler) props.recordHandler();
    setToStore([], CONFIG.RECORDING_SEQUENCE, false);
  };

  const submitRecording = () => {
    if (props.recordHandler) props.recordHandler();
    setToStore([], CONFIG.RECORDING_SEQUENCE, false);
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
        />
        <div id="uda-sequence-names" />
        <div style={{ marginBottom: "10px" }}>
          <button className="add-btn" onClick={() => addLabel()}>
            + Add Label
          </button>
        </div>
        <br />
        <br />
        <br />
        <br />
        <div style={{ marginTop: "10px", maxWidth: "100%" }}>
          <button className="uda-record-btn" onClick={() => cancelRecording()}>
            <span>Cancel and Exit</span>
          </button>
          <button
            className="uda-tutorial-btn"
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
