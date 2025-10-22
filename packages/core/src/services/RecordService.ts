import { apiClient } from './apiClient';
import { ENDPOINT } from '../config/endpoints';
import { getSessionKey, getUserId } from './userService';
import { processUrlArgs } from '../util/urlProcessing';

/**
 * Core RecordService
 *
 * Framework-agnostic HTTP methods related to recording flows. This module contains
 * only network/parameter shaping logic and must not access window/document or DOM.
 */

/**
 * Record a set of clicks or other user interactions.
 */
export const recordClicks = async (request: any = {}): Promise<any> => {
  const sessionid = await getSessionKey();
  const payload = { ...request, sessionid };
  const response = await apiClient.post(ENDPOINT.Record, payload);
  return response.data;
};

/**
 * Update previously recorded clicks.
 */
export const updateRecordClicks = async (request: any = {}): Promise<any> => {
  const response = await apiClient.post(ENDPOINT.UpdateRecord, request);
  return response.data;
};

/**
 * Re-index a sequence by id.
 */
export const updateSequnceIndex = async (id: number): Promise<any> => {
  const url = ENDPOINT.updateSequenceIndex + String(id);
  const response = await apiClient.post(url);
  return response.data;
};

/**
 * Record a sequence of user interactions.
 * Adds usersessionid automatically from the current user where available.
 */
export const recordSequence = async (request: any): Promise<any> => {
  if (!request) throw new Error('Request object is required');
  const usersessionid = await getUserId();
  if (!usersessionid) throw new Error('User session ID could not be retrieved');
  const payload = { ...request, usersessionid };
  const response = await apiClient.post(ENDPOINT.RecordSequence, payload);
  return response.data;
};

/**
 * Record a user click event (framework-agnostic).
 * Note: callers should provide clickedname in the request when needed.
 */
export const userClick = async (request: any): Promise<any> => {
  if (!request) throw new Error('Request object is required');
  const usersessionid = await getUserId();
  const payload = { ...request, usersessionid };
  const response = await apiClient.put(ENDPOINT.UserClick, payload);
  return response.data;
};

/**
 * Delete a recording sequence.
 */
export const deleteRecording = async (request: any): Promise<any> => {
  if (!request) throw new Error('Request object is required');
  const usersessionid = await getUserId();
  const payload = { ...request, usersessionid };
  const response = await apiClient.post(ENDPOINT.DeleteSequence, payload);
  return response.data;
};

/**
 * Update an existing recording sequence.
 */
export const updateRecording = async (request: any): Promise<any> => {
  if (!request) throw new Error('Request object is required');
  const usersessionid = await getUserId();
  const payload = { ...request, usersessionid };
  const response = await apiClient.post(ENDPOINT.updateRecordSequence, payload);
  return response.data;
};

/**
 * Fetch status options (category-based).
 */
export const fetchStatuses = async (request: { category: string } = { category: 'sequenceList' }): Promise<any> => {
  if (!request?.category) throw new Error('Category is required');
  const url = processUrlArgs(ENDPOINT.statuses, request);
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * Profanity check helper (passes text to configured endpoint).
 * Consumers must provide any required headers at gateway; here we only POST the body.
 * If profanity key gating is required, it should be handled by the backend or caller.
 */
export const profanityCheck = async (request: any): Promise<any> => {
  if (!request) throw new Error('Request object is required');
  // Using apiClient.post without custom headers to keep SDK generic
  const response = await apiClient.post(ENDPOINT.ProfanityCheck, request);
  return response.data;
};

export const postRecordSequenceData = async (request: any): Promise<any> => {
  if (!request) throw new Error('Request object is required');
  // Delegate to recordSequence to ensure usersessionid handling is consistent
  return recordSequence(request);
};

export type RecordService = {
  recordClicks: typeof recordClicks;
  updateRecordClicks: typeof updateRecordClicks;
  updateSequnceIndex: typeof updateSequnceIndex;
  recordSequence: typeof recordSequence;
  postRecordSequenceData: typeof postRecordSequenceData;
  userClick: typeof userClick;
  deleteRecording: typeof deleteRecording;
  updateRecording: typeof updateRecording;
  fetchStatuses: typeof fetchStatuses;
  profanityCheck: typeof profanityCheck;
};
