import { getUserId, getSessionKey } from '../services/userService';
import { getFromStore } from '../util';
import { CONFIG } from '../config';

jest.mock('../util');

describe('userService - Additional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserId - Additional Tests', () => {
    it('should handle non-object user session data', async () => {
      (getFromStore as jest.Mock).mockResolvedValue('not an object');
      const result = await getUserId();
      expect(result).toBeNull();
    });

    it('should handle user session data with null authdata', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({ authdata: null });
      const result = await getUserId();
      expect(result).toBeNull();
    });

    it('should handle user session data with undefined authdata', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({ authdata: undefined });
      const result = await getUserId();
      expect(result).toBeNull();
    });

    it('should handle user session data with non-object authdata', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({ authdata: 'not an object' });
      const result = await getUserId();
      expect(result).toBeNull();
    });
  });

  describe('getSessionKey - Additional Tests', () => {
    it('should handle non-object user session data', async () => {
      (getFromStore as jest.Mock).mockResolvedValue('not an object');
      const result = await getSessionKey();
      expect(result).toBeNull();
    });

    it('should handle user session data with null sessionkey', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: null });
      const result = await getSessionKey();
      expect(result).toBeNull();
    });

    it('should handle user session data with undefined sessionkey', async () => {
      (getFromStore as jest.Mock).mockResolvedValue({ sessionkey: undefined });
      const result = await getSessionKey();
      expect(result).toBeNull();
    });
  });

  describe('Error Handling - Additional Tests', () => {
    it('should handle getFromStore throwing an error in getUserId', async () => {
      (getFromStore as jest.Mock).mockRejectedValue(new Error('Storage error'));
      await expect(getUserId()).rejects.toThrow('Storage error');
    });

    it('should handle getFromStore throwing an error in getSessionKey', async () => {
      (getFromStore as jest.Mock).mockRejectedValue(new Error('Storage error'));
      await expect(getSessionKey()).rejects.toThrow('Storage error');
    });
  });
});
