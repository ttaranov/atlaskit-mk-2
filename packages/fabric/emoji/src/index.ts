import { AbstractResource } from '@atlaskit/util-service-support';
import AtlassianEmojiMigrationResource from './api/AtlassianEmojiMigrationResource';
import Emoji from './components/common/Emoji';
import EmojiPlaceholder from './components/common/EmojiPlaceholder';
import ResourcedEmoji from './components/common/ResourcedEmoji';
import EmojiPicker from './components/picker/EmojiPicker';
import EmojiTypeAhead from './components/typeahead/EmojiTypeAhead';
import EmojiResource, {
  EmojiProvider,
  UploadingEmojiProvider,
} from './api/EmojiResource';
import EmojiRepository from './api/EmojiRepository';
import EmojiLoader from './api/EmojiLoader';
import { denormaliseEmojiServiceResponse } from './api/EmojiUtils';
import { toEmojiId, toOptionalEmojiId } from './type-helpers';
import {
  customCategory,
  defaultEmojiHeight,
  emojiPickerWidth,
  emojiPickerHeight,
} from './constants';
import { mockEmojiResource, testData, storyData } from './support';
import * as support from './support';

export {
  // Classes
  AbstractResource,
  AtlassianEmojiMigrationResource,
  Emoji,
  EmojiPlaceholder,
  EmojiLoader,
  EmojiPicker,
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
  customCategory,
  // Support types
  mockEmojiResource,
  testData,
  storyData,
  support,
};

export * from './types';

export default EmojiPicker;
