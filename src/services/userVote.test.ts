import { getUserId } from './userService';
import { CONFIG } from '../config';
import { REST } from '../services';
import { getFromStore } from '../util';
import { ENDPOINT } from '../config/endpoints';

// Mock dependencies
jest.mock('../services/userService');
jest.mock('../services');
jest.mock('../config', () => ({
  CONFIG: {
    UDA_DOMAIN: 'https://example.com',
  },
}));

describe('userVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('vote', () => {
    it('should call REST.apiCal with correct parameters for upvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence456' };
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      await vote(mockRequest, 'up');

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${CONFIG.UDA_DOMAIN}/voiceapi/vote`,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: 'sequence456',
          upvote: 1,
          downvote: 0,
        },
      });
    });

    it('should call REST.apiCal with correct parameters for downvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence789' };
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      await vote(mockRequest, 'down');

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${CONFIG.UDA_DOMAIN}/voiceapi/vote`,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: 'sequence789',
          upvote: 0,
          downvote: 1,
        },
      });
    });

    it('should handle errors from getUserId', async () => {
        (getUserId as jest.Mock).mockRejectedValue(new Error('User ID error'));
  
        await expect(vote({ id: 'sequence123' }, 'up')).rejects.toThrow('User ID error');
      });
  
      it('should handle errors from REST.apiCal', async () => {
        (getUserId as jest.Mock).mockResolvedValue('user123');
        (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API error'));
  
        await expect(vote({ id: 'sequence123' }, 'up')).rejects.toThrow('API error');
      });
    });
  });

  describe('getVoteRecord', () => {
    it('should call REST.apiCal with correct parameters', async () => {
      const mockUserId = 'user456';
      const mockRequest = { id: 'sequence789' };
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValue({ voteData: 'someData' });

      await getVoteRecord(mockRequest);

      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${CONFIG.UDA_DOMAIN}/voiceapi/vote/sequence789/user456`,
        method: 'GET',
      });
    });
    it('should handle errors from getUserId', async () => {
        (getUserId as jest.Mock).mockRejectedValue(new Error('User ID error'));
  
        await expect(getVoteRecord({ id: 'sequence123' })).rejects.toThrow('User ID error');
      });
  
      it('should handle errors from REST.apiCal', async () => {
        (getUserId as jest.Mock).mockResolvedValue('user123');
        (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API error'));
  
        await expect(getVoteRecord({ id: 'sequence123' })).rejects.toThrow('API error');
      });
    });
    // Additional edge cases
  describe('Edge cases', () => {
    it('should handle vote with undefined request', async () => {
      await expect(vote(undefined, 'up')).rejects.toThrow();
    });
});

    it('should handle vote with invalid vote type', async () => {
      await expect(vote({ id: 'sequence123' }, 'invalid')).resolves.toBeDefined();
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          upvote: 0,
          downvote: 0,
        }),
      }));
    });

    it('should handle getVoteRecord with undefined request', async () => {
      await expect(getVoteRecord(undefined)).rejects.toThrow();
    });

 
describe('userVote - Additional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('vote - Additional Tests', () => {
    it('should handle vote with null request', async () => {
      await expect(vote(null, 'up')).rejects.toThrow();
    });

    it('should handle vote with non-object request', async () => {
      await expect(vote('not an object', 'up')).rejects.toThrow();
    });

    it('should handle vote with request missing id', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      await vote({ someOtherProp: 'value' }, 'up');
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          sequenceid: undefined,
        }),
      }));
      });

    it('should handle vote with numeric id', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValue(mockUserId);
      await vote({ id: 12345 }, 'up');
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          sequenceid: 12345,
        }),
      }));
     });

    it('should handle vote with null vote type', async () => {
      await expect(vote({ id: 'sequence123' }, null)).resolves.toBeDefined();
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          upvote: 0,
          downvote: 0,
        }),
      }));
    });

    it('should handle vote with empty string vote type', async () => {
      await expect(vote({ id: 'sequence123' }, '')).resolves.toBeDefined();
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          upvote: 0,
          downvote: 0,
        }),
      }));
    });
  });

  describe('getVoteRecord - Additional Tests', () => {
    it('should handle getVoteRecord with null request', async () => {
      await expect(getVoteRecord(null)).rejects.toThrow();
    });

    it('should handle getVoteRecord with non-object request', async () => {
      await expect(getVoteRecord('not an object')).rejects.toThrow();
    }); 
  });

  describe('Error Handling - Additional Tests', () => {
    it('should handle getUserId returning null', async () => {
      (getUserId as jest.Mock).mockResolvedValue(null);
      await vote({ id: 'sequence123' }, 'up');
      expect(REST.apiCal).toHaveBeenCalledWith(expect.objectContaining({
        body: expect.objectContaining({
          usersessionid: null,
        }),
      }));
    });

    it('should handle REST.apiCal returning null', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue(null);
      const result = await vote({ id: 'sequence123' }, 'up');
      expect(result).toBeNull();
    });

    it('should handle REST.apiCal returning undefined', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue(undefined);
      const result = await getVoteRecord({ id: 'sequence123' });
      expect(result).toBeUndefined();
    });
  });

  describe('Performance - Additional Tests', () => {
    it('should handle multiple concurrent vote calls', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      const promises = [
        vote({ id: 'sequence1' }, 'up'),
        vote({ id: 'sequence2' }, 'down'),
        vote({ id: 'sequence3' }, 'up'),
      ];

      await Promise.all(promises);

      expect(REST.apiCal).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple concurrent getVoteRecord calls', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ voteData: 'someData' });

      const promises = [
        getVoteRecord({ id: 'sequence1' }),
        getVoteRecord({ id: 'sequence2' }),
        getVoteRecord({ id: 'sequence3' }),
      ];

      await Promise.all(promises);

      expect(REST.apiCal).toHaveBeenCalledTimes(3);
    });
  });
});

export const vote = async (request?: any, type?: string) => {
  let usersessionid = await getUserId();
  const payload = {
    usersessionid: usersessionid,
    sequenceid: request.id,
    upvote: type !== 'down' ? 1 : 0,
    downvote: type === 'down' ? 1 : 0,
  };

  const parameters = {
    url: ENDPOINT.VoteRecord,
    method: 'POST',
    body: payload,
  };
  return REST.apiCal(parameters);
};

export const getVoteRecord = async (request?: any) => {
  let userSessionId = await getUserId();

  const parameters = {
    url: ENDPOINT.fetchVoteRecord + request.id + '/' + userSessionId,
    method: 'GET',
  };
  return REST.apiCal(parameters);
};



jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

describe('userVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('vote', () => {
    it('should call REST.apiCal with the correct parameters for upvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      const mockType = 'up';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, mockType);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 1,
          downvote: 0,
        },
      });
    });

    it('should call REST.apiCal with the correct parameters for downvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      const mockType = 'down';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, mockType);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 1,
        },
      });
    });

    it('should call REST.apiCal with the correct parameters when type is not provided', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 0,
        },
      });
    });
  });

  describe('getVoteRecord', () => {
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord(mockRequest);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${mockRequest.id}/${mockUserId}`,
        method: 'GET',
      });
    });
  });
});



jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

describe('userVote', () => {
  // ... (previous test cases)

  describe('vote', () => {
    it('should call REST.apiCal with the correct parameters when request is not provided', async () => {
      const mockUserId = 'user123';
      const mockType = 'up';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(undefined, mockType);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: undefined,
          upvote: 1,
          downvote: 0,
        },
      });
    });

    it('should call REST.apiCal with the correct parameters when request and type are not provided', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: undefined,
          upvote: 0,
          downvote: 0,
        },
      });
    });

    it('should return the result of REST.apiCal', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      const mockType = 'up';
      const mockResult = { success: true };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await vote(mockRequest, mockType);

      expect(result).toEqual(mockResult);
    });
  });

  describe('getVoteRecord', () => {
    it('should call REST.apiCal with the correct parameters when request is not provided', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}undefined/${mockUserId}`,
        method: 'GET',
      });
    });

    it('should return the result of REST.apiCal', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'sequence123' };
      const mockResult = { upvote: 1, downvote: 0 };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);
      (REST.apiCal as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await getVoteRecord(mockRequest);

      expect(result).toEqual(mockResult);
    });
  });
});


jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn(),
  },
}));

describe('userVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('vote', () => {
    it('should call the REST API with the correct parameters for upvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'record456' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, 'up');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 1,
          downvote: 0,
        },
      });
    });

    it('should call the REST API with the correct parameters for downvote', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'record456' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, 'down');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 1,
        },
      });
    });

    it('should handle missing request or type', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: undefined,
          upvote: 0,
          downvote: 0,
        },
      });
    });
  });

  describe('getVoteRecord', () => {
    it('should call the REST API with the correct parameters', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'record456' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord(mockRequest);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${mockRequest.id}/${mockUserId}`,
        method: 'GET',
      });
    });

    it('should handle missing request', async () => {
      const mockUserId = 'user123';
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}undefined/${mockUserId}`,
        method: 'GET',
      });
      });
  });
});


describe('userVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('vote', () => {
    // Existing test cases...

    it('should handle getUserId returning null', async () => {
      (getUserId as jest.Mock).mockResolvedValueOnce(null);

      await vote();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: null,
          sequenceid: undefined,
          upvote: 0,
          downvote: 0,
        },
      });
      });

    it('should handle invalid type parameter', async () => {
      const mockUserId = 'user123';
      const mockRequest = { id: 'record456' };
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await vote(mockRequest, 'invalid');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 0,
        },
      });
    });
  });

  describe('getVoteRecord', () => {
    // Existing test cases...

    it('should handle getUserId returning null', async () => {
      (getUserId as jest.Mock).mockResolvedValueOnce(null);

      await getVoteRecord();

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}undefined/null`,
        method: 'GET',
      });
    });

    it('should handle request with missing id property', async () => {
      const mockUserId = 'user123';
      const mockRequest = {};
      (getUserId as jest.Mock).mockResolvedValueOnce(mockUserId);

      await getVoteRecord(mockRequest);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}undefined/${mockUserId}`,
        method: 'GET',
      });
    });
  });
});



describe('userVote', () => {
  describe('vote', () => {
    it('should send an upvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      const request = { id: 'sequence123' };
      const type = 'up';

      const result = await vote(request, type);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user123',
          sequenceid: request.id,
          upvote: 1,
          downvote: 0
        }
      });
      expect(result).toEqual({ success: true });
    });

    it('should send a downvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      const request = { id: 'sequence123' };
      const type = 'down';

      const result = await vote(request, type);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user123',
          sequenceid: request.id,
          upvote: 0,
          downvote: 1
        }
      });
      expect(result).toEqual({ success: true });
    });

    it('should handle missing user session id', async () => {
      (getUserId as jest.Mock).mockResolvedValue(null);
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: false });

      const request = { id: 'sequence123' };
      const type = 'up';

      const result = await vote(request, type);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: null,
          sequenceid: request.id,
          upvote: 1,
          downvote: 0
        }
      });
      expect(result).toEqual({ success: false });
    });
  });

  describe('getVoteRecord', () => {
    it('should fetch vote record', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ vote: 'up' });

      const request = { id: 'sequence123' };

      const result = await getVoteRecord(request);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${request.id}/user123`,
        method: 'GET'
      });
      expect(result).toEqual({ vote: 'up' });
    });

    it('should handle missing user session id', async () => {
      (getUserId as jest.Mock).mockResolvedValue(null);
      (REST.apiCal as jest.Mock).mockResolvedValue({ vote: 'none' });

      const request = { id: 'sequence123' };

      const result = await getVoteRecord(request);

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${request.id}/null`,
        method: 'GET'
      });
      expect(result).toEqual({ vote: 'none' });
    });
  });
});

describe('userVote', () => {
    describe('vote', () => {
        it('should handle API call failure', async () => {
            (getUserId as jest.Mock).mockResolvedValue('user123');
            (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API call failed'));
      
            const request = { id: 'sequence123' };
            const type = 'up';
      
            await expect(vote(request, type)).rejects.toThrow('API call failed');
      
            expect(getUserId).toHaveBeenCalled();
            expect(REST.apiCal).toHaveBeenCalledWith({
              url: ENDPOINT.VoteRecord,
              method: 'POST',
              body: {
                usersessionid: 'user123',
                sequenceid: request.id,
                upvote: 1,
                downvote: 0
              }
            });
            });
          });
});

describe('getVoteRecord', () => {
    
  it('should handle invalid request object', async () => {
    (getUserId as jest.Mock).mockResolvedValue('user123');
    (REST.apiCal as jest.Mock).mockResolvedValue({ vote: 'none' });

    const request = { invalidKey: 'sequence123' };

    const result = await getVoteRecord(request);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchVoteRecord}undefined/user123`,
      method: 'GET'
    });
    expect(result).toEqual({ vote: 'none' });
  });
});

  

