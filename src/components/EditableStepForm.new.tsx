/**
 * Author: Yureswar Ravuri
 * Type: Component
 * Objective: Reusable component for editing step details
 * Associated Usage: RecordSequenceDetails.tsx, RecordedData.tsx
 *
 * REFACTORED: Now uses Redux state from core package via DigitalAssistantCore SDK
 * All business logic has been moved to @digital-assistant/core package
 */

import React, { useState, useEffect } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
    getObjData,
    StorageUtil,
    validateStepNameWithProfanity,
    toggleSkipDuringPlay,
    togglePersonalInfo,
    updateTooltipMetadata,
    updateDelayTimeMetadata,
    saveStepChanges,
    updateStepNameService,
    updateCustomMetadataService,
    isHighlightNode,
    DigitalAssistantCore,
    initializeFormForStep,
    resetForm,
    updateStepName as updateStepNameAction,
    updateTooltip as updateTooltipAction,
    updateSlowPlaybackTime as updateSlowPlaybackTimeAction,
    updateCustomMetadata as updateCustomMetadataAction,
    setStepProfanityError,
    setStepInputError,
    setTooltipError,
    setSlowPlaybackTimeError,
    setDisableTooltipSubmit,
} from "@digital-assistant/core";
import { translate } from "../util/translation";
import SelectedElement from "./SelectedElement";
import { Button } from "antd";
import { addNotification } from "../util/addNotification";
import { CONFIG } from "../config";

// Get the SDK instance
const DigitalAssistantCoreSDK = new DigitalAssistantCore(window.UDAPluginSDK);

interface EditableStepFormProps {
    item: any;
    index: number;
    recordData: any[];
    config: any;
    isUpdateMode: boolean;
    storeRecording: (data: any[]) => void;
    onSave?: (index: number) => Promise<void>;
    onCancel?: () => void;
    showLoader?: Function;
    recordingId?: number;
    autoPlay?: Function;
}

