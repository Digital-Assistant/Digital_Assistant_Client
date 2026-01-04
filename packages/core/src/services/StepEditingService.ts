/**
 * StepEditingService
 * Framework-agnostic business logic for editing recording steps
 * Contains all metadata manipulation and step saving logic
 */

import { updateRecordClicks, updateSequnceIndex } from './RecordService';
import { profanityCheck } from './RecordService';
import {
  validateStepName,
  validateTooltip,
  validateDelayTime,
  ValidationResult,
} from '../util/validation/formValidators';

/**
 * TypeScript Interfaces
 */
export interface UpdateMetadataParams {
  recordData: any[];
  index: number;
  metaKey: string;
  value: any;
}

export interface SaveStepParams {
  recordData: any[];
  index: number;
  stepEditValue: string;
  isUpdateMode: boolean;
  recordingId?: number;
}

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Helper function to parse objectdata
 */
const getObjData = (objectdata: string | object): any => {
  try {
    return typeof objectdata === 'string' ? JSON.parse(objectdata) : objectdata || {};
  } catch (e) {
    console.error('Error parsing objectdata:', e);
    return {};
  }
};

/**
 * Validate step name and check for profanity
 *
 * @param value - The step name to validate
 * @param enableProfanityCheck - Whether profanity checking is enabled
 * @returns Promise<ServiceResult> with validation result
 */
export const validateStepNameWithProfanity = async (
  value: string,
  enableProfanityCheck: boolean = false
): Promise<ServiceResult<{ hasProfanity: boolean; cleanedValue: string }>> => {
  // First, basic validation
  const validation = validateStepName(value);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  // Check for profanity if enabled
  if (enableProfanityCheck && value.trim()) {
    try {
      const response = await profanityCheck(value);
      if (response.Terms && response.Terms.length > 0) {
        return {
          success: false,
          data: {
            hasProfanity: true,
            cleanedValue: value,
          },
          error: 'Profanity detected',
        };
      }
    } catch (error) {
      console.error('Error checking profanity:', error);
    }
  }

  return {
    success: true,
    data: {
      hasProfanity: false,
      cleanedValue: value,
    },
  };
};

/**
 * Update step metadata in recordData
 *
 * @param params - UpdateMetadataParams containing recordData, index, metaKey, and value
 * @returns Updated recordData array
 */
export const updateStepMetadata = (params: UpdateMetadataParams): any[] => {
  const { recordData, index, metaKey, value } = params;
  const updatedRecordData = [...recordData];

  try {
    const nodeData = getObjData(updatedRecordData[index].objectdata);

    // Initialize meta object if it doesn't exist
    if (!nodeData.meta) {
      nodeData.meta = {};
    }

    // Update the metadata
    nodeData.meta[metaKey] = value;

    // Update the objectdata
    updatedRecordData[index] = {
      ...updatedRecordData[index],
      objectdata: JSON.stringify(nodeData),
    };

    return updatedRecordData;
  } catch (error) {
    console.error('Error updating step metadata:', error);
    return recordData; // Return original if error
  }
};

/**
 * Toggle skipDuringPlay metadata
 *
 * @param recordData - Array of recording data
 * @param index - Index of the step to update
 * @returns Updated recordData array
 */
export const toggleSkipDuringPlay = (recordData: any[], index: number): any[] => {
  const updatedRecordData = [...recordData];

  try {
    const nodeData = getObjData(updatedRecordData[index].objectdata);

    if (!nodeData.meta) {
      nodeData.meta = {};
    }

    nodeData.meta.skipDuringPlay = !nodeData.meta.skipDuringPlay;

    updatedRecordData[index] = {
      ...updatedRecordData[index],
      objectdata: JSON.stringify(nodeData),
    };

    return updatedRecordData;
  } catch (error) {
    console.error('Error toggling skipDuringPlay:', error);
    return recordData;
  }
};

/**
 * Toggle isPersonal metadata
 *
 * @param recordData - Array of recording data
 * @param index - Index of the step to update
 * @returns Updated recordData array
 */
