/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React, { useEffect } from "react";
import "../App.scss";
import {
  LeftOutlined,
  DeleteOutlined,
  LikeOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Empty, List, Row, Col } from "antd";
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
  getAllChildren,
  compareNodes,
  getAbsoluteOffsets,
} from "../util";
// import { jaroWinkler } from "jaro-winkler-typescript";

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
  const cancel = (flag: boolean) => {
    if (props.cancelHandler) props.cancelHandler();
  };
  const recordSequence = () => {
    if (props.recordSeqHandler) props.recordSeqHandler();
  };
  return props?.recordButtonVisibility ? (
    <div className="uda-card-details">
      <Row>
        <Col span={24} className="halign-right">
          <CloseCircleOutlined
            className="small"
            onClick={() => cancel(false)}
          />
        </Col>
      </Row>
      <h5>Create your own action</h5>
      <div>
        <button
          className="uda-record-btn"
          id="uda-enable-record"
          onClick={() => recordSequence()}
        >
          <VideoCameraAddOutlined />
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
        // const selector = getLookUpSelector(originalElement);
        // const targetElement = document.querySelector(selector);
        let compareElements = getAllChildren(document.body);
        for (let i = 0; i < compareElements?.length; i++) {
          if (originalElement.outerHTML == compareElements[i].outerHTML) {
            if (originalNode.offset) {
              // console.log(originalNode);
              const _offsets = getAbsoluteOffsets(compareElements[i]);
              // console.log(originalNode, _offsets);
              if (
                _offsets.x == originalNode.offset.x ||
                _offsets.y == originalNode.offset.y
              ) {
                originalElement = compareElements[i];
              }
            } else {
              originalElement = compareElements[i];
            }
          }
        }
        if (originalElement) {
          updateStatus(playItem.index);
          window.location.href = originalElement?.getAttribute("href") || "/";
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
      let compareElements = getAllChildren(document.body);
      for (let i = 0; i < compareElements?.length; i++) {
        if (originalElement.outerHTML == compareElements[i].outerHTML) {
          if (originalNode.offset) {
            // console.log(originalNode);
            const _offsets = getAbsoluteOffsets(compareElements[i]);
            // console.log(originalNode, _offsets);
            if (
              _offsets.x == originalNode.offset.x ||
              _offsets.y == originalNode.offset.y
            ) {
              originalElement = compareElements[i];
            }
          } else {
            originalElement = compareElements[i];
          }
        }
      }

      // console.log(originalNode);
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

      //let selector = getLookUpSelector(originalElement);

      //console.log("'" + selector + index + "'");

      //originalElement = document.querySelector(selector);

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
      // console.log(e);
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
          <Button
            type="primary"
            shape="circle"
            size="small"
            style={{ position: "absolute", top: 12, left: 0 }}
            onClick={() => backNav()}
          >
            <LeftOutlined />
          </Button>
          <PlayCircleOutlined
            className="large secondary"
            onClick={() => play()}
          />
        </div>
        <h5>{getName()}</h5> <hr />
        <ul className="uda-suggestion-list" id="uda-sequence-steps">
          {props?.data && (
            <List
              itemLayout="horizontal"
              dataSource={selectedRecordingDetails?.userclicknodesSet}
              renderItem={(item: any, index: number) => (
                <List.Item
                  className={item.status}
                  onClick={() => setToolTip(item, index)}
                >
                  <List.Item.Meta title={item?.clickednodename} />
                </List.Item>
              )}
            />
          )}
        </ul>
      </div>
      <Row>
        <Col span={12} style={{ textAlign: "center" }}>
          <Button size="small">
            <DeleteOutlined width={33} />
          </Button>
        </Col>
        <Col span={12} style={{ textAlign: "center" }}>
          <Button size="small">
            <LikeOutlined width={33} />
          </Button>
        </Col>
      </Row>
    </>
  ) : null;
};
