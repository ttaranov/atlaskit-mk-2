import * as React from 'react';
import { mount } from 'enzyme';
import { Stubs } from '../../_stubs';
import { Subject } from 'rxjs/Subject';
import { FileItem } from '@atlaskit/media-core';
import { AudioViewer } from '../../../src/newgen/viewers/audio';
import Spinner from '@atlaskit/spinner';
import { ErrorMessage } from '../../../src/newgen/styled';

const token = 'some-token';
const clientId = 'some-client-id';

const audioItem: FileItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'audio',
    artifacts: {
      'audio.mp3': {
        url: '/audio',
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

function createFixture(authPromise) {
  const context = createContext(authPromise);
  const el = mount(<AudioViewer context={context} item={audioItem} />);
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

describe('Audio viewer', () => {
  it('assigns a src for audio files when successful', async () => {
    const authPromise = Promise.resolve({ token, clientId });
    const { el } = createFixture(authPromise);
    await el.instance()['init']();
    el.update();
    expect(el.find('audio').prop('src')).toEqual(
      'some-service-host/audio?client=some-client-id&token=some-token',
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
});