export const togglePersonalInfo = (recordData: any[], index: number): any[] => {
  const updatedRecordData = [...recordData];

  try {
    const nodeData = getObjData(updatedRecordData[index].objectdata);

    if (!nodeData.meta) {
      nodeData.meta = {};
    }

    nodeData.meta.isPersonal = !nodeData.meta.isPersonal;

    updatedRecordData[index] = {
      ...updatedRecordData[index],
      objectdata: JSON.stringify(nodeData),
    };

    return updatedRecordData;
  } catch (error) {
    console.error('Error toggling personal info:', error);
    return recordData;
  }
};

/**
 * Update tooltip metadata
 *
 * @param recordData - Array of recording data
 * @param index - Index of the step to update
 * @param tooltip - Tooltip text to set
 * @returns ServiceResult with updated recordData
 */
export const updateTooltipMetadata = (
  recordData: any[],
  index: number,
  tooltip: string
): ServiceResult<any[]> => {
  // Validate tooltip
  const validation = validateTooltip(tooltip);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    const updatedRecordData = updateStepMetadata({
      recordData,
      index,
      metaKey: 'tooltipInfo',
      value: tooltip,
    });

    return {
      success: true,
      data: updatedRecordData,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error updating tooltip',
    };
  }
};

/**
 * Update delay time metadata
 *
 * @param recordData - Array of recording data
 * @param index - Index of the step to update
 * @param time - Delay time in milliseconds
 * @returns ServiceResult with updated recordData
 */
export const updateDelayTimeMetadata = (
  recordData: any[],
  index: number,
  time: number | string
): ServiceResult<any[]> => {
  // Validate delay time
  const validation = validateDelayTime(time);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    const numValue = typeof time === 'string' ? parseFloat(time) : time;

    const updatedRecordData = updateStepMetadata({
      recordData,
      index,
      metaKey: 'slowPlaybackTime',
      value: numValue,
    });

    return {
      success: true,
      data: updatedRecordData,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error updating delay time',
    };
  }
};

/**
 * Update custom metadata (for AI features)
 *
 * @param recordData - Array of recording data
 * @param index - Index of the step to update
 * @param metaKey - The metadata key to update (e.g., 'inputType', 'inputTypeDescription')
 * @param value - The metadata value
 * @returns Updated recordData array
 */
export const updateCustomMetadata = (
  recordData: any[],
  index: number,
  metaKey: string,
  value: any
): any[] => {
  return updateStepMetadata({
    recordData,
    index,
    metaKey,
    value,
  });
};

/**
 * Save step changes
 * Handles both recording mode and update mode
 *
 * @param params - SaveStepParams containing all necessary data
 * @returns Promise<ServiceResult> with operation result
 */
export const saveStepChanges = async (
  params: SaveStepParams
): Promise<ServiceResult> => {
  const { recordData, index, stepEditValue, isUpdateMode, recordingId } = params;

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
    updatedRecordData[index] = {
      ...updatedRecordData[index],
      objectdata: JSON.stringify(nodeData),
      clickednodename: stepEditValue, // Update for backward compatibility
    };

    // If in update mode, update the record in the backend
    if (isUpdateMode && recordingId) {
      try {
        await updateRecordClicks(updatedRecordData[index]);
        await updateSequnceIndex(recordingId);
      } catch (error) {
        console.error('Error updating record in backend:', error);
        return {
          success: false,
          error: 'Failed to update record in backend',
        };
      }
    }

    return {
      success: true,
      data: updatedRecordData,
    };
  } catch (error) {
    console.error('Error saving step changes:', error);
    return {
      success: false,
      error: 'Error saving step changes',
    };
  }
};

/**
 * Update step name in record data
 * This is used for real-time updates while editing
 *
 * @param recordData - Array of recording data
 * @param index - Index of the step to update
 * @param stepName - New step name
 * @returns Updated recordData array
 */
export const updateStepName = (
  recordData: any[],
  index: number,
  stepName: string
): any[] => {
  return updateStepMetadata({
    recordData,
    index,
    metaKey: 'displayText',
    value: stepName,
  });
};
