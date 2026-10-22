import { useState, useEffect, useRef } from "react";
import {
    getObjData,
    toggleSkipDuringPlay,
    togglePersonalInfo,
    updateTooltipMetadata,
    updateStepType,
    saveStepChanges,
    updateStepNameService,
    updateCustomMetadataService,
    UDAConsoleLogger,
    isHighlightNode,
    fetchHtmlFormElements,
    validateStepNameWithProfanity,
    startValidation,
    updateDraftChanges,
} from "@udan/digital-assistant-sdk";
import { coreSDK as DigitalAssistantCoreSDK } from "../services/coreSDK";
import { translate } from "../util/translation";
import { addNotification } from "../util/addNotification";
import svgPaths from "../imports/svg-ckbrelabtn";
import svgPathsNew from "../imports/svg-k4wo7ducks";
import svgPathsMulti from "../imports/svg-xxlbqiqnh7";

interface StepFormProps {
    mode: 'recording' | 'editing';
    stepNumber: number;
    onCancel: () => void;
    onClose?: () => void; // alias for onCancel or handled specifically

    // Unified editing props
    title?: string;
    delay?: string | number;
    type?: string;
    tooltip?: string;
    recordData?: any[];
    stepIndex?: number;
    storeRecording?: (data: any[]) => void;
    config?: any;

    // Editing mode props
    onSave?: (stepData: any) => void;
    onValidate?: (stepData: any) => void;
    validationCompleted?: boolean;
    validationRequired?: boolean;

    // Recording mode props
    onSaveStep?: (stepData: any) => void; // alias for onSave in recording
    onFinalSave?: (data: { name: string; labels: string[]; additionalParams: any }) => void;
    completedSteps?: Array<{ number: number; title: string }>;
    sequenceName?: string;
    sequenceLabels?: { label: string; profanity?: boolean }[];
    permissionsConfig?: any;
    tmpPermissions?: any;
    onPermissionsChange?: (key: string, value: any) => void;
}

