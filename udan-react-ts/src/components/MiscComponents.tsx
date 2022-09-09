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
  getCurrentPlayItem,
} from "../util";
export interface MProps {
  data?: any;
  recordButtonVisibility?: boolean;
  recordSequenceVisibility?: boolean;
  recordSequenceDetailsVisibility?: boolean;
  cancelHandler?: Function;
  recordHandler?: Function;
  recordSeqHandler?: Function;
  playHandler?: Function;
  isPlaying?: string;
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
        <button
          className="uda-record-btn"
          data-exclude={true}
          onClick={() => cancelRecording()}
        >
          Cancel and Exit
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

  /**
   * Every time isPlaying state changes, and status is "on", play continues
   */
  useEffect(() => {
    if (props?.isPlaying == "on") {
      autoPlay();
    }
  }, [props.isPlaying]);

  /**
   * Record player(auto play)
   */
  const autoPlay = () => {
    //get current play item from storage
    const playItem = getCurrentPlayItem();
    if (playItem && playItem.node) {
      const originalNode = JSON.parse(playItem.node.objectdata);
      let originalElement = originalNode?.node;
      //if target element is ANCHOR, navigate link rather than tooltip
      if (originalElement.nodeName.toLowerCase() === "a") {
        const selector = getLookUpSelector(originalElement);
        const targetElement = document.querySelector(selector);
        if (targetElement) {
          updateStatus(playItem.index);
          window.location.href = targetElement?.getAttribute("href") || "/";
        }
      } else {
        //show tooltip
        setToolTip(playItem.node, playItem.index);
      }
    } else {
      //if no play items are leftover, turn off player
      if (props?.playHandler) {
        props?.playHandler("off");
      }
    }
  };

  /**
   * To add tooltip for target elements
   */
  const addToolTip = (invokingNode: any, index: any) => {
    const tooltipDivElement = getToolTipElement();
    try {
      const originalNode = JSON.parse(invokingNode);

      let originalElement = originalNode?.node;

      //attach event to continue button in tooltip
      document
        .getElementById("uda-autoplay-continue")
        ?.addEventListener("click", (e: Event) => {
          // const elementsFromStore = getFromStore("selectedRecordedItem", false);
          setToolTip(
            selectedRecordingDetails?.userclicknodesSet[index + 1],
            index + 1
          );
        });

      //attach event to close tooltip
      document
        .getElementById("uda-autoplay-exit")
        ?.addEventListener("click", (e: Event) => {
          removeToolTip();
        });

      let selector = getLookUpSelector(originalElement);

      // console.log("'" + selector + index + "'");

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

  /**
   * adds tooltip and change status (in recording details list)
   * @param item
   * @param index
   */
  const setToolTip = (item: any, index: number) => {
    addToolTip(item?.objectdata, index);
    updateStatus(index);
  };

  /**
   * updates node status(to completed) by index
   * @param index
   */
  const updateStatus = (index: number) => {
    selectedRecordingDetails.userclicknodesSet[index].status = "completed";
    setToStore(selectedRecordingDetails, "selectedRecordedItem", false);
    setSelectedRecordingDetails({ ...selectedRecordingDetails });
  };

  /**
   * Updates all recorded nodes status to 'none'
   */
  const resetStatus = () => {
    selectedRecordingDetails?.userclicknodesSet?.forEach((element: any) => {
      element.status = "none";
    });
    setToStore(selectedRecordingDetails, "selectedRecordedItem", false);
    setSelectedRecordingDetails({ ...selectedRecordingDetails });
  };

  /**
   *
   * @returns name/label of the recording
   */
  const getName = () => {
    let name = "";
    if (props.data) {
      try {
        name = JSON.parse(props?.data?.name)?.join(",");
      } catch (e) {}
    }
    return name;
  };

  /**
   * prepares recorded node list
   * @returns HTML Collection
   */
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

  /**
   * Navigates back to search results card
   */
  const backNav = () => {
    if (props.cancelHandler) props.cancelHandler();
  };

  /**
   * Auto play button handler
   */
  const play = () => {
    resetStatus();
    setToStore("on", "isPlaying", true);
    autoPlay();
    // setToolTip(selectedRecordingDetails?.userclicknodesSet[0], 0);
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
