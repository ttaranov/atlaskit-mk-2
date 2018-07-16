import EmojiActivityIcon from '@atlaskit/icon/glyph/emoji/activity';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import EmojiFlagsIcon from '@atlaskit/icon/glyph/emoji/flags';
import EmojiFoodIcon from '@atlaskit/icon/glyph/emoji/food';
import EmojiFrequentIcon from '@atlaskit/icon/glyph/emoji/frequent';
import EmojiNatureIcon from '@atlaskit/icon/glyph/emoji/nature';
import EmojiObjectsIcon from '@atlaskit/icon/glyph/emoji/objects';
import EmojiPeopleIcon from '@atlaskit/icon/glyph/emoji/people';
import EmojiSymbolsIcon from '@atlaskit/icon/glyph/emoji/symbols';
import EmojiTravelIcon from '@atlaskit/icon/glyph/emoji/travel';
import EmojiProductivityIcon from '@atlaskit/icon/glyph/emoji/productivity';

import { CategoryDescription } from '../../types';
import { customCategory, userCustomTitle, customTitle } from '../../constants';

export type CategoryId =
  | 'FREQUENT'
  | 'PEOPLE'
  | 'NATURE'
  | 'FOODS'
  | 'ACTIVITY'
  | 'PLACES'
  | 'OBJECTS'
  | 'SYMBOLS'
  | 'FLAGS'
  | 'ATLASSIAN'
  | 'CUSTOM';

export type CategoryGroupKey = CategoryId | 'USER_CUSTOM' | 'SEARCH';

export type CategoryDescriptionMap = {
  [key in CategoryGroupKey]: CategoryDescription
};

export const CategoryDescriptionMap: CategoryDescriptionMap = {
  SEARCH: {
    id: 'SEARCH',
    name: 'Search results',
    icon: undefined,
    order: 0,
  },
  FREQUENT: {
    id: 'FREQUENT',
    name: 'Frequent',
    icon: EmojiFrequentIcon,
    order: 1,
  },
  PEOPLE: {
    id: 'PEOPLE',
    name: 'People',
    icon: EmojiPeopleIcon,
    order: 2,
  },
  NATURE: {
    id: 'NATURE',
    name: 'Nature',
    icon: EmojiNatureIcon,
    order: 3,
  },
  FOODS: {
    id: 'FOODS',
    name: 'Food & Drink',
    icon: EmojiFoodIcon,
    order: 4,
  },
  ACTIVITY: {
    id: 'ACTIVITY',
    name: 'Activity',
    icon: EmojiActivityIcon,
    order: 5,
  },
  PLACES: {
    id: 'PLACES',
    name: 'Travel & Places',
    icon: EmojiTravelIcon,
    order: 6,
  },
  OBJECTS: {
    id: 'OBJECTS',
    name: 'Objects',
    icon: EmojiObjectsIcon,
    order: 7,
  },
  SYMBOLS: {
    id: 'SYMBOLS',
    name: 'Symbols',
    icon: EmojiSymbolsIcon,
    order: 8,
  },
  FLAGS: {
    id: 'FLAGS',
    name: 'Flags',
    icon: EmojiFlagsIcon,
    order: 9,
  },
  ATLASSIAN: {
    id: 'ATLASSIAN',
    name: 'Productivity',
    icon: EmojiProductivityIcon,
    order: 10,
  },
  USER_CUSTOM: {
    id: customCategory,
    name: userCustomTitle,
    icon: EmojiCustomIcon,
    order: 11,
  },
  CUSTOM: {
    id: customCategory,
    name: customTitle,
    icon: EmojiCustomIcon,
    order: 12,
  },
};
