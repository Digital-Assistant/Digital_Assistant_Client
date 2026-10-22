import { TitleBar } from "./TitleBar";
import { PlayerControls } from "./PlayerControls";
import { FeedbackButtons } from "./FeedbackButtons";
import { StepsList, StepData } from "./StepsList";
import { StepForm } from "./StepForm";
import { PermissionsPanel } from "./PermissionsPanel";
import { Step } from "./Step";
import { FinalSaveScreen } from "./FinalSaveScreen";
import { useState, useEffect, useRef } from "react";
import {
  deleteRecording,
  vote,
  startStepEditing,
  cancelStepEditing,
  startValidation,
  markValidationCompleted,
  addNotificationAction,
  StorageUtil,
  recordUserClickData,
  matchNode,
  getCurrentPlayItem,
  updateRecording as updateRecordingService,
  updateRecordClicks,
  updateSequnceIndex as updateSequenceIndexService,
  getObjData,
  getVoteRecord,
  fetchStatuses,
  getClickedNodeLabel,
  isHighlightNode,
  saveStepChanges,
  validateStepNameWithProfanity,
  setSelectedRecordingDetails as setReduxSelectedRecordingDetails,
  CONFIG
} from "@udan/digital-assistant-sdk";
import { getUserId } from "@udan/digital-assistant-sdk";
import { off, on, trigger } from "../util/events";
import { translate } from "../util/translation";
import { generateShareUrl } from "../util";
import { removeToolTip } from "../util/addToolTip";
import { addNotification } from "../util/addNotification";
import {
  coreSDK as DigitalAssistantCoreSDK,
} from "../services/coreSDK";
import { UDAConsoleLogger } from "@udan/digital-assistant-sdk";

// Fix for circular structure error in Core package's matchNode/searchNodes
// The Core implementation uses JSON.stringify for logging, which fails on DOM elements
UDAConsoleLogger.info = (mes: any, level: number = 0) => {
  // Use console.log directly which handles circular references in browser devtools
  // or suppress if needed. Using console.log mimics the safe local behavior.
  if (process.env.NODE_ENV === 'development') {
    console.log(mes);
  }
};

interface RecordingDetailProps {
  title?: string;
  onBack?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  data?: any;
  showLoader?: Function;
  config?: any;
  playHandler?: Function;
  isPlaying?: string;
  cancelHandler?: Function;
  refetchSearch?: Function;
  visible?: boolean;
}

