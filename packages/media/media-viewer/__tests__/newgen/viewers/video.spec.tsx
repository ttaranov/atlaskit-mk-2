import * as util from '../../../src/newgen/util';
const constructAuthTokenUrlSpy = jest.spyOn(util, 'constructAuthTokenUrl');

import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Button from '@atlaskit/button';
import { Stubs } from '../../_stubs';
import { Subject } from 'rxjs/Subject';
import { FileItem } from '@atlaskit/media-core';
import { VideoViewer, Props } from '../../../src/newgen/viewers/video';
import { Video } from '../../../src/newgen/styled';
import Spinner from '@atlaskit/spinner';
import { ErrorMessage } from '../../../src/newgen/styled';
import { CustomVideo } from '../../../src/newgen/viewers/video/customVideo';
import { FeatureFlagsContext } from '../../../src/newgen/utils/featureFlag';
import { Ellipsify } from '@atlaskit/media-ui';
import { MediaViewerFeatureFlags } from '../../../src/newgen/domain';

const token = 'some-token';
const clientId = 'some-client-id';

const videoItem: FileItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'video',
    artifacts: {
      'video_640.mp4': {
        url: '/video',
      },
      'video_1280.mp4': {
        url: '/video_hd',
      },
    },
  },
};

function createContext(authPromise) {
  const serviceHost = 'some-service-host';
  const authProvider = jest.fn().mockReturnValue(authPromise);
  const contextConfig = {
    serviceHost,
    authProvider,
  };
  return Stubs.context(
    contextConfig,
    undefined,
    Stubs.mediaItemProvider(new Subject<FileItem>()),
  ) as any;
}

async function createFixture(
  authPromise?,
  props?: Partial<Props>,
  featureFlags: MediaViewerFeatureFlags = {},
) {
  const defaultAuthPromise = Promise.resolve({ token, clientId });
  const context = createContext(authPromise || defaultAuthPromise);
  const el = mount(
    <FeatureFlagsContext.Provider value={featureFlags}>
      <VideoViewer
        context={context}
        item={videoItem}
        previewCount={0}
        {...props}
      />,
    </FeatureFlagsContext.Provider>,
  );

  await init(el);
  el.update();

  return { context, el };
}

async function awaitError(response, expectedMessage) {
  try {
    await response;
  } catch (err) {
    if (err.message !== expectedMessage) {
      throw err;
    }
  }
}

const init = (element: ReactWrapper) => {
  return (element.first().instance() as any)['init']();
};

describe('Video viewer', () => {
  afterEach(() => {
    constructAuthTokenUrlSpy.mockClear();
  });

  it('assigns a src for videos when successful', async () => {
    const authPromise = Promise.resolve({ token, clientId });
    const { el } = await createFixture(authPromise);

    expect(el.find(Video).prop('src')).toEqual(
      'some-service-host/video?client=some-client-id&token=some-token',
    );
  });

  it.only('shows spinner when pending', async () => {
    const authPromise = new Promise(() => {});
    const { el } = createFixture(authPromise);

    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows error if there is an error', async () => {
    const authPromise = Promise.reject(new Error('test error'));
    const { el } = await createFixture(authPromise);
    await awaitError(authPromise, 'test error');
    el.update();
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('MSW-720: passes collectionName to constructAuthTokenUrl', async () => {
    const collectionName = 'some-collection';
    const authPromise = Promise.resolve({ token, clientId });
    const { el } = await createFixture(authPromise, { collectionName });

    el.update();
    expect(constructAuthTokenUrlSpy.mock.calls[0][2]).toEqual(collectionName);
  });

  it('should render a custom video player if the feature flag is active', async () => {
    const authPromise = Promise.resolve({ token, clientId });
    const { el } = await createFixture(authPromise, undefined, {
      customVideoPlayer: true,
    });

    expect(el.find(CustomVideo)).toHaveLength(1);
    expect(el.find(CustomVideo).prop('src')).toEqual(
      'some-service-host/video?client=some-client-id&token=some-token',
    );
  });

  it('should toggle hd when button is clicked', async () => {
    const authPromise = Promise.resolve({ token, clientId });
    const { el } = await createFixture(authPromise, undefined, {
      customVideoPlayer: true,
    });

    expect(el.state('isHDActive')).toBeFalsy();
    el
      .find(Button)
      .at(1)
      .simulate('click');
    expect(el.state('isHDActive')).toBeTruthy();
  });

  describe('AutoPlay', () => {
    it('should auto play custom video viewer when it is the first preview', async () => {
      const { el } = await createFixture(
        undefined,
        { previewCount: 0 },
        { customVideoPlayer: true },
      );
      expect(el.find(CustomVideo)).toHaveLength(1);
      expect(el.find({ autoPlay: true })).toHaveLength(2);
    });

    it('should not auto play custom video viewer when it is not the first preview', async () => {
      const { el } = await createFixture(
        undefined,
        { previewCount: 1 },
        { customVideoPlayer: true },
      );
      expect(el.find(CustomVideo)).toHaveLength(1);
      expect(el.find({ autoPlay: true })).toHaveLength(0);
    });

    it('should auto play native video viewer when it is the first preview', async () => {
      const { el } = await createFixture(undefined, { previewCount: 0 });
      expect(el.find(CustomVideo)).toHaveLength(0);
      expect(el.find({ autoPlay: true })).toHaveLength(2);
    });

    it('should not auto play native video viewer when it is not the first preview', async () => {
      const { el } = await createFixture(undefined, { previewCount: 1 });
      expect(el.find(CustomVideo)).toHaveLength(0);
      expect(el.find({ autoPlay: true })).toHaveLength(0);
    });
  });
});
