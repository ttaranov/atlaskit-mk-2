import * as React from 'react';
import { mount } from 'enzyme';
import { createContext, Stubs } from '../../_stubs';
import { FileItem, DataUri } from '@atlaskit/media-core';
import { awaitError } from '@atlaskit/media-test-helpers';
import { AudioViewer } from '../../../src/newgen/viewers/audio';
import Spinner from '@atlaskit/spinner';
import { DefaultCoverWrapper, AudioCover } from '../../../src/newgen/styled';
import { ErrorMessage } from '../../../src/newgen/error';
import Button from '@atlaskit/button';

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

function createFixture(
  collectionName?: string,
  getArtifactUrl?: () => Promise<string>,
  fetchImageResponse?: Promise<DataUri>,
) {
  const dataUriService = Stubs.dataUriService();
  dataUriService.fetchImageDataUri.mockReturnValue(
    fetchImageResponse || Promise.resolve(''),
  );
  const context = createContext({ getArtifactUrl, dataUriService });
  const el = mount(
    <AudioViewer
      context={context}
      item={audioItem}
      collectionName={collectionName}
      previewCount={0}
    />,
  );
  return { context, el };
}

describe('Audio viewer', () => {
  it('assigns a src for audio files when successful', async () => {
    const { el } = createFixture('mycollection', () =>
      Promise.resolve('audio-src'),
    );
    await (el as any).instance()['init']();
    el.update();
    expect(el.find('audio').prop('src')).toEqual('audio-src');
  });

  it('shows spinner when pending', async () => {
    const authPromise: any = new Promise(() => {});
    const { el } = createFixture(authPromise);
    el.update();
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows error message with a download button if there is an error displaying the preview', async () => {
    const urlPromise = Promise.reject(new Error('test error'));
    const { el } = createFixture('my-collection', () => urlPromise);
    await awaitError(urlPromise, 'test error');
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      "We couldn't generate a preview for this file",
    );

    // download button
    expect(errorMessage.text()).toContain(
      'Try downloading the file to view it',
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  describe('cover', () => {
    it('it should show the default cover while the audio cover is loading', async () => {
      const { el } = createFixture();
      await (el as any).instance()['init']();
      el.update();
      expect(el.find(DefaultCoverWrapper)).toHaveLength(1);
    });

    it('it should show the default cover when the audio cover is errored', async () => {
      const { el } = createFixture();
      const instance: any = el.instance();

      instance['loadCover'] = () => Promise.reject('no cover found');
      await instance['init']();
      el.update();
      expect(el.find(DefaultCoverWrapper)).toHaveLength(1);
    });

    it.only('it should show the audio cover if exists', async () => {
      const { el } = createFixture(
        'my-collection',
        () => Promise.resolve('audio-src'),
        Promise.resolve('image-base64-encoded-url'),
      );
      const instance: any = el.instance();
      const promiseSrc = Promise.resolve('cover-src');

      instance['loadCover'] = () => promiseSrc;
      await instance['init']();
      await promiseSrc;
      el.update();
      console.log(el.debug());
      expect(el.find(DefaultCoverWrapper)).toHaveLength(0);
      // expect(el.find(AudioCover).prop('src')).toEqual('cover-src');
    });

    describe('AutoPlay', () => {
      async function createAutoPlayFixture(previewCount: number) {
        const context = createContext();
        const el = mount(
          <AudioViewer
            context={context}
            item={audioItem}
            collectionName="collectionName"
            previewCount={previewCount}
          />,
        );
        const instance: any = el.instance();
        await instance['init']();
        el.update();
        return el;
      }

      it('should auto play when it is the first preview', async () => {
        const el = await createAutoPlayFixture(0);
        expect(el.find({ autoPlay: true })).toHaveLength(2);
      });

      it('should not auto play when it is not the first preview', async () => {
        const el = await createAutoPlayFixture(1);
        expect(el.find({ autoPlay: true })).toHaveLength(0);
      });
    });
  });
});