describe('userVote', () => {
  beforeEach(() => {
    (getUserId as jest.Mock).mockReset();
    (REST.apiCal as jest.Mock).mockReset();
  });

  describe('vote', () => {
    it('should send an upvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ status: 200 });

      const result = await vote({ id: 'sequence456' }, 'up');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user123',
          sequenceid: 'sequence456',
          upvote: 1,
          downvote: 0,
        },
      });
      expect(result).toEqual({ status: 200 });
    });

    it('should send a downvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user789');
      (REST.apiCal as jest.Mock).mockResolvedValue({ status: 200 });

      const result = await vote({ id: 'sequence101112' }, 'down');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user789',
          sequenceid: 'sequence101112',
          upvote: 0,
          downvote: 1,
        },
      });
      expect(result).toEqual({ status: 200 });
    });
  });

  describe('getVoteRecord', () => {
    it('should fetch the vote record', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ data: 'voteData' });

      const result = await getVoteRecord({ id: 'sequence456' });

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}sequence456/user123`,
        method: 'GET',
      });
      expect(result).toEqual({ data: 'voteData' });
    });
  });
});



describe('userVote', () => {
  beforeEach(() => {
    (getUserId as jest.Mock).mockReset();
    (REST.apiCal as jest.Mock).mockReset();
  });
});

  describe('vote', () => {
    it('should send an upvote request', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ status: 200 });

      const result = await vote({ id: 'sequence456' }, 'up');

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user123',
          sequenceid: 'sequence456',
          upvote: 1,
          downvote: 0,
        },
      });
      expect(result).toEqual({ status: 200 });
    });


      const result = await vote({ id: 'sequence101112' }, 'down');

      expect(getUserId).toHaveBeenCalled();
      expe
    

    it('should handle errors from getUserId', async () => {
      (getUserId as jest.Mock).mockRejectedValue(new Error('Failed to get user ID'));

      await expect(vote({ id: 'sequence456' }, 'up')).rejects.toThrow('Failed to get user ID');
      expect(REST.apiCal).not.toHaveBeenCalled();
    });

    it('should handle errors from REST.apiCal', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockRejectedValue(new Error('API request failed'));

      await expect(vote({ id: 'sequence456' }, 'up')).rejects.toThrow('API request failed');
      expect(getUserId).toHaveBeenCalled();
    });

    it('should send a request with upvote: 0 and downvote: 0 if type is not provided', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ status: 200 });

      const result = await vote({ id: 'sequence456' });

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: 'user123',
          sequenceid: 'sequence456',
          upvote: 0,
          downvote: 0,
        },
      });
      expect(result).toEqual({ status: 200 });
    });
  });

  describe('getVoteRecord', () => {
    it('should fetch the vote record', async () => {
      (getUserId as jest.Mock).mockResolvedValue('user123');
      (REST.apiCal as jest.Mock).mockResolvedValue({ data: 'voteData' });

      const result = await getVoteRecord({ id: 'sequence456' });

      expect(getUserId).toHaveBeenCalled();
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}sequence456/user123`,
        method: 'GET',
      });
      expect(result).toEqual({ data: 'voteData' });
    });
});

    it('should handle errors from getUserId', async () => {
      (getUserId as jest.Mock).mockRejectedValue(new Error('Failed to get user ID'));

      await expect(getVoteRecord({ id: 'sequence456' })).rejects.toThrow('Failed to get user ID');
      expect(REST.apiCal).not.toHaveBeenCalled();
    });


