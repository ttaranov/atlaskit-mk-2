import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import {
  MediaItemType,
  MediaItem,
  ContextConfig,
  Auth,
} from '@atlaskit/media-core';
import { MediaFileListViewer } from '../../src/components/media-file-list-viewer';
import { Stubs } from '../_stubs';
import { MediaFileAttributes } from '../../src/mediaviewer';

describe('<MediaFileListViewer />', () => {
  const token = 'some-token';
  const clientId = 'some-client-id';
  const baseUrl = 'some-base-url';
  const authProvider = jest.fn(() =>
    Promise.resolve<Auth>({ token, clientId, baseUrl }),
  );
  const contextConfig: ContextConfig = {
    authProvider,
  };
  const collectionName = 'some-collection';
  const basePath = 'some-base-path';
  const selectedItem = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    type: 'file' as MediaItemType,
  };
  const list = [
    {
      id: 'some-id',
      occurrenceKey: 'some-custom-occurrence-key',
      type: 'file' as MediaItemType,
    },
    {
      id: 'some-id-2',
      occurrenceKey: 'some-custom-occurrence-key-2',
      type: 'file' as MediaItemType,
    },
    {
      id: 'some-id-3',
      occurrenceKey: 'some-custom-occurrence-key-3',
      type: 'file' as MediaItemType,
    },
  ];

  it('should construct a media viewer instance with default config', () => {
    const mediaViewerConstructor = Stubs.mediaViewerConstructor();

    shallow(
      <MediaFileListViewer
        selectedItem={selectedItem}
        list={[selectedItem]}
        context={Stubs.context(contextConfig) as any}
        collectionName={collectionName}
        MediaViewer={mediaViewerConstructor as any}
        basePath={basePath}
      />,
    );

    expect(mediaViewerConstructor).toHaveBeenCalledTimes(1);
    let firstCall = mediaViewerConstructor.mock.calls[0];
    let firstArg = firstCall[0];
    expect(firstArg.assets).toEqual({ basePath });
    expect(firstArg.enableMiniMode).toBe(undefined);
    expect(typeof firstArg.fetchToken).toBe('function');
  });

  it('should construct a media viewer instance with custom config', () => {
    const mediaViewerConstructor = Stubs.mediaViewerConstructor();
    const additionalConfiguration = { enableMiniMode: true };

    shallow(
      <MediaFileListViewer
        selectedItem={selectedItem}
        list={[selectedItem]}
        context={Stubs.context(contextConfig) as any}
        collectionName={collectionName}
        mediaViewerConfiguration={additionalConfiguration}
        MediaViewer={mediaViewerConstructor as any}
        basePath={basePath}
      />,
    );

    expect(mediaViewerConstructor).toHaveBeenCalledTimes(1);
    let firstCall = mediaViewerConstructor.mock.calls[0];
    let firstArg = firstCall[0];
    expect(firstArg.assets).toEqual({ basePath });
    expect(firstArg.enableMiniMode).toBe(true);
    expect(typeof firstArg.fetchToken).toBe('function');
  });

  it('should construct a media viewer with no collectionName provided', () => {
    const context = Stubs.context(contextConfig) as any;
    const mediaViewerConstructor = Stubs.mediaViewerConstructor();
    const additionalConfiguration = { enableMiniMode: true };
    mount(
      <MediaFileListViewer
        selectedItem={selectedItem}
        list={list}
        context={context}
        mediaViewerConfiguration={additionalConfiguration}
        MediaViewer={mediaViewerConstructor as any}
        basePath={basePath}
      />,
    );
    expect(context.getMediaItemProvider).toHaveBeenCalledTimes(3);
    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      'some-id',
      'file',
      undefined,
    );
    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      'some-id-2',
      'file',
      undefined,
    );
    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      'some-id-3',
      'file',
      undefined,
    );
  });

  it('should construct a media viewer with a collectionName', () => {
    const context = Stubs.context(contextConfig) as any;
    const mediaViewerConstructor = Stubs.mediaViewerConstructor();
    const additionalConfiguration = { enableMiniMode: true };
    mount(
      <MediaFileListViewer
        selectedItem={selectedItem}
        list={list}
        context={context}
        collectionName={collectionName}
        mediaViewerConfiguration={additionalConfiguration}
        MediaViewer={mediaViewerConstructor as any}
        basePath={basePath}
      />,
    );
    expect(context.getMediaItemProvider).toHaveBeenCalledTimes(3);
    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      'some-id',
      'file',
      'some-collection',
    );
    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      'some-id-2',
      'file',
      'some-collection',
    );
    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      'some-id-3',
      'file',
      'some-collection',
    );
  });

  it('should call classic MediaViewer with the expected parameters', done => {
    const subject = new Subject<MediaItem>();
    const context = Stubs.context(
      contextConfig,
      undefined,
      Stubs.mediaItemProvider(subject),
    ) as any;

    const setFiles = (files: MediaFileAttributes[]) => {
      expect(files.length).toEqual(3);
      expect(files[0].id).toEqual('stub-some-custom-occurrence-key');
      expect(files[1].id).toEqual('stub-some-custom-occurrence-key-2');
      expect(files[2].id).toEqual('stub-some-custom-occurrence-key-3');
    };

    const open = ({ id }: MediaFileAttributes) => {
      expect(id).toEqual('some-id-some-custom-occurrence-key');
      done();
    };

    const mediaViewerConstructor = Stubs.mediaViewerConstructor({
      setFiles,
      open,
    });
    const additionalConfiguration = { enableMiniMode: true };
    mount(
      <MediaFileListViewer
        selectedItem={selectedItem}
        list={list}
        context={context}
        collectionName={collectionName}
        mediaViewerConfiguration={additionalConfiguration}
        MediaViewer={mediaViewerConstructor as any}
        basePath={basePath}
      />,
    );

    subject.next({
      type: 'file',
      details: {
        id: 'stub',
      },
    });

    expect(context.getMediaItemProvider).toHaveBeenCalledTimes(3);
    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      'some-id',
      'file',
      'some-collection',
    );
    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      'some-id-2',
      'file',
      'some-collection',
    );
    expect(context.getMediaItemProvider).toHaveBeenCalledWith(
      'some-id-3',
      'file',
      'some-collection',
    );
  });

  it('should listen on fv.close given an onClose handler', () => {
    const mediaViewerConstructor = Stubs.mediaViewerConstructor();
    const onClose = jest.fn();

    const wrapper = mount(
      <MediaFileListViewer
        selectedItem={selectedItem}
        list={[selectedItem]}
        context={Stubs.context(contextConfig) as any}
        collectionName={collectionName}
        MediaViewer={mediaViewerConstructor as any}
        basePath={basePath}
        onClose={onClose}
      />,
    );

    const { mediaViewer } = wrapper.state();
    expect(mediaViewer.on).toHaveBeenCalledTimes(1);
    expect((mediaViewer.on as any).mock.calls[0][0]).toBe('fv.close');

    wrapper.unmount();
    expect(mediaViewer.off).toHaveBeenCalledTimes(1);
    expect((mediaViewer.off as any).mock.calls[0][0]).toBe('fv.close');
  });

  it('should deal with provider errors', done => {
    const list = [
      {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        type: 'file' as MediaItemType,
      },
      {
        id: 'some-id-2',
        occurrenceKey: 'some-custom-occurrence-key-2',
        type: 'file' as MediaItemType,
      },
    ];

    const subject = new Subject<MediaItem>();
    const context = Stubs.context(
      contextConfig,
      undefined,
      Stubs.mediaItemProvider(subject),
    ) as any;

    const setFiles = (files: MediaFileAttributes[]) => {
      expect(files.length).toEqual(2);
      expect(files[0].id).toEqual('some-id-some-custom-occurrence-key');
      expect(files[0].type).toEqual('error');

      expect(files[1].id).toEqual('some-id-2-some-custom-occurrence-key-2');
      expect(files[1].type).toEqual('error');
    };

    const open = ({ id }: MediaFileAttributes) => {
      expect(id).toEqual('some-id-some-custom-occurrence-key');
      done();
    };

    const mediaViewerConstructor = Stubs.mediaViewerConstructor({
      setFiles,
      open,
    });

    const additionalConfiguration = {
      enableMiniMode: true,
    };

    mount(
      <MediaFileListViewer
        selectedItem={selectedItem}
        list={list}
        context={context}
        collectionName={collectionName}
        mediaViewerConfiguration={additionalConfiguration}
        MediaViewer={mediaViewerConstructor as any}
        basePath={basePath}
      />,
    );

    // make all underlying observables from MediaItemProviders fail
    subject.error({});
  });
});
