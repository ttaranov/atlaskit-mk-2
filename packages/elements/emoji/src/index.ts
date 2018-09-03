import { AbstractResource } from '@atlaskit/util-service-support';
import Emoji from './components/common/Emoji';
import EmojiPlaceholder from './components/common/EmojiPlaceholder';
import CachingEmoji from './components/common/CachingEmoji';
import ResourcedEmoji from './components/common/ResourcedEmoji';
import EmojiPreview from './components/common/EmojiPreview';
import LoadingEmojiComponent, {
  Props as LoadingEmojiProps,
  State as LoadingEmojiState,
} from './components/common/LoadingEmojiComponent';
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
export {
  customCategory,
  defaultEmojiHeight,
  frequentCategory,
  analyticsEmojiPrefix,
  defaultCategories,
  emojiNode,
  emojiSprite,
  placeholder,
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
  // interfaces
  EmojiProvider,
  UploadingEmojiProvider,
  // common components for picker
  CachingEmoji,
  EmojiPreview,
  LoadingEmojiComponent,
  LoadingEmojiProps,
  LoadingEmojiState,
  getEmojiVariation,
};

export * from './types';

export default EmojiTypeAhead;
