/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";

import {
  BsXCircle,
  BsMic,
} from "react-icons/bs";
 
export interface MProps {
  recordButtonVisibility?: boolean;
  cancelHandler?: Function;
  recordHandler?: Function;
  recordSeqHandler?: Function;
}

/**
 * To render record container
 * @returns HTML Element
 */
export const RecordButton = (props: MProps) => {
  const cancel = (flag: boolean) => {
    if (props.cancelHandler) props.cancelHandler();
  };
  const recordSequence = () => {
    if (props.recordSeqHandler) props.recordSeqHandler();
  };
  return props?.recordButtonVisibility ? (
    <div className="uda-card-details">
      <span style={{ float: "right" }} onClick={() => cancel(false)}>
        <BsXCircle size={16} />
      </span>
      <h5>Create your own action</h5>
      <div className="flex-card flex-center">
        <button
          style={{ marginTop: 20, flexDirection: "column" }}
          className="uda-record-round-btn flex-card flex-center round"
          id="uda-enable-record"
          onClick={() => recordSequence()}
        >
          <BsMic size={24} />
          <span style={{ fontSize: 10, marginTop: 6 }}>Record</span>
          {/* <BsFillRecord2Fill size={16} /> <span>Rec</span> */}
        </button>
      </div>
    </div>
  ) : null;
};