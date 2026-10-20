/**
 * RecordingScreen.tsx
 *
 * Handles the full recording-capture experience:
 *   - Phase "recording": live list of recorded steps from core SDK storage
 *   - Phase "naming"  : sequence name input, alias labels, permissions, submit
 *   - Phase "saving"  : real upload progress via core SDK API calls
 *
 * All data persistence is delegated entirely to @udan/digital-assistant-sdk.
 * No custom save logic is written here.
 */

import { useState, useEffect, useCallback } from "react";
import {
  getObjData,
  StorageUtil,
  CONFIG,
  recordClicks,
  postRecordSequenceData,
  profanityCheck,
  hasValidScreenInfo,
  UDAErrorLogger,
  UDAConsoleLogger,
  fetchDomain,
  finalSaveSequence,
  validateStepNameWithProfanity,
  validateStepName,
  fetchStatuses,
} from "@udan/digital-assistant-sdk";
import { on, off, trigger } from "../util/events";
import { translate } from "../util/translation";
import { addNotification } from "../util/addNotification";
import { SavingProgress } from "./SavingProgress";
import { StepForm } from "./StepForm";
import { FinalSaveScreen } from "./FinalSaveScreen";

type RecordPhase = "recording" | "naming" | "saving";

interface RecordingScreenProps {
  /** Kept for backward-compat; no longer triggers stepEditor mode */
  onContainerClick?: () => void;
  /** Called when user cancels — navigates HomePageUser back to idle */
  onCancel: () => void;
  /** Called with "cancel" on cancel, or after successful save */
  recordHandler?: Function;
  /** Called after successful save so search results refresh */
  refetchSearch?: Function;
  /** Show/hide a loader in the parent */
  showLoader?: Function;
  /** Global UDA config (enablePermissions, enableSlowReplay, enableProfanity, permissions…) */
  config?: any;
}

