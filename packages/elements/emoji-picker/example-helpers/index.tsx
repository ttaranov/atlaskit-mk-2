import { OnEmojiEvent, OnToneSelected, EmojiUpload } from '@atlaskit/emoji';
import { OnUploadEmoji } from '../src/common/EmojiUploadPicker';
import { emoji, UsageClearEmojiResource } from '@atlaskit/util-data-test';
import debug from '../src/util/logger';

const storyData = emoji.storyData;

export const onSelection: OnEmojiEvent = (emojiId, emoji, event?) =>
  debug('emoji selected', emojiId, emoji);

export const onToneSelected: OnToneSelected = (variation: number) =>
  debug('tone selected', variation);

export const onUploadEmoji: OnUploadEmoji = (upload: EmojiUpload) =>
  debug('uploaded emoji', upload);

export const onUploadCancelled = () => debug('upload cancelled');

export const {
  lorem,
  getEmojiResourceWithStandardAndAtlassianEmojis,
  loggedUser,
  getEmojis,
  getEmojiResource,
} = storyData;

export const getUsageClearEmojiResource: () => UsageClearEmojiResource =
  storyData.getUsageClearEmojiResource;
