import { AbstractResource } from '@atlaskit/util-service-support';
import Emoji from './components/common/Emoji';
import EmojiPlaceholder from './components/common/EmojiPlaceholder';
import ResourcedEmoji from './components/common/ResourcedEmoji';
import EmojiPicker from './components/picker/EmojiPicker';
import EmojiTypeAhead from './components/typeahead/EmojiTypeAhead';
import EmojiTypeAheadItem from './components/typeahead/EmojiTypeAheadItem';
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
  customCategory,
  defaultEmojiHeight,
  defaultListLimit,
  emojiPickerWidth,
  emojiPickerHeight,
} from './constants';

export {
  // Classes
  AbstractResource,
  Emoji,
  EmojiPlaceholder,
  EmojiLoader,
  EmojiPicker,
  EmojiResource,
  EmojiRepository,
  EmojiTypeAhead,
  EmojiTypeAheadItem,
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
  defaultListLimit,
  customCategory,
  EmojiResourceConfig,
};

export * from './types';

export default EmojiPicker;