export function RecordingScreen({
  onCancel,
  recordHandler,
  refetchSearch,
  showLoader,
  config,
}: RecordingScreenProps) {
  // ── Phase ──────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<RecordPhase>("recording");

  // ── Recorded data (from core SDK storage) ─────────────────────────────────
  const [recordData, setRecordData] = useState<any[]>([]);

  // ── Naming-phase state ────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [labels, setLabels] = useState<{ label: string; profanity?: boolean }[]>([]);
  const [inputAlert, setInputAlert] = useState<any>({});
  const [inputError, setInputError] = useState<any>({});
  const [inputAt, setInputAt] = useState("");
  const [checkingProfanity, setCheckingProfanity] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [disableForm, setDisableForm] = useState(false);

  // ── Permissions ───────────────────────────────────────────────────────────
  const [advBtnShow, setAdvBtnShow] = useState(false);
  const [tmpPermissionsObj, setTmpPermissionsObj] = useState<any>({});
  const [statusOptions, setStatusOptions] = useState<any[]>([]);

  // ── Slow-replay ───────────────────────────────────────────────────────────
  const [slowPlayback, setSlowPlayback] = useState(false);
  const [delayPlaybackTime, setDelayPlaybackTime] = useState(1);

  // ── Saving-phase state ────────────────────────────────────────────────────
  const [savedClickedDataPercent, setSavedClickedDataPercent] = useState(0);
  const [savingError, setSavingError] = useState(false);

  // ── Screen info validation ────────────────────────────────────────────────
  const [screenInfoNotAvailable, setScreenInfoNotAvailable] = useState(false);

  // ── Load recorded data from core SDK storage ──────────────────────────────
  const loadRecordData = useCallback(() => {
    const stored = StorageUtil.getFromStore(CONFIG.RECORDING_SEQUENCE, false);
    setRecordData(Array.isArray(stored) ? [...stored] : []);
  }, []);

  useEffect(() => {
    loadRecordData();
  }, [loadRecordData]);

  // Listen for "updateRecordedData" — fired by core SDK on every captured click
  useEffect(() => {
    const handler = () => {
      console.log("UI: Received updateRecordedData event");
      loadRecordData();
    };
    on("updateRecordedData", handler);
    return () => off("updateRecordedData", handler);
  }, [loadRecordData]);

  // Validate screen info on last recorded step
  useEffect(() => {
    if (recordData && recordData.length > 0) {
      const lastNode = getObjData(recordData[recordData.length - 1]?.objectdata);
      if (lastNode?.node?.nodeInfo && !hasValidScreenInfo(lastNode.node.nodeInfo)) {
        setScreenInfoNotAvailable(true);
      } else {
        setScreenInfoNotAvailable(false);
      }
    }
  }, [recordData]);



  // Sync permissions from config
  useEffect(() => {
    if (config?.permissions) {
      setTmpPermissionsObj({ ...config.permissions });
    }
  }, [config?.permissions]);

  useEffect(() => {
    if (config?.enableStatusSelection) {
      fetchStatuses().then(setStatusOptions);
    }
  }, [config?.enableStatusSelection]);

  // ── Core SDK storage helper ────────────────────────────────────────────────
  const storeRecording = (data: any[]) => {
    setRecordData([...data]);
    StorageUtil.setToStore(data, CONFIG.RECORDING_SEQUENCE, false);
  };

  // ── Cancel ─────────────────────────────────────────────────────────────────
  const cancelRecording = async () => {
    resetForm();
    StorageUtil.add([], CONFIG.RECORDING_SEQUENCE, false);
    trigger("updateRecordedData", {});
    if (recordHandler) recordHandler("cancel");
    onCancel();
  };

  const resetForm = () => {
    setName("");
    setLabels([]);
    setDisableForm(false);
    setInputAlert({});
    setInputError({});
    setSavedClickedDataPercent(0);
    setSavingError(false);
    setFormSubmit(false);
  };

  // ── Validation helpers ─────────────────────────────────────────────────────
  const validateInput = (value: string): boolean => {
    return validateStepName(value).isValid;
  };

  const validateChange = async (value: string) => {
    setName(value);
    if (!validateInput(value)) {
      setInputError((e: any) => ({ ...e, name: true }));
      return false;
    }
    setInputAlert((a: any) => ({ ...a, name: false }));
    setInputError((e: any) => ({ ...e, name: false }));
    return true;
  };

  // ── Profanity helpers (delegate to core SDK) ───────────────────────────────
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
    if (!validateInput(value)) {
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

  // ── Label management ───────────────────────────────────────────────────────
  const addLabel = () => setLabels([...labels, { label: "" }]);

  const removeLabel = (index: number) => {
    const updated = [...labels];
    updated.splice(index, 1);
    setLabels(updated);
  };

  // ── Permissions toggle ─────────────────────────────────────────────────────
  const handlePermissions = (key: string, value: any) => {
    setTmpPermissionsObj((prev: any) => {
      const updated = { ...prev };
      if (updated[key]) {
        updated[key] = false;
      } else {
        updated[key] = value || true;
      }
      return updated;
    });
  };

  // ── Validate delay time ────────────────────────────────────────────────────
  const validateDelayTime = (value: number) => {
    if (!isNaN(value)) {
      setDelayPlaybackTime(value);
    } else {
      setInputError((e: any) => ({ ...e, slowPlayBackTime: true }));
    }
  };

  const handleStatusChange = (statusId: number) => {
    setTmpPermissionsObj((prev: any) => ({ ...prev, status: statusId }));
  };

  // ── Submit recording (core SDK calls only) ─────────────────────────────────
  const submitRecording = async (overrides?: { name?: string; labels?: string[]; additionalParams?: any }) => {
    setFormSubmit(true);

    const finalName = overrides?.name ?? name;
    const finalLabels = overrides?.labels ?? labels.map(l => l.label);
    const finalParams = overrides?.additionalParams ?? tmpPermissionsObj;

    if (checkingProfanity) {
      addNotification("Wait", "Please wait for profanity check to complete", "warning");
      return;
    }

    const result = await validateStepNameWithProfanity(finalName, config?.enableProfanity);
    if (!result.success) {
      setInputError((e: any) => ({ ...e, name: true }));
      UDAConsoleLogger.info("Submission blocked: Name validation failed - " + result.error, 1);
      addNotification("Validation Error", result.error || "Sequence name is invalid.", "error");
      return;
    }

    let processedName = finalName;
    if (result.data?.hasProfanity) {
      processedName = result.data.cleanedValue;
      setName(processedName);
      addNotification("Profanity Detected", "Profanity has been removed from sequence name.", "warning");
    }

    setDisableForm(true);
    setPhase("saving");

    // Build label array: [mainName, ...aliases]
    const labelValues: string[] = [processedName, ...finalLabels];

    const _payload: any = {
      name: JSON.stringify(labelValues),
      domain: fetchDomain(),
      userclicknodesSet: recordData, // Fix visibility: ensure backend sees all nodes
    };

    // Apply status selection
    const mergedParams = { ...finalParams };
    if (config?.enableStatusSelection && !mergedParams.hasOwnProperty("status")) {
      mergedParams.enableStatus = 1;
    }
    if (Object.keys(mergedParams).length > 0) {
      _payload.additionalParams = mergedParams;
    }

    // Save domain if enableForAllDomains
    if (global?.UDAGlobalConfig?.enableForAllDomains) {
      _payload.additionalParams = {
        enableForAllDomains: true,
        recordedDomain: window.location.host,
        ..._payload.additionalParams,
      };
    }

    // Save slow playback time
    if (config?.enableSlowReplay && slowPlayback) {
      _payload.additionalParams = {
        ..._payload.additionalParams,
        slowPlaybackTime: delayPlaybackTime,
      };
    }

    // ── Per-click save loop and Final save (SDK: finalSaveSequence) ──────────
    try {
      const { response: instance } = await finalSaveSequence(
        _payload,
        recordData,
        (percent) => setSavedClickedDataPercent(percent)
      );

      if (instance) {
        setSavedClickedDataPercent(100);
        addNotification(translate("savedSequence"), translate("savedSequenceDescription"), "success");

        // Wait for indexing interval to ensure search results are updated before redirection
        await new Promise(resolve => setTimeout(resolve, CONFIG.indexInterval));

        if (refetchSearch) refetchSearch("on");

        StorageUtil.add(false, CONFIG.RECORDING_SWITCH_KEY, true);
        StorageUtil.add([], CONFIG.RECORDING_SEQUENCE, false);
        trigger("updateRecordedData", {});

        if (recordHandler) recordHandler("cancel");
        onCancel();
      } else {
        throw new Error("Failed to save sequence");
      }
    } catch (error: any) {
      UDAErrorLogger.error("Save Sequence Error: " + error?.message);
      addNotification(translate("savedSequenceError"), translate("savedSequenceErrorDescription"), "error");
      setDisableForm(false);
      setPhase("naming");
      setFormSubmit(false);
      setSavingError(true);
    }
  };

  // ── Render step label ──────────────────────────────────────────────────────
  const getStepLabel = (item: any): string => {
    const objData = getObjData(item?.objectdata);
    return objData?.meta?.displayText || item?.clickednodename || "Step";
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE: saving
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "saving") {
    return (
      <div className="content-stretch flex flex-col gap-[20px] items-start w-full">
        {/* Header */}
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
          <div className="relative shrink-0 size-[16px]">
            <svg className="block size-full" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" fill="#FB2C36" r="8" />
            </svg>
          </div>
          <div className="flex flex-col font-['Raleway',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[16px] text-center text-nowrap">
            <p className="leading-[normal] whitespace-pre">Saving Recording…</p>
          </div>
        </div>

        {savingError && (
          <div className="w-full bg-red-50 border border-red-300 text-red-700 rounded-[8px] px-4 py-3 text-sm">
            Some steps failed to save. Please try again.
          </div>
        )}

        {/* Progress — driven by real API progress, not a timer */}
        <div className="w-full flex flex-col items-center justify-center py-8">
          <div className="relative w-[200px] h-[200px]">
            <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="#D9D9D9" />
            </svg>
            <svg className="absolute inset-0 w-full h-full -rotate-90" fill="none" viewBox="0 0 200 200">
              <circle
                cx="100" cy="100" r="80"
                fill="none"
                stroke="black"
                strokeWidth="20"
                strokeDasharray={`${(2 * Math.PI * 80 * savedClickedDataPercent) / 100} ${2 * Math.PI * 80}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-['Roboto',sans-serif] font-semibold text-[40px] text-black">
                {Math.round(savedClickedDataPercent)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE: naming — sequence name + labels + permissions + submit
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "naming") {
    return (
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
        onCancel={cancelRecording}
        onSubmit={() => submitRecording()}
        disableForm={disableForm}
        screenInfoNotAvailable={screenInfoNotAvailable}
        recordData={recordData}
        getStepLabel={getStepLabel}
        savingError={savingError}
        statusOptions={statusOptions}
        onStatusChange={handleStatusChange}
      />
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE: recording — live step list + last-step editor
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start w-full">
      {/* Recording Started Header */}
      <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
        <div className="relative shrink-0 size-[16px]">
          <svg className="block size-full" fill="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="#FB2C36" r="8" />
          </svg>
        </div>
        <div className="flex flex-col font-['Raleway',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[16px] text-center text-nowrap">
          <p className="leading-[normal] whitespace-pre">Recording Sequence</p>
        </div>
      </div>

      {/* Steps captured so far */}
      {recordData.length === 0 ? (
        /* Placeholder — SDK will populate this as user clicks around */
        <div
          className="basis-0 bg-[#f2f2f2] content-stretch flex grow items-center justify-center min-h-[300px] relative rounded-[8px] shrink-0 w-full"
        >
          <div aria-hidden="true" className="absolute border border-[#cccccc] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
          <div className="flex flex-col font-['Raleway',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[16px] text-center max-w-[296px]">
            <p className="leading-[normal]">Navigate and click through the website to capture steps here</p>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3">
          {/* Completed steps (all except last) — read-only */}
          {/* {recordData.slice(0, -1).map((item, index) => (
            <div
              key={`step-completed-${index}`}
              className="bg-white content-stretch flex gap-[10px] h-[44px] items-center px-[10px] rounded-[8px] border border-[#e0e0e0]"
            >
              <span className="font-['Raleway',sans-serif] text-[14px] text-[#1c1c1e]">
                {index + 1}. {getStepLabel(item)}
              </span>
            </div>
          ))} */}

          {/* Last step — shown in StepEditor for properties editing */}
          <StepForm
            mode="recording"
            onClose={() => {/* staying in recording phase */ }}
            stepNumber={recordData.length}
            completedSteps={recordData.slice(0, -1).map((item, i) => ({
              number: i + 1,
              title: getStepLabel(item),
            }))}
            recordData={recordData}
            stepIndex={recordData.length - 1}
            storeRecording={storeRecording}
            sequenceName={name}
            sequenceLabels={labels}
            permissionsConfig={config?.permissions}
            tmpPermissions={tmpPermissionsObj}
            onPermissionsChange={handlePermissions}
            config={config}
            onFinalSave={(data) => {
              setPhase("naming");
            }}
            onCancel={cancelRecording}
          />
        </div>
      )}
      <br />
    </div>
  );
}