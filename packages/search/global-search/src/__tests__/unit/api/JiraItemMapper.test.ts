import {
  ResultType,
  AnalyticsType,
  ContentType,
} from '../../../../src/model/Result';

import { mapJiraItemToResult } from '../../../../src/api/JiraItemMapper';
import {
  generateRandomIssueV1,
  generateRandomJiraIssue,
  generateRandomJiraBoard,
  generateRandomJiraFilter,
  generateRandomJiraProject,
} from '../../../../example-helpers/mockJira';
import { JiraItemV1, JiraItemV2 } from '../../../api/types';

describe('mapJiraItemToResult', () => {
  it('should be able to parse issue V1 response', () => {
    const issue = generateRandomIssueV1() as JiraItemV1;
    const result = mapJiraItemToResult(issue);

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
    const result = mapJiraItemToResult(issue);

    const avatar = issue.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: issue.id,
      avatarUrl: avatar.url,
      name: issue.name,
      href: issue.url,
      containerName: issue.attributes.issueTypeName,
      objectKey: issue.attributes.key,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraIssue,
    });
  });

  it('should be able to parse jira filter', () => {
    const filter = generateRandomJiraFilter() as JiraItemV2;
    const result = mapJiraItemToResult(filter);

    const avatar = filter.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: filter.id,
      avatarUrl: avatar.url,
      name: filter.name,
      href: filter.url,
      containerName: filter.attributes.ownerName,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraFilter,
      objectKey: 'Filter',
    });
  });

  it('should be able to parse jira board', () => {
    const board = generateRandomJiraBoard() as JiraItemV2;
    const result = mapJiraItemToResult(board);

    const avatar = board.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: board.id,
      avatarUrl: avatar.url,
      name: board.name,
      href: board.url,
      containerName: board.attributes.containerName,
      analyticsType: AnalyticsType.ResultJira,
      resultType: ResultType.JiraObjectResult,
      contentType: ContentType.JiraBoard,
      objectKey: 'Board',
    });
  });

  it('should be able to parse jira project', () => {
    const project = generateRandomJiraProject() as JiraItemV2;
    const result = mapJiraItemToResult(project);

    const avatar = project.attributes.avatar || {};
    expect(result).toMatchObject({
      resultId: project.id,
      avatarUrl: avatar.url,
      name: project.name,
      href: project.url,
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
      const result = mapJiraItemToResult(issue);
      expect(result.avatarUrl).toBe('http://48url');
    });

    it('should select first url if 48x48 url does not exist', () => {
      const issue = generateRandomJiraIssue() as JiraItemV2;
      const avatar = issue.attributes.avatar || {};
      avatar.url = undefined;
      (avatar.urls = { ['32x32']: 'http://32url' }),
        { ['16x16']: 'http://16url' };
      const result = mapJiraItemToResult(issue);
      expect(result.avatarUrl).toBe('http://32url');
    });
  });
});
