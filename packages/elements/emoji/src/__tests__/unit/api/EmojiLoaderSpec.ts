import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock/src/client';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { SecurityOptions } from '@atlaskit/util-service-support';

import { EmojiLoaderConfig } from '../../../api/EmojiUtils';
import EmojiLoader from '../../../api/EmojiLoader';

const p1Url = 'https://p1/';

const defaultSecurityHeader = 'X-Bogus';

const header = (code: string | number): SecurityOptions => ({
  headers: {
    [defaultSecurityHeader]: code,
  },
});

const getSecurityHeader = call => call[1].headers.get(defaultSecurityHeader);

const defaultSecurityCode = '10804';
const defaultAltScaleParam = 'altScale=XHDPI';

const provider1: EmojiLoaderConfig = {
  url: p1Url,
  securityProvider: () => header(defaultSecurityCode),
};

const providerData1 = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

const fetchResponse = data => ({ emojis: data });

function checkOrder(expected, actual) {
  expect(actual.length, `${actual.length} emojis`).to.equal(expected.length);
  expected.forEach((emoji, idx) => {
    expect(emoji.id, `emoji #${idx}`).to.equal(actual[idx].id);
  });
}

describe('EmojiLoader', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('#loadEmoji', () => {
    it('normal', () => {
      fetchMock.mock({
        matcher: `begin:${provider1.url}`,
        response: fetchResponse(providerData1),
      });

      const resource = new EmojiLoader(provider1);
      return resource.loadEmoji().then(emojiResponse => {
        checkOrder(providerData1, emojiResponse.emojis);
      });
    });

    it('is only passed a baseUrl with no securityProvider and default altScale param', () => {
      const simpleProvider: EmojiLoaderConfig = {
        url: p1Url,
      };
      fetchMock.mock({
        matcher: `end:${defaultAltScaleParam}`,
        response: fetchResponse(providerData1),
      });

      const resource = new EmojiLoader(simpleProvider);
      return resource.loadEmoji().then(emojiResponse => {
        checkOrder(providerData1, emojiResponse.emojis);
      });
    });

    it('can handle when a version is specified in the query params', () => {
      const params = '?maxVersion=2';
      fetchMock.mock({
        matcher: `end:${params}&${defaultAltScaleParam}`,
        response: fetchResponse(providerData1),
      });

      const provider2 = {
        ...provider1,
        url: `${provider1.url}${params}`,
      };

      const resource = new EmojiLoader(provider2);
      return resource.loadEmoji().then(emojiResponse => {
        checkOrder(providerData1, emojiResponse.emojis);
      });
    });

    it('does not add a scale param when it detects the pixel ratio is <= 1', () => {
      const provider2 = {
        ...provider1,
        getRatio: () => 1,
      };
      fetchMock.mock({
        matcher: `${provider1.url}?${defaultAltScaleParam}`,
        response: fetchResponse(providerData1),
      });

      const resource = new EmojiLoader(provider2);
      return resource.loadEmoji().then(emojiResponse => {
        checkOrder(providerData1, emojiResponse.emojis);
      });
    });

    it('adds a scale param when it detects the pixel ratio is > 1', () => {
      const provider2 = {
        ...provider1,
        getRatio: () => 2,
      };
      // Should use double of XHDPI for altScale
      fetchMock.mock({
        matcher: `end:?scale=XHDPI&altScale=XXXHDPI`,
        response: fetchResponse(providerData1),
      });

      const resource = new EmojiLoader(provider2);
      return resource.loadEmoji().then(emojiResponse => {
        checkOrder(providerData1, emojiResponse.emojis);
      });
    });

    it('401 error once retry', () => {
      const refreshedSecurityProvider = sinon.stub();
      refreshedSecurityProvider.returns(Promise.resolve(header(666)));

      const provider401 = {
        ...provider1,
        refreshedSecurityProvider,
      };

      const matcher = `begin:${provider1.url}`;

      fetchMock
        .mock({
          name: 'auth',
          matcher,
          response: 401,
          repeat: 1,
        })
        .mock({
          name: 'auth2',
          matcher,
          response: fetchResponse(providerData1),
          repeat: 1,
        });

      const resource = new EmojiLoader(provider401);
      return resource.loadEmoji().then(emojiResponse => {
        expect(
          refreshedSecurityProvider.callCount,
          'refreshedSecurityProvider called once',
        ).to.equal(1);
        const firstCall = fetchMock.lastCall('auth');
        // tslint:disable-next-line
        expect(firstCall).to.not.be.undefined;
        expect(getSecurityHeader(firstCall), 'first call').to.equal(
          defaultSecurityCode,
        );
        const secondCall = fetchMock.lastCall('auth2');
        // tslint:disable-next-line
        expect(secondCall).to.not.be.undefined;
        expect(getSecurityHeader(secondCall), 'forced refresh call').to.equal(
          '666',
        );

        checkOrder([...providerData1], emojiResponse.emojis);
      });
    });

    it('401 error twice retry', () => {
      const refreshedSecurityProvider = sinon.stub();
      refreshedSecurityProvider.returns(Promise.resolve(header(666)));

      const provider401 = {
        ...provider1,
        refreshedSecurityProvider,
      };

      const provider401Matcher = {
        name: 'authonce',
        matcher: `begin:${provider1.url}`,
      };

      fetchMock.mock({
        ...provider401Matcher,
        response: 401,
      });

      const resource = new EmojiLoader(provider401);
      return resource
        .loadEmoji()
        .then(emojiResponse => {
          expect(true, 'Emojis should not have loaded').to.equal(false);
        })
        .catch(err => {
          expect(err.code, `Expected error: '${err}' to contain 401`).to.equal(
            401,
          );
        });
    });
  });
});
