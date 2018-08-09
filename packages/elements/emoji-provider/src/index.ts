import { AbstractResource } from '@atlaskit/util-service-support';
import EmojiResource, {
  EmojiProvider,
  UploadingEmojiProvider,
  EmojiResourceConfig,
} from './api/EmojiResource';
import EmojiRepository from './api/EmojiRepository';
import EmojiLoader from './api/EmojiLoader';
import { denormaliseEmojiServiceResponse } from './api/EmojiUtils';

export {
  // Classes
  AbstractResource,
  EmojiLoader,
  EmojiResource,
  EmojiRepository,
  // functions
  denormaliseEmojiServiceResponse,
  // interfaces
  EmojiProvider,
  UploadingEmojiProvider,
  EmojiResourceConfig,
};

export default EmojiResource;
