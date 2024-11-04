/**
 * Author: Lakshman Veti
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React, {useEffect, useRef, useState} from "react";
import {Button, Col, List, Popconfirm, Row, Checkbox} from "antd";
import {
  DeleteOutlined,
  DislikeFilled,
  DislikeOutlined,
  LeftOutlined,
  LikeFilled,
  LikeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ShareAltOutlined,
  CopyFilled
} from "@ant-design/icons";
import {getCurrentPlayItem, getFromStore, getObjData, setToStore,} from "../util";
import {deleteRecording, recordUserClickData, updateRecording} from "../services/recordService";
import {getUserId} from "../services/userService";
import {matchNode} from "../util/invokeNode";
import {CONFIG} from "../config";
import {off, on, trigger} from "../util/events";
import {translate} from "../util/translation";
import {removeToolTip} from "../util/addToolTip";
import {getClickedNodeLabel} from "../util/getClickedNodeLabel";
import {getVoteRecord, vote} from "../services/userVote";
import {addNotification} from "../util/addNotification";


interface MProps {
  data?: any;
  config?: any;
  refetchSearch?: Function;
  recordSequenceDetailsVisibility?: boolean;
  cancelHandler?: Function;
  playHandler?: Function;
  isPlaying?: string;
  showLoader?: Function;
  searchKeyword?: string;
}

/**
 * To render record sequence details
 * @returns HTML Element
 */

