import { Client } from '../../Client';

declare namespace NodeJS {
  interface Global {
    fetch: Function;
  }
}

declare var global: NodeJS.Global;

function createFetchWithResponse() {
  return jest.fn().mockReturnValue(
    Promise.resolve({
      json: jest
        .fn()
        .mockReturnValue(Promise.resolve({ response: { body: { data: {} } } })),
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

describe('Client', () => {
  it('should use the baseUrl', async () => {
    global.fetch = createFetchWithResponse();
    const client = new Client({ baseUrl: 'https://foo-bar.com/' });
    await client.get('https://www.atlassian.com/');
    expect(global.fetch).toBeCalledWith(
      expect.stringMatching(/^https:\/\/foo-bar.com\//),
      expect.anything(),
    );
  });

  it('should reject when the request fails', () => {
    global.fetch = createFetchWithFailedRequest();
    const client = new Client();
    return expect(
      client.get('https://www.atlassian.com/'),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should reject when the request parsing fails', () => {
    global.fetch = createFetchWithFailedParse();
    const client = new Client();
    return expect(
      client.get('https://www.atlassian.com/'),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should resolve when the request succeeds', async () => {
    global.fetch = createFetchWithResponse();
    const client = new Client();
    const res = await client.get('https://www.atlassian.com/');
    expect(res).toEqual({
      data: {},
    });
  });
});
