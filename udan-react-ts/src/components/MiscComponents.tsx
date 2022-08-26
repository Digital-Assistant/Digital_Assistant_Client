/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../App.scss";

export interface MProps {
  data?: any;
  recordButtonVisibility?: boolean;
  recordSequenceVisibility?: boolean;
  cancelHandler?: Function;
  recordHandler?: Function;
  recordSeqHandler?: Function;
}

/**
 * To render record sequence container
 * @returns HTML Elements
 */

export const RecordSequence = (props: MProps) => {
  const cancelRecording = () => {
    if (props.cancelHandler) props.cancelHandler();
  };
  return props?.recordSequenceVisibility ? (
    <div className="uda-card-details">
      <h5>Recorded Sequence</h5> <hr />
      <h5>Please navigate in the page to record.</h5> <br />
      <div className="uda-recording" style={{ textAlign: "center" }}>
        <button className="uda-record-btn" onClick={() => cancelRecording()}>
          <span>Cancel and Exit</span>
        </button>
      </div>
    </div>
  ) : null;
};

/**
 * To render record container
 * @returns HTML Element
 */

export const RecordButton = (props: MProps) => {
  const setShowRecord = (flag: boolean) => {
    if (props.recordHandler) props.recordHandler(flag);
  };
  const recordSequence = () => {
    if (props.recordSeqHandler) props.recordSeqHandler();
  };
  return props?.recordButtonVisibility ? (
    <div className="uda-card-details">
      <span className="uda-close-icon" onClick={() => setShowRecord(false)}>
        ×
      </span>
      <h5>Create your own action</h5>
      <div>
        <button
          className="uda-record-btn"
          id="uda-enable-record"
          onClick={() => recordSequence()}
        >
          <span>Rec</span>
        </button>
      </div>
    </div>
  ) : null;
};
