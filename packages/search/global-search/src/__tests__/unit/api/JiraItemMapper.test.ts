import {
  ResultType,
  AnalyticsType,
  ContentType,
} from '../../../../src/model/Result';

import {
  mapJiraItemToResult,
  addJiraResultQueryParams,
} from '../../../../src/api/JiraItemMapper';
import {
  generateRandomIssueV1,
  generateRandomJiraIssue,
  generateRandomJiraBoard,
  generateRandomJiraFilter,
  generateRandomJiraProject,
} from '../../../../example-helpers/mockJira';
import { JiraItemV1, JiraItemV2 } from '../../../api/types';

const sessionId = 'sessionId';

describe('mapJiraItemToResult', () => {
  it('should be able to parse issue V1 response', () => {
    const issue = generateRandomIssueV1() as JiraItemV1;
    const result = mapJiraItemToResult(issue, sessionId);

    expect(result).toMatchObject({
      resultId: issue.key,
      avatarUrl: issue.fields.issuetype.iconUrl,
      name: issue.fields.summary,
      href: `/browse/${issue.key}`,
      containerName: issue.fields.project.name,
      objectKey: issue.key,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraIssue,
    });
  });

  it('should be able to parse issue V2 respnse', () => {
    const issue = generateRandomJiraIssue() as JiraItemV2;
    const result = mapJiraItemToResult(issue, sessionId);

    const avatar = issue.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: issue.id,
      avatarUrl: avatar.url,
      name: issue.name,
      href: expect.stringMatching(issue.url),
      containerName: issue.attributes.issueTypeName,
      objectKey: issue.attributes.key,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraIssue,
    });
  });

  it('should be able to parse jira filter', () => {
    const filter = generateRandomJiraFilter() as JiraItemV2;
    const result = mapJiraItemToResult(filter, sessionId);

    const avatar = filter.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: filter.id,
      avatarUrl: avatar.url,
      name: filter.name,
      href: expect.stringMatching(filter.url),
      containerName: filter.attributes.ownerName,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraFilter,
      objectKey: 'Filter',
    });
  });

  it('should be able to parse jira board', () => {
    const board = generateRandomJiraBoard() as JiraItemV2;
    const result = mapJiraItemToResult(board, sessionId);

    const avatar = board.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: board.id,
      avatarUrl: avatar.url,
      name: board.name,
      href: expect.stringMatching(board.url),
      containerName: board.attributes.containerName,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraBoard,
      objectKey: 'Board',
    });
  });

  it('should be able to parse jira project', () => {
    const project = generateRandomJiraProject() as JiraItemV2;
    const result = mapJiraItemToResult(project, sessionId);

    const avatar = project.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: project.id,
      avatarUrl: avatar.url,
      name: project.name,
      href: expect.stringMatching(project.url),
      containerName: project.attributes.projectType,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraProject,
    });
  });

  describe('avatar url', () => {
    it('should be able to extract the 48x48 avatar url', () => {
      const issue = generateRandomJiraIssue() as JiraItemV2;
      const avatar = issue.attributes.avatar || {};
      avatar.url = undefined;
      avatar.urls = { ['32x32']: 'http://32url', ['48x48']: 'http://48url' };
      const result = mapJiraItemToResult(issue, sessionId);
      expect(result.avatarUrl).toBe('http://48url');
    });

    it('should select first url if 48x48 url does not exist', () => {
      const issue = generateRandomJiraIssue() as JiraItemV2;
      const avatar = issue.attributes.avatar || {};
      avatar.url = undefined;
      avatar.urls = { ['32x32']: 'http://32url', ['16x16']: 'http://16url' };
      const result = mapJiraItemToResult(issue, sessionId);
      expect(result.avatarUrl).toBe('http://32url');
    });
  });

  describe('AddJiraResultQueryParams', () => {
    it('should add session attributes to jira url', () => {
      const url = 'https://product-fabric.atlassian.net/browse/ETH-671';
      const href = addJiraResultQueryParams(url, {
        searchSessionId: sessionId,
        searchContainerId: 'containerId',
        searchObjectId: 'objectId',
        searchContentType: 'issue',
      });
      expect(href).toBe(
        'https://product-fabric.atlassian.net/browse/ETH-671?searchSessionId=sessionId&searchContainerId=containerId&searchObjectId=objectId&searchContentType=issue',
      );
    });

    it('should not add falsy session attributes', () => {
      const url = 'https://product-fabric.atlassian.net/browse/ETH-671';
      const href = addJiraResultQueryParams(url, {
        searchSessionId: sessionId,
        searchContainerId: undefined,
        searchObjectId: '',
      });
      expect(href).toBe(
        'https://product-fabric.atlassian.net/browse/ETH-671?searchSessionId=sessionId',
      );
    });

    it('should not affect existing query params', () => {
      const url =
        'https://product-fabric.atlassian.net/browse/ETH-671?q=existing';
      const href = addJiraResultQueryParams(url, {
        searchSessionId: sessionId,
        searchContainerId: 'container',
      });
      expect(href).toBe(
        'https://product-fabric.atlassian.net/browse/ETH-671?q=existing&searchSessionId=sessionId&searchContainerId=container',
      );
    });
  });

  describe('mapJiraItemToResult with addSessionIdToJiraResult param', () => {
    let issue;
    beforeEach(() => {
      issue = {
        id: 'issue-id',
        name: 'issue-name',
        url: 'https://exmaple.jira.com/ISSUE-576',
        attributes: {
          '@type': 'issue',
          containerId: 'container-id',
          key: 'ISSUE-576',
          issueTypeName: 'story',
          issueTypeId: '10002',
          avatar: {
            url:
              'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg',
          },
        },
      } as JiraItemV2;
    });
    it('should add query params when addSessionIdToJiraResult is true', () => {
      const result = mapJiraItemToResult(issue, sessionId, true);
      expect(result.href).toBe(
        'https://exmaple.jira.com/ISSUE-576?searchSessionId=sessionId&searchContainerId=container-id&searchObjectId=issue-id&searchContentType=issue',
      );
    });

    it('should not add query params when addSessionIdToJiraResult is false', () => {
      const result = mapJiraItemToResult(issue, sessionId, false);
      expect(result.href).toBe('https://exmaple.jira.com/ISSUE-576');
    });
  });
});
