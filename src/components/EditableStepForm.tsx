/**
 * Author: Yureswar Ravuri
 * Type: Component
 * Objective: Reusable component for editing step details with validation through playback
 * Associated Usage: RecordSequenceDetails.tsx, RecordedData.tsx
 */

import React, { useState, useEffect, useRef } from "react";
import { InfoCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { getObjData, setToStore } from "../util";
import { profanityCheck, updateRecordClicks, updateSequnceIndex } from "../services/recordService";
import { translate } from "../util/translation";
import { isHighlightNode } from "../util/checkNode";
import SelectedElement from "./SelectedElement";
import { Button, Tooltip } from "antd";
import { addNotification } from "../util/addNotification";
import { CONFIG } from "../config";
import { trigger } from "../util/events";

interface EditableStepFormProps {
    item: any;
    index: number;
    recordData: any[];
    config: any;
    isUpdateMode: boolean;  // This indicates if we're in update mode (editing existing step)
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

    // Generate a unique key for this edit session - only used in update mode
    const editSessionKey = isUpdateMode ? `editValidation` : null;

    // State to track if the edited sequence has been successfully played - only relevant in update mode
    const [playbackValidated, setPlaybackValidated] = useState(() => {
        // Only check localStorage if we're in update mode
        if (isUpdateMode && editSessionKey) {
            const savedState = localStorage.getItem(editSessionKey);
            return savedState === 'validated';
        }
        return false;
    });

    // State to track if temporary changes have been stored - only relevant in update mode
    const [changesPending, setChangesPending] = useState(() => {
        // Only check for pending changes if we're in update mode
        if (isUpdateMode) {
            return localStorage.getItem(CONFIG.editingConfig.storageName.editDataStorageName) !== null;
        }
        return false;
    });

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

        // Only set up playback completion listener if we're in update mode
        if (isUpdateMode) {
            // Setup event listener for playback completion
            const handlePlaybackComplete = (event) => {
                console.log(event);
                // Check if this is the step we're editing
                const editingIndex = localStorage.getItem(CONFIG.editingConfig.storageName.editModeStorageName);
                if (editingIndex && parseInt(editingIndex, 10) === index) {
                    if (changesPending) {
                        // Store validation state in localStorage
                        localStorage.setItem(editSessionKey, 'validated');
                        setPlaybackValidated(true);

                        // Force panel to open to show the save button
                        trigger("openPanel", {action: 'openPanel'});

                        addNotification(
                            translate('playbackValidated'),
                            translate('playbackValidatedDescription'),
                            'success'
                        );
                    }
                }
            };

            // Add event listener for playback completion
            window.addEventListener('UDAValidationCompleted', handlePlaybackComplete);

            // Cleanup function to remove event listener
            return () => {
                window.removeEventListener('UDAPlayCompleted', handlePlaybackComplete);
            };
        }

        // Cleanup function to set isMounted to false when component unmounts
        return () => {
            isMounted.current = false;
        };
    }, [editSessionKey, isUpdateMode, index]);

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
     * @returns {boolean} - Whether the input is valid
     */
    const validateStepName = (value: string) => {
        // Basic validation - check if empty or too long
        const hasError = !value.trim() || value.length > 100;

        updateFormState({
            stepEditValue: value,
            stepInputError: hasError
        });

        // Reset validation state when input changes (only in update mode)
        if (isUpdateMode && playbackValidated && editSessionKey) {
            localStorage.removeItem(editSessionKey);
            setPlaybackValidated(false);
        } else if(editSessionKey) {
            localStorage.removeItem(editSessionKey);
            setPlaybackValidated(false);
            setChangesPending(true);
        }

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
            addNotification(
                translate('profanityCheckError'),
                translate('profanityCheckErrorDescription'),
                'error'
            );
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

        // Reset validation state when input changes (only in update mode)
        if (isUpdateMode && playbackValidated && editSessionKey) {
            localStorage.removeItem(editSessionKey);
            setPlaybackValidated(false);
        } else if(editSessionKey) {
            localStorage.removeItem(editSessionKey);
            setPlaybackValidated(false);
            setChangesPending(true);
        }
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

            // Store temporary changes in local storage (only in update mode)
            if (isUpdateMode) {
                // localStorage.setItem(CONFIG.editingConfig.storageName.editDataStorageName, JSON.stringify(updatedRecordData));
                setChangesPending(true);

                // Reset validation state
                if (editSessionKey) {
                    localStorage.removeItem(editSessionKey);
                    setPlaybackValidated(false);
                    setChangesPending(true);
                }
            } else if(editSessionKey) {
                localStorage.removeItem(editSessionKey);
                setPlaybackValidated(false);
                setChangesPending(true);
            }

            updateFormState({ disableTooltipSubmitBtn: true });

            addNotification(
                translate('tooltipUpdated'),
                translate('tooltipUpdatedDescription'),
                'info'
            );
        } catch (error) {
            console.error("Error updating tooltip:", error);
            addNotification(
                translate('tooltipUpdateError'),
                translate('tooltipUpdateErrorDescription'),
                'error'
            );
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    /**
     * Validate delay time input
     * @param value - The delay time value
     * @param field - The field name
     * @param showNotification - Whether to show a notification
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

        // Reset validation state when input changes (only in update mode)
        if (isUpdateMode && playbackValidated && editSessionKey) {
            localStorage.removeItem(editSessionKey);
            setPlaybackValidated(false);
        } else if(editSessionKey) {
            localStorage.removeItem(editSessionKey);
            setPlaybackValidated(false);
            setChangesPending(true);
        }

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

            // Store temporary changes in local storage (only in update mode)
            if (isUpdateMode) {
                // localStorage.setItem(CONFIG.editingConfig.storageName.editDataStorageName, JSON.stringify(updatedRecordData));
                setChangesPending(true);

                // Reset validation state
                if(editSessionKey) {
                    localStorage.removeItem(editSessionKey);
                    setPlaybackValidated(false);
                    setChangesPending(true);
                }
            }

            if(showNotification) {
                addNotification(
                    translate('delayTimeUpdated'),
                    translate('delayTimeUpdatedDescription'),
                    'info'
                );
            }
        } catch (error) {
            console.error("Error updating delay time:", error);
            if(showNotification) {
                addNotification(
                    translate('delayTimeUpdateError'),
                    translate('delayTimeUpdateErrorDescription'),
                    'error'
                );
            }
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    /**
     * Handle skip during play checkbox change
     * @param e - The event object
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

        // Store temporary changes in local storage (only in update mode)
        if (isUpdateMode) {
            // localStorage.setItem(CONFIG.editingConfig.storageName.editDataStorageName, JSON.stringify(updatedRecordData));
            setChangesPending(true);

            // Reset validation state
            if(editSessionKey) {
                localStorage.removeItem(editSessionKey);
                setPlaybackValidated(false);
                setChangesPending(true);
            }
        } else if(editSessionKey) {
            localStorage.removeItem(editSessionKey);
            setPlaybackValidated(false);
            setChangesPending(true);
        }
    };

    /**
     * Handle personal info checkbox change
     * @param e - The event object
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

        // Store temporary changes in local storage (only in update mode)
        if (isUpdateMode) {
            // localStorage.setItem(CONFIG.editingConfig.storageName.editDataStorageName, JSON.stringify(updatedRecordData));
            setChangesPending(true);

            // Reset validation state
            if (editSessionKey) {
                localStorage.removeItem(editSessionKey);
                setPlaybackValidated(false);
                setChangesPending(true);
            }
        } else if(editSessionKey) {
            localStorage.removeItem(editSessionKey);
            setPlaybackValidated(false);
            setChangesPending(true);
        }
    };

    /**
     * Temporarily save the edited step to local storage for validation
     * Only used in update mode
     * @returns {boolean} - Whether the step was successfully saved temporarily
     */
    const saveStepTemporarily = () => {
        // Only applicable in update mode
        if (!isUpdateMode) return true;

        // Don't save if there are errors
        if (formState.stepInputError || formState.stepProfanityError) {
            return false;
        }

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

            // Store temporary changes in local storage
            // localStorage.setItem(CONFIG.editingConfig.storageName.editDataStorageName, JSON.stringify(updatedRecordData));
            setChangesPending(true);

            // Reset validation state
            if (editSessionKey) {
                localStorage.removeItem(editSessionKey);
                setPlaybackValidated(false);
            }

            return true;
        } catch (error) {
            console.error("Error saving step temporarily:", error);
            addNotification(
                translate('tempSaveError'),
                translate('tempSaveErrorDescription'),
                'error'
            );
            return false;
        }
    };

    /**
     * Start playback to validate the edited step
     * Only used in update mode
     */
    const validateByPlayback = () => {
        // Only applicable in update mode
        if (!isUpdateMode) return;

        if (!saveStepTemporarily()) {
            return;
        }

        try {
            // Get the current recording data
            const updatedRecordData = [...recordData];

            // Reset all steps' status to ensure full playback
            for (let i = 0; i < updatedRecordData.length; i++) {
                delete updatedRecordData[i].status;
            }

            // Store the updated recording data
            storeRecording(updatedRecordData);

            // Get the full recording object from localStorage
            let currentRecording = JSON.parse(localStorage.getItem(CONFIG.SELECTED_RECORDING) || '{}');

            // Update the recording with our edited data
            currentRecording.userclicknodesSet = updatedRecordData;

            // Save back to localStorage
            setToStore(currentRecording, CONFIG.SELECTED_RECORDING, false);

            // Save the current editing index to localStorage
            localStorage.setItem(CONFIG.editingConfig.storageName.indexStorageName, index.toString());

            // Close the panel
            trigger("closePanel", {action: 'closePanel'});

            // Trigger the global play event
            trigger("UDAValidatePlay", {action: 'play'});

            addNotification(
                translate('validationStarted'),
                translate('validationStartedDescription'),
                'info'
            );
        } catch (error) {
            console.error("Error starting validation playback:", error);
            addNotification(
                translate('validationError'),
                translate('validationErrorDescription'),
                'error'
            );
        }
    };

    /**
     * Save the edited step to the server
     */
    const saveStep = async () => {
        // Don't save if there are errors
        if (formState.stepInputError || formState.stepProfanityError) {
            return;
        }

        // In update mode, check if validation is required but not completed
        if (isUpdateMode && !playbackValidated && changesPending) {
            addNotification(
                translate('playbackValidationRequired'),
                translate('playbackValidationRequiredDescription'),
                'warning'
            );
            return;
        } else if(isUpdateMode && playbackValidated && changesPending){
            localStorage.removeItem(CONFIG.editingConfig.storageName.validationStorageName);
        }

        if (showLoader) showLoader(true);

        try {
            // In update mode, get the temporarily stored data if it exists
            let updatedRecordData;

            // In recording mode, just use the current data
            updatedRecordData = recordData;

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

            // If in update mode, update the record in the backend
            if (isUpdateMode && recordingId) {
                await updateRecordClicks(updatedRecordData[index]);
                await updateSequnceIndex(recordingId);

                // Clean up temporary storage
                localStorage.removeItem(CONFIG.editingConfig.storageName.editDataStorageName);
                localStorage.removeItem(CONFIG.editingConfig.storageName.indexStorageName);
                if (editSessionKey) {
                    localStorage.removeItem(editSessionKey);
                }
                setChangesPending(false);
                setPlaybackValidated(false);
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

    // Handle input blur event
    const handleInputBlur = (e) => {
        e.stopPropagation();
        checkProfanityForStep(e.target.value);

        // In update mode, save temporarily when user leaves the input field
        if (isUpdateMode && !formState.stepInputError && !formState.stepProfanityError) {
            saveStepTemporarily();
            addNotification(
                translate('changesPending'),
                translate('validatePlaybackRequired'),
                'info'
            );
        } else if (!isUpdateMode && !formState.stepInputError && !formState.stepProfanityError) {
            // In recording mode, just save the step directly
            saveStep();
        }
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
                onBlur={handleInputBlur}
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

            {/* Only show validation controls in update mode */}
            {isUpdateMode && (
                <div style={{ marginTop: '10px' }}>
                    {/* Validate button to test the edited step */}
                    <Tooltip title={changesPending ? translate('validatePlaybackTooltip') : translate('noChangesToValidate')}>
                        <Button
                            size="small"
                            type="default"
                            icon={<PlayCircleOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                validateByPlayback();
                            }}
                            className="uda_exclude"
                            disabled={!changesPending}
                            style={{ marginRight: '5px' }}
                        >
                            {translate('validatePlayback')}
                        </Button>
                    </Tooltip>

                    {/* Save button - only enabled after successful playback validation if changes are pending */}
                    <Tooltip title={(!playbackValidated && changesPending) ? translate('playbackValidationRequiredTooltip') : ''}>
                        <Button
                            size="small"
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                saveStep();
                            }}
                            className="uda_exclude"
                            disabled={!playbackValidated && changesPending}
                        >
                            {translate('save')}
                        </Button>
                    </Tooltip>
                    <Button
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Clean up temporary storage
                            localStorage.removeItem(CONFIG.editingConfig.storageName.editDataStorageName);
                            localStorage.removeItem(CONFIG.editingConfig.storageName.indexStorageName);
                            if (editSessionKey) {
                                localStorage.removeItem(editSessionKey);
                            }

                            // If we have original data in recordData, revert to it
                            // This ensures we go back to the original state
                            if (isUpdateMode) {
                                // Get the original data from recordData (without any temporary changes)
                                const originalData = [...recordData];
                                storeRecording(originalData);
                            }

                            if (onCancel) onCancel();
                        }}
                        className="uda_exclude"
                        style={{ marginLeft: '5px' }}
                    >
                        {translate('cancel')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EditableStepForm;

