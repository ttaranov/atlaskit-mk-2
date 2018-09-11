import { utils } from '@atlaskit/util-service-support';

import JiraClientImpl from '../../../api/JiraClient';
import {
  JiraRecentResponse,
  TransformedResponse,
} from '../../../../example-helpers/jiraRecentResponseData';
import {
  generateJiraScopeWithError,
  generateJiraScope,
} from '../../../../example-helpers/mockData';

const url = 'https://www.example.jira.dev.com/';
const cloudId = 'cloudId';
const PATH = '/rest/internal/2/productsearch/recent';
const SEARCH_PATH = 'rest/quicknavjira/1/search';

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

  describe('Recent api', () => {
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

  describe('Search api', () => {
    it('should call correct endpoint with correct params', () => {
      const sessionId = 'session-123123';
      const query = 'manda';
      jiraClient.search(sessionId, query);

      expect(requestSpy).toHaveBeenCalledTimes(1);

      const serviceConfigParam = requestSpy.mock.calls[0][0];
      expect(serviceConfigParam).toHaveProperty('url', url);

      const requestOptions = requestSpy.mock.calls[0][1];
      expect(requestOptions).toHaveProperty('path', SEARCH_PATH);
      expect(requestOptions.queryParams).toMatchObject({
        search_id: sessionId,
        query,
      });
    });

    [
      () => Promise.reject(new Error('error occured during request')),
      () => {
        throw new Error('general error');
      },
      () => 'invalid response will fail during transformation',
    ].forEach(mockImpl => {
      it('should throw exception', async () => {
        requestSpy.mockImplementation(mockImpl);
        try {
          await jiraClient.search('sessionId-2', 'query');
          expect(true).toBe(false); // should never reach this line
        } catch (e) {
          expect(e).not.toBeNull();
        }
      });
    });

    it('should remove scopes with error', async () => {
      const scopes = [
        generateJiraScopeWithError(
          'issues',
          8,
          'something wrong with issue search',
        ),
        generateJiraScope('boards', 3),
        generateJiraScope('projects', 4),
        generateJiraScope('filters', 2),
      ];

      requestSpy.mockReturnValue(Promise.resolve({ scopes }));

      const { results } = await jiraClient.search('session-12', 'man');

      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(results.issues).toBe(undefined);
      expect(results.projects).toHaveProperty('length', 4);
      expect(results.boards).toHaveProperty('length', 3);
      expect(results.filters).toHaveProperty('length', 2);
    });

    it('should return transformed data successfully', async () => {
      const scopes = [
        generateJiraScope('issues', 8),
        generateJiraScope('boards', 3),
        generateJiraScope('projects', 4),
        generateJiraScope('filters', 2),
      ];

      requestSpy.mockReturnValue(Promise.resolve({ scopes }));

      const { results } = await jiraClient.search('session-12', 'man');

      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(results.issues).toHaveProperty('length', 8);
      expect(results.projects).toHaveProperty('length', 4);
      expect(results.boards).toHaveProperty('length', 3);
      expect(results.filters).toHaveProperty('length', 2);
    });

    it('should include abTest', async () => {
      const issuesScope = generateJiraScope('issues', 8);
      issuesScope.abTest = undefined;
      const boardsScope = generateJiraScope('boards', 3);
      const scopes = [issuesScope, boardsScope];

      requestSpy.mockReturnValue(Promise.resolve({ scopes }));

      const { abTest, results } = await jiraClient.search('session-12', 'man');

      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(results.issues).toHaveProperty('length', 8);
      expect(results.boards).toHaveProperty('length', 3);

      expect(abTest).toMatchObject(boardsScope.abTest);
    });
  });
});
