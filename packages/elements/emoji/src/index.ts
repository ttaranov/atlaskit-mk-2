import { AbstractResource } from '@atlaskit/util-service-support';
import Emoji from './components/common/Emoji';
import EmojiPlaceholder from './components/common/EmojiPlaceholder';
import CachingEmoji from './components/common/CachingEmoji';
import ResourcedEmoji from './components/common/ResourcedEmoji';
import EmojiPreview from './components/common/EmojiPreview';
import LoadingEmojiComponent from './components/common/LoadingEmojiComponent';
import EmojiTypeAhead from './components/typeahead/EmojiTypeAhead';
import EmojiResource, {
  EmojiProvider,
  UploadingEmojiProvider,
  EmojiResourceConfig,
} from './api/EmojiResource';
import EmojiRepository, { getEmojiVariation } from './api/EmojiRepository';
import EmojiLoader from './api/EmojiLoader';
import { denormaliseEmojiServiceResponse } from './api/EmojiUtils';
import {
  toEmojiId,
  toOptionalEmojiId,
  supportsUploadFeature,
} from './type-helpers';
import {
  customCategory,
  defaultEmojiHeight,
  frequentCategory,
  analyticsEmojiPrefix,
  defaultCategories,
} from './constants';

export {
  // Classes
  AbstractResource,
  Emoji,
  EmojiPlaceholder,
  EmojiLoader,
  EmojiResource,
  EmojiResourceConfig,
  EmojiRepository,
  EmojiTypeAhead,
  ResourcedEmoji,
  // functions
  denormaliseEmojiServiceResponse,
  toEmojiId,
  toOptionalEmojiId,
  supportsUploadFeature,
  // interfaces
  EmojiProvider,
  UploadingEmojiProvider,
  defaultEmojiHeight,
  customCategory,
  frequentCategory,
  analyticsEmojiPrefix,
  defaultCategories,
  // common components for picker
  CachingEmoji,
  EmojiPreview,
  LoadingEmojiComponent,
  getEmojiVariation,
};

export * from './types';

export default EmojiTypeAhead;
