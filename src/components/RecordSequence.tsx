/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React from "react";
import {translate} from "../util/translation";

export interface MProps {
  recordSequenceVisibility?: boolean;
  cancelHandler?: Function;
}

/**
 * To render record sequence container
 * @returns HTML Elements
 */

export const RecordSequence = (props: MProps) => {
  const cancelRecording = () => {
    if (props.cancelHandler) {
      props.cancelHandler();
    }
  };
  return props.recordSequenceVisibility ? (
    <div className="uda-card-details">
      <h5>Recorded Sequence</h5> <hr />
      <h5>Please navigate in the page to record.</h5> <br />
      <div className="uda-recording" style={{ textAlign: "center" }}>
        <button
          className="uda-record-btn uda-record-btn-icon uda_exclude"
          data-exclude={true}
          onClick={()=>{cancelRecording();}}
        >
          {translate('cancelRecording')}
        </button>
      </div>
    </div>
  ) : null;
};
