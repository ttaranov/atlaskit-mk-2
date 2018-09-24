import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock/src/client';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { SecurityOptions, ServiceConfig } from '@atlaskit/util-service-support';

import { waitUntil } from '@atlaskit/util-common-test';

import { selectedToneStorageKey } from '../../../constants';
import SiteEmojiResource from '../../../api/media/SiteEmojiResource';
import EmojiResource, {
  EmojiProvider,
  EmojiResourceConfig,
  supportsUploadFeature,
  UploadingEmojiProvider,
} from '../../../api/EmojiResource';

import {
  evilburnsEmoji,
  grinEmoji,
  mediaEmoji,
  siteServiceEmojis,
  siteUrl,
  standardServiceEmojis,
} from '../_test-data';

import { alwaysPromise } from '../_test-util';

// used to access window.localStorage in tests below
declare var global: any;

const baseUrl = 'https://bogus/';
const p1Url = 'https://p1/';

const defaultSecurityHeader = 'X-Bogus';

const header = (code: string | number): SecurityOptions => ({
  headers: {
    [defaultSecurityHeader]: code,
  },
});

const defaultSecurityCode = '10804';

const provider1: ServiceConfig = {
  url: p1Url,
  securityProvider: () => header(defaultSecurityCode),
};

const defaultApiConfig: EmojiResourceConfig = {
  recordConfig: {
    url: baseUrl,
    securityProvider() {
      return header(defaultSecurityCode);
    },
  },
  providers: [provider1],
};

const providerServiceData1 = standardServiceEmojis;

describe('UploadingEmojiResource', () => {
  beforeEach(() => {
    fetchMock.mock({
      matcher: `begin:${provider1.url}`,
      response: providerServiceData1,
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  class TestUploadingEmojiResource extends EmojiResource {
    private mockSiteEmojiResource?: SiteEmojiResource;

    constructor(
      mockSiteEmojiResource?: SiteEmojiResource,
      config?: EmojiResourceConfig,
    ) {
      super({
        providers: [provider1],
        allowUpload: true,
        ...config,
      });
      this.mockSiteEmojiResource = mockSiteEmojiResource;
    }

    protected initSiteEmojiResource(emojiResponse, provider) {
      this.siteEmojiResource = this.mockSiteEmojiResource;
      return Promise.resolve();
    }
  }

  describe('#isUploadSupported', () => {
    it('resource has custom emoji with media support and upload token', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const hasUploadTokenStub = siteEmojiResource.hasUploadToken;
      hasUploadTokenStub.returns(Promise.resolve(true));
      const config: EmojiResourceConfig = {
        allowUpload: true,
      } as EmojiResourceConfig;

      const emojiResource = new TestUploadingEmojiResource(
        siteEmojiResource,
        config,
      );

      return emojiResource.isUploadSupported().then(supported => {
        expect(supported, 'Upload is supported').to.equal(true);
      });
    });

    it('should not allow upload if no upload token', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const hasUploadTokenStub = siteEmojiResource.hasUploadToken;
      hasUploadTokenStub.returns(Promise.resolve(false));
      const config: EmojiResourceConfig = {
        allowUpload: true,
      } as EmojiResourceConfig;

      const emojiResource = new TestUploadingEmojiResource(
        siteEmojiResource,
        config,
      );
      return emojiResource.isUploadSupported().then(supported => {
        expect(supported, 'Upload is not supported').to.equal(false);
      });
    });

    it('resource has no media support', () => {
      const emojiResource = new TestUploadingEmojiResource();
      return emojiResource.isUploadSupported().then(supported => {
        expect(supported, 'Upload is not supported').to.equal(false);
      });
    });

    it('allowUpload is false', () => {
      const emojiResource = new TestUploadingEmojiResource(
        sinon.createStubInstance(SiteEmojiResource) as any,
        { allowUpload: false } as EmojiResourceConfig,
      );
      return emojiResource.isUploadSupported().then(supported => {
        expect(supported, 'Upload is not supported').to.equal(false);
      });
    });
  });

  describe('#uploadCustomEmoji', () => {
    const upload = {
      name: 'cheese',
      shortName: ':cheese:',
      filename: 'cheese.png',
      dataURL: 'data:blah',
      width: 32,
      height: 32,
    };

    it('no media support - throw error', () => {
      const emojiResource = new TestUploadingEmojiResource();
      return emojiResource
        .uploadCustomEmoji(upload)
        .then(emoji => {
          expect(true, 'Promise should have been rejected').to.equal(false);
        })
        .catch(error => {
          expect(true, 'Promise should be rejected').to.equal(true);
        });
    });

    it('media support - upload successful', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const hasUploadTokenStub = siteEmojiResource.hasUploadToken;
      hasUploadTokenStub.returns(Promise.resolve(true));
      const uploadEmojiStub = siteEmojiResource.uploadEmoji;
      uploadEmojiStub.returns(Promise.resolve(mediaEmoji));

      const emojiResource = new TestUploadingEmojiResource(siteEmojiResource);

      return emojiResource.uploadCustomEmoji(upload).then(emoji => {
        expect(
          uploadEmojiStub.calledWith(upload),
          'upload called on siteEmojiResource',
        ).to.equal(true);
        expect(emoji, 'Emoji uploaded').to.equal(mediaEmoji);
      });
    });

    it('media support - upload error', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const hasUploadTokenStub = siteEmojiResource.hasUploadToken;
      hasUploadTokenStub.returns(Promise.resolve(true));
      const uploadEmojiStub = siteEmojiResource.uploadEmoji;
      uploadEmojiStub.returns(Promise.reject('bad things'));

      const emojiResource = new TestUploadingEmojiResource(siteEmojiResource);
      return emojiResource
        .uploadCustomEmoji(upload)
        .then(emoji => {
          expect(true, 'Promise should have been rejected').to.equal(false);
        })
        .catch(error => {
          expect(
            uploadEmojiStub.calledWith(upload),
            'upload called on siteEmojiResource',
          ).to.equal(true);
          expect(true, 'Promise should be rejected').to.equal(true);
        });
    });
  });

  describe('#prepareForUpload', () => {
    it('no media support - no error', () => {
      const emojiResource = new TestUploadingEmojiResource();
      emojiResource.prepareForUpload();
      expect(true, 'executed without error').to.equal(true);
    });

    it('media support - token primed', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const prepareForUploadStub = siteEmojiResource.prepareForUpload;
      const emojiResource = new TestUploadingEmojiResource(siteEmojiResource);
      emojiResource.prepareForUpload();
      return waitUntil(() => prepareForUploadStub.called).then(() => {
        expect(
          prepareForUploadStub.called,
          'upload called on siteEmojiResource',
        ).to.equal(true);
      });
    });
  });

  describe('#deleteSiteEmoji', () => {
    it('calls delete in SiteEmojiResource', () => {
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      const emojiResource = new TestUploadingEmojiResource(siteEmojiResource);
      const deleteStub = siteEmojiResource.deleteEmoji;
      deleteStub.returns(new Promise(resolve => {}));
      emojiResource.deleteSiteEmoji(mediaEmoji);
      return waitUntil(() => deleteStub.called).then(() => {
        expect(
          deleteStub.called,
          'delete called on siteEmojiResource',
        ).to.equal(true);
      });
    });

    it('can find mediaEmoji by id if not yet deleted', () => {
      fetchMock.mock({
        matcher: `begin:${siteUrl}`,
        response: siteServiceEmojis(),
        times: 1,
      });

      const config = {
        providers: [
          {
            url: siteUrl,
          },
        ],
      };
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      siteEmojiResource.deleteEmoji = () => Promise.resolve(true);
      const emojiResource = new TestUploadingEmojiResource(
        siteEmojiResource,
        config,
      );
      return alwaysPromise(emojiResource.findById(mediaEmoji.id!))
        .then(emoji => expect(emoji).to.deep.equal(mediaEmoji))
        .catch(() => expect(true).to.equal(false));
    });

    it('removes the deleted emoji from the emoji repository', () => {
      fetchMock.mock({
        matcher: `begin:${siteUrl}`,
        response: siteServiceEmojis(),
        times: 1,
      });

      const config = {
        providers: [
          {
            url: siteUrl,
          },
        ],
      };
      const siteEmojiResource = sinon.createStubInstance(
        SiteEmojiResource,
      ) as any;
      siteEmojiResource.deleteEmoji = () => Promise.resolve(true);
      const emojiResource = new TestUploadingEmojiResource(
        siteEmojiResource,
        config,
      );
      return emojiResource
        .deleteSiteEmoji(mediaEmoji)
        .then(result => {
          expect(result).to.equal(true);
          const emojiPromise = alwaysPromise(
            emojiResource.findById(mediaEmoji.id!),
          );
          return emojiPromise.then(emoji => expect(emoji).to.equal(undefined));
        })
        .catch(() => expect(true).to.equal(false));
    });
  });
});

