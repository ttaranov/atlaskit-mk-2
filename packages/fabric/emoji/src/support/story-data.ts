import { denormaliseEmojiServiceResponse } from '../api/EmojiUtils';
import EmojiRepository from '../api/EmojiRepository';
import { MockEmojiResourceConfig } from './support-types';
import {
  UsageClearEmojiResource,
  emojiProviderFactory,
} from './MockEmojiResource';
import { EmojiDescription, EmojiServiceResponse } from '../types';
import { EmojiProvider } from '../api/EmojiResource';
import { siteEmojiWtf } from './test-data';

let emojisSets: Map<string, EmojiDescription[]>;

export const getStandardEmojiData = (): EmojiServiceResponse =>
  require('./json-data/service-data-standard.json') as EmojiServiceResponse;
export const getAtlassianEmojiData = (): EmojiServiceResponse =>
  require('./json-data/service-data-atlassian.json') as EmojiServiceResponse;

const siteEmojis = {
  emojis: [siteEmojiWtf],
};

export const getSiteEmojiData = (): EmojiServiceResponse =>
  siteEmojis as EmojiServiceResponse;

export const getAllEmojiData = (): EmojiServiceResponse => {
  const standardEmojis = getStandardEmojiData();
  const atlassianEmojis = getAtlassianEmojiData();
  const siteEmojis = getSiteEmojiData();
  const standardSprites =
    (standardEmojis.meta && standardEmojis.meta.spriteSheets) || {};
  const atlassianSprites =
    (atlassianEmojis.meta && atlassianEmojis.meta.spriteSheets) || {};
  return {
    emojis: [
      ...standardEmojis.emojis,
      ...atlassianEmojis.emojis,
      ...siteEmojis.emojis,
    ],
    meta: {
      spriteSheets: {
        ...standardSprites,
        ...atlassianSprites,
      },
    },
  };
};

const getEmojiSet = (name: string): EmojiDescription[] => {
  if (!emojisSets) {
    const emojis = denormaliseEmojiServiceResponse(getAllEmojiData()).emojis;
    const standardEmojis = denormaliseEmojiServiceResponse(
      getStandardEmojiData(),
    ).emojis;
    const atlassianEmojis = denormaliseEmojiServiceResponse(
      getAtlassianEmojiData(),
    ).emojis;
    const siteEmojis = denormaliseEmojiServiceResponse(getSiteEmojiData())
      .emojis;

    emojisSets = new Map<string, EmojiDescription[]>();
    emojisSets.set('all', emojis);
    emojisSets.set('standard', standardEmojis);
    emojisSets.set('atlassian', atlassianEmojis);
    emojisSets.set('site', siteEmojis);
  }
  return emojisSets.get(name) || [];
};

export const getStandardEmojis = (): EmojiDescription[] =>
  getEmojiSet('standard');
export const getAtlassianEmojis = (): EmojiDescription[] =>
  getEmojiSet('atlassian');
export const getSiteEmojis = (): EmojiDescription[] => getEmojiSet('site');
export const getEmojis = (): EmojiDescription[] => getEmojiSet('all');

export const lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt,
lorem eu vestibulum sollicitudin, erat nibh ornare purus, et sollicitudin lorem
felis nec erat. Quisque quis ligula nisi. Cras nec dui vestibulum, pretium massa ut,
egestas turpis. Quisque finibus eget justo a mollis. Mauris quis varius nisl. Donec
aliquet enim vel eros suscipit porta. Vivamus quis molestie leo. In feugiat felis mi,
ac varius odio accumsan ac. Pellentesque habitant morbi tristique senectus et netus et
malesuada fames ac turpis egestas. Mauris elementum mauris ac leo porta venenatis.
Integer hendrerit lacus vel faucibus sagittis. Mauris elit urna, tincidunt at aliquet
sit amet, convallis placerat diam. Mauris id aliquet elit, non posuere nibh. Curabitur
ullamcorper lectus mi, quis varius libero ultricies nec. Quisque tempus neque ligula,
a semper massa dignissim nec.
`;

export const getEmojiRepository = (): EmojiRepository =>
  new EmojiRepository(getEmojis());

export const getEmojiResource = (
  config?: MockEmojiResourceConfig,
): Promise<EmojiProvider> =>
  emojiProviderFactory(getEmojiRepository(), config) as Promise<EmojiProvider>;

export const getEmojiResourceWithStandardAndAtlassianEmojis = (
  config?: MockEmojiResourceConfig,
): Promise<EmojiProvider> => {
  const standardEmojis: EmojiDescription[] = getStandardEmojis();
  const atlassianEmojis: EmojiDescription[] = getAtlassianEmojis();
  return emojiProviderFactory(
    new EmojiRepository([...standardEmojis, ...atlassianEmojis]),
    config,
  ) as Promise<EmojiProvider>;
};

export const getUsageClearEmojiResource = (): UsageClearEmojiResource =>
  new UsageClearEmojiResource(getEmojis());

export const loggedUser = 'blackpanther';
