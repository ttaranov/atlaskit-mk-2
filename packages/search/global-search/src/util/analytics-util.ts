import {
  Result,
  ConfluenceObjectResult,
  JiraResult,
  ResultType,
} from '../model/Result';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { ReferralContextIdentifiers } from '../components/GlobalQuickSearchWrapper';

export declare type ScreenEventSafeGasPayload = GasPayload & { name: string };

export const DEFAULT_GAS_SOURCE = 'globalSearchDrawer';
export const DEFAULT_GAS_CHANNEL = 'fabric-elements';
export const DEFAULT_GAS_ATTRIBUTES = {
  packageName: 'global-search',
  packageVersion: '0.0.0',
  componentName: 'GlobalQuickSearch',
};

export const GLOBAL_SEARCH_SCREEN_NAME = 'globalSearchDrawer';

export interface ShownAnalyticsAttributes {
  resultCount: number;
  resultSectionCount: number;
  resultContext: ShownResultContextSection[];
  experimentId?: string;
}

export interface PerformanceTiming {
  elapsedMs: number;
  [key: string]: number;
}

export interface ShownResultContextSection {
  sectionId: string;
  results: ShownResultContextItem[];
}

export interface ShownResultContextItem {
  resultContentId: string;
  resultType?: string;
  containerId?: string;
}

export interface PostQueryShownAttributes extends ShownAnalyticsAttributes {
  queryWordCount: number;
  queryCharacterCount: number;
}

export interface ResultSelectedAnalyticsDetails {
  resultContentId: string;
  resultType: string;
  section: string;
  sectionIndex: number;
  globalIndex: number;
  indexWithinSection: number;
}

export const sanitizeSearchQuery = (query: string): string => {
  return (query || '').replace(/\s+/g, ' ').trim();
};

export const sanitizeContainerId = (containerId?: string): string => {
  const trimmedContainerId = (containerId || '').trim();
  return trimmedContainerId.startsWith('~')
    ? 'UNAVAILABLE'
    : trimmedContainerId;
};

function mapResultsToShownSection(
  results: Result[],
): ShownResultContextSection {
  return {
    sectionId: results[0].resultType,
    results: results.map(mapResultToShownResult),
  };
}

function mapResultToShownResult(result: Result): ShownResultContextItem {
  if (result.resultType === ResultType.ConfluenceObjectResult) {
    const confluenceResult = result as ConfluenceObjectResult;
    return {
      resultContentId: result.resultId,
      resultType: confluenceResult.contentType,
      containerId: sanitizeContainerId(confluenceResult.containerId),
    };
  } else if (result.resultType === ResultType.JiraObjectResult) {
    const jiraResult = result as JiraResult;
    return {
      resultContentId: result.resultId,
      resultType: jiraResult.contentType,
      containerId: sanitizeContainerId(jiraResult.containerId),
    };
  }

  return {
    resultContentId: result.resultId,
  };
}

/**
 * @param resultsArrays an ordered array of Result arrays, passed as arguments
 */
export function buildShownEventDetails(
  ...resultsArrays: Result[][]
): ShownAnalyticsAttributes {
  const sectionsWithContent = resultsArrays.filter(
    section => section.length > 0,
  );
  const totalResultCount = resultsArrays.reduce(
    (prev, curr) => prev + curr.length,
    0,
  );

  // Grab experiment ID from the first result. For now we only run single experiments.
  const experimentId =
    sectionsWithContent[0] && sectionsWithContent[0][0]
      ? sectionsWithContent[0][0].experimentId
      : undefined;

  return {
    experimentId: experimentId,
    resultCount: totalResultCount,
    resultSectionCount: sectionsWithContent.length,
    resultContext: sectionsWithContent.map(mapResultsToShownSection),
  };
}

export enum Screen {
  PRE_QUERY = 'GlobalSearchPreQueryDrawer',
  POST_QUERY = 'GlobalSearchPostQueryDrawer',
}

export function buildScreenEvent(
  screen: Screen,
  timesViewed: number,
  searchSessionId: string,
  referralContextIdentifiers: ReferralContextIdentifiers,
): ScreenEventSafeGasPayload {
  return {
    action: 'viewed',
    actionSubject: GLOBAL_SEARCH_SCREEN_NAME,
    eventType: 'screen',
    source: DEFAULT_GAS_SOURCE,
    name: DEFAULT_GAS_SOURCE,
    attributes: {
      subscreen: screen,
      timesViewed: timesViewed,
      searchSessionId: searchSessionId,
      ...referralContextIdentifiers,
      ...DEFAULT_GAS_ATTRIBUTES,
    },
  };
}
