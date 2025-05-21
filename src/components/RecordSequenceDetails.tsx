/**
 * Author: Yureswar Ravuri
 * Type: Component
 * Objective: To render miscellaneous components
 * Associated Route/Usage: *
 */

import React, {useEffect, useRef, useState} from "react";
import {Button, Checkbox, Col, Form, List, Popconfirm, Row, Select} from "antd";
import {
  CopyFilled,
  DeleteOutlined,
  DislikeFilled,
  DislikeOutlined,
  EditOutlined, InfoCircleOutlined,
  LeftOutlined,
  LikeFilled,
  LikeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import {getCurrentPlayItem, getFromStore, getObjData, setToStore,} from "../util";
import {
  deleteRecording,
  fetchStatuses,
  profanityCheck,
  recordUserClickData, updateRecordClicks,
  updateRecording, updateSequnceIndex
} from "../services/recordService";
import {getUserId} from "../services/userService";
import {matchNode} from "../util/invokeNode";
import {CONFIG} from "../config";
import {off, on, trigger} from "../util/events";
import {translate} from "../util/translation";
import {removeToolTip} from "../util/addToolTip";
import {getClickedNodeLabel} from "../util/getClickedNodeLabel";
import {getVoteRecord, vote} from "../services/userVote";
import {addNotification} from "../util/addNotification";
import SelectedElement from "./SelectedElement";
import {isHighlightNode} from "../util/checkNode";
import EditableStepForm from "./EditableStepForm";


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
  const [advBtnShow, setAdvBtnShow] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<any>({});
  const [selectedRecordingDetails, setSelectedRecordingDetails] = React.useState<any>(props.data);
  const [userId, setUserId] = useState<string>(null);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [playStatus, setPlayStatus] = useState<string>("");

  // State for step editing
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(() => {
    // Initialize from localStorage if available
    const savedIndex = localStorage.getItem('UDA_EDITING_STEP_INDEX');
    return savedIndex ? parseInt(savedIndex, 10) : null;
  });
  const [stepEditValue, setStepEditValue] = useState<string>('');
  const [stepProfanityError, setStepProfanityError] = useState<boolean>(false);
  const [stepInputError, setStepInputError] = useState<boolean>(false);
  const [inputError, setInputError] = useState<any>({});
  const [inputAlert, setInputAlert] = useState<any>({});
  const [tooltip, setTooltip] = useState<string>('');
  const [disableTooltipSubmitBtn, setDisableTooltipSubmitBtn] = useState<boolean>(true);

  const [editModeEnabled, setEditModeEnabled] = useState<boolean>(() => {
    // Try to get the saved value from localStorage
    const savedEditMode = localStorage.getItem('UDA_EDIT_MODE_ENABLED');
    // Return true if the saved value is 'true', otherwise return false
    return savedEditMode === 'true';
  });

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

    // Add this new listener for validation playback
    on("UDAValidatePlay", () => {
      recordUserClickData('validatePlayback', '', selectedRecordingDetails.id);
      if (props.playHandler) props.playHandler("on");
      // Set a flag in localStorage to indicate we're in validation mode
      localStorage.setItem('UDA_VALIDATION_MODE', 'true');
      autoPlay();
    });

    return () => {
      off("UDAPlayNext", autoPlay);
      off("ContinuePlay", autoPlay);
      off("BackToSearchResults", backNav);
      off("PausePlay", pause);
      off("UDAValidatePlay", () => {});
    };
  }, []);

  /**
   * Fetches available status options from the API
   * Manages loading state during the fetch operation
   * Updates the local state with fetched status options
   * @returns {Promise<void>}
   */
  const fetchStatusOptions = async () => {
    props.showLoader(true);    // Show loading indicator before fetch
    const response = await fetchStatuses();    // Get statuses from API
    setStatusOptions(response);    // Update local state with fetched options
    props.showLoader(false);    // Hide loading indicator after completion
  };


  useEffect(()=>{
    if(props.data){
      setSelectedRecordingDetails(props.data);
      setTmpPermissionsObj(props.data.additionalParams);
      if(props.config.enableStatusSelection && (props.data.usersessionid === userId)){
        fetchStatusOptions();
      }
    }
  },[props.data, userId]);

  useEffect(() => {
    if(setSelectedRecordingDetails){
      checkStatus();
    }
  }, [selectedRecordingDetails]);

  /**
   * Effect hook to fetch status options when component mounts
   * Only fetches if:
   * 1. Status selection is enabled in config
   * 2. Current user session matches the userId
   *
   * @dependency props.config.enableStatusSelection - Triggers fetch when status selection setting changes
   */
  useEffect(() => {
    if(props?.config?.enableStatusSelection && (props.data.usersessionid === userId)){
      fetchStatusOptions();
    }
  }, [props.config.enableStatusSelection]);

  /**
   * Record player(auto play)
   */
  const autoPlay = async (data = null) => {
    if (getFromStore(CONFIG.RECORDING_IS_PLAYING, true) !== "on") {
      return;
    }
    const playItem = getCurrentPlayItem();
    if (playItem.node) {
      if(await matchNode(playItem)) {
        updateStatus(playItem.index);
      } else {
        recordUserClickData('playBackError', '', selectedRecordingDetails.id);
        pause();
        removeToolTip();
        trigger("openPanel", {action: 'openPanel'});

        // If we're in validation mode, clear the flag and show an error
        if (localStorage.getItem('UDA_VALIDATION_MODE') === 'true') {
          // localStorage.removeItem('UDA_VALIDATION_MODE');
          addNotification(
              translate('validationFailed'),
              translate('validationFailedDescription'),
              'error'
          );
        }
      }
    } else {
      recordUserClickData('playCompleted', '', selectedRecordingDetails.id);
      pause();
      removeToolTip();

      // Check if we're in validation mode
      const isValidationMode = localStorage.getItem('UDA_VALIDATION_MODE') === 'true';

      // Clear the validation mode flag
      // localStorage.removeItem('UDA_VALIDATION_MODE');

      // Show appropriate notification
      if (isValidationMode) {
        addNotification(
            translate('validationCompleted'),
            translate('validationCompletedDescription'),
            'success'
        );
        setPlayStatus('completed');
        props.playHandler("off");

        // Dispatch the UDAPlayCompleted event
        const playCompletedEvent = new CustomEvent('UDAValidationCompleted', {
          detail: { recordingId: selectedRecordingDetails.id }
        });
        window.dispatchEvent(playCompletedEvent);

        trigger("openPanel", {action: 'openPanel'});
      } else {
        addNotification(
            translate('autoplayCompletedTitle'),
            translate('autoplayCompleted'),
            'success'
        );

        setPlayStatus('completed');
        props.playHandler("off");

        // Dispatch the UDAPlayCompleted event
        const playCompletedEvent = new CustomEvent('UDAPlayCompleted', {
          detail: { recordingId: selectedRecordingDetails.id }
        });
        window.dispatchEvent(playCompletedEvent);

        if(!props?.config?.enableHidePanelAfterCompletion) {
          trigger("openPanel", {action: 'openPanel'});
        } else {
          backNav(true, false);
        }
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
    for (let i = 0; i < selectedRecordingDetails?.userclicknodesSet?.length; i++) {
      delete selectedRecordingDetails.userclicknodesSet[i].status;
    }
    setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
    setSelectedRecordingDetails({...selectedRecordingDetails});
    setUserVote({upvote: 0, downvote: 0});
    return true;
  };

  /**
   * check node status(to completed) by index
   * @param index
   */
  const checkStatus = () => {
    let count = 0;
    for (let i = 0; i < selectedRecordingDetails?.userclicknodesSet?.length; i++) {
      if (selectedRecordingDetails.userclicknodesSet[i].status === "completed") {
        count++;
      }
    }
    if(count === selectedRecordingDetails?.userclicknodesSet?.length) {
      setPlayStatus('completed');

      // Dispatch an event to notify that playback is completed
      // This will be used by EditableStepForm to enable the save button
      const playCompletedEvent = new CustomEvent('UDAPlayCompleted', {
        detail: { recordingId: selectedRecordingDetails.id }
      });
      window.dispatchEvent(playCompletedEvent);
    }
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
        // name = names[0] ? names[0] : 'NA';
        if (typeof names[0] === 'object' && 'label' in names[0]) {
          name = names[0].label;
        } else {
          name = names[0] ? names[0] : 'NA';
        }
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

  const playNode = async (item, index) => {
    if (await matchNode({node: item, index, additionalParams: selectedRecordingDetails?.additionalParams})) {
      updateStatus(index);
    }
  }

  /**
   * Replay the recording
   */
  const replay = async () => {
    recordUserClickData('replay', '', selectedRecordingDetails.id);
    setPlayStatus('playing');
    if(resetStatus()) {
      trigger("closePanel", {action: 'closePanel'});
      if (props.playHandler) props.playHandler("on");
      autoPlay();
    }
  };

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


  /**
   * Toggles the publish/unpublish state of a recording and updates it in the store
   * This async function handles the permission changes and persists them
   * @returns {Promise<void>}
   */
  const updateStatusChange = async (newStatus: number) => {
    // Show loading state while operation is in progress
    props.showLoader(true);

    // Create a copy of permissions object to avoid direct mutation
    let permissions = {...tmpPermissionsObj};

    // Toggle published state if it exists, otherwise set it to false
    if(permissions.hasOwnProperty('status')) {
      permissions.status = newStatus;
    } else {
      permissions.status = 1;
    }

    // Update the temporary permissions state
    setTmpPermissionsObj({...permissions});

    // Persist the changes to the recording
    await updateRecording({id: selectedRecordingDetails.id, additionalParams: permissions});

    // Update the recording details with new permissions
    selectedRecordingDetails.additionalParams = permissions;

    // Save updated recording details to store
    setToStore(selectedRecordingDetails, CONFIG.SELECTED_RECORDING, false);

    // Hide loader after operation is complete
    props.showLoader(false);
  };

  // Editing labels functionality
  const [isEditingLabels, setIsEditingLabels] = useState(false);
  const [labels, setLabels] = useState<Array<{label: string, profanity: boolean}>>([]);

  // Function to get all labels from props.data.name
  const getAllLabels = () => {
    try {
      // Parse the name from props
      const names = JSON.parse(props?.data?.name || '[]');
      // Ensure it's an array and each item has the expected structure
      return Array.isArray(names)
          ? names.map(item => {
            // If item is already in the correct format, return it
            if (typeof item === 'object' && 'label' in item) {
              return item;
            }
            // If item is just a string, convert to the expected format
            return { label: String(item), profanity: false };
          })
          : [];
    } catch (e) {
      console.error("Error parsing labels:", e);
      return [];
    }
  };

  // Initialize labels when starting to edit
  const startEditing = () => {
    const currentLabels = getAllLabels();
    console.log("Current labels:", currentLabels); // For debugging
    setLabels(currentLabels);
    setIsEditingLabels(true);
  };

  const onExtraLabelChange = async (index: number, value: string) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = { ...updatedLabels[index], label: value };
    setLabels(updatedLabels);
  };

  const setInputAt = async (key: string) => {
    setInputError({ ...inputError, [key]: { error: false } });
  };

  const checkLabelProfanity = async (index: number, value: string) => {
    // Implement profanity check similar to RecordedData.tsx
    // This is a placeholder - implement actual profanity check logic
    const hasProfanity = false; // Replace with actual check

    const updatedLabels = [...labels];
    updatedLabels[index] = { ...updatedLabels[index], profanity: hasProfanity };
    setLabels(updatedLabels);
  };

  const addLabel = () => {
    setLabels([...labels, { label: '', profanity: false }]);
  };

  const removeLabel = (index: number) => {
    const updatedLabels = [...labels];
    updatedLabels.splice(index, 1);
    setLabels(updatedLabels);
  };

  const saveLabels = async () => {
    // Convert labels array to the format expected by the API
    let convertedLabels = [];
    labels.map((item) => {convertedLabels.push(item.label)});

    // Create updated data object with new labels
    const updatedData = { ...props.data, name: JSON.stringify(convertedLabels)};

    // Show loader while updating
    props.showLoader(true);

    try {
      // Update the recording in the backend
      await updateRecording(updatedData);

      // Update local state with the updated data
      setSelectedRecordingDetails(updatedData);

      // Update the data in local storage
      setToStore(updatedData, CONFIG.SELECTED_RECORDING, false);

      // Exit editing mode
      setIsEditingLabels(false);

      // Show success notification
      addNotification(translate('labelsUpdated'), translate('labelsUpdatedDescription'), 'success');
    } catch (error) {
      console.error("Error updating labels:", error);
      addNotification(translate('labelsUpdateError'), translate('labelsUpdateErrorDescription'), 'error');
    } finally {
      props.showLoader(false);
    }
  };

  // Handle start step editing index number
  const startEditingStep = (index: number) => {
    setEditingStepIndex(index);
    // Save to localStorage
    localStorage.setItem('UDA_EDITING_STEP_INDEX', index.toString());
  };

// Handle cancels editing step index number
  const cancelEditingStep = () => {
    setEditingStepIndex(null);
    // Clear from localStorage
    localStorage.removeItem('UDA_EDITING_STEP_INDEX');
    // Also clear any temporary edit data
    localStorage.removeItem('tempEditedRecordData');
  };

  // Add a toggle function
  const toggleEditMode = () => {
    // If we're exiting edit mode, make sure to cancel any active editing
    if (editModeEnabled && editingStepIndex !== null) {
      cancelEditingStep();
    }
    if (editModeEnabled && isEditingLabels) {
      setIsEditingLabels(false);
    }

    // Toggle the state
    const newEditModeValue = !editModeEnabled;

    // Update localStorage with the new value
    localStorage.setItem('UDA_EDIT_MODE_ENABLED', newEditModeValue.toString());

    // Update the state
    setEditModeEnabled(newEditModeValue);

    // Record the action
    recordUserClickData('toggleEditMode', '', selectedRecordingDetails.id);
  };

  useEffect(() => {
    // Return a cleanup function
    return () => {
      // If edit mode is enabled when component unmounts, disable it
      if (editModeEnabled) {
        // This ensures we don't leave edit mode enabled when navigating away
        // localStorage.setItem('UDA_EDIT_MODE_ENABLED', 'false');
      }
    };
  }, [editModeEnabled]);

  // Add this effect to validate edit mode when userId or selectedRecordingDetails change
  useEffect(() => {
    // If edit mode is enabled but this isn't the user's recording, disable it
    if (editModeEnabled &&
        selectedRecordingDetails &&
        userId &&
        selectedRecordingDetails.usersessionid !== userId) {
      setEditModeEnabled(false);
      localStorage.setItem('UDA_EDIT_MODE_ENABLED', 'false');
    }
  }, [userId, selectedRecordingDetails, editModeEnabled]);


  return props?.recordSequenceDetailsVisibility ? (
      <>
        <div
            className={`uda-card-details ${editModeEnabled ? 'edit-mode-active' : ''}`}
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
            {(props?.isPlaying == "off" && playStatus !== "completed") && (
                <PlayCircleOutlined
                    className="large secondary uda_exclude"
                    onClick={async () => {
                      await play();
                    }}
                />
            )}
            {(props?.isPlaying == "on" && playStatus !== "completed") && (
                <PauseCircleOutlined
                    className="large secondary uda_exclude"
                    onClick={async () => {
                      recordUserClickData('stopPlay', '', selectedRecordingDetails.id);
                      pause();
                    }}
                />
            )}
            {playStatus == "completed" && (
                <ReloadOutlined
                    className="large secondary uda_exclude"
                    onClick={async () => {
                      recordUserClickData('restartPlay', '', selectedRecordingDetails.id);
                      replay();
                    }}
                />
            )}
          </div>
          {/*<h5>{getName()}</h5>*/}
          <Row style={{ marginBottom: '10px' }}>
            <Col span={24} style={{ textAlign: 'right' }}>
              {(props?.config?.enableEditingOfRecordings && (selectedRecordingDetails.usersessionid === userId)) && (
                  <Button
                      type={editModeEnabled ? "primary" : "default"}
                      icon={<EditOutlined />}
                      onClick={toggleEditMode}
                      className="uda_exclude"
                  >
                    {editModeEnabled ? "Exit Editing" : "Edit Recording"}
                  </Button>
              )}
            </Col>
          </Row>
          <div className="sequence-name-container">
            {isEditingLabels ? (
                <div>
                  <div id="uda-sequence-names">
                    {labels.map((item, index) => (
                        <div key={`label-${index}`}>
                          <div className="flex-card flex-center">
                            <input
                                type="text"
                                id="uda-recorded-name"
                                name="uda-save-recorded[]"
                                className={`uda-form-input uda-form-input-reduced uda_exclude ${
                                    item.profanity ? "profanity" : ""
                                }`}
                                placeholder="Enter Label"
                                onChange={async (e) => {
                                  await onExtraLabelChange(index, e.target.value);
                                  await setInputAt('label' + index);
                                }}
                                onBlur={async (e) => {
                                  await checkLabelProfanity(index, e.target.value);
                                }}
                                value={item.label}
                            />
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                className="delete-btn uda-remove-row uda_exclude"
                                onClick={() => removeLabel(index)}
                            />
                          </div>
                          <div className="flex-card flex-center">
                            {item.profanity && (
                                <span className="uda-alert">{translate('profanityDetected')}<br/></span>
                            )}
                            {(inputError['label' + index] && inputError['label' + index].error) && (
                                <span className="uda-alert">{translate('inputError')}</span>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>

                  <div className="add_lebel_btn_wrap">
                    <Button className="add-btn uda_exclude" onClick={() => addLabel()}>
                      + {translate('addLabel')}
                    </Button>
                  </div>

                  <div className="action-buttons">
                    <Button
                        type="primary"
                        className="uda_exclude"
                        onClick={saveLabels}
                    >
                      Save
                    </Button>
                    <Button
                        className="uda_exclude"
                        onClick={() => {
                          setIsEditingLabels(false);
                        }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
            ) : (
                <div className="flex-card flex-center">
                  <h5>{getName()}</h5>
                  {(props?.config?.enableEditingOfRecordings &&
                      (selectedRecordingDetails.usersessionid === userId) &&
                      editModeEnabled) && (
                      <Button
                          type="text"
                          icon={<EditOutlined />}
                          className="edit-btn uda_exclude"
                          onClick={startEditing}
                      />
                  )}
                </div>
            )}
          </div>

          <hr/>
          <ul className="uda-suggestion-list" id="uda-sequence-steps">
            {props?.data && (
                <List
                    itemLayout="horizontal"
                    dataSource={selectedRecordingDetails?.userclicknodesSet}
                    renderItem={(item: any, index: number) => {
                      const objectData = getObjData(item.objectdata);
                      let nodeData = getObjData(item.objectdata);
                      let skipItem = false;
                      if (nodeData.meta.hasOwnProperty('skipDuringPlay') && nodeData.meta.skipDuringPlay && !editModeEnabled) {
                        skipItem = true;
                      }
                      if(skipItem) {
                        return <></>;
                      }
                      return (
                          <li
                              className={addSkipClass(item)}
                              onClick={() => editingStepIndex !== index && playNode(item, index)}
                          >
                            {editingStepIndex === index ? (
                                <div className="step-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                  <EditableStepForm
                                      item={item}
                                      index={index}
                                      recordData={selectedRecordingDetails.userclicknodesSet}
                                      config={props.config}
                                      isUpdateMode={true}
                                      storeRecording={(data) => {
                                        const updatedRecordingDetails = { ...selectedRecordingDetails };
                                        updatedRecordingDetails.userclicknodesSet = data;
                                        setSelectedRecordingDetails(updatedRecordingDetails);
                                        setToStore(updatedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
                                      }}
                                      onSave={async () => {
                                        // Save to API
                                        props.showLoader(true);
                                        try {
                                          await updateRecording(selectedRecordingDetails);

                                          // Record this action
                                          recordUserClickData('editStep', '', selectedRecordingDetails.id);

                                          // Show success notification
                                          addNotification(translate('stepUpdated'), translate('stepUpdatedDescription'), 'success');

                                          // Exit edit mode and clear localStorage
                                          cancelEditingStep();
                                        } catch (error) {
                                          console.error("Error updating step:", error);
                                          addNotification(translate('stepUpdateError'), translate('stepUpdateErrorDescription'), 'error');
                                        } finally {
                                          props.showLoader(false);
                                        }
                                      }}
                                      onCancel={() => cancelEditingStep()}
                                      showLoader={props.showLoader}
                                      recordingId={selectedRecordingDetails.id}
                                  />
                                </div>
                            ) : (
                                <>
                                  <i>{getClickedNodeLabel(item)}</i>
                                  {(props?.config?.enableEditingOfRecordings && (selectedRecordingDetails.usersessionid === userId) && editModeEnabled) && (
                                      <Button
                                          type="text"
                                          icon={<EditOutlined />}
                                          className="edit-btn uda_exclude"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingStep(index);
                                          }}
                                      />
                                  )}
                                </>
                            )}
                          </li>
                      );
                    }}
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
                  <>
                    <Popconfirm title={translate('deleteRecording')} onConfirm={removeRecording} className="uda_exclude">
                      <Button className="uda_exclude">
                        <DeleteOutlined width={33} className="secondary uda_exclude"/>
                      </Button>
                    </Popconfirm>
                  </>
              }
            </Col>
          </Row>
          {/* Row container for publish/unpublish controls */}
          {(props?.config?.enableStatusSelection) &&
              <Row>
                {/* Left column taking up 8/24 of the row width */}
                <Col span={24}>
                  {/* Only show publish controls if the current user owns this recording */}
                  {(selectedRecordingDetails.usersessionid === userId) &&
                      <>
                        <Form.Item labelCol={{ span: 8 }}
                                   label={translate('statusLabel')}
                                   className="uda_exclude"
                                   style={{ marginBottom: 0 }}
                        >
                          <Select
                              defaultValue={(tmpPermissionsObj && tmpPermissionsObj.hasOwnProperty('status'))?parseInt(tmpPermissionsObj.status) : 6}
                              onChange={updateStatusChange}
                              className="uda_exclude"
                          >
                            {statusOptions.map((status: any) => (
                                <Select.Option key={status.id} value={status.id}>
                                  {status.name.toUpperCase()}
                                </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </>
                  }
                </Col>
              </Row>
          }
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
                    if(tmpPermissionsObj && typeof tmpPermissionsObj[key] !== "undefined") {
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