export const RecordSequenceDetails = (props: MProps) => {
  const [advBtnShow, setAdvBtnShow] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<any>({});
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

  useEffect(()=>{
    if(props.data){
      setSelectedRecordingDetails(props.data);
      setTmpPermissionsObj(props.data.additionalParams);
    }
  },[props.data])


  /**
   * Record player(auto play)
   */
  const autoPlay = async (data = null) => {
    if (getFromStore(CONFIG.RECORDING_IS_PLAYING, true) !== "on") {
      return;
    }
    const playItem = getCurrentPlayItem();
    if (playItem.node) {
      if(matchNode(playItem)) {
        updateStatus(playItem.index);
      } else {
        recordUserClickData('playBackError', '', selectedRecordingDetails.id);
        pause();
        removeToolTip();
        trigger("openPanel", {action: 'openPanel'});
      }
    } else {
      recordUserClickData('playCompleted', '', selectedRecordingDetails.id);
      pause();
      removeToolTip();
      if(!props?.config?.enableHidePanelAfterCompletion) {
        trigger("openPanel", {action: 'openPanel'});
      } else {
        addNotification(translate('autoplayCompletedTitle'), translate('autoplayCompleted'), 'success');
        backNav(true, false);
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
  const backNav = async (forceRefresh = false, openPanel = true) => {
    recordUserClickData('backToSearchResults', '', selectedRecordingDetails.id);
    if(openPanel) {
      trigger("openPanel", {action: 'openPanel'});
    }
    resetStatus();
    removeToolTip();
    if (props.cancelHandler) props.cancelHandler(forceRefresh);
  };

  /**
   * Auto play button handler
   */
  const play = async () => {
    recordUserClickData('play', '', selectedRecordingDetails.id);
    trigger("closePanel", {action: 'closePanel'});
    if (props.playHandler) props.playHandler("on");
    // autoPlay();
  };

  /**
   * Pause the autoplay
   */
  const pause = async () => {
    if (props.playHandler){
      props.playHandler("off");
    }
  };

  const playNode = (item, index) => {
    if (matchNode({node: item, index, selectedRecordingDetails})) {
      updateStatus(index);
    }
  }

  const removeRecording = async () => {
    recordUserClickData('delete', '', selectedRecordingDetails.id);
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
      recordUserClickData('upVote', '', selectedRecordingDetails.id);
    } else {
      setUserVote({upvote: 0, downvote: 1});
      recordUserClickData('downVote', '', selectedRecordingDetails.id);
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

  const displayKeyValue = (key: string, value: any) => {
    return <span>{key} {value}</span>
  };

  const copy = async () => {
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
    recordUserClickData('shareLink', '', selectedRecordingDetails.id);
  }

  /**
   * Toggles the advanced mode.
   *
   * @return {Promise<void>} A promise that resolves when the advanced mode is toggled.
   */
  const toggleAdvanced = async () => {
    if(advBtnShow) {
      props.showLoader(true);
      await updateRecording({id: selectedRecordingDetails.id, additionalParams: tmpPermissionsObj});
      selectedRecordingDetails.additionalParams = tmpPermissionsObj;
      setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
      await setAdvBtnShow(!advBtnShow);
      props.showLoader(false);
    } else {
      await setAdvBtnShow(!advBtnShow);
    }
  };

  const [tmpPermissionsObj, setTmpPermissionsObj] = useState<any>({});

  /**
   * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
   *
   * @param {any} obj - The object parameter used in the function.
   * @return {Promise<void>} A promise that resolves to nothing.
   */
  const handlePermissions = (obj: any) => async () => {
    let permissions = {...tmpPermissionsObj};
    if (permissions[obj.key]) {
      delete permissions[obj.key];
    } else {
      permissions[obj.key] = obj[obj.key];
    }
    await setTmpPermissionsObj({...permissions});
  };

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
                    onClick={async () => {
                      await play();
                    }}
                />
            )}
            {props?.isPlaying == "on" && (
                <PauseCircleOutlined
                    className="large secondary uda_exclude"
                    onClick={async () => {
                      recordUserClickData('stopPlay', '', selectedRecordingDetails.id);
                      pause();
                    }}
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
                {/*<br/>
                <Badge
                    className="site-badge-count-109"
                    count={selectedRecordingDetails.upVoteCount}
                    style={{ backgroundColor: '#52c41a' }}
                />*/}
              </Button>
              <Button onClick={() => manageVote("down")} className="uda_exclude">
                {(userVote && userVote?.downvote === 1) &&
                    <DislikeFilled width={33} className="secondary"/>
                }
                {((userVote && userVote?.downvote === 0) || (!userVote)) &&
                    <DislikeOutlined width={33} className="secondary"/>
                }
                {/*<br/>
                <Badge
                    className="site-badge-count-109"
                    count={selectedRecordingDetails.downVoteCount}
                    style={{ backgroundColor: '#faad14' }}
                />*/}
              </Button>
            </Col>
            <Col span={8}>
              <Button onClick={copy}>
                {!copied && <><ShareAltOutlined /> Share link</>} : {copied && <> <CopyFilled /> Copied!</>}
              </Button>
            </Col>
            <Col span={8}>
              {(selectedRecordingDetails.usersessionid === userId) &&
                  <Popconfirm title={translate('deleteRecording')} onConfirm={removeRecording} className="uda_exclude">
                      <Button className="uda_exclude">
                          <DeleteOutlined width={33} className="secondary uda_exclude"/>
                      </Button>
                  </Popconfirm>
              }
            </Col>
          </Row>
          {/* enabling update permissions*/}
          {(props?.config?.enablePermissions && (selectedRecordingDetails.usersessionid === userId)) && (
              <div id="uda-permissions-section" style={{padding: "25px", display:'flex'}}>
                <div>
                    <button
                        className="add-btn uda_exclude"
                        style={{color:'white'}}
                        onClick={() => toggleAdvanced()}
                    >
                        {advBtnShow ? 'Update Permissions' : 'Edit Permissions'}
                    </button>
                </div>
                <div>

                    { advBtnShow && Object.entries(props?.config?.permissions).map(([key, value]) => {
                        if(tmpPermissionsObj[key] !== undefined) {
                          return <div key={key} style={{marginLeft: 30}}>
                            <Checkbox id="uda-recorded-name" className="uda_exclude" checked={true}
                                      onChange={handlePermissions({[key]: value, key})}
                            />
                            {displayKeyValue(key, value)}
                          </div>
                        } else {
                          return <div key={key} style={{marginLeft: 30}}>
                            <Checkbox id="uda-recorded-name" className="uda_exclude"
                                      onChange={handlePermissions({[key]: value, key})}
                            />
                            {displayKeyValue(key, value)}
                          </div>
                        }
                    })
                    }
                </div>
              </div>
          )}
        </div>
      </>
  ) : null;
};
