/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../App.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { createPopperLite as createPopper } from "@popperjs/core";
import {
  // addToolTip,
  setToStore,
  getToolTipElement,
  getFromStore,
  getLookUpSelector,
  getTooltipPositionClass,
  removeToolTip,
} from "../util";
export interface MProps {
  data?: any;
  recordButtonVisibility?: boolean;
  recordSequenceVisibility?: boolean;
  recordSequenceDetailsVisibility?: boolean;
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

/**
 * To render record sequence details
 * @returns HTML Element
 */

export const RecordSequenceDetails = (props: MProps) => {
  const [selectedRecordingDetails, setSelectedRecordingDetails] =
    React.useState<any>(props.data);

  const addToolTip = (invokingNode: any, index: any) => {
    const tooltipDivElement = getToolTipElement();
    try {
      const originalNode = JSON.parse(invokingNode);

      let originalElement = originalNode?.node;

      document
        .getElementById("uda-autoplay-continue")
        ?.addEventListener("click", (e: Event) => {
          // const elementsFromStore = getFromStore("selectedRecordedItem", false);
          setToolTip(
            selectedRecordingDetails?.userclicknodesSet[index + 1],
            index + 1
          );
        });

      document
        .getElementById("uda-autoplay-exit")
        ?.addEventListener("click", (e: Event) => {
          removeToolTip();
        });

      let selector = getLookUpSelector(originalElement);

      console.log("'" + selector + index + "'");

      originalElement = document.querySelector(selector);

      if (originalElement) {
        let toolTipPositionClass: any = getTooltipPositionClass(
          originalElement,
          tooltipDivElement
        );
        createPopper(originalElement, tooltipDivElement, {
          placement: toolTipPositionClass,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const setToolTip = (item: any, index: number) => {
    addToolTip(item?.objectdata, index);
    updateStatus(index);
  };

  const updateStatus = (index: number) => {
    selectedRecordingDetails.userclicknodesSet[index].status = "completed";
    setToStore(selectedRecordingDetails, "selectedRecordedItem", false);
    setSelectedRecordingDetails({ ...selectedRecordingDetails });
  };

  const getName = () => {
    let name = "";
    if (props.data) {
      try {
        name = JSON.parse(props?.data?.name)?.join(",");
      } catch (e) {}
    }
    return name;
  };

  const renderData = () => {
    if (!props?.data) return;
    return selectedRecordingDetails?.userclicknodesSet?.map(
      (item: any, index: number) => {
        return (
          <li className={item.status} onClick={() => setToolTip(item, index)}>
            <i>{item?.clickednodename}</i>
          </li>
        );
      }
    );
  };

  const backNav = () => {
    if (props.cancelHandler) props.cancelHandler();
  };

  const play = () => {
    setToStore("on", "isPlaying", true);
    setToolTip(selectedRecordingDetails?.userclicknodesSet[0], 0);
  };

  return props?.recordSequenceDetailsVisibility ? (
    <>
      <div
        className="uda-card-details"
        style={{
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
        }}
      >
        <div className="uda-card-btns">
          <div className="uda-loading-bar" id="nist-autoplay">
            <span onClick={() => play()}>
              <FontAwesomeIcon icon={faPlayCircle} />
            </span>
          </div>
        </div>
        <div
          className="uda-card-right-dbl-arrow"
          id="uda-backto-search"
          onClick={() => backNav()}
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
        </div>
        <h5>{getName()}</h5> <hr />
        <ul className="uda-suggestion-list" id="uda-sequence-steps">
          {renderData()}
        </ul>
      </div>
      <div className="uda-details-footer">
        <div
          className="uda-details-footer-left uda-trash-img"
          id="uda-delete-sequence"
        ></div>
        <div className="uda-details-footer-right"> </div>
      </div>
    </>
  ) : null;
};
