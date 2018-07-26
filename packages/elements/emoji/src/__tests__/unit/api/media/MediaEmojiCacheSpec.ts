import * as sinon from 'sinon';
import { expect } from 'chai';

import { waitUntil } from '@atlaskit/util-common-test';
import { EmojiDescriptionWithVariations } from '../../../../types';
import { isPromise } from '../../../../type-helpers';
import MediaEmojiCache, {
  BrowserCacheStrategy,
  EmojiCacheStrategy,
  MemoryCacheStrategy,
} from '../../../../api/media/MediaEmojiCache';
import TokenManager from '../../../../api/media/TokenManager';

import {
  createTokenManager,
  imageEmoji,
  loadedMediaEmoji,
  mediaEmoji,
  mediaEmojiImagePath,
  loadedAltMediaEmoji,
} from '../../_test-data';
import { frequentCategory } from '../../../../constants';

const restoreStub = (stub: any) => {
  if (stub.restore) {
    stub.restore();
  }
};

class MockMediaImageLoader {
  reject: boolean;

  loadMediaImage(url: string): Promise<string> {
    if (this.reject) {
      return Promise.reject('Bad times');
    }
    return Promise.resolve(`data:;base64,`);
  }
}

describe('MediaEmojiCache', () => {
  class TestMediaEmojiCache extends MediaEmojiCache {
    constructor(tokenManager?: TokenManager) {
      super(tokenManager || createTokenManager());
    }

    callGetCache(
      url: string,
    ): EmojiCacheStrategy | Promise<EmojiCacheStrategy> {
      return this.getCache(url);
    }
  }

  afterEach(() => {
    restoreStub(BrowserCacheStrategy.supported);
    restoreStub(BrowserCacheStrategy.prototype.loadEmoji);
    restoreStub(BrowserCacheStrategy.prototype.optimisticRendering);
    restoreStub(MemoryCacheStrategy.prototype.loadEmoji);
    restoreStub(MemoryCacheStrategy.prototype.optimisticRendering);
  });

  describe('#getCache', () => {
    it('init - use BrowserCacheStrategy', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const cacheStrategy = cache.callGetCache(mediaEmojiImagePath);
      if (isPromise(cacheStrategy)) {
        return cacheStrategy.then(implCache => {
          expect(
            implCache instanceof BrowserCacheStrategy,
            'Is BrowserCacheStrategy',
          ).to.equal(true);
        });
      }
      expect(false, 'cacheStrategy is a promise').to.equal(true);
    });

    it('init - use MemoryCacheStrategy', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(false));
      const cache = new TestMediaEmojiCache();
      const cacheStrategy = cache.callGetCache(mediaEmojiImagePath);
      if (isPromise(cacheStrategy)) {
        return cacheStrategy.then(implCache => {
          expect(
            implCache instanceof MemoryCacheStrategy,
            'Is MemoryCacheStrategy',
          ).to.equal(true);
        });
      }
      expect(false, 'cacheStrategy is a promise').to.equal(true);
    });

    it('cache initialised - returns cache not promise', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const cacheStrategy = cache.callGetCache(mediaEmojiImagePath);
      if (isPromise(cacheStrategy)) {
        return cacheStrategy.then(implCache => {
          expect(
            implCache instanceof BrowserCacheStrategy,
            `Is BrowserCacheStrategy - ${typeof implCache}`,
          ).to.equal(true);
          const cacheStrategy2 = cache.callGetCache(mediaEmojiImagePath);
          expect(isPromise(cacheStrategy2), 'Not a promise').to.equal(false);
        });
      }
      expect(false, 'cacheStrategy is a promise').to.equal(true);
    });

    it('init - first url is bad, good second', () => {
      const supportedError = 'damn it';
      const supportedStub = sinon.stub(BrowserCacheStrategy, 'supported');
      supportedStub.onFirstCall().returns(Promise.reject(supportedError));
      supportedStub.onSecondCall().returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const cacheStrategy = cache.callGetCache(mediaEmojiImagePath);
      if (isPromise(cacheStrategy)) {
        return cacheStrategy
          .catch(err => {
            expect(err, 'First url is bad').to.equal(
              'Unable to initialise cache based on provided url(s)',
            );

            const cacheStrategy2 = cache.callGetCache(mediaEmojiImagePath);
            if (isPromise(cacheStrategy)) {
              return cacheStrategy2 as Promise<EmojiCacheStrategy>;
            }
            expect(false, 'cacheStrategy2 is a promise').to.equal(true);
            return Promise.reject('unreachable');
          })
          .then(implCache => {
            expect(
              implCache instanceof BrowserCacheStrategy,
              'Is BrowserCacheStrategy',
            ).to.equal(true);
          });
      }
      expect(false, 'cacheStrategy is a promise').to.equal(true);
    });
  });

  describe('#loadEmoji', () => {
    it('image emoji - immediately returned', () => {
      const cache = new TestMediaEmojiCache();
      const loadedEmoji = cache.loadEmoji(imageEmoji);
      expect(
        isPromise(loadedEmoji),
        'Emoji returned immediately',
      ).to.deep.equal(false);
      expect(loadedEmoji, 'Same emoji').to.equal(imageEmoji);
    });

    it('media emoji - before and after cache ready', () => {
      sinon
        .stub(BrowserCacheStrategy.prototype, 'loadEmoji')
        .returns(loadedMediaEmoji);
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const emojiPromise = cache.loadEmoji(mediaEmoji);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then(emoji => {
          expect(emoji, 'Emoji loaded').to.deep.equal(loadedMediaEmoji);
          const cachedEmoji = cache.loadEmoji(mediaEmoji);
          if (isPromise(cachedEmoji)) {
            expect(
              false,
              'Call after cache is ready should not return promise',
            );
            return;
          }
          expect(cachedEmoji, 'Emoji loaded immediately').to.deep.equal(
            loadedMediaEmoji,
          );
        });
      }
      expect(false, 'emojiPromise is a promise').to.equal(true);
    });

    it('media emoji - cache failed to load', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.reject('fail'));
      const cache = new TestMediaEmojiCache();
      const emojiPromise = cache.loadEmoji(mediaEmoji);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then(emoji => {
          expect(emoji, 'Undefined if cache if not working').to.equal(
            undefined,
          );
        });
      }
      expect(false, 'emojiPromise is a promise').to.equal(true);
    });
  });

  describe('#optimisticRendering', () => {
    it('delegates to cache strategy', () => {
      const optimisticRenderingStub = sinon.stub(
        BrowserCacheStrategy.prototype,
        'optimisticRendering',
      );
      optimisticRenderingStub.returns(true);
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.resolve(true));
      const cache = new TestMediaEmojiCache();
      const optimisticRenderingPromise = cache.optimisticRendering(
        mediaEmojiImagePath,
      );
      if (isPromise(optimisticRenderingPromise)) {
        return optimisticRenderingPromise.then(optimistic => {
          expect(optimistic, 'Optimistic Rendering').to.equal(true);
          expect(
            optimisticRenderingStub.callCount,
            'Strategy called once',
          ).to.equal(1);
          const optimisticRendering = cache.optimisticRendering(
            mediaEmojiImagePath,
          );
          if (isPromise(optimisticRendering)) {
            expect(
              false,
              'Call after cache is ready should not return promise',
            );
            return;
          }
          expect(optimisticRendering, 'Result returned immediately').to.equal(
            true,
          );
          expect(
            optimisticRenderingStub.callCount,
            'Strategy called twice',
          ).to.equal(2);
        });
      }
      expect(false, 'emojiPromise is a promise').to.equal(true);
    });

    it('returns false if no cache strategy', () => {
      sinon
        .stub(BrowserCacheStrategy, 'supported')
        .returns(Promise.reject('fail'));
      const cache = new TestMediaEmojiCache();
      const renderingPromise = cache.optimisticRendering(mediaEmojiImagePath);
      if (isPromise(renderingPromise)) {
        return renderingPromise.then(optimistic => {
          expect(optimistic, 'false if cache if not working').to.equal(false);
        });
      }
      expect(false, 'emojiPromise is a promise').to.equal(true);
    });
  });
});

