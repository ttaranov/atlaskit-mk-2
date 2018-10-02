import * as URI from 'urijs';
import {
  ResultType,
  AnalyticsType,
  ContainerResult,
  ConfluenceObjectResult,
  ContentType,
  Result,
} from '../model/Result';
import { Scope, ConfluenceItem } from './types';

export function removeHighlightTags(text: string): string {
  return text.replace(/@@@hl@@@|@@@endhl@@@/g, '');
}

function mapConfluenceItemToResultObject(
  item: ConfluenceItem,
  searchSessionId: string,
  experimentId?: string,
): ConfluenceObjectResult {
  const href = new URI(`${item.baseUrl}${item.url}`);
  href.addQuery('search_id', searchSessionId);

  return {
    resultId: item.content!.id, // content always available for pages/blogs/attachments
    name: removeHighlightTags(item.title),
    href: `${href.pathname()}?${href.query()}`,
    containerName: item.container.title,
    analyticsType: AnalyticsType.ResultConfluence,
    contentType: `confluence-${item.content!.type}` as ContentType,
    resultType: ResultType.ConfluenceObjectResult,
    containerId: 'UNAVAILABLE', // TODO
    iconClass: item.iconCssClass,
    experimentId: experimentId,
  };
}

function mapConfluenceItemToResultSpace(
  spaceItem: ConfluenceItem,
  searchSessionId: string,
  experimentId?: string,
): ContainerResult {
  // add searchSessionId
  const href = new URI(
    `${spaceItem.baseUrl || ''}${spaceItem.container.displayUrl}`,
  );
  href.addQuery('search_id', searchSessionId);

  return {
    resultId: `space-${spaceItem.space!.key}`, // space is always defined for space results
    avatarUrl: `${spaceItem.baseUrl}${spaceItem.space!.icon.path}`,
    name: spaceItem.container.title,
    href: `${href.pathname()}?${href.query()}`,
    analyticsType: AnalyticsType.ResultConfluence,
    resultType: ResultType.GenericContainerResult,
    contentType: ContentType.ConfluenceSpace,
    experimentId: experimentId,
  };
}

export function mapConfluenceItemToResult(
  scope: Scope,
  item: ConfluenceItem,
  searchSessionId: string,
  experimentId?: string,
): Result {
  const mapper =
    scope === Scope.ConfluenceSpace
      ? mapConfluenceItemToResultSpace
      : mapConfluenceItemToResultObject;
  return mapper(item as ConfluenceItem, searchSessionId, experimentId);
}
