import * as fetchMock from 'fetch-mock/src/client';
import { expect } from 'chai';
import { ServiceConfig } from '@atlaskit/util-service-support';

import AtlassianEmojiMigrationResource from '../../../src/api/AtlassianEmojiMigrationResource';
import { EmojiServiceResponse } from '../../../src/types';
import { isPromise, toEmojiId } from '../../../src/type-helpers';
import {
  customType,
  customCategory,
  migrationUserId,
} from '../../../src/constants';
import { EmojiResourceConfig } from '../../../src/api/EmojiResource';
import {
  atlassianEmojis,
  atlassianServiceEmojis,
  standardServiceEmojis,
  atlassianBoomEmoji,
} from '../../../src/support/test-data';

const p1Url = 'https://p1/';
const p2Url = 'https://p2/';
const p3Url = 'https://p3/';

// remove preceding "atlassian-" from string
const removeAtlassianPrefix = (id: string): string => id.slice(10, id.length);

const standardServiceData: EmojiServiceResponse = standardServiceEmojis;
const atlassianServiceData: EmojiServiceResponse = atlassianServiceEmojis;
const siteServiceData: EmojiServiceResponse = {
  emojis: JSON.parse(JSON.stringify(atlassianServiceData.emojis)).map(emoji => {
    emoji.id = removeAtlassianPrefix(emoji.id);
    emoji.type = customType;
    emoji.category = customCategory;
    emoji.creatorUserId = migrationUserId;
    return emoji;
  }),
};

const provider1: ServiceConfig = {
  url: p1Url,
};

const provider2: ServiceConfig = {
  url: p2Url,
};

const provider3: ServiceConfig = {
  url: p3Url,
};

describe('AtlassianEmojiMigrationResource', () => {
  beforeEach(() => {
    fetchMock
      .mock({
        matcher: `begin:${provider1.url}`,
        response: standardServiceData,
      })
      .mock({
        matcher: `begin:${provider2.url}`,
        response: atlassianServiceData,
      });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('#initEmojiRepository', () => {
    it('does not remove atlassian emojis if there is no corresponding site emoji version', () => {
      const config: EmojiResourceConfig = {
        providers: [provider1, provider2],
      };

      const resource = new AtlassianEmojiMigrationResource(config);
      const atlassianServiceEmojis = resource.findInCategory('ATLASSIAN');
      return atlassianServiceEmojis.then(emojis =>
        expect(emojis.length).to.equal(atlassianEmojis.length),
      );
    });

    it('does not contain atlassian emojis if there are site duplicates for each', () => {
      fetchMock.mock({
        matcher: `begin:${provider3.url}`,
        response: siteServiceData,
      });
      const config: EmojiResourceConfig = {
        providers: [provider1, provider2, provider3],
      };

      const resource = new AtlassianEmojiMigrationResource(config);
      const atlassianServiceEmojis = resource.findInCategory('ATLASSIAN');
      return atlassianServiceEmojis.then(emojis =>
        expect(emojis.length).to.equal(0),
      );
    });

    it('only removes the atlassian emojis with duplicates if there is only partial migration', () => {
      const partialSiteServiceData: EmojiServiceResponse = {
        emojis: siteServiceData.emojis.slice(0, 5),
      };
      fetchMock.mock({
        matcher: `begin:${provider3.url}`,
        response: partialSiteServiceData,
      });

      const config: EmojiResourceConfig = {
        providers: [provider1, provider2, provider3],
      };

      const resource = new AtlassianEmojiMigrationResource(config);
      const atlassianServiceEmojis = resource.findInCategory('ATLASSIAN');
      return atlassianServiceEmojis.then(emojis =>
        expect(emojis.length).to.equal(5),
      );
    });
  });

  describe('#findByEmojiId', () => {
    it('resolves an atlassian emoji by its migrated site version', () => {
      fetchMock.mock({
        matcher: `begin:${provider3.url}`,
        response: siteServiceData,
      });
      const config: EmojiResourceConfig = {
        providers: [provider2, provider3],
      };

      const resource = new AtlassianEmojiMigrationResource(config);
      const boomEmoji = resource.findByEmojiId(toEmojiId(atlassianBoomEmoji));
      if (isPromise(boomEmoji)) {
        return boomEmoji.then(emoji => expect(emoji!.id).to.equal('boom'));
      }
      expect(boomEmoji!.id).to.equal('boom');
    });

    it('should not resolve atlassian emoji with site version if creatorUserId is not migrator', () => {
      const boomService = siteServiceData.emojis.filter(
        emoji => emoji.shortName === 'boom',
      )[0];
      const customBoom = {
        ...boomService,
        creatorUserId: 'bob',
      };
      const boomServiceData: EmojiServiceResponse = {
        emojis: [customBoom],
      };
      fetchMock.mock({
        matcher: `begin:${provider3.url}`,
        response: boomServiceData,
      });
      const config: EmojiResourceConfig = {
        providers: [provider2, provider3],
      };

      const resource = new AtlassianEmojiMigrationResource(config);
      const boomEmoji = resource.findByEmojiId(toEmojiId(atlassianBoomEmoji));
      if (isPromise(boomEmoji)) {
        return boomEmoji.then(emoji => expect(emoji).to.equal(undefined));
      }
      expect(boomEmoji).to.equal(undefined);
    });
  });
});
