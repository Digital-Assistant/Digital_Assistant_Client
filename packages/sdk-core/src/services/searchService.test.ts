import { fetchSearchResults } from './searchService';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe('fetchSearchResults', () => {
  it('should call the fetch API with the correct parameters', async () => {
    const params = {
      keyword: 'test',
      page: 1,
      domain: 'example.com',
    };
    await fetchSearchResults(params);
    expect(fetch).toHaveBeenCalledWith('/api/search', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});
