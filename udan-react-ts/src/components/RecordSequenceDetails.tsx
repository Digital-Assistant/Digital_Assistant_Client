/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React, {useEffect} from "react";
import {Row, Col, Button, List, Popconfirm, message} from "antd";
import {
  LeftOutlined,
  DeleteOutlined,
  LikeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import {createPopperLite as createPopper} from "@popperjs/core";
import {
  // addToolTip,
  setToStore,
  getToolTipElement,
  getTooltipPositionClass,
  removeToolTip,
  getCurrentPlayItem,
  getObjData,
  getAbsoluteOffsets,
  sleep,
} from "../util";
import {deleteRecording, getUserId, vote} from "../services/recordService";
import {jaroWinkler} from "jaro-winkler-typescript";
import {CONFIG} from "../config";


export interface MProps {
  data?: any;
  config?: any;
  refetchSearch?: Function;
  recordSequenceDetailsVisibility?: boolean;
  cancelHandler?: Function;
  playHandler?: Function;
  isPlaying?: string;

}

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
      const _metaData = getObjData(playItem?.node?.objectdata);

      //ignore if recorded node is personal / marked as skip
      if (_metaData.meta.isPersonal || _metaData.meta.skipDuringPlay) {
        updateStatus(playItem.index);
        autoPlay();
      }
      let originalElement = originalNode?.node;
      //if target element is ANCHOR, navigate link rather than tooltip
      if (originalElement.nodeName.toLowerCase() === "a") {
        // const selector = getLookUpSelector(originalElement);
        // const targetElement = document.querySelector(selector);
        let compareElements = document.querySelectorAll(
            originalElement.nodeName
        );
        for (let i = 0; i < compareElements?.length; i++) {
          if (
              jaroWinkler(
                  originalElement.outerHTML,
                  compareElements[i].outerHTML
              ) >= CONFIG.JARO_WEIGHT
          ) {
            if (originalNode.offset) {
              const _offsets = getAbsoluteOffsets(compareElements[i]);
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
        // console.log(originalElement);
        if (
            originalElement &&
            originalElement?.nodeName?.toLowerCase() === "a"
        ) {
          updateStatus(playItem.index);
          try {
            window.location.href = originalElement?.getAttribute("href") || "/";
          } catch (e) {
            window.location.href = originalElement?.href;
            // console.log(e);
          }
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
    let _toolTipFlag = false;
    const tooltipDivElement = getToolTipElement();
    try {
      const originalNode = JSON.parse(invokingNode);
      const _metaData = getObjData(invokingNode);
      //ignore if recorded node is personal / marked as skip
      if (
          _metaData &&
          (_metaData.meta.isPersonal || _metaData.meta.skipDuringPlay)
      )
        return;

      let originalElement = originalNode?.node;
      let compareElements = document.querySelectorAll(originalElement.nodeName); //getAllChildren(document.body);

      for (let i = 0; i < compareElements?.length; i++) {
        // console.log(
        //   jaroWinkler(originalElement.outerHTML, compareElements[i].outerHTML),
        //   originalElement.outerHTML + "*****" + compareElements[i].outerHTML
        // );
        // if (originalElement.outerHTML == compareElements[i].outerHTML) {
        if (
            jaroWinkler(
                originalElement.outerHTML,
                compareElements[i].outerHTML
            ) >= CONFIG.JARO_WEIGHT
        ) {
          _toolTipFlag = true;
          if (originalNode.offset) {
            const _offsets = getAbsoluteOffsets(compareElements[i]);
            if (
                _offsets.x == originalNode.offset.x ||
                _offsets.y == originalNode.offset.y
            ) {
              originalElement = compareElements[i];
            } else {
              _toolTipFlag = false;
            }
          } else {
            originalElement = compareElements[i];
          }
        }
      }

      if (originalElement && originalElement?.nodeName?.toLowerCase() === "a") {
        const playItem = getCurrentPlayItem();
        updateStatus(playItem.index);
        setToStore("on", CONFIG.RECORDING_MANUAL_PLAY, true);
        try {
          window.location.href = originalElement?.getAttribute("href") || "/";
        } catch (e) {
        }
        return;
      }

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
      return _toolTipFlag;
    }
    if (!_toolTipFlag) message.error("Error occurred, try again!");
    return _toolTipFlag;
  };

  /**
   * adds tooltip and change status (in recording details list)
   * @param item
   * @param index
   */
  const setToolTip = (item: any, index: number) => {
    const status = addToolTip(item?.objectdata, index);
    if (status) updateStatus(index);
  };

  /**
   * updates node status(to completed) by index
   * @param index
   */
  const updateStatus = (index: number) => {
    selectedRecordingDetails.userclicknodesSet[index].status = "completed";
    setToStore(selectedRecordingDetails, "selectedRecordedItem", false);
    setSelectedRecordingDetails({...selectedRecordingDetails});
  };

  /**
   * Updates all recorded nodes status to 'none'
   */
  const resetStatus = () => {
    selectedRecordingDetails?.userclicknodesSet?.forEach((element: any) => {
      element.status = "none";
    });
    setToStore(selectedRecordingDetails, "selectedRecordedItem", false);
    setSelectedRecordingDetails({...selectedRecordingDetails});
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
      } catch (e) {
      }
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
              <li
                  key={`rec-details-${index}`}
                  className={item.status}
                  onClick={() => setToolTip(item, index)}
              >
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
    // setToStore("on", CONFIG.RECORDING_IS_PLAYING, true);
    if (props.playHandler) props.playHandler("on");
    // autoPlay();
    // setToolTip(selectedRecordingDetails?.userclicknodesSet[0], 0);
  };

  /**
   * Pause the autoplay
   */
  const pause = () => {
    if (props.playHandler) props.playHandler("off");
  };

  const removeRecording = async () => {
    if (!window.confirm("Sure you want to delete?")) return;
    await deleteRecording({id: selectedRecordingDetails.id});
    if (props?.refetchSearch) {
      props.refetchSearch("on");
    }
    backNav();
  };

  const manageVote = async () => {
    await vote({id: selectedRecordingDetails.id}, "up");
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
                style={{position: "absolute", top: 12, left: 0}}
                onClick={() => backNav()}
            >
              <LeftOutlined/>
            </Button>
            {props?.isPlaying == "off" && (
                <PlayCircleOutlined
                    className="large secondary"
                    onClick={() => play()}
                />
            )}
            {props?.isPlaying == "on" && (
                <PauseCircleOutlined
                    className="large secondary"
                    onClick={() => pause()}
                />
            )}
          </div>
          <h5>{getName()}</h5>
          <hr/>
          <ul className="uda-suggestion-list" id="uda-sequence-steps">
            {/* {renderData()} */}
            {props?.data && (
                <List
                    itemLayout="horizontal"
                    dataSource={selectedRecordingDetails?.userclicknodesSet}
                    renderItem={(item: any, index: number) => (
                        <List.Item
                            className={item.status}
                            onClick={() => setToolTip(item, index)}
                        >
                          <List.Item.Meta title={item?.clickednodename}/>
                        </List.Item>
                    )}
                />
            )}
          </ul>
        </div>
        <div className="uda-details-footer">
          <Row>
            {(selectedRecordingDetails.usersessionid === getUserId) &&
                <Col span={12} style={{textAlign: "center"}}>
                    <Popconfirm title="Are you sure?" onConfirm={removeRecording}>
                        <Button>
                            <DeleteOutlined width={33} className="secondary"/>
                        </Button>
                    </Popconfirm>
                </Col>
            }
            <Col span={12} style={{textAlign: "center"}}>
              <Button onClick={() => manageVote()}>
                <LikeOutlined width={33} className="secondary"/>
              </Button>
            </Col>
          </Row>
        </div>
      </>
  ) : null;
};
