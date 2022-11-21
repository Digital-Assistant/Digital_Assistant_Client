/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React, {useEffect, useState} from "react";
import {Row, Col, Button, List, Popconfirm} from "antd";
import {
  LeftOutlined,
  DeleteOutlined,
  LikeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import {
  setToStore,
  getCurrentPlayItem,
} from "../util";
import {deleteRecording, vote} from "../services/recordService";
import {getUserId} from "../services/userService";
import {matchNode} from "../util/invokeNode";
import {CONFIG} from "../config";
import {off, on} from "../util/events";


interface MProps {
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

  useEffect(() => {
    on("UDAPlayNext", autoPlay);
    on("ContinuePlay", autoPlay);
    on("BackToSearchResults", backNav);
    on("PausePlay", pause);
    return () => {
      off("UDAPlayNext", autoPlay);
      off("ContinuePlay", autoPlay);
      off("BackToSearchResults", backNav);
      off("PausePlay", pause);
    };
  }, []);


  /**
   * Record player(auto play)
   */
  const autoPlay = () => {
    if (props?.isPlaying == "on") {
      const playItem = getCurrentPlayItem();
      if (matchNode(playItem)) {
        updateStatus(playItem.index);
      } else {
        pause();
      }
    }
  };

  /**
   * updates node status(to completed) by index
   * @param index
   */
  const updateStatus = (index: number) => {
    selectedRecordingDetails.userclicknodesSet[index].status = "completed";
    setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
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
   * Get added node label
   * @param data
   */
  const getClickedNodeLabel = (data) => {
    let clickedName = '';
    let nodeData = JSON.parse(data.objectdata);
    if (nodeData.meta.hasOwnProperty('displayText') && nodeData.meta.displayText !== '') {
      clickedName = ((nodeData.meta.displayText.length > CONFIG.maxStringLength) ? nodeData.meta.displayText.substr(0, CONFIG.maxStringLength) + '...' : nodeData.meta.displayText);
    } else {
      clickedName = ((data.clickednodename.length > CONFIG.maxStringLength) ? data.clickednodename.substr(0, CONFIG.maxStringLength) + '...' : data.clickednodename);
    }
    return clickedName;
  }

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
    if (props.playHandler) props.playHandler("on");
    // autoPlay();
  };

  /**
   * Pause the autoplay
   */
  const pause = () => {
    if (props.playHandler) props.playHandler("off");
  };

  const playNode = (item, index) => {
    if (matchNode({node: item, index})) {
      // setToolTip(item, index)
      updateStatus(index);
    }
  }

  const removeRecording = async () => {
    if (!window.confirm("Sure you want to delete?")) return;
    await deleteRecording({id: selectedRecordingDetails.id});
    /*if (props?.refetchSearch) {
      props.refetchSearch("on");
    }*/
    backNav();
  };

  const manageVote = async () => {
    await vote({id: selectedRecordingDetails.id}, "up");
  };

  const [userId, setUserId] = useState<string>(null);

  useEffect(() => {
    (async () => {
      setUserId(await getUserId());
    })();
  }, []);

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
                            onClick={() => playNode(item, index)}
                        >
                          <List.Item.Meta title={getClickedNodeLabel(item)}/>
                        </List.Item>
                    )}
                />
            )}
          </ul>
        </div>
        <div className="uda-details-footer">
          <Row>
            {(selectedRecordingDetails.usersessionid === userId) &&
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
