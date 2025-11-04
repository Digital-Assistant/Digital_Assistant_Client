import { apiClient } from './apiClient';
import { ENDPOINT } from '../config/endpoints';
import { getSessionKey, getUserId } from './userService';
import { processUrlArgs } from '../util/urlProcessing';
import { StorageUtil } from '../util/storage';
import { CONFIG } from '../config/constants';

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
  const sessionId = await getSessionKey();
  const payload = { ...request, sessionid: sessionId };
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

/**
 * Prepare record sequence payload by pulling recorded nodes from storage.
 * Accepts optional overrides via request: { domain?, userclicknodesSet? }
 */
export const prepareRecordSequencePayload = async (request: any): Promise<any> => {
  if (!request) throw new Error('Request object is required');

  // Prefer provided userclicknodesSet, else read from storage
  const userclicknodesSet = request.userclicknodesSet ?? (await StorageUtil.get(CONFIG.RECORDING_SEQUENCE)) ?? [];
  const ids: string[] = (userclicknodesSet || []).map((item: any) => String(item.id)).filter(Boolean);

  // Determine domain: prefer explicit request.domain, else window.location.host when available
  let domain = request.domain;
  if (!domain && typeof window !== 'undefined' && window.location) {
    domain = window.location.host;
  }

  return {
    ...request,
    domain: domain || '',
    isIgnored: 0,
    isValid: 1,
    userclicknodelist: ids.join(','),
    userclicknodesSet,
  };
};

/**
 * Posts a recorded sequence of user interactions to the backend.
 * @param request - An object containing the data required to record the sequence of user interactions.
 * @returns A promise that resolves when the sequence of user interactions has been posted.
 * @throws Error - If no request object is provided.
 */
export const postRecordSequenceData = async (request: any): Promise<any> => {
  if (!request) throw new Error('Request object is required');
  const payload = await prepareRecordSequencePayload(request);
  return recordSequence(payload);
};

/**
 * Updates a previously recorded sequence of user interactions.
 * @param request - An object containing the data required to update the sequence of user interactions.
 * @returns A promise that resolves when the sequence of user interactions has been updated.
 * @throws Error - If no request object is provided.
 */
export const updateRecordSequenceData = async (request: any): Promise<any> => {
  if (!request) throw new Error('Request object is required');
  const payload = await prepareRecordSequencePayload(request);
  // UI previously called recordSequence for updates as well
  return recordSequence(payload);
};

export type RecordService = {
  recordClicks: typeof recordClicks;
  updateRecordClicks: typeof updateRecordClicks;
  updateSequnceIndex: typeof updateSequnceIndex;
  recordSequence: typeof recordSequence;
  postRecordSequenceData: typeof postRecordSequenceData;
  updateRecordSequenceData: typeof updateRecordSequenceData;
  userClick: typeof userClick;
  deleteRecording: typeof deleteRecording;
  updateRecording: typeof updateRecording;
  fetchStatuses: typeof fetchStatuses;
  profanityCheck: typeof profanityCheck;
  prepareRecordSequencePayload: typeof prepareRecordSequencePayload;
};
