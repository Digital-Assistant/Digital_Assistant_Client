/**
 * Author: Yureswar Ravuri
 * Type: Component
 * Objective: Reusable component for editing step details
 * Associated Usage: RecordSequenceDetails.tsx, RecordedData.tsx
 */

import React, { useState, useEffect } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getObjData } from "../util";
import { profanityCheck } from "../services/recordService";
import { translate } from "../util/translation";
import { isHighlightNode } from "../util/checkNode";
import SelectedElement from "./SelectedElement";
import { Button } from "antd";

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
                                                               showLoader
                                                           }) => {
    const objectData = getObjData(item.objectdata);

    // State for form fields
    const [stepEditValue, setStepEditValue] = useState<string>('');
    const [stepProfanityError, setStepProfanityError] = useState<boolean>(false);
    const [stepInputError, setStepInputError] = useState<boolean>(false);
    const [inputError, setInputError] = useState<any>({});
    const [tooltip, setTooltip] = useState<string>('');
    const [disableTooltipSubmitBtn, setDisableTooltipSubmitBtn] = useState<boolean>(true);

    // Initialize form values from item data
    useEffect(() => {
        // Prefill the step name with existing data
        setStepEditValue(objectData.meta?.displayText || item.clickednodename);

        // Prefill the tooltip with existing data
        setTooltip(objectData.meta?.tooltipInfo || '');

        // Enable tooltip submit button if tooltip already exists
        setDisableTooltipSubmitBtn(!objectData.meta?.tooltipInfo);
    }, [item, objectData]);

    /**
     * Validate step name input
     * @param value - The new value for the step
     */
    const validateStepName = async (value: string) => {
        setStepEditValue(value);

        // Basic validation - check if empty or too long
        if (!value.trim() || value.length > 100) {
            setStepInputError(true);
            return false;
        } else {
            setStepInputError(false);
            return true;
        }
    };

    /**
     * Check for profanity in step name
     * @param value - The value to check for profanity
     */
    const checkProfanityForStep = async (value: string) => {
        if (!config.enableProfanity || !value.trim()) {
            setStepProfanityError(false);
            return;
        }

        try {
            const response = await profanityCheck(value);

            if (response.Terms && response.Terms.length > 0) {
                setStepProfanityError(true);
            } else {
                setStepProfanityError(false);
            }
        } catch (error) {
            console.error("Error checking profanity:", error);
            setStepProfanityError(false);
        }
    };

    /**
     * Validate tooltip input
     * @param value - The tooltip text to validate
     */
    const validateTooltip = async (value: string) => {
        setTooltip(value);

        // Basic validation - check if empty or too long
        if (value && value.length > 0 && value.length <= 100) {
            setDisableTooltipSubmitBtn(false);
            setInputError({...inputError, tooltip: false});
        } else {
            setDisableTooltipSubmitBtn(true);
            setInputError({...inputError, tooltip: true});
        }
    };

    /**
     * Update tooltip for a step
     * @param field - The field to update
     */
    const updateTooltip = async (field: string) => {
        if (disableTooltipSubmitBtn) {
            return;
        }

        if (showLoader) showLoader(true);

        try {
            const updatedRecordData = [...recordData];
            const nodeData = getObjData(updatedRecordData[index].objectdata);
            if (!nodeData.meta) {
                nodeData.meta = {};
            }
            nodeData.meta[field] = tooltip;
            updatedRecordData[index].objectdata = JSON.stringify(nodeData);

            storeRecording(updatedRecordData);
            setDisableTooltipSubmitBtn(true);
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    /**
     * Validate delay time input
     * @param value - The delay time value
     * @param field - The field name
     */
    const validateDelayTime = async (value: number, field: string) => {
        // Implement validation logic for delay time
        if (isNaN(value) || value < 0 || value > 10000) {
            setInputError({...inputError, [field]: true});
            return;
        } else {
            setInputError({...inputError, [field]: false});
        }

        if (showLoader) showLoader(true);

        try {
            const updatedRecordData = [...recordData];
            const nodeData = getObjData(updatedRecordData[index].objectdata);
            if (!nodeData.meta) {
                nodeData.meta = {};
            }
            nodeData.meta[field] = value;
            updatedRecordData[index].objectdata = JSON.stringify(nodeData);

            storeRecording(updatedRecordData);
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    /**
     * Handle skip during play checkbox change
     */
    const handleSkipPlay = () => {
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
    const handlePersonal = () => {
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
        if (stepInputError || stepProfanityError) {
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
            nodeData.meta.displayText = stepEditValue;

            // Convert back to string and update the objectdata
            updatedRecordData[index].objectdata = JSON.stringify(nodeData);

            // Update the clickednodename field as well for backward compatibility
            updatedRecordData[index].clickednodename = stepEditValue;

            // Store the updated data
            storeRecording(updatedRecordData);

            // Call the onSave callback if provided
            if (onSave) {
                await onSave(index);
            }
        } catch (error) {
            console.error("Error saving step:", error);
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    return (
        <div style={{ width: '100%', padding: '10px' }}>
          <span style={{flex: 2}}>
            <input
                type="text"
                id="uda-edited-name"
                name="uda-edited-name"
                className={`uda-form-input uda_exclude ${
                    stepProfanityError ? "profanity" : ""
                }`}
                placeholder="Enter Name"
                onChange={async (e) => {
                    await validateStepName(e.target.value);
                }}
                onBlur={async (e) => {
                    await checkProfanityForStep(e.target.value);
                }}
                style={{width: "85%"}}
                onClick={(e) => e.stopPropagation()}
                value={stepEditValue}
            />
              {stepProfanityError &&
                  <span className={`uda-alert`}> {translate('profanityDetected')}</span>}
              {stepInputError &&
                  <span className={`uda-alert`}> {translate('inputError')}</span>}
          </span>

            {config.enableSkipDuringPlay &&
                <div className="flex-card flex-vcenter small-text">
                    <input
                        type="checkbox"
                        id="UDA-skip-duringPlay"
                        className="uda-checkbox flex-vcenter uda_exclude"
                        value={(objectData.meta?.skipDuringPlay) ? 1 : 0}
                        checked={(objectData.meta?.skipDuringPlay)}
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
                    value={(objectData.meta?.isPersonal) ? 1 : 0}
                    checked={(objectData.meta?.isPersonal)}
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
                        onChange={async (e) => {
                            await validateTooltip(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        value={tooltip}
                    />
                    {inputError.tooltip &&
                        <span className={`uda-alert`}> {translate('inputError')}</span>
                    }
                    <span>
                        <button
                            className={`uda-tutorial-btn uda_exclude ${(disableTooltipSubmitBtn) ? "disabled" : ""}`}
                            style={{color: "#fff", marginTop: "10px"}}
                            id="uda-tooltip-save"
                            disabled={disableTooltipSubmitBtn}
                            onClick={async (e) => {
                                e.stopPropagation();
                                await updateTooltip('tooltipInfo');
                            }}
                        >
                          {(!objectData.meta?.tooltipInfo) ? translate('submitTooltip') : translate('updateTooltip')}
                        </button>
                    </span>
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
                        onChange={async (e) => {
                            await validateDelayTime(parseInt(e.target.value), 'slowPlaybackTime');
                        }}
                        onBlur={async (e) => {
                            await validateDelayTime(parseInt(e.target.value), 'slowPlaybackTime');
                        }}
                        onClick={(e) => e.stopPropagation()}
                        value={objectData.meta?.slowPlaybackTime || ''}
                    />
                    {inputError?.slowPlaybackTime &&
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

