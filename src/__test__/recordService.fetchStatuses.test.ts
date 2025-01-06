import { REST } from '../services';
import { fetchStatuses } from '../services/recordService';

jest.mock('../services', () => ({
    REST: {
        processArgs: jest.fn(),
        apiCal: jest.fn()
    }
}));

describe('fetchStatuses', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetches statuses with default category', async () => {
        const mockResponse = { statuses: ['active', 'inactive'] };
        (REST.apiCal as jest.Mock).mockResolvedValue(mockResponse);
        (REST.processArgs as jest.Mock).mockReturnValue('api/statuses?category=sequenceList');

        const result = await fetchStatuses();

        expect(REST.processArgs).toHaveBeenCalledWith(expect.any(String), { category: 'sequenceList' });
        expect(REST.apiCal).toHaveBeenCalledWith({
            url: 'api/statuses?category=sequenceList',
            method: 'GET'
        });
        expect(result).toEqual(mockResponse);
    });
});
