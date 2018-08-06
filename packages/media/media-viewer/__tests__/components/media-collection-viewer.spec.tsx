import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import {
  Auth,
  ContextConfig,
  MediaCollection,
  MediaCollectionFileItem,
  MediaItemType,
} from '@atlaskit/media-core';
import {
  MediaCollectionViewer,
  MediaCollectionViewerProps,
  MediaCollectionViewerState,
} from '../../src/components/media-collection-viewer';
import { MediaFileAttributesFactory } from '../../src/domain/media-file-attributes';
import { Stubs } from '../_stubs';

describe('<MediaCollectionViewer />', () => {
  const token = 'some-token';
  const clientId = 'some-client-id';
  const baseUrl = 'some-service-host';
  const authProvider = jest.fn(() =>
    Promise.resolve<Auth>({ token, clientId, baseUrl }),
  );
  const contextConfig: ContextConfig = {
    authProvider,
  };
  const occurrenceKey = 'some-occurence-key';
  const id = 'some-media-id';
  const collectionName = 'some-collection';
  const basePath = 'some-base-path';
  const file = {
    type: 'file',
    details: {
      id: 'file-1',
      occurrenceKey: 'occurence-1',
    },
  } as MediaCollectionFileItem;

  const collection = {
    id: collectionName,
    items: [file],
  } as MediaCollection;

  const emptyCollection = {
    id: collectionName,
    items: [],
  } as MediaCollection;

  const selectedItem = {
    id,
    occurrenceKey,
    type: 'file' as MediaItemType,
  };

  it('should get the correct collection provider', () => {
    const context = Stubs.context(contextConfig);
    shallow(
      <MediaCollectionViewer
        context={context as any}
        selectedItem={selectedItem}
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
    expect(context.getMediaCollectionProvider).toHaveBeenCalledWith(
      collectionName,
      MediaCollectionViewer.defaultPageSize,
    );
  });

  it('should get the correct collection provider given page size', () => {
    const context = Stubs.context(contextConfig);
    const pageSize = 28;

    shallow(
      <MediaCollectionViewer
        context={context as any}
        selectedItem={selectedItem}
        collectionName={collectionName}
        pageSize={pageSize}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
    expect(context.getMediaCollectionProvider).toHaveBeenCalledWith(
      collectionName,
      pageSize,
    );
  });

  it('should construct a media viewer instance with default config', () => {
    const mediaViewerConstructor = Stubs.mediaViewerConstructor();

    shallow(
      <MediaCollectionViewer
        context={Stubs.context(contextConfig) as any}
        selectedItem={selectedItem}
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
    const additionalConfiguration = {
      enableMiniMode: true,
    };

    shallow(
      <MediaCollectionViewer
        context={Stubs.context(contextConfig) as any}
        selectedItem={selectedItem}
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

  it('should listen on fv.close given an onClose handler', () => {
    const onClose = jest.fn();

    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={Stubs.context(contextConfig) as any}
        selectedItem={selectedItem}
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
        onClose={onClose}
      />,
    );

    const { mediaViewer } = wrapper.state();
    expect(mediaViewer.on).toHaveBeenCalledTimes(2);
    expect((mediaViewer.on as any).mock.calls[0][0]).toBe('fv.close');

    wrapper.unmount();
    expect(mediaViewer.off).toHaveBeenCalledTimes(2);
    expect((mediaViewer.off as any).mock.calls[0][0]).toBe('fv.close');
  });

  it('should not listen on fv.close given no onClose handler', () => {
    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={Stubs.context(contextConfig) as any}
        selectedItem={selectedItem}
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    expect(wrapper.state().mediaViewer.on).not.toHaveBeenCalledWith('fv.close');
  });

  it('should listen on fv.changeFile to detect if the next page needs to be loaded', () => {
    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={Stubs.context(contextConfig) as any}
        selectedItem={selectedItem}
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    const { mediaViewer } = wrapper.state();

    expect(mediaViewer.on).toHaveBeenCalledTimes(2);
    expect((mediaViewer.on as any).mock.calls[1][0]).toBe('fv.changeFile');

    wrapper.unmount();

    expect(mediaViewer.off).toHaveBeenCalledTimes(2);
    expect((mediaViewer.off as any).mock.calls[1][0]).toBe('fv.changeFile');
  });

  it('should open media viewer with query, given media viewer is not open', async () => {
    const subject = new Subject<MediaCollection>();
    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={
          Stubs.context(
            contextConfig,
            Stubs.mediaCollectionProvider(subject),
          ) as any
        }
        selectedItem={selectedItem}
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    const files = MediaFileAttributesFactory.fromMediaCollection(
      collection,
      baseUrl,
    );
    const { mediaViewer } = wrapper.state();
    (mediaViewer.isOpen as any).mockImplementation(() => false);

    subject.next(collection);

    await Promise.resolve();

    expect(mediaViewer.open).toHaveBeenCalledWith({
      id: 'some-media-id-some-occurence-key',
    });
    expect(mediaViewer.setFiles).toHaveBeenCalledWith(files);
  });

  it('should open media viewer with first item from the collection, if no selectedItem passed', async () => {
    const subject = new Subject<MediaCollection>();
    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={
          Stubs.context(
            contextConfig,
            Stubs.mediaCollectionProvider(subject),
          ) as any
        }
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    const files = MediaFileAttributesFactory.fromMediaCollection(
      collection,
      baseUrl,
    );
    const { mediaViewer } = wrapper.state();
    (mediaViewer.isOpen as any).mockImplementation(() => false);

    subject.next(collection);
    await Promise.resolve();

    expect(mediaViewer.open).toHaveBeenCalledWith({ id: 'file-1-occurence-1' });
    expect(mediaViewer.setFiles).toHaveBeenCalledWith(files);
  });

  it('should not open media viewer, if selectedItem was passed but not items were found in the collection', () => {
    const subject = new Subject<MediaCollection>();
    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={
          Stubs.context(
            contextConfig,
            Stubs.mediaCollectionProvider(subject),
          ) as any
        }
        selectedItem={selectedItem}
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    const { mediaViewer } = wrapper.state();
    (mediaViewer.isOpen as any).mockImplementation(() => false);

    subject.next(emptyCollection);

    expect(mediaViewer.open).not.toHaveBeenCalled();
    expect(mediaViewer.setFiles).not.toHaveBeenCalled();
  });

  it('should not open media viewer, if no selectedItem was passed and not items were found in the collection', () => {
    const subject = new Subject<MediaCollection>();
    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={
          Stubs.context(
            contextConfig,
            Stubs.mediaCollectionProvider(subject),
          ) as any
        }
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    const { mediaViewer } = wrapper.state();
    (mediaViewer.isOpen as any).mockImplementation(() => false);

    subject.next(emptyCollection);

    expect(mediaViewer.open).not.toHaveBeenCalled();
    expect(mediaViewer.setFiles).not.toHaveBeenCalled();
  });

  it('should set files with query and not open media viewer, given media viewer is already open', async () => {
    const subject = new Subject<MediaCollection>();
    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={
          Stubs.context(
            contextConfig,
            Stubs.mediaCollectionProvider(subject),
          ) as any
        }
        selectedItem={selectedItem}
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    const files = MediaFileAttributesFactory.fromMediaCollection(
      collection,
      baseUrl,
    );
    const currentFile = files[0];
    const { mediaViewer } = wrapper.state();

    (mediaViewer.isOpen as any).mockImplementation(() => true);
    (mediaViewer.getCurrent as any).mockImplementation(() => currentFile);

    subject.next(collection);

    await Promise.resolve();

    expect(mediaViewer.open).not.toHaveBeenCalled();
    expect(mediaViewer.setFiles).toHaveBeenCalledWith(files, {
      id: currentFile.id,
    });
  });

  it('should load next page, given media viewer is showing last page on navigation', () => {
    const provider = Stubs.mediaCollectionProvider(undefined);
    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={Stubs.context(contextConfig, provider) as any}
        selectedItem={selectedItem}
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    const { mediaViewer } = wrapper.state();

    (mediaViewer.isShowingLastFile as any).mockImplementation(() => true);
    (mediaViewer as any).trigger('fv.changeFile');

    expect(provider.loadNextPage).toHaveBeenCalled();
  });

  it('should not load next page, given media viewer not is showing last page on navigation', () => {
    const provider = Stubs.mediaCollectionProvider(undefined);
    const wrapper = mount<
      MediaCollectionViewerProps,
      MediaCollectionViewerState
    >(
      <MediaCollectionViewer
        context={Stubs.context(contextConfig, provider) as any}
        selectedItem={selectedItem}
        collectionName={collectionName}
        MediaViewer={Stubs.mediaViewerConstructor() as any}
        basePath={basePath}
      />,
    );

    const { mediaViewer } = wrapper.state();

    (mediaViewer.isShowingLastFile as any).mockImplementation(() => false);
    (mediaViewer as any).trigger('fv.changeFile');

    expect(provider.loadNextPage).not.toHaveBeenCalled();
  });
});
