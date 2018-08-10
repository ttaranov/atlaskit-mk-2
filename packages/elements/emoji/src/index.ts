import { AbstractResource } from '@atlaskit/util-service-support';
import Emoji from './components/common/Emoji';
import CachingEmoji from './components/common/CachingEmoji';
import EmojiPreview from './components/common/EmojiPreview';
import EmojiPlaceholder from './components/common/EmojiPlaceholder';
import ResourcedEmoji from './components/common/ResourcedEmoji';
import EmojiTypeAhead from './components/typeahead/EmojiTypeAhead';
import EmojiResource, {
  EmojiProvider,
  UploadingEmojiProvider,
  EmojiResourceConfig,
} from './api/EmojiResource';
import EmojiRepository from './api/EmojiRepository';
import EmojiLoader from './api/EmojiLoader';
import { denormaliseEmojiServiceResponse } from './api/EmojiUtils';
import { toEmojiId, toOptionalEmojiId } from './type-helpers';
import {
  defaultEmojiHeight,
  emojiPickerWidth,
  emojiPickerHeight,
} from './constants';

export {
  // Classes
  AbstractResource,
  Emoji,
  EmojiPlaceholder,
  EmojiLoader,
  EmojiResource,
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
  // Constants
  emojiPickerWidth,
  emojiPickerHeight,
  defaultEmojiHeight,
  EmojiResourceConfig,
  EmojiPreview,
  CachingEmoji,
};

export * from './types';

export default EmojiResource;
