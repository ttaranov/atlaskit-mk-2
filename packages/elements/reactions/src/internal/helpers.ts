import { EmojiId } from '@atlaskit/emoji';
import { ReactionSummary } from '../reactions-resource';

export const isLeftClick = event =>
  event.button === 0 &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.shiftKey;

export const findIndex = (
  array: any[],
  predicate: (item: any) => boolean,
): number => {
  let index = -1;
  array.some((item, i) => {
    if (predicate(item)) {
      index = i;
      return true;
    }
    return false;
  });

  return index;
};

export const updateReadonlyArray = <T>(
  array: Array<T>,
  index: number,
  updater: (T) => T,
): Array<T> => {
  return array.map((value, i) => {
    if (i === index) {
      return updater(value);
    }

    return value;
  });
};

export const unique = (array: any[], predicate: (item: any) => string) => {
  const seen = {};
  return array.filter(
    item => (seen[predicate(item)] ? false : (seen[predicate(item)] = true)),
  );
};

export const equalEmojiId = (
  l: EmojiId | string,
  r: EmojiId | string,
): boolean => {
  if (isEmojiId(l) && isEmojiId(r)) {
    return l === r || (l && r && l.id === r.id && l.shortName === r.shortName);
  } else {
    return l === r;
  }
};

const isEmojiId = (emojiId: EmojiId | string): emojiId is EmojiId => {
  return (emojiId as EmojiId).id !== undefined;
};

export const compareEmojiId = (l: string, r: string): number => {
  return l.localeCompare(r);
};

export type ReactionSummarySortFunction = (
  a: ReactionSummary,
  b: ReactionSummary,
) => number;

export const sortByRelevance: ReactionSummarySortFunction = (
  a: ReactionSummary,
  b: ReactionSummary,
) => {
  if (a.count > b.count) {
    return -1;
  } else if (a.count < b.count) {
    return 1;
  } else {
    return compareEmojiId(a.emojiId, b.emojiId);
  }
};

export const sortByPreviousPosition = (
  reactions: ReactionSummary[],
): ReactionSummarySortFunction => {
  const indexes: { [emojiId: string]: number } = reactions.reduce(
    (map, reaction, index) => {
      map[reaction.emojiId] = index;
      return map;
    },
    {},
  );

  const getPosition = ({ emojiId }: ReactionSummary) =>
    indexes[emojiId] === undefined ? reactions.length : indexes[emojiId];

  return (a, b) => getPosition(a) - getPosition(b);
};

export const isPromise = (p): p is Promise<any> =>
  !!(p && (<Promise<any>>p).then);
