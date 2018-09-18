import { utils } from '@atlaskit/util-service-support';

import JiraClientImpl from '../../../api/JiraClient';
import {
  JiraRecentResponse,
  TransformedResponse,
} from '../../../../example-helpers/jiraRecentResponseData';

const url = 'https://www.example.jira.dev.com/';
const cloudId = 'cloudId';
const PATH = 'rest/internal/2/productsearch/recent';
describe('JiraClient', () => {
  let requestSpy;
  let jiraClient;

  beforeEach(() => {
    requestSpy = jest.spyOn(utils, 'requestService');
    jiraClient = new JiraClientImpl(url, cloudId);
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  it('should call remote endpoint with correct params', () => {
    const sessionId = 'sessionId-1';
    const counts = {
      issues: 7,
      projects: 5,
      boards: 3,
      filters: 1,
    };

    jiraClient.getRecentItems(sessionId, counts);

    expect(requestSpy).toHaveBeenCalledTimes(1);

    const serviceConfigParam = requestSpy.mock.calls[0][0];
    expect(serviceConfigParam).toHaveProperty('url', url);

    const requestOptions = requestSpy.mock.calls[0][1];
    expect(requestOptions).toHaveProperty('path', PATH);
    expect(requestOptions.queryParams).toMatchObject({
      search_id: sessionId,
      ...counts,
    });
  });

  [
    () => Promise.reject(new Error('error occured during request')),
    () => {
      throw new Error('general error');
    },
    () => 'invalid response will fail during transformation',
  ].forEach(mockImpl => {
    it('should throws exception on error calling request', async () => {
      requestSpy.mockImplementation(mockImpl);
      try {
        await jiraClient.getRecentItems('sessionId-2');
        expect(true).toBe(false); // should never reach this line
      } catch (e) {
        expect(e).not.toBeNull();
      }
    });
  });

  [[[], []], [JiraRecentResponse, TransformedResponse]].forEach(
    ([jiraResponse, transformedResponse]) => {
      it('should transform valid response without error', async () => {
        requestSpy.mockReturnValue(Promise.resolve(jiraResponse));
        const result = await jiraClient.getRecentItems('session');
        expect(result).toEqual(transformedResponse);
      });
    },
  );
});
