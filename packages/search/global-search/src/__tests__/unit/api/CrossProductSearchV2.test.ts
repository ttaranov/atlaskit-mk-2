import CrossProductSearchClientImpl, {
  CrossProductSearchClient,
} from '../../../api/CrossProductSearchClientv2';
import { utils } from '@atlaskit/util-service-support';
import {
  generateJiraScopeWithError,
  generateJiraScope,
} from '../../../../example-helpers/mockData';
import { ABTest } from '../../../model/Result';

const url = 'https://www.example.jira.dev.com/';
const cloudId = 'cloudId';
const SEARCH_PATH: string = '/rest/quicksearch/v2';

describe('Search api', () => {
  let client: CrossProductSearchClient;
  let requestSpy;

  beforeEach(() => {
    client = new CrossProductSearchClientImpl(url, cloudId);
    requestSpy = jest.spyOn(utils, 'requestService');
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  it('should call correct endpoint with correct params', () => {
    const sessionId = 'session-123123';
    const query = 'manda';
    client.search(query, sessionId);

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
        await client.search('query', 'sessionId-2');
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

    const { results } = await client.search('man', 'session-12');

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

    const { results } = await client.search('man', 'session-12');

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

    const { abTest, results } = await client.search('man', 'session-12');

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(results.issues).toHaveProperty('length', 8);
    expect(results.boards).toHaveProperty('length', 3);

    expect(abTest).toMatchObject(boardsScope.abTest as ABTest);
  });
});
