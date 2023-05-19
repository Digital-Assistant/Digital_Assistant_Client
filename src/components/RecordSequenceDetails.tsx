/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React, {useEffect, useRef, useState} from "react";
import {Badge, Button, Col, List, Popconfirm, Row} from "antd";
import {
  DeleteOutlined,
  DislikeFilled,
  DislikeOutlined,
  LeftOutlined,
  LikeFilled,
  LikeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import {getCurrentPlayItem, getFromStore, getObjData, setToStore,} from "../util";
import {deleteRecording} from "../services/recordService";
import {getUserId} from "../services/userService";
import {matchNode} from "../util/invokeNode";
import {CONFIG} from "../config";
import {off, on} from "../util/events";
import {translate} from "../util/translation";
import {removeToolTip} from "../util/addToolTip";
import {getClickedNodeLabel} from "../util/getClickedNodeLabel";
import {getVoteRecord, vote} from "../services/userVote";


interface MProps {
  data?: any;
  config?: any;
  refetchSearch?: Function;
  recordSequenceDetailsVisibility?: boolean;
  cancelHandler?: Function;
  playHandler?: Function;
  isPlaying?: string;
  showLoader?: Function;
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
  const autoPlay = (data = null) => {
    if (getFromStore(CONFIG.RECORDING_IS_PLAYING, true) !== "on") {
      return;
    }
    const playItem = getCurrentPlayItem();
    if (playItem.node && matchNode(playItem)) {
      updateStatus(playItem.index);
    } else {
      pause();
      removeToolTip();
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
    setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
    setSelectedRecordingDetails({...selectedRecordingDetails});
    setUserVote({upvote: 0, downvote: 0});
  };

  /**
   *
   * @returns name/label of the recording
   */
  const getName = () => {
    let name = "";
    if (props.data) {
      try {
        // name = JSON.parse(props?.data?.name)?.join(",");
        let names = JSON.parse(props?.data?.name);
        name = names[0] ? names[0] : 'NA';
      } catch (e) {
      }
    }
    return name;
  };

  /**
   * Navigates back to search results card
   */
  const backNav = (forceRefresh = false) => {
    resetStatus();
    removeToolTip();
    if (props.cancelHandler) props.cancelHandler(forceRefresh);
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
      updateStatus(index);
    }
  }

  const removeRecording = async () => {
    props.showLoader(true);
    await deleteRecording({id: selectedRecordingDetails.id});
    setTimeout(() => {
      backNav(true);
    }, CONFIG.indexInterval);
  };

  const manageVote = async (type: string = 'up') => {
    let record = await vote({id: selectedRecordingDetails.id}, type);
    selectedRecordingDetails.upVoteCount = record.upVoteCount;
    selectedRecordingDetails.downVoteCount = record.downVoteCount;
    setSelectedRecordingDetails({...selectedRecordingDetails});
    if (type === 'up') {
      setUserVote({upvote: 1, downvote: 0});
    } else {
      setUserVote({upvote: 0, downvote: 1});
    }
  };

  const [userId, setUserId] = useState<string>(null);

  /**
   * setting the user vote record
   */
  const [userVote, setUserVote] = useState<any>({upvote: 0, downvote: 0});

  const fetchUserVote = async () => {
    let userRecord = await getVoteRecord({id: selectedRecordingDetails.id});
    if (userRecord) {
      setUserVote(userRecord);
    } else {
      console.log('empty');
    }
  }

  useEffect(() => {
    (async () => {
      setUserId(await getUserId());
      await fetchUserVote();
    })();
  }, []);

  const addSkipClass = (item) => {
    if (item.status !== 'completed') {
      return 'uda_exclude';
    }
    let nodeData = getObjData(item.objectdata);
    if (nodeData.meta.hasOwnProperty('skipDuringPlay') && nodeData.meta.skipDuringPlay) {
      return 'skipped uda_exclude';
    }
    return item.status + ' uda_exclude';
  }

  const ref = useRef();

  const [copied, setCopied] = useState(false);

  function copy() {
    const el = document.createElement("input");
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(CONFIG.UDA_URL_Param, selectedRecordingDetails.id);
    let path = window.location.href.split('?')[0]
    el.value = path + '?' + searchParams.toString();
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }

  return props?.recordSequenceDetailsVisibility ? (
      <>
        <div
            className="uda-card-details"
            style={{
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px",
            }} ref={ref}
        >
          <div className="uda-card-btns">
            <Button
                type="primary"
                shape="circle"
                size="small"
                style={{position: "absolute", top: 12, left: 0}}
                className="uda_exclude"
                onClick={() => backNav(false)}
            >
              <LeftOutlined/>
            </Button>
            {props?.isPlaying == "off" && (
                <PlayCircleOutlined
                    className="large secondary uda_exclude"
                    onClick={() => play()}
                />
            )}
            {props?.isPlaying == "on" && (
                <PauseCircleOutlined
                    className="large secondary uda_exclude"
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
                        <li
                            className={addSkipClass(item)}
                            onClick={() => playNode(item, index)}
                        >
                          <i>{getClickedNodeLabel(item)}</i>
                        </li>
                    )}
                />
            )}
          </ul>
        </div>
        <div className="uda-details-footer">
          <Row style={{textAlign: "center"}}>

            <Col span={8}>
              <Button onClick={() => manageVote("up")} className="uda_exclude">
                {(userVote && userVote?.upvote === 1) &&
                    <LikeFilled width={33} className="secondary"/>
                }
                {((userVote && userVote?.upvote === 0) || !userVote) &&
                    <LikeOutlined width={33} className="secondary"/>
                }
                <br/>
                <Badge
                    className="site-badge-count-109"
                    count={selectedRecordingDetails.upVoteCount}
                    style={{ backgroundColor: '#52c41a' }}
                />
              </Button>
            </Col>
            <Col span={8}>
              <Button onClick={copy}>{!copied ? "Copy link" : "Copied!"}</Button>
            </Col>
            <Col span={8}>
              {(selectedRecordingDetails.usersessionid === userId) &&
                  <Popconfirm title={translate('deleteRecording')} onConfirm={removeRecording} className="uda_exclude">
                      <Button className="uda_exclude">
                          <DeleteOutlined width={33} className="secondary uda_exclude"/>
                      </Button>
                  </Popconfirm>
              }
              <Button onClick={() => manageVote("down")} className="uda_exclude">
                {(userVote && userVote?.downvote === 1) &&
                    <DislikeFilled width={33} className="secondary"/>
                }
                {((userVote && userVote?.downvote === 0) || (!userVote)) &&
                    <DislikeOutlined width={33} className="secondary"/>
                }
                <br/>
                <Badge
                    className="site-badge-count-109"
                    count={selectedRecordingDetails.downVoteCount}
                    style={{ backgroundColor: '#faad14' }}
                />
              </Button>
            </Col>
          </Row>
        </div>
      </>
  ) : null;
};
