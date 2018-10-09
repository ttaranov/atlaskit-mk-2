import { EventType, GasPayload } from '@atlaskit/analytics-gas-types';
import { isSpecialMention, MentionDescription } from '@atlaskit/mention';
import {
  name as packageName,
  version as packageVersion,
} from '../../../../package.json';
import { InsertType } from '../../../analytics/fabric-analytics-helper';

export const buildAnalyticsPayload = (
  actionSubject: string,
  action: string,
  eventType: EventType,
  sessionId: string,
  otherAttributes = {},
): GasPayload => ({
  action,
  actionSubject,
  eventType,
  attributes: {
    packageName,
    packageVersion,
    componentName: 'mention',
    sessionId,
    ...otherAttributes,
  },
  source: 'unknown',
});

type QueryAttributes = Partial<{
  queryLength: number;
  spaceInQuery: boolean;
}>;

const emptyQueryResponse: QueryAttributes = {
  queryLength: 0,
  spaceInQuery: false,
};

const extractAttributesFromQuery = (query?: string): QueryAttributes => {
  if (query) {
    return {
      queryLength: query.length,
      spaceInQuery: query.indexOf(' ') !== -1,
    };
  }
  return emptyQueryResponse;
};

export const buildTypeAheadCancelPayload = (
  duration: number,
  upKeyCount: number,
  downKeyCount: number,
  sessionId: string,
  query?: string,
): GasPayload => {
  const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
  return buildAnalyticsPayload(
    'mentionTypeahead',
    'cancelled',
    'ui',
    sessionId,
    {
      duration,
      downKeyCount,
      upKeyCount,
      queryLength,
      spaceInQuery,
    },
  );
};

const getPosition = (
  mentionList: MentionDescription[] | undefined,
  selectedMention: MentionDescription,
): number | undefined => {
  if (mentionList) {
    const index = mentionList.findIndex(
      mention => mention.id === selectedMention.id,
    );
    return index === -1 ? undefined : index;
  }
  return;
};

const isClicked = (insertType: InsertType) =>
  insertType === InsertType.SELECTED;

export const buildTypeAheadInsertedPayload = (
  duration: number,
  upKeyCount: number,
  downKeyCount: number,
  sessionId: string,
  insertType: InsertType,
  mention: MentionDescription,
  mentionList?: MentionDescription[],
  query?: string,
): GasPayload => {
  const { queryLength, spaceInQuery } = extractAttributesFromQuery(query);
  return buildAnalyticsPayload(
    'mentionTypeahead',
    isClicked(insertType) ? 'clicked' : 'pressed',
    'ui',
    sessionId,
    {
      duration,
      position: getPosition(mentionList, mention),
      keyboardKey: isClicked(insertType) ? undefined : insertType,
      queryLength,
      spaceInQuery,
      isSpecial: isSpecialMention(mention),
      accessLevel: mention.accessLevel || '',
      userType: mention.userType,
      userId: mention.id,
      upKeyCount,
      downKeyCount,
    },
  );
};
