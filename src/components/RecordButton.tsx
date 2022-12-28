/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React from "react";
import {
  CloseCircleOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";


interface MProps {
  recordButtonVisibility?: boolean;
  cancelHandler?: Function;
  recordHandler?: Function;
  recordSeqHandler?: Function;
  config?: any;
}

/**
 * To render record container
 * @returns HTML Element
 */
export const RecordButton = (props: MProps) => {
  const cancel = () => {
    if (props.cancelHandler) props.cancelHandler();
  };
  const recordSequence = () => {
    if (props.recordSeqHandler) props.recordSeqHandler();
  };
  return props?.recordButtonVisibility ? (
    <div className="uda-card-details uda_exclude">
      <span style={{ float: "right" }}>
        <CloseCircleOutlined className="small uda_exclude" onClick={() => cancel()} />
      </span>
      <h5>Create your own action</h5>
      <div className="flex-card flex-center uda_exclude">
        <button
          style={{ marginTop: 20, flexDirection: "column" }}
          className="uda-record-round-btn flex-card flex-center round uda_exclude"
          id="uda-enable-record"
          onClick={() => recordSequence()}
        >
          <VideoCameraAddOutlined />
          <span style={{ fontSize: 10, marginTop: 6 }}>Record</span>
        </button>
      </div>
    </div>
  ) : null;
};