const EditableStepForm: React.FC<EditableStepFormProps> = ({
    item,
    index,
    recordData,
    config,
    isUpdateMode,
    storeRecording,
    onSave,
    onCancel,
    showLoader,
    recordingId,
    autoPlay,
}) => {
    // Subscribe to SDK state changes
    const [sdkState, setSdkState] = useState(DigitalAssistantCoreSDK.getState());

    useEffect(() => {
        const unsubscribe = DigitalAssistantCoreSDK.subscribe((newState) => {
            setSdkState(newState);
        });
        return unsubscribe;
    }, []);

    // Extract form state from SDK state
    const formState = sdkState.editableStepForm.formFields;
    const errors = sdkState.editableStepForm.errors;
    const uiState = sdkState.editableStepForm.uiState;
    const validationState = sdkState.editing;

    // Get object data from the item
    const objectData = getObjData(item?.objectdata || '{}');

    // Initialize form on mount
    useEffect(() => {
        DigitalAssistantCoreSDK.dispatch(initializeFormForStep({
            item,
            index,
            isUpdateMode,
            recordingId,
        }));

        // Cleanup: reset form on unmount
        return () => {
            DigitalAssistantCoreSDK.dispatch(resetForm());
        };
    }, [item.id]); // Re-initialize if item changes

    /**
     * Validate step name input
     */
    const validateStepNameInput = (value: string) => {
        const hasError = !value.trim() || value.length > 100;
        DigitalAssistantCoreSDK.dispatch(setStepInputError(hasError));
        return !hasError;
    };

    /**
     * Check for profanity in step name
     */
    const checkProfanityForStep = async (value: string): Promise<boolean> => {
        if (!config.enableProfanity || !value.trim()) {
            DigitalAssistantCoreSDK.dispatch(setStepProfanityError(false));
            handleStepNameChange(value);
            return false;
        }

        try {
            const result = await validateStepNameWithProfanity(value, true);

            if (!result.success && result.data?.hasProfanity) {
                DigitalAssistantCoreSDK.dispatch(setStepProfanityError(true));
                return true;
            } else {
                DigitalAssistantCoreSDK.dispatch(setStepProfanityError(false));
                handleStepNameChange(value);
                return false;
            }
        } catch (error) {
            console.error("Error checking profanity:", error);
            DigitalAssistantCoreSDK.dispatch(setStepProfanityError(false));
            return false;
        }
    };

    /**
     * Validate tooltip input
     */
    const validateTooltip = (value: string) => {
        const isValid = value && value.length > 0 && value.length <= 100;
        DigitalAssistantCoreSDK.dispatch(setTooltipError(!isValid));
        DigitalAssistantCoreSDK.dispatch(setDisableTooltipSubmit(!isValid));
    };

    /**
     * Update tooltip for a step
     */
    const updateTooltip = async (field: string) => {
        if (uiState.disableTooltipSubmitBtn) {
            return;
        }

        if (showLoader) showLoader(true);

        try {
            const result = updateTooltipMetadata(recordData, index, formState.tooltip);

            if (result.success && result.data) {
                storeRecording(result.data);
                DigitalAssistantCoreSDK.dispatch(setDisableTooltipSubmit(true));
                addNotification(translate('tooltipUpdated'), translate('tooltipUpdatedDescription'), 'success');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Error updating tooltip:", error);
            addNotification(translate('tooltipUpdateError'), translate('tooltipUpdateErrorDescription'), 'error');
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    /**
     * Validate delay time input
     */
    const validateDelayTime = (value: number | string, field: string, showNotification: boolean = false) => {
        const numValue = Number(value);
        const hasError = isNaN(numValue) || numValue < 0 || numValue > 10000;

        DigitalAssistantCoreSDK.dispatch(setSlowPlaybackTimeError(hasError));

        if (hasError) {
            return;
        }

        if (showLoader) showLoader(true);

        try {
            const result = updateDelayTimeMetadata(recordData, index, numValue);

            if (result.success && result.data) {
                storeRecording(result.data);

                if (showNotification) {
                    addNotification(translate('delayTimeUpdated'), translate('delayTimeUpdatedDescription'), 'success');
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Error updating delay time:", error);
            if (showNotification) {
                addNotification(translate('delayTimeUpdateError'), translate('delayTimeUpdateErrorDescription'), 'error');
            }
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    /**
     * Handle skip during play checkbox change
     */
    const handleSkipPlay = (e) => {
        e.stopPropagation();
        const updatedRecordData = toggleSkipDuringPlay(recordData, index);
        storeRecording(updatedRecordData);
    };

    /**
     * Handle personal info checkbox change
     */
    const handlePersonal = (e) => {
        e.stopPropagation();
        const updatedRecordData = togglePersonalInfo(recordData, index);
        storeRecording(updatedRecordData);
    };

    /**
     * Handle Step Name change
     */
    const handleStepNameChange = (value) => {
        const updatedRecordData = updateStepNameService(recordData, index, value);
        storeRecording(updatedRecordData);
    };

    /**
     * Update metadata for AI features (inputType or inputTypeDescription)
     */
    const updateMetadata = async (key: string, idx: number) => {
        if (showLoader) showLoader(true);

        const metadataValue = formState.customMetadata[key];
        if (metadataValue) {
            const updatedRecordData = updateCustomMetadataService(recordData, idx, key, metadataValue);
            storeRecording(updatedRecordData);
        }

        if (showLoader) showLoader(false);
    };

    /**
     * Save the edited step
     */
    const saveStep = async () => {
        // Don't save if there are errors
        if (errors.stepInputError || errors.stepProfanityError) {
            return;
        }

        if (showLoader) showLoader(true);

        try {
            const result = await saveStepChanges({
                recordData,
                index,
                stepEditValue: formState.stepEditValue,
                isUpdateMode,
                recordingId,
            });

            if (result.success && result.data) {
                // Store the updated data
                storeRecording(result.data);

                // Call the onSave callback if provided
                if (onSave) {
                    await onSave(index);
                } else {
                    addNotification(translate('stepUpdated'), translate('stepUpdatedDescription'), 'success');
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Error saving step:", error);
            addNotification(translate('stepUpdateError'), translate('stepUpdateErrorDescription'), 'error');
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    // Input change handler
    const handleInputChange = (e) => {
        e.stopPropagation();
        const value = e.target.value;
        DigitalAssistantCoreSDK.dispatch(updateStepNameAction(value));
        validateStepNameInput(value);
    };

    return (
        <div style={{ width: '100%', padding: '10px' }} onClick={(e) => e.stopPropagation()}>
            <span style={{ flex: 2 }}>
                <input
                    type="text"
                    id="uda-edited-name"
                    name="uda-edited-name"
                    className={`uda-form-input uda_exclude ${errors.stepProfanityError ? "profanity" : ""}`}
                    placeholder="Enter Name"
                    onChange={handleInputChange}
                    onBlur={async (e) => {
                        e.stopPropagation();
                        await checkProfanityForStep(e.target.value);
                    }}
                    style={{ width: "85%" }}
                    onClick={(e) => e.stopPropagation()}
                    value={formState.stepEditValue}
                />
                {errors.stepProfanityError && <span className={`uda-alert`}> {translate('profanityDetected')}</span>}
                {errors.stepInputError && <span className={`uda-alert`}> {translate('inputError')}</span>}
            </span>

            {config.enableSkipDuringPlay && (
                <div className="flex-card flex-vcenter small-text">
                    <input
                        type="checkbox"
                        id="UDA-skip-duringPlay"
                        className="uda-checkbox flex-vcenter uda_exclude"
                        value={(objectData?.meta?.skipDuringPlay) ? 1 : 0}
                        checked={(objectData?.meta?.skipDuringPlay)}
                        onChange={handleSkipPlay}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <label className="uda-checkbox-label">{translate('skipDuringPlay')}</label>
                    <span className="info-icon ms-1" title={translate('skipInfo')}>
                        <InfoCircleOutlined />
                    </span>
                </div>
            )}

            <div className="flex-card flex-vcenter small-text">
                <input
                    type="checkbox"
                    id="isPersonal"
                    className="uda-checkbox uda_exclude"
                    value={(objectData?.meta?.isPersonal) ? 1 : 0}
                    checked={(objectData?.meta?.isPersonal)}
                    onChange={handlePersonal}
                    onClick={(e) => e.stopPropagation()}
                />
                <label className="uda-checkbox-label">{translate('personalInfoLabel')}</label>
                <span className="info-icon" title={translate('personalInfoTooltip')}>
                    <InfoCircleOutlined />
                </span>
            </div>

            {(config.enableTooltipAddition === true && isHighlightNode(objectData)) && (
                <div className="uda-recording uda_exclude" style={{ textAlign: "center" }}>
                    <input
                        type="text"
                        id="uda-edited-tooltip"
                        name="uda-edited-tooltip"
                        className="uda-form-input uda_exclude"
                        placeholder={translate('toolTipPlaceHolder')}
                        style={{ width: "68% !important" }}
                        onChange={(e) => {
                            DigitalAssistantCoreSDK.dispatch(updateTooltipAction(e.target.value));
                            validateTooltip(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        value={formState.tooltip}
                    />
                    {errors.tooltipError && <span className={`uda-alert`}> {translate('inputError')}</span>}
                    <div>
                        <button
                            className={`uda-tutorial-btn uda_exclude ${(uiState.disableTooltipSubmitBtn) ? "disabled" : ""}`}
                            style={{ color: "#fff", marginTop: "10px" }}
                            id="uda-tooltip-save"
                            disabled={uiState.disableTooltipSubmitBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                updateTooltip('tooltipInfo');
                            }}
                        >
                            {(!objectData?.meta?.tooltipInfo) ? translate('submitTooltip') : translate('updateTooltip')}
                        </button>
                    </div>
                </div>
            )}

            {/* AI Search features */}
            {global.UDAGlobalConfig.enableAISearch && (
                <>
                    <div className="uda-recording uda_exclude" style={{ textAlign: "center" }}>
                        <input
                            type="text"
                            id="uda-edited-customMetaData"
                            name="uda-edited-customMetaData"
                            className="uda-form-input uda_exclude"
                            placeholder={translate('customMetaData')}
                            style={{ width: "68% !important" }}
                            onChange={(e: any) => {
                                DigitalAssistantCoreSDK.dispatch(updateCustomMetadataAction({ key: 'inputType', value: e.target.value }));
                            }}
                            value={formState.customMetadata.inputType || objectData.meta?.inputType || ''}
                        />
                        <span>
                            <button
                                className={`uda-tutorial-btn uda_exclude`}
                                style={{ color: "#fff", marginTop: "10px" }}
                                id="uda-customMetadata-save"
                                onClick={async () => {
                                    await updateMetadata('inputType', index)
                                }}
                            >
                                {(!objectData.meta?.inputType) ? translate('submit') : translate('update')}
                            </button>
                        </span>
                    </div>

                    <div className="uda-recording uda_exclude" style={{ textAlign: "center" }}>
                        <input
                            type="text"
                            id="uda-edited-customMetaDataDescription"
                            name="uda-edited-customMetaData"
                            className="uda-form-input uda_exclude"
                            placeholder={translate('customMetadataDescriptionPlaceHolder')}
                            style={{ width: "68% !important" }}
                            onChange={(e: any) => {
                                DigitalAssistantCoreSDK.dispatch(updateCustomMetadataAction({ key: 'inputTypeDescription', value: e.target.value }));
                            }}
                            value={formState.customMetadata.inputTypeDescription || objectData.meta?.inputTypeDescription || ''}
                        />
                        <span>
                            <button
                                className={`uda-tutorial-btn uda_exclude`}
                                style={{ color: "#fff", marginTop: "10px" }}
                                id="uda-customMetadataDescription-save"
                                onClick={async () => {
                                    await updateMetadata('inputTypeDescription', index)
                                }}
                            >
                                {(!objectData.meta?.inputTypeDescription) ? translate('submit') : translate('update')}
                            </button>
                        </span>
                    </div>
                </>
            )}

            <SelectedElement
                data={item}
                index={index}
                recordData={recordData}
                config={config}
                storeRecording={storeRecording}
            />

            {(config.enableSlowReplay === true) && (
                <div className="uda-recording uda_exclude" style={{ textAlign: "center" }}>
                    <input
                        type="number"
                        id="uda-slowPlaybackTime"
                        name="uda-slowPlaybackTime"
                        className="uda-form-input uda_exclude"
                        placeholder={translate('playBackTimePlaceHolder')}
                        style={{ width: "68% !important" }}
                        onChange={(e) => {
                            DigitalAssistantCoreSDK.dispatch(updateSlowPlaybackTimeAction(e.target.value));
                            validateDelayTime(e.target.value, 'slowPlaybackTime');
                        }}
                        onBlur={(e) => {
                            validateDelayTime(e.target.value, 'slowPlaybackTime', true);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        value={formState.slowPlaybackTime}
                    />
                    {errors.slowPlaybackTimeError && <span className={`uda-alert`}> {translate('inputError')}</span>}
                </div>
            )}

            {isUpdateMode && (
                <div style={{ marginTop: '10px' }}>
                    <Button
                        size="small"
                        type="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            StorageUtil.add(true, CONFIG.RECORDING_IS_PLAYING, true);
                            autoPlay();
                        }}
                        disabled={!validationState.validationRequired}
                        className="uda_exclude"
                    >
                        Validate
                    </Button>
                    <Button
                        size="small"
                        type="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            saveStep();
                        }}
                        disabled={!validationState.validationCompleted}
                        className="uda_exclude"
                    >
                        Save
                    </Button>
                    <Button
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onCancel) onCancel();
                        }}
                        className="uda_exclude"
                        style={{ marginLeft: '5px' }}
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EditableStepForm;