describe('#toneSelectionStorage', () => {
  let getItemSpy: jest.SpyInstance<any>;
  let setItemSpy: jest.SpyInstance<any>;

  beforeEach(() => {
    // https://github.com/facebook/jest/issues/6798#issuecomment-412871616
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
  });

  it('retrieves previously stored tone selection upon construction', () => {
    // tslint:disable-next-line:no-unused-expression
    new EmojiResource(defaultApiConfig);

    global.expect(getItemSpy).toHaveBeenCalledWith(selectedToneStorageKey);
  });

  it('calling setSelectedTone calls setItem in localStorage', () => {
    const resource = new EmojiResource(defaultApiConfig);
    const tone = 3;
    resource.setSelectedTone(tone);

    global
      .expect(setItemSpy)
      .toHaveBeenCalledWith(selectedToneStorageKey, '' + tone);
  });
});

describe('helpers', () => {
  class TestEmojiProvider implements EmojiProvider {
    getAsciiMap = () =>
      Promise.resolve(new Map([[grinEmoji.ascii![0], grinEmoji]]));
    findByShortName = shortName => Promise.resolve(evilburnsEmoji);
    findByEmojiId = emojiId => Promise.resolve(evilburnsEmoji);
    findById = emojiIdStr => Promise.resolve(evilburnsEmoji);
    findInCategory = categoryId => Promise.resolve([]);
    getSelectedTone = () => -1;
    setSelectedTone = tone => {};
    deleteSiteEmoji = emoji => Promise.resolve(false);
    getCurrentUser = () => undefined;
    filter = (query, options) => {};
    subscribe = onChange => {};
    unsubscribe = onChange => {};
    loadMediaEmoji = () => undefined;
    optimisticMediaRendering = () => false;
    getFrequentlyUsed = (options?) => Promise.resolve([]);
  }

  class TestUploadingEmojiProvider extends TestEmojiProvider
    implements UploadingEmojiProvider {
    isUploadSupported = () => Promise.resolve(true);
    uploadCustomEmoji = upload => Promise.resolve(evilburnsEmoji);
    prepareForUpload = () => {};
  }

  it('supportsUploadFeature for UploadingEmojiProvider is true', () => {
    expect(
      supportsUploadFeature(new TestUploadingEmojiProvider()),
      'Supports upload feature',
    ).to.equal(true);
  });

  it('supportsUploadFeature for plain old EmojiProvider is false', () => {
    expect(
      supportsUploadFeature(new TestEmojiProvider()),
      'Does not support upload feature',
    ).to.equal(false);
  });
});