describe('BrowserCacheStrategy', () => {
  describe('#supported', () => {
    class MockImage {
      src: string;
      listeners: Map<string, Function> = new Map();
      addEventListener(type, callback) {
        this.listeners.set(type, callback);
      }
    }
    let imageConstructorStub;
    let mockImage;
    let mockMediaImageLoader;

    beforeEach(() => {
      mockImage = new MockImage();
      mockMediaImageLoader = new MockMediaImageLoader();
      imageConstructorStub = sinon
        .stub(window, 'Image' as any)
        .returns(mockImage);
    });

    afterEach(() => {
      restoreStub(Image);
    });

    it('image loaded', () => {
      const promise = BrowserCacheStrategy.supported(
        'cheese',
        mockMediaImageLoader,
      ).then(supported => {
        expect(supported, 'Is supported').to.equal(true);
        expect(mockImage.src, 'Image src url').to.equal('cheese');
      });
      return waitUntil(() => !!mockImage.listeners.get('load')).then(() => {
        mockImage.listeners.get('load')();
        return promise;
      });
    });

    it('image load error', () => {
      const promise = BrowserCacheStrategy.supported(
        'cheese',
        mockMediaImageLoader,
      ).then(supported => {
        expect(supported, 'Is not supported').to.equal(false);
        expect(mockImage.src, 'Image src url').to.equal('cheese');
      });
      return waitUntil(() => !!mockImage.listeners.get('error')).then(() => {
        mockImage.listeners.get('error')();
        return promise;
      });
    });

    it('exception loading image', () => {
      restoreStub(imageConstructorStub);
      imageConstructorStub = sinon
        .stub(window, 'Image' as any)
        .throws(new Error('doh'));
      return BrowserCacheStrategy.supported(
        'cheese',
        mockMediaImageLoader,
      ).then(supported => {
        expect(supported, 'Is not supported').to.equal(false);
        expect(mockImage.src, 'Image src url not set').to.equal(undefined);
        expect(mockImage.listeners.size, 'No listeners registered').to.equal(0);
      });
    });
  });

  describe('#loadEmoji', () => {
    let mockMediaImageLoader;
    let browserCacheStrategy: BrowserCacheStrategy;

    beforeEach(() => {
      mockMediaImageLoader = new MockMediaImageLoader();
      browserCacheStrategy = new BrowserCacheStrategy(mockMediaImageLoader);
    });

    it('returns emoji if not media', () => {
      const emoji = browserCacheStrategy.loadEmoji(imageEmoji);
      expect(isPromise(emoji), 'Returns immediately').to.equal(false);
      expect(emoji, 'Exact emoji returned').to.deep.equal(imageEmoji);
    });

    it('returns Promise if uncached, Emoji when not', () => {
      const emojiPromise = browserCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise), 'Returns immediately').to.equal(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then(emoji => {
          expect(emoji, 'Same emoji returned').to.deep.equal(emoji);
          const cachedEmoji = browserCacheStrategy.loadEmoji(mediaEmoji);
          expect(isPromise(cachedEmoji), 'Cached, not a promise').to.deep.equal(
            false,
          );
          expect(cachedEmoji, 'Same emoji returned').to.deep.equal(emoji);
        });
      }
    });

    it('returns undefined via Promise if uncached and error', () => {
      mockMediaImageLoader.reject = true;
      const emojiPromise = browserCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise), 'Returns immediately').to.equal(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then(emoji => {
          expect(emoji, 'Emoji is undefined on load error').to.equal(undefined);
        });
      }
    });

    it('returns different emoji if two different EmojiDescription have same mediaPath', () => {
      const frequentEmoji: EmojiDescriptionWithVariations = {
        ...mediaEmoji,
        category: frequentCategory,
      };
      const emojiPromise = browserCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise), 'Returns immediately').to.equal(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then(emoji => {
          expect(emoji, 'Same emoji returned').to.deep.equal(emoji);
          const cachedEmoji = browserCacheStrategy.loadEmoji(frequentEmoji);
          expect(isPromise(cachedEmoji), 'Cached, not a promise').to.deep.equal(
            false,
          );
          expect(
            cachedEmoji,
            'Different EmojiDescription returned',
          ).to.deep.equal(frequentEmoji);
        });
      }
    });
  });
});

