import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  EmojiId,
  EmojiServiceDescription,
  MediaApiToken,
  EmojiRepository,
  denormaliseEmojiServiceResponse,
} from '@atlaskit/emoji';
import { customCategory, customType } from './utils';
import {
  mockNonUploadingEmojiResourceFactory,
  mockEmojiResourceFactory,
} from './MockEmojiResource';

export const spriteEmoji: EmojiDescription = {
  id: 'grimacing',
  shortName: ':grimacing:',
  name: 'Grimacing',
  type: 'standard',
  category: 'PEOPLE',
  order: 666,
  representation: {
    sprite: {
      url: 'https://path-to-spritesheet.png',
      row: 6,
      column: 6,
      height: 1024,
      width: 1024,
    },
    xIndex: 1,
    yIndex: 1,
    x: 123,
    y: 456,
    height: 72,
    width: 72,
  },
  searchable: true,
};

export const imageEmoji: EmojiDescription = {
  id: 'grimacing',
  shortName: ':grimacing:',
  name: 'Grimacing',
  type: 'standard',
  category: 'PEOPLE',
  order: 777,
  representation: {
    imagePath: 'https://path-to-image.png',
    width: 24,
    height: 24,
  },
  altRepresentation: {
    imagePath: 'https://alt-path-to-image.png',
    width: 48,
    height: 48,
  },
  searchable: true,
};

export const mediaBaseUrl = 'https://media.example.com/';
export const mediaEmojiImagePath = `${mediaBaseUrl}path-to-image.png`;
export const mediaEmojiAlternateImagePath = `${mediaBaseUrl}alt-path-to-image.png`;

export const mediaServiceEmoji: EmojiServiceDescription = {
  id: 'media',
  shortName: ':media:',
  name: 'Media example',
  fallback: ':media:',
  type: customType,
  category: customCategory,
  order: -2,
  representation: {
    imagePath: mediaEmojiImagePath,
    width: 24,
    height: 24,
  },
  altRepresentations: {
    XHDPI: {
      imagePath: mediaEmojiAlternateImagePath,
      width: 48,
      height: 48,
    },
  },
  searchable: true,
};

export const mediaEmojiId: EmojiId = {
  id: 'media',
  shortName: ':media:',
  fallback: ':media:',
};

export const mediaEmoji: EmojiDescriptionWithVariations = {
  ...mediaEmojiId,
  name: 'Media example',
  type: customType,
  category: customCategory,
  order: -2,
  representation: {
    mediaPath: mediaEmojiImagePath,
    width: 24,
    height: 24,
  },
  altRepresentation: {
    mediaPath: mediaEmojiAlternateImagePath,
    width: 48,
    height: 48,
  },
  skinVariations: [],
  searchable: true,
};

export const siteEmojiFoo: EmojiDescriptionWithVariations = {
  id: 'foo',
  name: 'foo',
  fallback: ':foo:',
  type: 'SITE',
  category: 'CUSTOM',
  order: -1000,
  searchable: true,
  shortName: ':foo:',
  creatorUserId: 'hulk',
  representation: {
    height: 72,
    width: 92,
    imagePath: 'https://image-path-foo.png',
  },
  skinVariations: [],
};

export const siteEmojiWtf: EmojiDescriptionWithVariations = {
  id: 'wtf',
  name: 'wtf',
  fallback: ':wtf:',
  type: 'SITE',
  category: 'CUSTOM',
  order: -1000,
  searchable: true,
  shortName: ':wtf:',
  creatorUserId: 'Thor',
  representation: {
    height: 72,
    width: 92,
    imagePath:
      'https://pf-emoji-service--cdn.useast.atlassian.io/atlassian/wtf@4x.png',
  },
  skinVariations: [],
};

export const expiresAt = (offsetSeconds: number = 0): number =>
  Math.floor(Date.now() / 1000) + offsetSeconds;

export const defaultMediaApiToken = (): MediaApiToken => ({
  url: mediaBaseUrl,
  clientId: '1234',
  jwt: 'abcd',
  collectionName: 'emoji-collection',
  expiresAt: expiresAt(60), // seconds since Epoch UTC
});

// tslint:disable-next-line:no-var-requires
export const standardServiceEmojis = require('../json-data/test-emoji-standard.json');
// tslint:disable-next-line:no-var-requires
export const atlassianServiceEmojis = require('../json-data/test-emoji-atlassian.json');
export const siteServiceEmojis = () => ({
  emojis: [mediaServiceEmoji],
  meta: {
    mediaApiToken: defaultMediaApiToken(),
  },
});

export const filterToSearchable = (
  emojis: EmojiDescription[],
): EmojiDescription[] => {
  return emojis.filter(emoji => emoji.searchable);
};

export const standardEmojis: EmojiDescription[] = denormaliseEmojiServiceResponse(
  standardServiceEmojis,
).emojis;
export const atlassianEmojis: EmojiDescription[] = denormaliseEmojiServiceResponse(
  atlassianServiceEmojis,
).emojis;
export const siteEmojis: EmojiDescription[] = [mediaEmoji];
export const emojis: EmojiDescription[] = [
  ...standardEmojis,
  ...atlassianEmojis,
  ...siteEmojis,
];
export const searchableEmojis: EmojiDescription[] = filterToSearchable(emojis);

export const newEmojiRepository = () => new EmojiRepository(emojis);
export const newSiteEmojiRepository = () => new EmojiRepository(siteEmojis);

const defaultEmojiRepository = newEmojiRepository();

export const smileyEmoji = defaultEmojiRepository.findByShortName(
  ':smiley:',
) as EmojiDescriptionWithVariations;
export const openMouthEmoji = defaultEmojiRepository.findByShortName(
  ':open_mouth:',
) as EmojiDescriptionWithVariations;
export const grinEmoji = defaultEmojiRepository.findByShortName(
  ':grin:',
) as EmojiDescriptionWithVariations;
export const evilburnsEmoji = defaultEmojiRepository.findByShortName(
  ':evilburns:',
) as EmojiDescriptionWithVariations;
export const thumbsupEmoji = defaultEmojiRepository.findByShortName(
  ':thumbsup:',
) as EmojiDescriptionWithVariations;
export const thumbsdownEmoji = defaultEmojiRepository.findByShortName(
  ':thumbsdown:',
) as EmojiDescriptionWithVariations;
export const standardBoomEmoji = defaultEmojiRepository.findById(
  '1f4a5',
) as EmojiDescriptionWithVariations;
export const atlassianBoomEmoji = defaultEmojiRepository.findById(
  'atlassian-boom',
) as EmojiDescriptionWithVariations;
export const blackFlagEmoji = defaultEmojiRepository.findByShortName(
  ':flag_black:',
) as EmojiDescriptionWithVariations;
export const congoFlagEmoji = defaultEmojiRepository.findByShortName(
  ':flag_cg:',
) as EmojiDescriptionWithVariations;

export const getNonUploadingEmojiResourcePromise = (config?) =>
  mockNonUploadingEmojiResourceFactory(newEmojiRepository(), config);

export const getEmojiResourcePromise = (config?) =>
  mockEmojiResourceFactory(newEmojiRepository(), config);

export const getEmojiResourcePromiseFromRepository = (repo, config?) =>
  mockEmojiResourceFactory(repo, config);