export function StepForm({
    mode,
    stepNumber,
    onCancel,
    onClose,
    title,
    delay,
    type,
    tooltip,
    recordData = [],
    stepIndex = 0,
    storeRecording,
    config = {},
    onSave,
    onValidate,
    validationCompleted,
    validationRequired,
    onSaveStep,
    onFinalSave,
    completedSteps = [],
    sequenceName = "",
    sequenceLabels = [],
    permissionsConfig,
    tmpPermissions = {},
    onPermissionsChange,
}: StepFormProps) {
    const [isEditingHome, setIsEditingHome] = useState(false);
    const [selectedType, setSelectedType] = useState(type || "Link");
    const [tooltipValue, setTooltipValue] = useState(tooltip || "");
    const [isEditingTooltip, setIsEditingTooltip] = useState(false);
    const [enableSlowReplay, setEnableSlowReplay] = useState(delay ? true : false);
    const [delaySeconds, setDelaySeconds] = useState(delay?.toString() || "3");
    const [skipDuringPlay, setSkipDuringPlay] = useState(false);
    const [personalInformation, setPersonalInformation] = useState(false);
    const [showSkipTooltip, setShowSkipTooltip] = useState(false);
    const [showPersonalTooltip, setShowPersonalTooltip] = useState(false);
    const [inputTypeValue, setInputTypeValue] = useState("");
    const [inputTypeDescription, setInputTypeDescription] = useState("");

    // Sequence-level state (recording mode)
    const [localSeqName, setLocalSeqName] = useState(sequenceName);
    const [localLabels, setLocalLabels] = useState(sequenceLabels);
    const [optionsArray, setOptionsArray] = useState<any[]>([]);

    const isInternalChange = useRef(false);

    const currentStep = recordData[stepIndex];
    const stepMeta = currentStep ? (getObjData(currentStep.objectdata)?.meta ?? {}) : {};
    const [homeValue, setHomeValue] = useState(stepMeta.displayText || currentStep?.clickednodename || title || "");

    // 1. Sync local state FROM currentStep (only on mount or step change)
    useEffect(() => {
        if (currentStep) {
            const node = getObjData(currentStep.objectdata);
            const meta = node?.meta ?? {};

            // Mark as internal change to prevent the draft sync effect from firing back
            isInternalChange.current = true;

            const newHomeValue = meta.displayText || currentStep.clickednodename || title || "";
            if (homeValue !== newHomeValue) setHomeValue(newHomeValue);

            const newSkip = !!meta.skipDuringPlay;
            if (skipDuringPlay !== newSkip) setSkipDuringPlay(newSkip);

            const newPersonal = !!meta.isPersonal;
            if (personalInformation !== newPersonal) setPersonalInformation(newPersonal);

            const newTooltip = meta.tooltipInfo || tooltip || "";
            if (tooltipValue !== newTooltip) setTooltipValue(newTooltip);

            const newInputType = meta.inputType || "";
            if (inputTypeValue !== newInputType) setInputTypeValue(newInputType);

            const newInputTypeDesc = meta.inputTypeDescription || "";
            if (inputTypeDescription !== newInputTypeDesc) setInputTypeDescription(newInputTypeDesc);

            const delayVal = String(meta.slowPlaybackTime || delay || "");
            if (delayVal) {
                if (!enableSlowReplay) setEnableSlowReplay(true);
                if (delaySeconds !== delayVal) setDelaySeconds(delayVal);
            } else {
                if (enableSlowReplay) setEnableSlowReplay(false);
            }

            // Generate options array
            const currentSelectedElement = meta.selectedElement || {
                inputElement: "",
                inputType: "",
                displayName: "Please Select",
                systemTag: "",
            };

            const tempOptionsArray: any[] = [];
            const elements = fetchHtmlFormElements();

            if (currentSelectedElement.inputElement === "") {
                tempOptionsArray.push({
                    value: JSON.stringify(currentSelectedElement),
                    text: currentSelectedElement.displayName,
                });
            }

            for (const htmlFormElement of elements) {
                tempOptionsArray.push({
                    value: JSON.stringify(htmlFormElement),
                    text: htmlFormElement.displayName,
                });
            }

            if (mode === 'editing' && tempOptionsArray.length <= 1) {
                if (!tempOptionsArray.find(o => o.text === 'Link')) tempOptionsArray.push({ value: 'Link', text: 'Link' });
                if (!tempOptionsArray.find(o => o.text === 'High Light')) tempOptionsArray.push({ value: 'Highlight', text: 'High Light' });
            }

            setOptionsArray(tempOptionsArray);

            // Set initial selected value
            const isHighlight = isHighlightNode(node);
            const matchedOption = tempOptionsArray.find(opt => {
                try {
                    const val = JSON.parse(opt.value);
                    if (isHighlight && val.systemTag === 'highlight') return true;
                    if (currentSelectedElement.systemTag && val.systemTag === currentSelectedElement.systemTag) return true;
                    if (currentSelectedElement.displayName === val.displayName) return true;
                    return false;
                } catch (e) {
                    return opt.value === type;
                }
            });

            if (matchedOption) {
                if (selectedType !== matchedOption.value) setSelectedType(matchedOption.value);
            } else if (isHighlight || type === "Highlight") {
                if (selectedType !== "Highlight") setSelectedType("Highlight");
            } else {
                const finalType = type || "Link";
                if (selectedType !== finalType) setSelectedType(finalType);
            }

            // Use a timeout to reset the ref after the state updates have settled
            setTimeout(() => {
                isInternalChange.current = false;
            }, 100);
        }
    }, [stepIndex, currentStep?.id]);

    // Sync sequence-level changes from props
    useEffect(() => setLocalSeqName(sequenceName), [sequenceName]);
    useEffect(() => setLocalLabels(sequenceLabels), [sequenceLabels]);

    // 2. Sync local state TO Redux draft (on local changes)
    useEffect(() => {
        if (mode === 'editing' && currentStep && !isInternalChange.current) {
            const currentObjData = getObjData(currentStep.objectdata);
            const currentMeta = currentObjData?.meta || {};

            let selectedElement = currentMeta.selectedElement ? { ...currentMeta.selectedElement } : {
                inputElement: "",
                inputType: "",
                displayName: "Please Select",
                systemTag: "",
            };

            if (selectedType === 'Highlight') {
                selectedElement.systemTag = 'highlight';
            } else if (selectedType === 'Link') {
                delete selectedElement.systemTag;
                if (Object.keys(selectedElement).length === 0) {
                    selectedElement = undefined;
                }
            } else if (selectedType.startsWith('{') && selectedType.endsWith('}')) {
                try {
                    const parsed = JSON.parse(selectedType);
                    if (parsed.inputElement !== "") {
                        selectedElement = parsed;
                    }
                } catch (e) {
                    console.error('Error parsing selectedType JSON:', e);
                }
            }

            const draft = {
                ...currentStep,
                clickednodename: homeValue,
                objectdata: JSON.stringify({
                    ...currentObjData,
                    meta: {
                        ...currentMeta,
                        displayText: homeValue,
                        tooltipInfo: tooltipValue,
                        slowPlaybackTime: enableSlowReplay ? parseFloat(delaySeconds) : undefined,
                        skipDuringPlay,
                        isPersonal: personalInformation,
                        type: selectedType,
                        selectedElement,
                        ...(inputTypeValue && { inputType: inputTypeValue }),
                        ...(inputTypeDescription && { inputTypeDescription }),
                    }
                })
            };
            DigitalAssistantCoreSDK.dispatch(updateDraftChanges(draft));
        }
    }, [mode, homeValue, tooltipValue, selectedType, enableSlowReplay, delaySeconds, skipDuringPlay, personalInformation, inputTypeValue, inputTypeDescription]);

    const handleSaveHome = async () => {
        const result = await validateStepNameWithProfanity(homeValue, config?.enableProfanity);
        if (!result.success) {
            addNotification("Validation Error", result.error || "Invalid name", "error");
            return;
        }

        let processedValue = homeValue;
        if (result.data?.hasProfanity) {
            processedValue = result.data.cleanedValue;
            setHomeValue(processedValue);
            addNotification("Profanity Detected", "Profanity has been removed from your step name.", "warning");
        }

        setIsEditingHome(false);
        if (storeRecording && recordData.length > 0) {
            const updated = updateStepNameService(recordData, stepIndex, processedValue);
            storeRecording(updated);
            if (mode === 'editing') DigitalAssistantCoreSDK.dispatch(startValidation());
        }
    };

    const handleSaveTooltip = () => {
        setIsEditingTooltip(false);
        if (storeRecording && recordData.length > 0) {
            const result = updateTooltipMetadata(recordData, stepIndex, tooltipValue);
            if (result.success && result.data) {
                storeRecording(result.data);
                if (mode === 'editing') DigitalAssistantCoreSDK.dispatch(startValidation());
            }
        }
    };

    const handleValidate = async () => {
        const result = await validateStepNameWithProfanity(homeValue, config?.enableProfanity);
        let finalTitle = homeValue;
        if (result.success && result.data?.hasProfanity) {
            finalTitle = result.data.cleanedValue;
            setHomeValue(finalTitle);
        }

        if (onValidate) {
            onValidate({
                title: finalTitle,
                delay: enableSlowReplay ? parseFloat(delaySeconds) : undefined,
                type: selectedType,
                tooltip: tooltipValue,
            });
        }
    };

    const handleSaveStep = async () => {
        const finalData = {
            number: stepNumber,
            title: homeValue,
            type: selectedType,
            tooltip: tooltipValue,
            delay: enableSlowReplay ? parseFloat(delaySeconds) : undefined,
            enableSlowReplay,
            delaySeconds,
            skipDuringPlay,
            personalInformation
        };

        if (mode === 'editing' && onSave) {
            onSave(finalData);
        } else if (mode === 'recording' && onSaveStep) {
            onSaveStep(finalData);
        }

        // In recording mode, we still need to save changes to the local draft
        if (mode === 'recording' && storeRecording && recordData.length > 0) {
            const profResult = await validateStepNameWithProfanity(homeValue, config?.enableProfanity);
            let finalHomeValue = homeValue;
            if (profResult.success && profResult.data?.hasProfanity) {
                finalHomeValue = profResult.data.cleanedValue;
                setHomeValue(finalHomeValue);
            }

            const result = await saveStepChanges({
                recordData,
                index: stepIndex,
                stepEditValue: finalHomeValue,
                isUpdateMode: false,
                tooltipInfo: tooltipValue,
                slowPlaybackTime: enableSlowReplay ? parseFloat(delaySeconds) : undefined,
                skipDuringPlay,
                isPersonal: personalInformation,
            });
            if (result.success && result.data) {
                storeRecording(result.data);
            }
        }
    };

    const handleFinalAction = () => {
        if (onFinalSave) {
            onFinalSave({
                name: localSeqName,
                labels: localLabels.map(l => l.label).filter(l => l.trim() !== ""),
                additionalParams: tmpPermissions
            });
        }
    };

    const renderActionButtons = () => {
        return (
            <div className="flex gap-[10px] mb-3">
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        backgroundColor: '#969696',
                        height: '50px',
                        borderRadius: '8px',
                        fontFamily: 'Raleway, sans-serif',
                        fontSize: '20px',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                    }}
                >
                    Cancel
                </button>
                {mode === 'editing' && onValidate && (
                    <button
                        onClick={handleValidate}
                        disabled={!validationRequired}
                        style={{
                            flex: 1,
                            backgroundColor: validationRequired ? '#2563eb' : '#9ca3af',
                            height: '50px',
                            borderRadius: '8px',
                            fontFamily: 'Raleway, sans-serif',
                            fontSize: '20px',
                            color: 'white',
                            border: 'none',
                            cursor: validationRequired ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            opacity: validationRequired ? 1 : 0.6
                        }}
                    >
                        Validate
                    </button>
                )}
                <button
                    onClick={handleSaveStep}
                    disabled={mode === 'editing' && onValidate && !validationCompleted}
                    style={{
                        flex: 1,
                        height: '50px',
                        borderRadius: '8px',
                        fontFamily: 'Raleway, sans-serif',
                        fontSize: '20px',
                        color: (mode === 'editing' && validationCompleted) ? 'black' : 'white',
                        transition: 'all 0.3s ease',
                        cursor: (mode === 'editing' && onValidate && !validationCompleted) ? 'not-allowed' : 'pointer',
                        backgroundColor: (mode === 'editing' && onValidate && !validationCompleted)
                            ? '#9ca3af'
                            : (mode === 'editing' && validationCompleted)
                                ? '#EAB308'
                                : '#000000',
                        opacity: (mode === 'editing' && onValidate && !validationCompleted) ? 0.5 : 1,
                        boxShadow: (mode === 'editing' && validationCompleted) ? '0 0 15px rgba(234, 179, 8, 0.6)' : 'none',
                        fontWeight: (mode === 'editing' && validationCompleted) ? 'bold' : 'normal',
                        border: 'none'
                    }}
                >
                    Save step
                </button>
            </div>
        );
    };

    return (
        <div className={`${mode === 'recording' ? 'bg-[#f2f2f2] p-3 shadow-[0px_-2px_8px_0px_rgba(0,0,0,0.25),0px_4px_12px_0px_rgba(0,0,0,0.25)]' : ''} rounded-[8px] w-full max-h-[90vh] overflow-y-auto`}>
            {mode === 'recording' && completedSteps.length > 0 && (
                <div className="mb-3 space-y-2">
                    {completedSteps.map((step) => (
                        <div key={step.number} className="bg-white content-stretch flex gap-[10px] h-[44px] items-center p-[10px] rounded-[8px]">
                            <svg className="w-6 h-6 shrink-0" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                <path d={svgPathsMulti.p2de1ad00} fill="#969696" />
                            </svg>
                            <div className="flex flex-col font-['Raleway',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1c1e] text-[20px]">
                                <p className="leading-[normal] whitespace-pre">{step.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-[#d5d5d5] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2">
                    <p className="font-['Roboto',sans-serif] text-[20px] text-[#1c1c1e] leading-[normal]">Step {stepNumber}</p>
                    <button onClick={onClose || onCancel} className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-opacity" aria-label="Close">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                            <path d={svgPaths.p3f2c8580} fill="black" />
                        </svg>
                    </button>
                </div>

                <div className="px-4 mt-2">
                    {!isEditingHome ? (
                        <div className="relative bg-[#969696] h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-5">
                            <p className="font-['Roboto',sans-serif] text-[20px] text-white tracking-[0.25px] leading-[20px]">
                                {homeValue || (stepNumber === 1 && mode === 'recording' ? "Home" : "Step Title")}
                            </p>
                            {/* Edit pencil: always shown in editing mode; in recording mode only when enableEditClickedName is true */}
                            {(mode === 'editing' || config?.enableEditClickedName) && (
                            <button onClick={() => setIsEditingHome(true)} className="absolute right-3 w-6 h-6 hover:opacity-80 transition-opacity" aria-label="Edit">
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <path d={svgPaths.p157c33f0} fill="white" />
                                </svg>
                            </button>
                            )}
                        </div>
                    ) : (
                        <div className="relative bg-white h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center pl-3 pr-14">
                            <input
                                type="text"
                                value={homeValue}
                                onChange={(e) => setHomeValue(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none font-['Roboto',sans-serif] text-[20px] text-black tracking-[0.25px] leading-[20px]"
                                autoFocus
                            />
                            <button onClick={handleSaveHome} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-[30px]" aria-label="Save">
                                <svg className="block w-9 h-[42px]" fill="none" preserveAspectRatio="none" viewBox="0 0 36 42">
                                    <g filter="url(`#filter0_dd_${mode}`)">
                                        <rect fill="black" height="30" rx="4" width="28" x="4" y="4" />
                                        <path d="M10 19L15.25 24.25L25.75 13" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                                    </g>
                                    <defs>
                                        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42" id={`filter0_dd_${mode}`} width="36" x="0" y="0">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                                            <feOffset dy="4" />
                                            <feGaussianBlur stdDeviation="2" />
                                            <feComposite in2="hardAlpha" operator="out" />
                                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                            <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                                            <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
                                        </filter>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div className="px-4 mt-3">
                    <h3 className="font-['Raleway',sans-serif] font-semibold text-[20px] text-[#1c1c1e] mb-2.5 leading-[normal]">Properties</h3>

                    <div className="flex items-center gap-6 mb-5">
                        {(config.enableSkipDuringPlay || mode === 'editing') && (
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => {
                                        setSkipDuringPlay(!skipDuringPlay);
                                        if (storeRecording && recordData.length > 0) storeRecording(toggleSkipDuringPlay(recordData, stepIndex));
                                    }}
                                    className="w-[22px] h-[22px] border-2 border-black rounded bg-white flex items-center justify-center shrink-0 cursor-pointer"
                                    aria-label="Skip during play"
                                >
                                    {skipDuringPlay && <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M2 6L4.5 8.5L10 3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </button>
                                <label className="font-['Jost',sans-serif] text-[14px] text-black cursor-pointer" onClick={() => {
                                    setSkipDuringPlay(!skipDuringPlay);
                                    if (storeRecording && recordData.length > 0) {
                                        storeRecording(toggleSkipDuringPlay(recordData, stepIndex));
                                        if (mode === 'editing') DigitalAssistantCoreSDK.dispatch(startValidation());
                                    }
                                }}>Skip during play</label>
                                <div className="relative">
                                    <button onMouseEnter={() => setShowSkipTooltip(true)} onMouseLeave={() => setShowSkipTooltip(false)} className="w-[18px] h-[18px]">
                                        <svg className="block size-full" fill="none" viewBox="0 0 17 17"><circle cx="8.5" cy="8.5" fill="black" r="8.5" /><path d={svgPathsNew.p1e8c400} fill="white" /></svg>
                                    </button>
                                    {showSkipTooltip && <div className="absolute top-full left-0 mt-2 bg-black text-white text-[12px] px-3 py-2 rounded-md z-50 w-[200px]">Skip this step during playback</div>}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => {
                                    setPersonalInformation(!personalInformation);
                                    if (storeRecording && recordData.length > 0) storeRecording(togglePersonalInfo(recordData, stepIndex));
                                }}
                                className="w-[22px] h-[22px] border-2 border-black rounded bg-white flex items-center justify-center shrink-0 cursor-pointer"
                                aria-label="Personal information"
                            >
                                {personalInformation && <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M2 6L4.5 8.5L10 3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </button>
                            <label className="font-['Jost',sans-serif] text-[14px] text-black cursor-pointer" onClick={() => {
                                setPersonalInformation(!personalInformation);
                                if (storeRecording && recordData.length > 0) {
                                    storeRecording(togglePersonalInfo(recordData, stepIndex));
                                    if (mode === 'editing') DigitalAssistantCoreSDK.dispatch(startValidation());
                                }
                            }}>Personal information</label>
                            <div className="relative">
                                <button onMouseEnter={() => setShowPersonalTooltip(true)} onMouseLeave={() => setShowPersonalTooltip(false)} className="w-[18px] h-[18px]">
                                    <svg className="block size-full" fill="none" viewBox="0 0 17 17"><circle cx="8.5" cy="8.5" fill="black" r="8.5" /><path d={svgPathsNew.p1e8c400} fill="white" /></svg>
                                </button>
                                {showPersonalTooltip && <div className="absolute top-full right-0 mt-2 bg-black text-white text-[12px] px-3 py-2 rounded-md z-50 w-[200px]">This field contains personal information</div>}
                            </div>
                        </div>
                    </div>

                    {(config.enableNodeTypeSelection || mode === 'editing') && (
                        <div className="mb-5">
                            <label className="font-['Montserrat',sans-serif] font-medium text-[16px] text-black mb-2 block">Type</label>
                            <div className="relative bg-white border border-[#c8c8c8] h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                                <select
                                    value={selectedType}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSelectedType(newValue);

                                        let isHighlight = false;
                                        try {
                                            const parsed = JSON.parse(newValue);
                                            if (parsed.systemTag === 'highlight') isHighlight = true;
                                        } catch (e) {
                                            if (newValue === "Highlight") isHighlight = true;
                                        }

                                        if (isHighlight) setIsEditingTooltip(true);

                                        if (storeRecording && recordData.length > 0) {
                                            const updated = updateStepType(recordData, stepIndex, newValue);
                                            storeRecording(updated);
                                            if (mode === 'editing') DigitalAssistantCoreSDK.dispatch(startValidation());
                                        }
                                    }}
                                    className="flex-1 bg-transparent border-none outline-none font-['Raleway',sans-serif] text-[14px] text-black appearance-none cursor-pointer"
                                >
                                    {optionsArray.map((eachOption) => (
                                        <option key={eachOption.text} value={eachOption.value}>
                                            {eachOption.text}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 w-6 h-6 pointer-events-none">
                                    <svg className="block size-full" fill="none" viewBox="0 0 24 24"><path d={svgPathsNew.p37cfbaf0} fill="black" /></svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {(config.enableTooltipAddition || mode === 'editing') && (selectedType === "Highlight" || (typeof selectedType === 'string' && selectedType.includes('"systemTag":"highlight"'))) && (
                        <div className="mb-5">
                            {!isEditingTooltip && tooltipValue && mode === 'editing' ? (
                                <div className="relative bg-white h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3 cursor-pointer" onClick={() => setIsEditingTooltip(true)}>
                                    <p className="font-['Roboto',sans-serif] text-[14px] text-black">{tooltipValue}</p>
                                </div>
                            ) : (
                                <div className="relative bg-white h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center pl-3 pr-14">
                                    <input
                                        type="text"
                                        value={tooltipValue}
                                        onChange={(e) => setTooltipValue(e.target.value)}
                                        placeholder="Custom Tool Tip (optional)"
                                        className="flex-1 bg-transparent border-none outline-none font-['Roboto',sans-serif] text-[14px] text-black"
                                    />
                                    <button onClick={handleSaveTooltip} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-[30px] flex items-center justify-center bg-black rounded" aria-label="Save tool tip">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {(config.enableSlowReplay || mode === 'editing') && (
                        <div className="mb-5">
                            <label className="font-['Montserrat',sans-serif] font-medium text-[16px] text-black mb-2 block">Delay</label>
                            <input
                                type="number"
                                placeholder="Delay in seconds (optional)"
                                value={delaySeconds}
                                onChange={(e) => {
                                    setDelaySeconds(e.target.value);
                                    setEnableSlowReplay(!!e.target.value);
                                    if (mode === 'editing') DigitalAssistantCoreSDK.dispatch(startValidation());
                                }}
                                className="w-full bg-white border border-[#c8c8c8] h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-3 font-['Raleway',sans-serif] text-[14px] text-black outline-none"
                            />
                        </div>
                    )}

                    {config.enableAISearch && (
                        <div className="mb-5 space-y-3">
                            <label className="font-['Montserrat',sans-serif] font-medium text-[16px] text-black block">AI Input</label>
                            <div className="relative bg-white h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center pl-3 pr-14">
                                <input
                                    type="text"
                                    value={inputTypeValue}
                                    onChange={(e) => setInputTypeValue(e.target.value)}
                                    placeholder="Input label (e.g. First Name)"
                                    className="flex-1 bg-transparent border-none outline-none font-['Roboto',sans-serif] text-[14px] text-black"
                                />
                                <button
                                    onClick={() => {
                                        if (storeRecording && recordData.length > 0) {
                                            storeRecording(updateCustomMetadataService(recordData, stepIndex, 'inputType', inputTypeValue));
                                            if (mode === 'editing') DigitalAssistantCoreSDK.dispatch(startValidation());
                                        }
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-[30px] flex items-center justify-center bg-black rounded"
                                    aria-label="Save input label"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                            <div className="relative bg-white h-[46px] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center pl-3 pr-14">
                                <input
                                    type="text"
                                    value={inputTypeDescription}
                                    onChange={(e) => setInputTypeDescription(e.target.value)}
                                    placeholder="Input description (e.g. Enter the user's first name)"
                                    className="flex-1 bg-transparent border-none outline-none font-['Roboto',sans-serif] text-[14px] text-black"
                                />
                                <button
                                    onClick={() => {
                                        if (storeRecording && recordData.length > 0) {
                                            storeRecording(updateCustomMetadataService(recordData, stepIndex, 'inputTypeDescription', inputTypeDescription));
                                            if (mode === 'editing') DigitalAssistantCoreSDK.dispatch(startValidation());
                                        }
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-[30px] flex items-center justify-center bg-black rounded"
                                    aria-label="Save input description"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {renderActionButtons()}

                    {mode === 'recording' && (
                        <div className="mt-4">
                            <button
                                onClick={handleFinalAction}
                                className="w-full bg-black h-[50px] rounded-[8px] font-['Raleway',sans-serif] text-[20px] text-white hover:opacity-90 transition-opacity mb-3"
                            >
                                Finish Recording
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