describe('MemoryCacheStrategy', () => {
  describe('#loadEmoji', () => {
    let mockMediaImageLoader;
    let memoryCacheStrategy: MemoryCacheStrategy;

    beforeEach(() => {
      mockMediaImageLoader = new MockMediaImageLoader();
      memoryCacheStrategy = new MemoryCacheStrategy(mockMediaImageLoader);
    });

    it('returns emoji if not media', () => {
      const emoji = memoryCacheStrategy.loadEmoji(imageEmoji);
      expect(isPromise(emoji), 'Returns immediately').to.equal(false);
      expect(emoji, 'Exact emoji returned').to.deep.equal(imageEmoji);
    });

    it('returns Promise if uncached, Emoji when not', () => {
      const emojiPromise = memoryCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise), 'Returns immediately').to.equal(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then(emoji => {
          expect(emoji, 'Same emoji returned').to.deep.equal(loadedMediaEmoji);
          const cachedEmoji = memoryCacheStrategy.loadEmoji(mediaEmoji);
          expect(isPromise(cachedEmoji), 'Cached, not a promise').to.deep.equal(
            false,
          );
          expect(cachedEmoji, 'Same emoji returned').to.deep.equal(
            loadedMediaEmoji,
          );
        });
      }
    });

    it('returns undefined via Promise if uncached and error, Emoji once cached', () => {
      mockMediaImageLoader.reject = true;
      const emojiPromise = memoryCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise), 'Returns immediately').to.equal(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then(emoji => {
          expect(emoji, 'Emoji is undefined on load error').to.equal(undefined);
        });
      }
    });

    it('returns dataURL for altRepresentation.imgPath when useAlt is passed in', () => {
      const useAlt = true;
      const emojiPromise = memoryCacheStrategy.loadEmoji(mediaEmoji, useAlt);
      expect(isPromise(emojiPromise), 'Returns immediately').to.equal(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then(emoji => {
          // loadedAltMediaEmoji has dataURL generated for and set in
          // altRepresentation.imgPath rather than representation.imgPath
          expect(emoji, 'Same emoji returned').to.deep.equal(
            loadedAltMediaEmoji,
          );
          const cachedEmoji = memoryCacheStrategy.loadEmoji(mediaEmoji, useAlt);
          expect(isPromise(cachedEmoji), 'Cached, not a promise').to.deep.equal(
            false,
          );
          expect(cachedEmoji, 'Same emoji returned').to.deep.equal(
            loadedAltMediaEmoji,
          );
        });
      }
    });

    it('returns different emoji if two different EmojiDescription have same mediaPath', () => {
      const frequentEmoji: EmojiDescriptionWithVariations = {
        ...mediaEmoji,
        category: frequentCategory,
      };
      const loadedFrequentEmoji: EmojiDescriptionWithVariations = {
        ...loadedMediaEmoji,
        category: frequentCategory,
      };
      const emojiPromise = memoryCacheStrategy.loadEmoji(mediaEmoji);
      expect(isPromise(emojiPromise), 'Returns immediately').to.equal(true);
      if (isPromise(emojiPromise)) {
        return emojiPromise.then(emoji => {
          expect(emoji, 'Same emoji returned').to.deep.equal(loadedMediaEmoji);
          const cachedEmoji = memoryCacheStrategy.loadEmoji(frequentEmoji);
          expect(isPromise(cachedEmoji), 'Cached, not a promise').to.deep.equal(
            false,
          );
          expect(
            cachedEmoji,
            'Different EmojiDescription returned',
          ).to.deep.equal(loadedFrequentEmoji);
        });
      }
    });
  });
});