export function RecordingDetail(props: RecordingDetailProps) {
  const { title, onBack, onShare, onDelete, data, showLoader, config, playHandler, isPlaying, cancelHandler, refetchSearch, visible } = props;

  // ... (rest of code) ...

  if (!props.data) return null;
  if (props.visible === false) return null;
  const [selectedRecordingDetails, setSelectedRecordingDetails] = useState<any>(data);
  const [userId, setUserId] = useState<string | null>(null);
  const [playStatus, setPlayStatus] = useState<string>("");
  const [userVote, setUserVote] = useState<any>({ upvote: 0, downvote: 0 });

  // Missing Feature State
  const [isEditingLabels, setIsEditingLabels] = useState(false);
  const [labels, setLabels] = useState<Array<{ label: string, profanity?: boolean }>>([]);
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState<any>({});
  const [inputAlert, setInputAlert] = useState<any>({});
  const [inputAt, setInputAt] = useState("");
  const [checkingProfanity, setCheckingProfanity] = useState(false);
  const [slowPlayback, setSlowPlayback] = useState(false);
  const [delayPlaybackTime, setDelayPlaybackTime] = useState(1);
  const [savingError, setSavingError] = useState(false);
  const [disableForm, setDisableForm] = useState(false);
  const [advBtnShow, setAdvBtnShow] = useState(false);
  const [tmpPermissionsObj, setTmpPermissionsObj] = useState<any>({});
  const [statusOptions, setStatusOptions] = useState<any[]>([]);

  // SDK State
  const [sdkState, setSdkState] = useState(DigitalAssistantCoreSDK.getState());
  const [editRecording, setEditRecording] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [steps, setSteps] = useState<StepData[]>([]);

  // Initialize data and user
  useEffect(() => {
    (async () => {
      setUserId(await getUserId());
      if (selectedRecordingDetails) {
        let userRecord = await getVoteRecord({ id: selectedRecordingDetails.id });
        if (userRecord) setUserVote(userRecord);
        checkStatus();
      }
    })();

    // Reflect playing state in UI if RECORDING_IS_PLAYING was set for this specific recording
    const storedPlayStatus = StorageUtil.getFromStore(CONFIG.RECORDING_IS_PLAYING, true);
    const storedRecording = StorageUtil.getFromStore(CONFIG.SELECTED_RECORDING, false);
    if (storedPlayStatus === "on" && storedRecording?.id === data?.id) {
      setPlayStatus('playing');
    }
  }, []);

  useEffect(() => {
    if (data && data.id !== selectedRecordingDetails?.id) {
      setSelectedRecordingDetails(data);
    }
  }, [data, selectedRecordingDetails?.id]);

  // SDK Subscription
  useEffect(() => {
    const unsubscribe = DigitalAssistantCoreSDK.subscribe((newState) => {
      setSdkState(newState);
    });
    return unsubscribe;
  }, []);

  const editableStepFormState = sdkState.editableStepForm;
  const editingWorkflow = editableStepFormState?.editingWorkflow;

  useEffect(() => {
    if (editingWorkflow?.isEditing && editableStepFormState?.currentEditingIndex != null) {
      setEditRecording(true);
      setEditingStepIndex(editableStepFormState.currentEditingIndex);
    } else if (!editingWorkflow?.isEditing) {
      setEditingStepIndex(null);
    }
  }, [editingWorkflow?.isEditing, editableStepFormState?.currentEditingIndex]);

  // Sync selectedRecordingDetails from SDK Redux store (Source of Truth during Playback)
  useEffect(() => {
    if (
      sdkState.recording?.selectedRecordingDetails &&
      sdkState.recording.selectedRecordingDetails.id === data?.id
    ) {
      setSelectedRecordingDetails(sdkState.recording.selectedRecordingDetails);
    }
  }, [sdkState.recording?.selectedRecordingDetails]);

  // No longer needed: initialization is handled by PlaybackService in SDK

  useEffect(() => {
    const handleBackNavEvent = () => backNav();
    const handlePauseEvent = () => setPlayStatus('paused');
    const handlePlayStartedEvent = () => setPlayStatus('playing');
    const handlePlayCompletedEvent = () => {
      setPlayStatus('completed');
      // If enableHidePanelAfterCompletion is true, navigate back without opening the panel
      if (config?.enableHidePanelAfterCompletion) {
        backNav(false, false);
      } else {
        trigger("openPanel", { action: 'openPanel' });
      }
    };

    on("BackToSearchResults", handleBackNavEvent);
    on("PausePlay", handlePauseEvent);
    on("ContinuePlay", handlePlayStartedEvent);
    on("UDAPlaybackCompleted", handlePlayCompletedEvent);

    return () => {
      off("BackToSearchResults", handleBackNavEvent);
      off("PausePlay", handlePauseEvent);
      off("ContinuePlay", handlePlayStartedEvent);
      off("UDAPlaybackCompleted", handlePlayCompletedEvent);
    };
  }, []);

  // Update steps when data changes
  useEffect(() => {
    console.log("RecordingDetail: Updating steps based on selectedRecordingDetails",
      selectedRecordingDetails.userclicknodesSet.map((n: any) => n.status));
    const newSteps = selectedRecordingDetails.userclicknodesSet.map((node: any) => {
      const objData = getObjData(node.objectdata);
      const meta = objData?.meta ?? {};
      return {
        title: getClickedNodeLabel(node) || meta.label || node.label || "Step",
        delay: meta.slowPlaybackTime,
        type: isHighlightNode(objData) ? "Highlight" : "Link",
        tooltip: meta.tooltipInfo,
        completed: node.status === "completed",
        failed: false,
      };
    });
    setSteps(newSteps);
    checkStatus();
  }, [selectedRecordingDetails]);

  // -- LOGIC HELPER FUNCTIONS --

  const checkStatus = () => {
    let count = 0;
    if (selectedRecordingDetails?.userclicknodesSet) {
      for (let i = 0; i < selectedRecordingDetails.userclicknodesSet.length; i++) {
        if (selectedRecordingDetails.userclicknodesSet[i].status === "completed") {
          count++;
        }
      }
      if (count === selectedRecordingDetails.userclicknodesSet.length) {
        setPlayStatus('completed');
      }
    }
  };

  const updateStatus = async (index: number) => {
    const updatedNodes = selectedRecordingDetails.userclicknodesSet.map((node: any, i: number) => {
      if (i === index) {
        return { ...node, status: "completed" };
      }
      return node;
    });

    const updatedDetails = {
      ...selectedRecordingDetails,
      userclicknodesSet: updatedNodes
    };

    StorageUtil.setToStore(updatedDetails, CONFIG.SELECTED_RECORDING, false);
    setSelectedRecordingDetails(updatedDetails);
  };

  const resetStatus = () => {
    if (!selectedRecordingDetails?.userclicknodesSet) return true;

    const updatedNodes = selectedRecordingDetails.userclicknodesSet.map((node: any) => {
      if (node.status) {
        // Use destructuring to create a new object without 'status'
        // This is safer than 'delete' when working with potentially frozen objects
        const { status, ...nodeWithoutStatus } = node;
        return nodeWithoutStatus;
      }
      return node;
    });

    const updatedRecordingDetails = {
      ...selectedRecordingDetails,
      userclicknodesSet: updatedNodes
    };

    StorageUtil.setToStore(updatedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
    setSelectedRecordingDetails(updatedRecordingDetails);

    if (playStatus !== 'playing') {
      setUserVote({ upvote: 0, downvote: 0 });
    }
    return true;
  };



  // -- HANDLERS --

  const backNav = async (forceRefresh = false, openPanel = true) => {
    recordUserClickData('backToSearchResults', '', selectedRecordingDetails?.id);
    if (openPanel) {
      trigger("openPanel", { action: 'openPanel' });
    }
    StorageUtil.setToStore("off", CONFIG.RECORDING_IS_PLAYING, true);
    // Clear Redux store so next RecordingDetail mount doesn't inherit completed state
    DigitalAssistantCoreSDK.dispatch(setReduxSelectedRecordingDetails(null));
    resetStatus();
    removeToolTip();
    setEditRecording(false);
    DigitalAssistantCoreSDK.dispatch(cancelStepEditing());
    if (cancelHandler) cancelHandler(forceRefresh);
    if (onBack) onBack();
  };

  const shareUrl = selectedRecordingDetails?.id
    ? generateShareUrl(selectedRecordingDetails.id)
    : window.location.href;

  const handleDeleteClick = async () => {
    if (selectedRecordingDetails?.id) {
      recordUserClickData('delete', '', selectedRecordingDetails.id);
      if (showLoader) showLoader(true);
      await deleteRecording({ id: selectedRecordingDetails.id });
      setTimeout(() => {
        backNav(true);
        if (showLoader) showLoader(false);
        if (refetchSearch) refetchSearch('on'); // refresh list so deleted item disappears
      }, CONFIG.indexInterval);
    }
  };

  // Internal Play Handler to replace missing prop
  const internalPlayHandler = async (status: string) => {
    StorageUtil.setToStore(status, CONFIG.RECORDING_IS_PLAYING, true);
  };

  // Use prop or internal handler
  const handlePlayStatusChange = (status: string) => {
    if (playHandler) {
      playHandler(status);
    } else {
      internalPlayHandler(status);
    }
  };

  const pause = async () => {
    handlePlayStatusChange("off");
    setPlayStatus('paused');
    trigger("PausePlay", { recordingId: selectedRecordingDetails.id });
  };

  const replay = async () => {
    recordUserClickData('replay', '', selectedRecordingDetails.id);
    setPlayStatus('playing');
    if (resetStatus()) {
      trigger("closePanel", { action: 'closePanel' });
      handlePlayStatusChange("on");
      // Trigger SDK orchestration
      trigger("ContinuePlay", { action: 'ContinuePlay' });
    }
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (!selectedRecordingDetails?.id) return;
    let record: any = await vote({ id: selectedRecordingDetails.id }, type);

    const newDetails = { ...selectedRecordingDetails };
    newDetails.upVoteCount = record.upVoteCount;
    newDetails.downVoteCount = record.downVoteCount;
    setSelectedRecordingDetails(newDetails);

    if (type === 'up') {
      setUserVote({ upvote: 1, downvote: 0 });
      recordUserClickData('upVote', '', selectedRecordingDetails.id);
    } else {
      setUserVote({ upvote: 0, downvote: 1 });
      recordUserClickData('downVote', '', selectedRecordingDetails.id);
    }
  };


  const handleTitleChange = (newTitle: string) => {
    console.log("Title changed to:", newTitle);
    // TODO: Implement title update logic (API call) if needed, similar to updateStatusChange or simple update
  };

  // -- EDITING STEPS --

  const storeRecording = async (data: any, enableValidation: boolean = true) => {
    const updatedRecordingDetails = {
      ...selectedRecordingDetails,
      userclicknodesSet: data
    };
    setSelectedRecordingDetails(updatedRecordingDetails);
    StorageUtil.setToStore(updatedRecordingDetails, CONFIG.SELECTED_RECORDING, false);
    if (enableValidation) {
      DigitalAssistantCoreSDK.dispatch(startValidation(selectedRecordingDetails.id));
    }
  };

  // -- EDITING STEPS --

  const handleEditStep = (index: number) => {
    if (selectedRecordingDetails?.userclicknodesSet && index >= 0 && index < selectedRecordingDetails.userclicknodesSet.length) {
      const item = selectedRecordingDetails.userclicknodesSet[index];
      resetStatus();
      setEditingStepIndex(index);
      DigitalAssistantCoreSDK.dispatch(startStepEditing({
        recordingId: selectedRecordingDetails.id,
        index: index,
        stepData: JSON.parse(JSON.stringify(item)) // Deep copy for robust backup
      }));
    }
  };

  const handleValidateStep = (_stepData: any) => {
    if (editingStepIndex !== null && selectedRecordingDetails?.id) {
      resetStatus(); // Clear all step statuses before starting validation playback
      DigitalAssistantCoreSDK.dispatch(startValidation(selectedRecordingDetails.id));
      trigger("closePanel", { action: 'closePanel' });
      handlePlayStatusChange("on");
      // Trigger SDK orchestration
      trigger("ContinuePlay", { action: 'ContinuePlay' });
    }
  };

  const handleSaveEditedStep = async (stepData: {
    title: string;
    delay?: number;
    type?: string;
    tooltip?: string;
    skipDuringPlay?: boolean;
    personalInformation?: boolean;
  }) => {
    if (editingStepIndex !== null && selectedRecordingDetails?.userclicknodesSet) {
      if (showLoader) showLoader(true);
      try {
        const profResult = await validateStepNameWithProfanity(stepData.title, config?.enableProfanity);
        let finalTitle = stepData.title;
        if (profResult.success && profResult.data?.hasProfanity) {
          finalTitle = profResult.data.cleanedValue;
          addNotification("Profanity Detected", "Profanity has been removed from your step name.", "warning");
        }

        const result = await saveStepChanges({
          recordData: selectedRecordingDetails.userclicknodesSet,
          index: editingStepIndex,
          stepEditValue: finalTitle,
          isUpdateMode: true, // This is an update to an existing recording
          tooltipInfo: stepData.tooltip,
          slowPlaybackTime: stepData.delay,
          skipDuringPlay: stepData.skipDuringPlay,
          isPersonal: stepData.personalInformation,
        });

        if (result.success && result.data) {
          const updatedRecording = {
            ...selectedRecordingDetails,
            userclicknodesSet: result.data
          };

          // Synchronize with backend using legacy API sequence
          const editingStep = result.data[editingStepIndex];
          if (editingStep) {
            // Send only essential fields to avoid API failures with large payloads.
            // Ensure both sessionid and usersessionid are passed for API compatibility.
            const modifiedData = {
              id: editingStep.id,
              clickednodename: editingStep.clickednodename,
              objectdata: editingStep.objectdata,
              domain: editingStep.domain,
              urlpath: editingStep.urlpath,
              html5: editingStep.html5,
              clickedpath: editingStep.clickedpath,
            };
            await updateRecordClicks(modifiedData);
            await updateSequenceIndexService(selectedRecordingDetails.id);
          }

          // Send full update to API to ensure backend compatibility
          await updateRecordingService(updatedRecording);

          setSelectedRecordingDetails(updatedRecording);
          StorageUtil.setToStore(updatedRecording, CONFIG.SELECTED_RECORDING, false);

          // Record this action for analytics
          recordUserClickData('editStep', '', selectedRecordingDetails.id);

          if (refetchSearch) refetchSearch("on");
          DigitalAssistantCoreSDK.dispatch(addNotificationAction({
            title: "Step Saved",
            description: "Step changes have been saved successfully.",
            status: "success"
          }));
        }
      } catch (e) {
        console.error('Error saving step:', e);
        addNotification("Error", "Failed to save step changes.", "error");
      } finally {
        if (showLoader) showLoader(false);
      }

      setEditingStepIndex(null);
      DigitalAssistantCoreSDK.dispatch(cancelStepEditing());
    }
  };

  const handleCancelEdit = () => {
    // Revert local data if we have original data
    if (editingWorkflow?.originalStepData && editableStepFormState?.currentEditingIndex !== null) {
      const originalData = [...selectedRecordingDetails.userclicknodesSet];
      originalData[editableStepFormState.currentEditingIndex] = { ...editingWorkflow.originalStepData };
      storeRecording(originalData, false);
    }
    setEditingStepIndex(null);
    DigitalAssistantCoreSDK.dispatch(cancelStepEditing());
  };

  const handlePlayNode = async (index: number) => {
    if (playStatus === 'playing') return;

    const node = selectedRecordingDetails.userclicknodesSet[index];
    if (!node) return;

    const playItem = {
      index,
      node: node,
      selectedRecordingDetails: selectedRecordingDetails
    };

    trigger("closePanel", { action: 'closePanel' });
    if (await matchNode(playItem)) {
      updateStatus(index);
    } else {
      recordUserClickData('playBackError', '', selectedRecordingDetails.id);
      trigger("openPanel", { action: 'openPanel' });
    }
  };

  const handleReport = (issueType: string, description: string) => {
    console.log("Report submitted:", { issueType, description });
    // Add report submission logic
  };

  const getDisplayName = () => {
    if (!selectedRecordingDetails?.name) return title || "Recording";
    try {
      let names = JSON.parse(selectedRecordingDetails.name);
      if (typeof names[0] === 'object' && 'label' in names[0]) {
        return names[0].label;
      } else {
        return names[0] ? names[0] : 'NA';
      }
    } catch (e) {
      return title || "Recording";
    }
  };


  // -- MISSING FEATURES IMPLEMENTATION --

  const getAllLabels = () => {
    try {
      const names = JSON.parse(selectedRecordingDetails?.name || '[]');
      return Array.isArray(names)
        ? names.map(item => {
          if (typeof item === 'object' && 'label' in item) {
            return item;
          }
          return { label: String(item), profanity: false };
        })
        : [];
    } catch (e) {
      return [];
    }
  };

  const startEditing = () => {
    const allLabels = getAllLabels();
    if (allLabels.length > 0) {
      setName(allLabels[0].label);
      setLabels(allLabels.slice(1));
    } else {
      setName(getDisplayName());
      setLabels([]);
    }

    if (selectedRecordingDetails?.additionalParams) {
      setTmpPermissionsObj({ ...selectedRecordingDetails.additionalParams });
      if (selectedRecordingDetails.additionalParams.slowPlaybackTime) {
        setSlowPlayback(true);
        setDelayPlaybackTime(selectedRecordingDetails.additionalParams.slowPlaybackTime);
      }
    }

    setIsEditingLabels(true);
    setEditRecording(true);
    setAdvBtnShow(true); // default to expanded permissions
  };

  const validateChange = async (value: string) => {
    setName(value);
    if (!value.trim()) {
      setInputError((e: any) => ({ ...e, name: true }));
      return false;
    }
    setInputAlert((a: any) => ({ ...a, name: false }));
    setInputError((e: any) => ({ ...e, name: false }));
    return true;
  };

  const checkProfanityImproved = async (keyword: string): Promise<{ cleaned: string; hasProfanity: boolean }> => {
    if (!config?.enableProfanity) return { cleaned: keyword.trim(), hasProfanity: false };
    setCheckingProfanity(true);
    try {
      const result = await validateStepNameWithProfanity(keyword, true);
      if (result.success) {
        return {
          cleaned: result.data?.cleanedValue || keyword.trim(),
          hasProfanity: !!result.data?.hasProfanity
        };
      }
      return { cleaned: keyword.trim(), hasProfanity: false };
    } finally {
      setCheckingProfanity(false);
    }
  };

  const checkMainLabelProfanity = async (value: string) => {
    if (!value.trim()) return;
    const { cleaned, hasProfanity } = await checkProfanityImproved(value);
    if (hasProfanity) {
      setInputAlert((a: any) => ({ ...a, mainLabelProfanity: true }));
    } else {
      setInputAlert((a: any) => ({ ...a, mainLabelProfanity: false }));
    }
    setInputAt("");
    setName(cleaned);
    return validateChange(cleaned);
  };

  const onExtraLabelChange = async (index: number, value: string) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = { ...updatedLabels[index], label: value };
    setLabels(updatedLabels);
    if (!value.trim()) {
      setInputError((e: any) => ({ ...e, [`label${index}`]: { error: true } }));
      return false;
    }
    setInputError((e: any) => ({ ...e, [`label${index}`]: { error: false } }));
    return true;
  };

  const checkLabelProfanity = async (index: number, value: string) => {
    if (!value.trim()) return;
    const { cleaned, hasProfanity } = await checkProfanityImproved(value);
    const updatedLabels = [...labels];
    updatedLabels[index] = {
      label: cleaned,
      profanity: hasProfanity,
    };
    setLabels(updatedLabels);
    setInputAt("");
    return onExtraLabelChange(index, cleaned);
  };

  const addLabel = () => setLabels([...labels, { label: "", profanity: false }]);

  const removeLabel = (index: number) => {
    const updated = [...labels];
    updated.splice(index, 1);
    setLabels(updated);
  };

  const handlePermissions = (key: string, value: any) => {
    setTmpPermissionsObj((prev: any) => {
      const updated = { ...prev };
      // Toggle logic: if truthy, set to false; otherwise set to the provided value (which should be truthy)
      if (updated[key]) {
        delete updated[key];
      } else {
        updated[key] = updated[key];
      }
      return updated;
    });
  };

  const validateDelayTime = (value: number) => {
    if (!isNaN(value)) {
      setDelayPlaybackTime(value);
    } else {
      setInputError((e: any) => ({ ...e, slowPlayBackTime: true }));
    }
  };

  const getStepLabel = (item: any): string => {
    const objData = getObjData(item?.objectdata);
    return objData?.meta?.displayText || item?.clickednodename || "Step";
  };

  const handleFinalSave = async () => {
    if (showLoader) showLoader(true);
    setDisableForm(true);

    try {
      // 1. Final Profanity check for main name
      const result = await validateStepNameWithProfanity(name, config?.enableProfanity);
      let processedName = name;
      if (result.success && result.data?.hasProfanity) {
        processedName = result.data.cleanedValue;
        addNotification("Profanity Detected", "Profanity has been removed from sequence name.", "warning");
      }

      // 2. Build label array: [mainName, ...aliases]
      // Fix: Backend expects JSON array of strings, not objects
      const labelValues = [
        processedName,
        ...labels.map(l => l.label)
      ];

      // 3. Merge additional params (permissions + slow playback)
      const mergedParams = { ...tmpPermissionsObj };
      if (config?.enableSlowReplay && slowPlayback) {
        mergedParams.slowPlaybackTime = delayPlaybackTime;
      } else {
        delete mergedParams.slowPlaybackTime;
      }

      const payload: any = {
        id: selectedRecordingDetails.id,
        name: JSON.stringify(labelValues),
        additionalParams: mergedParams
      };

      await updateRecordingService(payload);

      const updatedDetails = {
        ...selectedRecordingDetails,
        ...payload
      };

      // Update local state and storage
      setSelectedRecordingDetails(updatedDetails);
      StorageUtil.setToStore(updatedDetails, CONFIG.SELECTED_RECORDING, false);
      setIsEditingLabels(false);
      setEditRecording(false);
      if (refetchSearch) refetchSearch("on");
      addNotification(translate('labelsUpdated'), translate('labelsUpdatedDescription'), 'success');
    } catch (error) {
      console.error("Failed to save sequence metadata:", error);
      addNotification(translate('labelsUpdateError'), translate('labelsUpdateDescription'), 'error');
      setSavingError(true);
    } finally {
      setDisableForm(false);
      if (showLoader) showLoader(false);
    }
  };



  const updateStatusChange = async (newStatus: number) => {
    if (showLoader) showLoader(true);
    try {
      const permissions = { ...tmpPermissionsObj };
      permissions.status = newStatus;
      setTmpPermissionsObj({ ...permissions });

      let currentDetails = selectedRecordingDetails;

      // If not in label-editing mode (where FinalSaveScreen handles final save), 
      // we persist individual status changes immediately like the old UI.
      if (!isEditingLabels) {
        const payload = {
          id: selectedRecordingDetails.id,
          additionalParams: permissions
        };
        await updateRecordingService(payload);

        // Update local state
        currentDetails = { ...selectedRecordingDetails, additionalParams: permissions };
      } else {
        // Just update local state for editing session
        currentDetails = { ...selectedRecordingDetails, additionalParams: permissions };
      }

      // Sync state and storage
      setSelectedRecordingDetails(currentDetails);
      StorageUtil.setToStore(currentDetails, CONFIG.SELECTED_RECORDING, false);
    } catch (e) {
      console.error("Error updating status:", e);
      addNotification("Error", "Failed to update status.", "error");
    } finally {
      if (showLoader) showLoader(false);
    }
  };

  // Initialize permissions
  useEffect(() => {
    if (selectedRecordingDetails?.additionalParams) {
      setTmpPermissionsObj({ ...selectedRecordingDetails.additionalParams });
    }
  }, [selectedRecordingDetails?.id, selectedRecordingDetails?.additionalParams]);

  // Initialize status options
  useEffect(() => {
    if (config?.enableStatusSelection && selectedRecordingDetails?.usersessionid === userId) {
      fetchStatuses().then(setStatusOptions);
    }
  }, [config?.enableStatusSelection, selectedRecordingDetails?.usersessionid, userId]);


  const isOwner = !!userId && selectedRecordingDetails?.usersessionid === userId;

  const toggleEditMode = () => {
    if (editRecording) {
      // Done — exit edit mode, cancel any in-progress step edit
      setEditRecording(false);
      setIsEditingLabels(false);
      setEditingStepIndex(null);
      DigitalAssistantCoreSDK.dispatch(cancelStepEditing());
    } else {
      setEditRecording(true);
    }
  };

  return (
    <div className="w-full flex flex-col mt-4">
      {/* TitleBar & Label Editor */}
      {!isEditingLabels ? (
        <>
          <div className="relative">
            <TitleBar
              title={getDisplayName()}
              onBack={() => backNav(false)}
              onTitleChange={handleTitleChange}
              onShare={() => recordUserClickData('shareLink', '', selectedRecordingDetails?.id)}
              onDelete={handleDeleteClick}
              onEdit={isOwner && config?.enableEditingOfRecordings ? toggleEditMode : undefined}
              onEditLabels={isOwner && config?.enableEditingOfRecordings ? startEditing : undefined}
              isOwner={isOwner}
              isEditing={editRecording}
              shareUrl={shareUrl}
            />
          </div>

          {/* Player Controls with Feedback Buttons */}
          <div className="content-stretch flex gap-[10px] items-center px-0 py-[16px] rounded-[4px] w-full">
            <PlayerControls
              status={playStatus as any || 'idle'}
              onPlay={() => {
                trigger("closePanel", { action: 'closePanel' });
                handlePlayStatusChange("on");
                // Trigger SDK orchestration
                trigger("ContinuePlay", { action: 'ContinuePlay' });
              }}
              onPause={pause}
              onReplay={replay}
              onSkipNext={() => {
                // trigger next?
              }}
            />

            <div className="flex-1" />

            <FeedbackButtons
              isLiked={userVote?.upvote === 1}
              isDisliked={userVote?.downvote === 1}
              onLike={() => handleVote('up')}
              onDislike={() => handleVote('down')}
              onReport={handleReport}
            />
          </div>

          {/* Steps Section */}
          <div className="w-full flex flex-col">
            <h3 className="flex flex-col font-['Raleway',sans-serif] font-semibold h-[33px] justify-center leading-[0] text-[20px] mb-4 text-black">
              <p className="leading-[normal]">Steps</p>
            </h3>

            <div className="flex flex-col gap-3">
              {steps.map((step, index) => (
                <div key={index}>
                  {editingStepIndex === index ? (
                    <StepForm
                      mode="editing"
                      stepNumber={index + 1}
                      title={step.title}
                      delay={step.delay}
                      type={step.type}
                      tooltip={step.tooltip}
                      recordData={selectedRecordingDetails.userclicknodesSet}
                      stepIndex={index}
                      storeRecording={(data) => storeRecording(data, false)}
                      onSave={handleSaveEditedStep}
                      onValidate={handleValidateStep}
                      onCancel={handleCancelEdit}
                      validationCompleted={!!editableStepFormState?.editingWorkflow?.validationCompleted}
                      validationRequired={!!editableStepFormState?.editingWorkflow?.validationRequired}
                      config={config}
                    />
                  ) : (
                    <Step
                      title={step.title}
                      delay={step.delay}
                      completed={step.completed}
                      failed={step.failed}
                      showEditIcon={editRecording && isOwner && config?.enableEditingOfRecordings}
                      onEdit={() => handleEditStep(index)}
                      onPlay={() => handlePlayNode(index)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <FinalSaveScreen
          name={name}
          setName={setName}
          labels={labels}
          setLabels={setLabels}
          inputError={inputError}
          inputAlert={inputAlert}
          setInputAt={setInputAt}
          validateChange={validateChange}
          checkMainLabelProfanity={checkMainLabelProfanity}
          onExtraLabelChange={onExtraLabelChange}
          checkLabelProfanity={checkLabelProfanity}
          addLabel={addLabel}
          removeLabel={removeLabel}
          config={config}
          advBtnShow={advBtnShow}
          setAdvBtnShow={setAdvBtnShow}
          tmpPermissionsObj={tmpPermissionsObj}
          handlePermissions={handlePermissions}
          slowPlayback={slowPlayback}
          setSlowPlayback={setSlowPlayback}
          delayPlaybackTime={delayPlaybackTime}
          validateDelayTime={validateDelayTime}
          onCancel={() => setIsEditingLabels(false)}
          onSubmit={handleFinalSave}
          disableForm={disableForm}
          screenInfoNotAvailable={false}
          recordData={selectedRecordingDetails.userclicknodesSet}
          getStepLabel={getStepLabel}
          savingError={savingError}
          statusOptions={statusOptions}
          onStatusChange={updateStatusChange}
        />
      )}
    </div>
  );
}