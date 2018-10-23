import * as URI from 'urijs';
import {
  ResultType,
  AnalyticsType,
  JiraResult,
  ContentType,
} from '../model/Result';

import {
  JiraItem,
  JiraItemV1,
  JiraItemV2,
  JiraItemAttributes,
  JiraResultQueryParams,
} from './types';

export const mapJiraItemToResult = (
  item: JiraItem,
  searchSessionId: string,
  addSessionIdToJiraResult?: boolean,
): JiraResult =>
  (<JiraItemV2>item).attributes && (<JiraItemV2>item).attributes['@type']
    ? mapJiraItemToResultV2(
        item as JiraItemV2,
        searchSessionId,
        addSessionIdToJiraResult,
      )
    : mapJiraItemToResultV1(item as JiraItemV1);

/**
 * add search session id, object id, container id and result type to query params
 */
export const addJiraResultQueryParams = (
  url: string,
  queryParams: JiraResultQueryParams,
) => {
  const href = new URI(url);
  Object.keys(queryParams)
    .filter(key => !!queryParams[key])
    .forEach(key => {
      href.addQuery(key, queryParams[key]);
    });
  return href.toString();
};

const extractSpecificAttributes = (attributes: JiraItemAttributes) => {
  const type = attributes['@type'];
  switch (type) {
    case 'issue':
      return {
        objectKey: attributes.key,
        containerName: attributes.issueTypeName,
      };
    case 'board':
      return {
        objectKey: 'Board',
        containerName: attributes.containerName,
      };
    case 'filter':
      return {
        objectKey: 'Filter',
        containerName: attributes.ownerName,
      };
    case 'project':
      return {
        containerName: attributes.projectType,
      };
  }
  return null;
};

const extractAvatarUrl = ({ url = '', urls = {} } = {}) => {
  if (url) {
    return url;
  }
  return urls['48x48'] || urls[Object.keys(urls)[0]];
};

const JIRA_TYPE_TO_CONTENT_TYPE = {
  issue: ContentType.JiraIssue,
  board: ContentType.JiraBoard,
  filter: ContentType.JiraFilter,
  project: ContentType.JiraProject,
};

const mapJiraItemToResultV2 = (
  item: JiraItemV2,
  searchSessionId: string,
  addSessionIdToJiraResult?: boolean,
): JiraResult => {
  const { id, name, url, attributes } = item;
  const contentType = JIRA_TYPE_TO_CONTENT_TYPE[attributes['@type']];
  const queryParams = {
    searchSessionId,
    searchContainerId: attributes.containerId,
    searchObjectId: id,
    searchContentType: attributes['@type'],
  };

  const href = addSessionIdToJiraResult
    ? addJiraResultQueryParams(url, queryParams)
    : url;

  return {
    resultId: id,
    name: name,
    href,
    resultType: ResultType.JiraObjectResult,
    containerId: attributes.containerId,
    analyticsType: AnalyticsType.ResultJira,
    ...extractSpecificAttributes(attributes),
    avatarUrl: attributes.avatar && extractAvatarUrl(attributes.avatar),
    contentType,
  };
};

const mapJiraItemToResultV1 = (item: JiraItemV1): JiraResult => {
  return {
    resultId: item.key,
    avatarUrl: item.fields.issuetype.iconUrl,
    name: item.fields.summary,
    href: `/browse/${item.key}`,
    containerName: item.fields.project.name,
    objectKey: item.key,
    analyticsType: AnalyticsType.ResultJira,
    resultType: ResultType.JiraObjectResult,
    contentType: ContentType.JiraIssue,
  };
};
