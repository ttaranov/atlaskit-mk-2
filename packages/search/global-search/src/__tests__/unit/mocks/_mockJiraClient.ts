import { JiraResult } from '../../../model/Result';
import { JiraClient } from '../../../api/JiraClient';

const mockJiraClient = (recentImpl, canSearchUsersImpl): JiraClient => ({
  getRecentItems: jest.fn(recentImpl),
  canSearchUsers: jest.fn(canSearchUsersImpl),
});

export const mockErrorJiraClient = (error, canSearchUsers: boolean = true) =>
  mockJiraClient(
    () => Promise.reject(error),
    () => Promise.resolve(canSearchUsers),
  );
export const mockNoResultJiraClient = (canSearchUsers: boolean = true) =>
  mockJiraClient(
    () => Promise.resolve([]),
    () => Promise.resolve(canSearchUsers),
  );
export const mockJiraClientWithData = (
  jiraResults: JiraResult[],
  canSearchUsers: boolean = true,
) =>
  mockJiraClient(
    () => Promise.resolve(jiraResults),
    () => Promise.resolve(canSearchUsers),
  );
