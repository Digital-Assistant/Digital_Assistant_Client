/**
 * Form Validation Utilities
 * Framework-agnostic validation functions for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate step name input
 * Rules:
 * - Cannot be empty or only whitespace
 * - Maximum length: 100 characters
 *
 * @param value - The step name to validate
 * @returns ValidationResult object with isValid flag and optional error message
 */
export const validateStepName = (value: string): ValidationResult => {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      error: 'Step name cannot be empty',
    };
  }

  if (value.length > 100) {
    return {
      isValid: false,
      error: 'Step name cannot exceed 100 characters',
    };
  }

  return { isValid: true };
};

/**
 * Validate tooltip input
 * Rules:
 * - Must have content (not empty)
 * - Maximum length: 100 characters
 *
 * @param value - The tooltip text to validate
 * @returns ValidationResult object with isValid flag and optional error message
 */
export const validateTooltip = (value: string): ValidationResult => {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      error: 'Tooltip cannot be empty',
    };
  }

  if (value.length > 100) {
    return {
      isValid: false,
      error: 'Tooltip cannot exceed 100 characters',
    };
  }

  return { isValid: true };
};

/**
 * Validate delay time input
 * Rules:
 * - Must be a valid number
 * - Must be non-negative
 * - Maximum value: 10000 milliseconds
 *
 * @param value - The delay time to validate (can be string or number)
 * @returns ValidationResult object with isValid flag and optional error message
 */
export const validateDelayTime = (value: number | string): ValidationResult => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: 'Delay time must be a valid number',
    };
  }

  if (numValue < 0) {
    return {
      isValid: false,
      error: 'Delay time cannot be negative',
    };
  }

  if (numValue > 10000) {
    return {
      isValid: false,
      error: 'Delay time cannot exceed 10000 milliseconds',
    };
  }

  return { isValid: true };
};

/**
 * Generic input validator used by RecordedData component
 * Rules:
 * - Maximum length: 100 characters
 * - Must match regex pattern: alphanumeric, spaces, dots, hyphens, underscores
 *
 * @param value - The input value to validate
 * @returns boolean indicating if input is valid
 */
export const validateInput = (value: string): boolean => {
  if (!value || value.length > 100) {
    return false;
  }

  const validateCondition = new RegExp('^[0-9A-Za-z _.-]+$');
  return validateCondition.test(value);
};

/**
 * Validate custom metadata input
 * Rules:
 * - Cannot be empty
 * - Maximum length: 200 characters
 *
 * @param value - The metadata value to validate
 * @returns ValidationResult object with isValid flag and optional error message
 */
export const validateCustomMetadata = (value: string): ValidationResult => {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      error: 'Metadata cannot be empty',
    };
  }

  if (value.length > 200) {
    return {
      isValid: false,
      error: 'Metadata cannot exceed 200 characters',
    };
  }

  return { isValid: true };
};
