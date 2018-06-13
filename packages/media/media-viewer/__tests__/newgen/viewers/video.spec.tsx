import * as util from '../../../src/newgen/util';
const constructAuthTokenUrlSpy = jest.spyOn(util, 'constructAuthTokenUrl');

import * as React from 'react';
import { mount } from 'enzyme';
import { Stubs } from '../../_stubs';
import { Subject } from 'rxjs/Subject';
import { FileItem } from '@atlaskit/media-core';
import { VideoViewer } from '../../../src/newgen/viewers/video';
import { Video } from '../../../src/newgen/styled';
import Spinner from '@atlaskit/spinner';
import { ErrorMessage } from '../../../src/newgen/styled';

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

function createFixture(authPromise, collectionName?) {
  const context = createContext(authPromise);
  const el = mount(
    <VideoViewer
      context={context}
      item={videoItem}
      collectionName={collectionName}
    />,
  );
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

describe('Video viewer', () => {
  afterEach(() => {
    constructAuthTokenUrlSpy.mockClear();
  });

  it('assigns a src for videos when successful', async () => {
    const authPromise = Promise.resolve({ token, clientId });
    const { el } = createFixture(authPromise);
    await el.instance()['init']();
    el.update();
    expect(el.find(Video).prop('src')).toEqual(
      'some-service-host/video?client=some-client-id&token=some-token',
    );
  });

  it('shows spinner when pending', async () => {
    const authPromise = new Promise(() => {});
    const { el } = createFixture(authPromise);
    el.update();
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows error if there is an error', async () => {
    const authPromise = Promise.reject(new Error('test error'));
    const { el } = createFixture(authPromise);
    await awaitError(authPromise, 'test error');
    el.update();
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('MSW-720: passes collectionName to constructAuthTokenUrl', async () => {
    const collectionName = 'some-collection';
    const authPromise = Promise.resolve({ token, clientId });
    const { el } = createFixture(authPromise, collectionName);
    await el.instance()['init']();
    el.update();
    expect(constructAuthTokenUrlSpy.mock.calls[0][2]).toEqual(collectionName);
  });
});