jest.mock('./userService');
jest.mock('./index');

describe('vote', () => {
  beforeEach(() => {
    getUserId.mockResolvedValue('user123');
    REST.apiCal.mockResolvedValue({ success: true });
  });

  it('should send a POST request with correct parameters for upvote', async () => {
    const request = { id: 'seq123' };
    const type = 'up';
    await vote(request, type);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user123',
        sequenceid: 'seq123',
        upvote: 1,
        downvote: 0,
      },
    });
  });

  it('should send a POST request with correct parameters for downvote', async () => {
    const request = { id: 'seq123' };
    const type = 'down';
    await vote(request, type);
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user123',
        sequenceid: 'seq123',
        upvote: 0,
        downvote: 1,
      },
    });
  });

  it('should handle null userId gracefully', async () => {
    getUserId.mockResolvedValue(null);
    const request = { id: 'seq123' };
    const type = 'up';
    await vote(request, type);
    expect(REST.apiCal).not.toHaveBeenCalled();
  });
});

describe('vote', () => {
    it('should not send a request if request object is undefined', async () => {
      const type = 'up';
      await vote(undefined, type);
      expect(REST.apiCal).not.toHaveBeenCalled();
    });
  
    it('should not send a request if type is neither "up" nor "down"', async () => {
      const request = { id: 'seq123' };
      const type = 'invalidType';
      await vote(request, type);
      expect(REST.apiCal).not.toHaveBeenCalled();
    });
  
    it('should handle API call failures gracefully', async () => {
      REST.apiCal.mockRejectedValue(new Error('API call failed'));
      const request = { id: 'seq123' };
      const type = 'up';
      await expect(vote(request, type)).rejects.toThrow('API call failed');
    });
  });



jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn()
  }
}));

describe('vote', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  

  
});

describe('getVoteRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the fetch vote record API with the correct parameters', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');

    await getVoteRecord(mockRequest);

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchVoteRecord}sequence-123/user-123`,
      method: 'GET'
    });
  });
});


jest.mock('./index', () => ({
  REST: {
    apiCal: jest.fn()
  }
}));

describe('vote', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the vote API with the correct payload for an upvote', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');

    await vote(mockRequest, 'up');

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-123',
        sequenceid: 'sequence-123',
        upvote: 1,
        downvote: 0
      }
    });
  });

  it('should call the vote API with the correct payload for a downvote', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');

    await vote(mockRequest, 'down');

    expect(getUserId).toHaveBeenCalled();
    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-123',
        sequenceid: 'sequence-123',
        upvote: 0,
        downvote: 1
      }
    });
  });

  it('should return the result of the API call', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };
    const mockResponse = { success: true };

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');
    jest.spyOn(REST, 'apiCal').mockResolvedValue(mockResponse);

    const result = await vote(mockRequest, 'up');
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if the API call fails', async () => {
    const mockRequest = {
      id: 'sequence-123'
    };
    const mockError = new Error('API call failed');

    jest.spyOn(global, 'getUserId').mockResolvedValue('user-123');
    jest.spyOn(REST, 'apiCal').mockRejectedValue(mockError);

    await expect(vote(mockRequest, 'up')).rejects.toThrow(mockError);
  });
});

describe('getVoteRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
});

  


it('should upvote a recording', async () => {
    const request = { id: 'recording-123' };
    const type = 'up';
  
    // Mock getUserId function to return a user session ID
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue('user-session-123');
  
    // Mock the REST.apiCal function
    const mockApiCal = jest.fn();
    jest.mock('./index', () => ({
      REST: { apiCal: mockApiCal }
    }));
  
    await vote(request, type);
  
    expect(mockApiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-session-123',
        sequenceid: 'recording-123',
        upvote: 1,
        downvote: 0
      }
    });
  });

  it('should downvote a recording', async () => {
    const request = { id: 'recording-456' };
    const type = 'down';
  
    // Mock getUserId function to return a user session ID
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue('user-session-456');
  
    // Mock the REST.apiCal function
    const mockApiCal = jest.fn();
    jest.mock('./index', () => ({
      REST: { apiCal: mockApiCal }
    }));
  
    await vote(request, type);
  
    expect(mockApiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: 'user-session-456',
        sequenceid: 'recording-456',
        upvote: 0,
        downvote: 1
      }
    });
  });
  
  it('should fetch the vote record for a recording', async () => {
    const request = { id: 'recording-789' };
  
    // Mock getUserId function to return a user session ID
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue('user-session-789');
  
    // Mock the REST.apiCal function
    const mockApiCal = jest.fn();
    jest.mock('./index', () => ({
      REST: { apiCal: mockApiCal }
    }));
  
    await getVoteRecord(request);
  
    expect(mockApiCal).toHaveBeenCalledWith({
      url: ENDPOINT.fetchVoteRecord + 'recording-789/user-session-789',
      method: 'GET'
    });
  });

  it('should not vote and throw an error when request ID is not provided', async () => {
    const request = { id: null };
    const type = 'up';
  
    await expect(vote(request, type)).rejects.toThrow('Request ID is required');
  });
  
  it('should not vote and throw an error when type is neither "up" nor "down"', async () => {
    const request = { id: 'recording-123' };
    const type = 'invalid';
  
    await expect(vote(request, type)).rejects.toThrow('Invalid vote type');
  });
  
  it('should not fetch vote record and throw an error when request ID is not provided', async () => {
    const request = { id: null };
  
    await expect(getVoteRecord(request)).rejects.toThrow('Request ID is required');
  });

  it('should fetch the vote record for a recording successfully', async () => {
    const request = { id: 'recording-789' };
  
    // Mock getUserId function to return a user session ID
    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue('user-session-789');
  
    // Mock the REST.apiCal function to return a mock response
    const mockResponse = { data: 'vote record data' };
    jest.mock('./index', () => ({
      REST: { apiCal: jest.fn().mockResolvedValue(mockResponse) }
    }));
  
    const result = await getVoteRecord(request);
  
    expect(result).toEqual(mockResponse);
  });
  
  
  
  jest.mock('./index', () => ({
    REST: {
      apiCal: jest.fn()
    }
  }));
  
  describe('vote', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should call REST.apiCal with the correct parameters for an upvote', async () => {
      const mockUserId = '123456789';
      const mockRequest = { id: 'abc123' };
  
      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
  
      await vote(mockRequest, 'up');
  
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 1,
          downvote: 0
        }
      });
    });
  
    it('should call REST.apiCal with the correct parameters for a downvote', async () => {
      const mockUserId = '123456789';
      const mockRequest = { id: 'abc123' };
  
      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
  
      await vote(mockRequest, 'down');
  
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 1
        }
      });
    });
  
    it('should call REST.apiCal with the correct parameters for a neutral vote', async () => {
      const mockUserId = '123456789';
      const mockRequest = { id: 'abc123' };
  
      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
  
      await vote(mockRequest);
  
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: ENDPOINT.VoteRecord,
        method: 'POST',
        body: {
          usersessionid: mockUserId,
          sequenceid: mockRequest.id,
          upvote: 0,
          downvote: 0
        }
      });
    });
  });
  
  describe('getVoteRecord', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should call REST.apiCal with the correct parameters', async () => {
      const mockUserId = '123456789';
      const mockRequest = { id: 'abc123' };
  
      jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);
  
      await getVoteRecord(mockRequest);
  
      expect(REST.apiCal).toHaveBeenCalledWith({
        url: `${ENDPOINT.fetchVoteRecord}${mockRequest.id}/${mockUserId}`,
        method: 'GET'
      });
    });
  });


describe('vote', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call REST.apiCal with the correct parameters for an upvote', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(mockRequest, 'up');

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: mockUserId,
        sequenceid: mockRequest.id,
        upvote: 1,
        downvote: 0
      }
    });
  });

  it('should call REST.apiCal with the correct parameters for a downvote', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(mockRequest, 'down');

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: mockUserId,
        sequenceid: mockRequest.id,
        upvote: 0,
        downvote: 1
      }
    });
  });

  it('should call REST.apiCal with the correct parameters for a neutral vote', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: mockUserId,
        sequenceid: mockRequest.id,
        upvote: 0,
        downvote: 0
      }
    });
  });

  it('should handle null request', async () => {
    const mockUserId = '123456789';

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(null, 'up');

    expect(REST.apiCal).not.toHaveBeenCalled();
  });

  it('should handle invalid vote type', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await vote(mockRequest, 'invalid');

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: ENDPOINT.VoteRecord,
      method: 'POST',
      body: {
        usersessionid: mockUserId,
        sequenceid: mockRequest.id,
        upvote: 0,
        downvote: 0
      }
    });
  });
});

describe('getVoteRecord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call REST.apiCal with the correct parameters', async () => {
    const mockUserId = '123456789';
    const mockRequest = { id: 'abc123' };

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await getVoteRecord(mockRequest);

    expect(REST.apiCal).toHaveBeenCalledWith({
      url: `${ENDPOINT.fetchVoteRecord}${mockRequest.id}/${mockUserId}`,
      method: 'GET'
    });
  });

  it('should handle null request', async () => {
    const mockUserId = '123456789';

    jest.spyOn(require('./userService'), 'getUserId').mockResolvedValue(mockUserId);

    await getVoteRecord(null);

    expect(REST.apiCal).not.toHaveBeenCalled();
  });
});

  

