import { SmartCardClient } from '../src/SmartCardClient';

declare namespace NodeJS {
  interface Global {
    fetch: Function;
  }
}

function createFetchWithResponse() {
  return jest.fn().mockReturnValue(
    Promise.resolve({
      json: jest.fn().mockReturnValue(Promise.resolve({ data: {} })),
    }),
  );
}

function createFetchWithFailedRequest() {
  return jest.fn().mockReturnValue(Promise.reject(new Error()));
}

function createFetchWithFailedParse() {
  return jest.fn().mockReturnValue(
    Promise.resolve({
      json: jest.fn().mockReturnValue(Promise.reject(new Error())),
    }),
  );
}

describe('SmartCardClient', () => {
  it('should use the baseUrl', async () => {
    global.fetch = createFetchWithResponse();
    const client = new SmartCardClient({ baseUrl: 'https://foo-bar.com/' });
    const res = await client.fetch('https://www.atlassian.com/');
    expect(global.fetch).toBeCalledWith(
      expect.stringMatching(/^https:\/\/foo-bar.com\//),
      expect.anything(),
    );
  });

  it('should reject when the request fails', () => {
    global.fetch = createFetchWithFailedRequest();
    const client = new SmartCardClient();
    return expect(
      client.fetch('https://www.atlassian.com/'),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should reject when the request parsing fails', () => {
    global.fetch = createFetchWithFailedParse();
    const client = new SmartCardClient();
    return expect(
      client.fetch('https://www.atlassian.com/'),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should resolve when the request succeeds', async () => {
    global.fetch = createFetchWithResponse();
    const client = new SmartCardClient();
    const res = await client.fetch('https://www.atlassian.com/');
    expect(res).toEqual({
      data: {},
    });
  });
});
