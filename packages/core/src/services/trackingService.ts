import { apiClient } from './apiClient';
import { ENDPOINT } from '../config/endpoints';
import {getSessionKey, getUserSessionId, getUserId} from './userService';

/**
 * Records user click data for analytics and tracking
 * @param clickType - Type of click event (default: "sequencerecord")
 * @param clickedName - Name of the clicked element
 * @param recordId - Associated record ID
 */
export const recordUserClickData = async (
  clickType = "sequencerecord",
  clickedName = "",
  recordId: number = 0
): Promise<any> => {
  try {
    const payload = {
      usersessionid: await getUserId(),
      clickedname: clickedName,
      clicktype: clickType,
      recordid: recordId,
    };

    // Make API call using the core apiClient
    const response = await apiClient.put(ENDPOINT.UserClick, payload);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown tracking error';
    console.error(`Error in recordUserClickData: ${errorMessage}`, error);
    throw error;
  }
};

/**
 * Sends user click event data to the server
 * @param payload - Click event payload
 */
export const userClick = async (payload: any): Promise<any> => {
  try {
    const response = await apiClient.put(ENDPOINT.UserClick, payload);
    return response.data;
  } catch (error) {
    console.error('Error sending user click data:', error);
    throw error;
  }
};
