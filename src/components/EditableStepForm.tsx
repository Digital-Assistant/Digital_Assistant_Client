/**
 * Author: Yureswar Ravuri
 * Type: Component
 * Objective: Reusable component for editing step details
 * Associated Usage: RecordSequenceDetails.tsx, RecordedData.tsx
 */

import React, { useState, useEffect, useRef } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getObjData } from "../util";
import { profanityCheck, updateRecordClicks, updateSequnceIndex } from "../services/recordService";
import { translate } from "../util/translation";
import { isHighlightNode } from "../util/checkNode";
import SelectedElement from "./SelectedElement";
import { Button } from "antd";
import { addNotification } from "../util/addNotification";

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
                                                               recordingId
                                                           }) => {
    // Create refs to track if component is mounted
    const isMounted = useRef(true);

    // Get object data from the item
    const objectData = getObjData(item?.objectdata || '{}');

    // State for form fields - using refs to prevent re-renders
    const [formState, setFormState] = useState({
        stepEditValue: '',
        tooltip: '',
        slowPlaybackTime: '',
        stepProfanityError: false,
        stepInputError: false,
        inputError: {tooltip: false, slowPlaybackTime: false},
        disableTooltipSubmitBtn: true
    });

    // Initialize form values from item data only once on mount
    useEffect(() => {
        // Get the display text from meta or use clickednodename as fallback
        const displayText = objectData?.meta?.displayText || item?.clickednodename || '';

        // Get tooltip info from meta
        const tooltipInfo = objectData?.meta?.tooltipInfo || '';

        // Get slow playback time from meta
        const playbackTime = objectData?.meta?.slowPlaybackTime || '';

        setFormState({
            ...formState,
            stepEditValue: displayText,
            tooltip: tooltipInfo,
            slowPlaybackTime: playbackTime,
            disableTooltipSubmitBtn: tooltipInfo === ''
        });

        // Cleanup function to set isMounted to false when component unmounts
        return () => {
            isMounted.current = false;
        };
    }, []); // Empty dependency array means this runs once on mount

    // Update form state safely
    const updateFormState = (updates) => {
        if (isMounted.current) {
            setFormState(prevState => ({
                ...prevState,
                ...updates
            }));
        }
    };

    /**
     * Validate step name input
     * @param value - The new value for the step
     */
    const validateStepName = (value: string) => {
        // Basic validation - check if empty or too long
        const hasError = !value.trim() || value.length > 100;

        updateFormState({
            stepEditValue: value,
            stepInputError: hasError
        });

        return !hasError;
    };

    /**
     * Check for profanity in step name
     * @param value - The value to check for profanity
     */
    const checkProfanityForStep = async (value: string) => {
        if (!config.enableProfanity || !value.trim()) {
            updateFormState({ stepProfanityError: false });
            return;
        }

        try {
            const response = await profanityCheck(value);

            if (response.Terms && response.Terms.length > 0) {
                updateFormState({ stepProfanityError: true });
            } else {
                updateFormState({ stepProfanityError: false });
            }
        } catch (error) {
            console.error("Error checking profanity:", error);
            updateFormState({ stepProfanityError: false });
        }
    };

    /**
     * Validate tooltip input
     * @param value - The tooltip text to validate
     */
    const validateTooltip = (value: string) => {
        // Basic validation - check if empty or too long
        const isValid = value && value.length > 0 && value.length <= 100;

        const newInputError = {...formState.inputError, tooltip: !isValid};

        updateFormState({
            tooltip: value,
            disableTooltipSubmitBtn: !isValid,
            inputError: newInputError
        });
    };

    /**
     * Update tooltip for a step
     * @param field - The field to update
     */
    const updateTooltip = async (field: string) => {
        if (formState.disableTooltipSubmitBtn) {
            return;
        }

        if (showLoader) showLoader(true);

        try {
            const updatedRecordData = [...recordData];
            const nodeData = getObjData(updatedRecordData[index].objectdata);
            if (!nodeData.meta) {
                nodeData.meta = {};
            }
            nodeData.meta[field] = formState.tooltip;
            updatedRecordData[index].objectdata = JSON.stringify(nodeData);

            storeRecording(updatedRecordData);
            updateFormState({ disableTooltipSubmitBtn: true });

            addNotification(translate('tooltipUpdated'), translate('tooltipUpdatedDescription'), 'success');
        } catch (error) {
            console.error("Error updating tooltip:", error);
            addNotification(translate('tooltipUpdateError'), translate('tooltipUpdateErrorDescription'), 'error');
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    /**
     * Validate delay time input
     * @param value - The delay time value
     * @param field - The field name
     */
    const validateDelayTime = (value: number | string, field: string, showNotification: boolean = false) => {
        const numValue = Number(value);

        // Implement validation logic for delay time
        const hasError = isNaN(numValue) || numValue < 0 || numValue > 10000;

        const newInputError = {...formState.inputError, [field]: hasError};

        updateFormState({
            slowPlaybackTime: value,
            inputError: newInputError
        });

        if (hasError) {
            return;
        }

        if (showLoader) showLoader(true);

        try {
            const updatedRecordData = [...recordData];
            const nodeData = getObjData(updatedRecordData[index].objectdata);
            if (!nodeData.meta) {
                nodeData.meta = {};
            }
            nodeData.meta[field] = numValue;
            updatedRecordData[index].objectdata = JSON.stringify(nodeData);

            storeRecording(updatedRecordData);

            if(showNotification) {
                addNotification(translate('delayTimeUpdated'), translate('delayTimeUpdatedDescription'), 'success');
            }
        } catch (error) {
            console.error("Error updating delay time:", error);
            if(showNotification) {
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

        const updatedRecordData = [...recordData];
        const nodeData = getObjData(updatedRecordData[index].objectdata);
        if (!nodeData.meta) {
            nodeData.meta = {};
        }
        nodeData.meta.skipDuringPlay = !nodeData.meta.skipDuringPlay;
        updatedRecordData[index].objectdata = JSON.stringify(nodeData);

        storeRecording(updatedRecordData);
    };

    /**
     * Handle personal info checkbox change
     */
    const handlePersonal = (e) => {
        e.stopPropagation();

        const updatedRecordData = [...recordData];
        const nodeData = getObjData(updatedRecordData[index].objectdata);
        if (!nodeData.meta) {
            nodeData.meta = {};
        }
        nodeData.meta.isPersonal = !nodeData.meta.isPersonal;
        updatedRecordData[index].objectdata = JSON.stringify(nodeData);

        storeRecording(updatedRecordData);
    };

    /**
     * Save the edited step
     */
    const saveStep = async () => {
        // Don't save if there are errors
        if (formState.stepInputError || formState.stepProfanityError) {
            return;
        }

        if (showLoader) showLoader(true);

        try {
            // Create a copy of the current data
            const updatedRecordData = [...recordData];

            // Update the node's objectdata to include the new name
            const nodeData = getObjData(updatedRecordData[index].objectdata);

            // Update the displayText in meta
            if (!nodeData.meta) {
                nodeData.meta = {};
            }
            nodeData.meta.displayText = formState.stepEditValue;

            // Convert back to string and update the objectdata
            updatedRecordData[index].objectdata = JSON.stringify(nodeData);

            // Update the clickednodename field as well for backward compatibility
            updatedRecordData[index].clickednodename = formState.stepEditValue;

            // Store the updated data
            storeRecording(updatedRecordData);

            // Add explicit local storage saving
            localStorage.setItem('recordedData', JSON.stringify(updatedRecordData));

            // If in update mode, update the record in the backend
            if (isUpdateMode && recordingId) {
                await updateRecordClicks(updatedRecordData[index]);
                await updateSequnceIndex(recordingId);
            }

            // Call the onSave callback if provided
            if (onSave) {
                await onSave(index);
            } else {
                addNotification(translate('stepUpdated'), translate('stepUpdatedDescription'), 'success');
            }
        } catch (error) {
            console.error("Error saving step:", error);
            addNotification(translate('stepUpdateError'), translate('stepUpdateErrorDescription'), 'error');
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    // Prevent re-renders from affecting the form
    const handleInputChange = (e) => {
        e.stopPropagation();
        validateStepName(e.target.value);
    };

    return (
        <div style={{ width: '100%', padding: '10px' }} onClick={(e) => e.stopPropagation()}>
          <span style={{flex: 2}}>
            <input
                type="text"
                id="uda-edited-name"
                name="uda-edited-name"
                className={`uda-form-input uda_exclude ${
                    formState.stepProfanityError ? "profanity" : ""
                }`}
                placeholder="Enter Name"
                onChange={handleInputChange}
                onBlur={(e) => {
                    checkProfanityForStep(e.target.value);
                    if (!formState.stepInputError && !formState.stepProfanityError) {
                        saveStep();
                    }
                }}
                style={{width: "85%"}}
                onClick={(e) => e.stopPropagation()}
                value={formState.stepEditValue}
            />
              {formState.stepProfanityError &&
                  <span className={`uda-alert`}> {translate('profanityDetected')}</span>}
              {formState.stepInputError &&
                  <span className={`uda-alert`}> {translate('inputError')}</span>}
          </span>

            {config.enableSkipDuringPlay &&
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
                    <span
                        className="info-icon ms-1"
                        title={translate('skipInfo')}
                    >
                        <InfoCircleOutlined/>
                    </span>
                </div>
            }

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
                  <InfoCircleOutlined/>
                </span>
            </div>

            {(config.enableTooltipAddition === true && isHighlightNode(objectData)) &&
                <div className="uda-recording uda_exclude" style={{textAlign: "center"}}>
                    <input
                        type="text"
                        id="uda-edited-tooltip"
                        name="uda-edited-tooltip"
                        className="uda-form-input uda_exclude"
                        placeholder={translate('toolTipPlaceHolder')}
                        style={{width: "68% !important"}}
                        onChange={(e) => {
                            validateTooltip(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        value={formState.tooltip}
                    />
                    {formState.inputError?.tooltip &&
                        <span className={`uda-alert`}> {translate('inputError')}</span>
                    }
                    <div>
                        <button
                            className={`uda-tutorial-btn uda_exclude ${(formState.disableTooltipSubmitBtn) ? "disabled" : ""}`}
                            style={{color: "#fff", marginTop: "10px"}}
                            id="uda-tooltip-save"
                            disabled={formState.disableTooltipSubmitBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                updateTooltip('tooltipInfo');
                            }}
                        >
                          {(!objectData?.meta?.tooltipInfo) ? translate('submitTooltip') : translate('updateTooltip')}
                        </button>
                    </div>
                </div>
            }

            <SelectedElement
                data={item}
                index={index}
                recordData={recordData}
                config={config}
                storeRecording={storeRecording}
            />

            {(config.enableSlowReplay === true) &&
                <div className="uda-recording uda_exclude" style={{textAlign: "center"}}>
                    <input
                        type="number"
                        id="uda-slowPlaybackTime"
                        name="uda-slowPlaybackTime"
                        className="uda-form-input uda_exclude"
                        placeholder={translate('playBackTimePlaceHolder')}
                        style={{width: "68% !important"}}
                        onChange={(e) => {
                            validateDelayTime(e.target.value, 'slowPlaybackTime');
                        }}
                        onBlur={(e) => {
                            validateDelayTime(e.target.value, 'slowPlaybackTime', true);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        value={formState.slowPlaybackTime}
                    />
                    {formState.inputError?.slowPlaybackTime &&
                        <span className={`uda-alert`}> {translate('inputError')}</span>}
                </div>
            }

            {isUpdateMode && (
                <div style={{ marginTop: '10px' }}>
                    <Button
                        size="small"
                        type="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            saveStep();
                        }}
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


