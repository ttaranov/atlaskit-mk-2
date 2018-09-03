import * as sinon from 'sinon';

import TokenManager from '../../api/media/TokenManager';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  EmojiId,
  EmojiServiceDescription,
  EmojiVariationDescription,
  MediaApiRepresentation,
  MediaApiToken,
} from '../../types';
import { convertMediaToImageRepresentation } from '../../type-helpers';
import { emoji } from '@atlaskit/util-data-test';
import EmojiRepository from '../../api/EmojiRepository';

const testData = emoji.testData;

export const {
  mediaEmoji,
  grinEmoji,
  spriteEmoji,
  imageEmoji,
  mediaEmojiId,
  mediaEmojiImagePath,
  mediaBaseUrl,
  atlassianEmojis,
  atlassianBoomEmoji,
  atlassianServiceEmojis,
  standardServiceEmojis,
  siteServiceEmojis,
  emojis,
  openMouthEmoji,
  searchableEmojis,
  standardEmojis,
  smileyEmoji,
  thumbsupEmoji,
  thumbsdownEmoji,
  evilburnsEmoji,
  filterToSearchable,
  mediaServiceEmoji,
  getEmojiResourcePromise,
  getEmojiResourcePromiseFromRepository,
  standardBoomEmoji,
  blackFlagEmoji,
} = testData;

export const newEmojiRepository: () => EmojiRepository =
  testData.newEmojiRepository;
export const newSiteEmojiRepository: () => EmojiRepository =
  testData.newSiteEmojiRepository;

export const loadedMediaEmoji: EmojiDescriptionWithVariations = {
  ...mediaEmoji,
  representation: {
    imagePath: 'data:;base64,', // assumes an empty result is returned (e.g. via fetchMock for the mediaPath)
    width: 24,
    height: 24,
  },
  altRepresentation: convertMediaToImageRepresentation(
    mediaEmoji.altRepresentation as MediaApiRepresentation,
  ),
};

export const loadedAltMediaEmoji: EmojiDescriptionWithVariations = {
  ...mediaEmoji,
  representation: convertMediaToImageRepresentation(
    mediaEmoji.representation as MediaApiRepresentation,
  ),
  altRepresentation: {
    imagePath: 'data:;base64,', // assumes an empty result is returned (e.g. via fetchMock for the mediaPath)
    width: 48,
    height: 48,
  },
};

const missingMediaId = 'some-new-emoji';

export const missingMediaEmojiId: EmojiId = {
  id: missingMediaId,
  shortName: `:${missingMediaId}:`,
  fallback: `:${missingMediaId}:`,
};

export const missingMediaServiceEmoji: EmojiServiceDescription = {
  ...testData.mediaServiceEmoji,
  ...missingMediaEmojiId,
};

export const missingMediaEmoji: EmojiDescription = {
  ...(mediaEmoji as EmojiDescription),
  ...missingMediaEmojiId,
};

export const siteUrl = 'https://emoji.example.com/emoji/site/blah';

export const fetchSiteEmojiUrl = (emojiId: EmojiId): string =>
  `${siteUrl}/../${emojiId.id}`;

export const siteServiceConfig = {
  url: siteUrl,
};

export const expiresAt = (offsetSeconds: number = 0): number =>
  Math.floor(Date.now() / 1000) + offsetSeconds;

export const defaultMediaApiToken = (): MediaApiToken => ({
  url: testData.mediaBaseUrl,
  clientId: '1234',
  jwt: 'abcd',
  collectionName: 'emoji-collection',
  expiresAt: expiresAt(60), // seconds since Epoch UTC
});

export const createTokenManager = (
  getTokenReturn?: Promise<MediaApiToken>,
): TokenManager => {
  const tokenManagerStub = sinon.createStubInstance(TokenManager) as any;
  tokenManagerStub.getToken.returns(
    getTokenReturn || Promise.resolve(defaultMediaApiToken()),
  );
  return tokenManagerStub;
};

export const generateSkinVariation = (
  base: EmojiDescription,
  idx: number,
): EmojiVariationDescription => {
  const { id, shortName, name } = base;
  if (!id) {
    throw new Error('An id is required for generating a skin variation');
  }

  return {
    id: `${id}-${idx}`,
    baseId: id,
    shortName: `${shortName.substring(0, shortName.length - 1)}-${idx}:`,
    name: `${name} ${idx}`,
    type: 'SITE',
    category: 'CHEESE',
    representation: {
      imagePath: `https://path-to-skin-variation-tone${idx}.png`,
      width: 24,
      height: 24,
    },
    searchable: false,
  };
};

export const blobResponse = (blob: Blob) => ({
  body: blob,
  sendAsJson: false,
});
