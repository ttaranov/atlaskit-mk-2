import { JiraResult } from '../../../model/Result';
import { JiraClient } from '../../../api/JiraClient';

const mockJiraClient = (impl): JiraClient => ({
  getRecentItems: jest.fn(impl),
});

export const mockErrorJiraClient = error =>
  mockJiraClient(() => Promise.reject(error));
export const mockNoResultJiraClient = () =>
  mockJiraClient(() => Promise.resolve([]));
export const mockJiraClientWithData = (jiraResults: JiraResult[]) =>
  mockJiraClient(() => Promise.resolve(jiraResults));
