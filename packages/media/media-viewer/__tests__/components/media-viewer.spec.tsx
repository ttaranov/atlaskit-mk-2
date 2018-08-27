import * as React from 'react';
import { mount } from 'enzyme';
import { Auth, ContextConfig, MediaItemType } from '@atlaskit/media-core';
import { MediaViewer } from '../../src/components/media-viewer';
import { MediaViewer as MediaViewerNextGen } from '../../src/newgen/media-viewer';
import { List } from '../../src/newgen/list';
import { Collection } from '../../src/newgen/collection';
import { Stubs } from '../_stubs';

declare var global: any;

describe('<MediaViewer />', () => {
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
  const selectedItem = {
    id,
    occurrenceKey,
    type: 'file' as MediaItemType,
  };
  const list = [
    {
      id: 'some-id',
      occurrenceKey: 'some-occurrence-key',
      type: 'file' as MediaItemType,
    },
    {
      id: 'some-id-2',
      occurrenceKey: 'some-occurrence-key-2',
      type: 'file' as MediaItemType,
    },
    {
      id: 'some-id-3',
      occurrenceKey: 'some-occurrence-key-3',
      type: 'file' as MediaItemType,
    },
  ];
  const collectionDataSource = { collectionName };
  const listDataSource = { list };

  describe('with next gen feature flag enabled', () => {
    it('should show the next gen viewer', () => {
      const featureFlags = { nextGen: true };
      const context = Stubs.context(contextConfig);
      const el = mount(
        <MediaViewer
          context={context as any}
          selectedItem={selectedItem}
          dataSource={listDataSource}
          collectionName={collectionName}
          MediaViewer={Stubs.mediaViewerConstructor() as any}
          basePath={basePath}
          featureFlags={featureFlags}
        />,
      );
      expect(el.find(MediaViewerNextGen)).toHaveLength(1);
    });

    it('should pass dark features down the list component', () => {
      const featureFlags = { nextGen: true };
      const context = Stubs.context(contextConfig);
      const el = mount(
        <MediaViewer
          context={context as any}
          selectedItem={selectedItem}
          dataSource={listDataSource}
          collectionName={collectionName}
          MediaViewer={Stubs.mediaViewerConstructor() as any}
          basePath={basePath}
          featureFlags={featureFlags}
        />,
      );
      const listComponent = el.find(List);
      expect(listComponent.prop('featureFlags')).toEqual(featureFlags);
    });

    it('should pass dark features down the collection component', () => {
      const featureFlags = { nextGen: true };
      const context = Stubs.context(contextConfig);
      const el = mount(
        <MediaViewer
          context={context as any}
          selectedItem={selectedItem}
          dataSource={collectionDataSource}
          collectionName={collectionName}
          MediaViewer={Stubs.mediaViewerConstructor() as any}
          basePath={basePath}
          featureFlags={featureFlags}
        />,
      );
      const collectionComponent = el.find(Collection);
      expect(collectionComponent.prop('featureFlags')).toEqual(featureFlags);
    });

    describe('MSW-720: the collectionName is added to selectedItem for MVNG', () => {
      it('adds the collectionName for list dataSources', () => {
        const featureFlags = { nextGen: true };
        const context = Stubs.context(contextConfig);
        const el = mount(
          <MediaViewer
            context={context as any}
            selectedItem={selectedItem}
            dataSource={listDataSource}
            collectionName={collectionName}
            MediaViewer={Stubs.mediaViewerConstructor() as any}
            basePath={basePath}
            featureFlags={featureFlags}
          />,
        );
        expect(
          el.find(MediaViewerNextGen).props().selectedItem!.collectionName,
        ).toEqual(collectionName);
      });

      it('adds the collectionName for collection dataSources', () => {
        const featureFlags = { nextGen: true };
        const context = Stubs.context(contextConfig);
        const el = mount(
          <MediaViewer
            context={context as any}
            selectedItem={selectedItem}
            dataSource={collectionDataSource}
            collectionName={'another-collection-name'}
            MediaViewer={Stubs.mediaViewerConstructor() as any}
            basePath={basePath}
            featureFlags={featureFlags}
          />,
        );
        expect(
          el.find(MediaViewerNextGen).props().selectedItem!.collectionName,
        ).toEqual(collectionDataSource.collectionName);
      });
    });

    it('should pass the correct collectionName property to the next gen viewer', () => {
      const featureFlags = { nextGen: true };
      const context = Stubs.context(contextConfig);
      const el = mount(
        <MediaViewer
          context={context as any}
          selectedItem={selectedItem}
          dataSource={collectionDataSource}
          collectionName={'another-collection-name'}
          MediaViewer={Stubs.mediaViewerConstructor() as any}
          basePath={basePath}
          featureFlags={featureFlags}
        />,
      );
      expect(
        (el.find(MediaViewerNextGen).props() as any).itemSource.collectionName,
      ).toEqual(collectionDataSource.collectionName);
    });

    it('should show the next gen viewer when dev flag is enabled', () => {
      let originalLocalStorage = global.window.localStorage;
      global.window.localStorage = {
        getItem: (key: string) => key === 'MediaViewerNextGenEnabled',
      };
      const context = Stubs.context(contextConfig);
      const el = mount(
        <MediaViewer
          context={context as any}
          selectedItem={selectedItem}
          dataSource={listDataSource}
          collectionName={collectionName}
          MediaViewer={Stubs.mediaViewerConstructor() as any}
          basePath={basePath}
        />,
      );
      expect(el.find(MediaViewerNextGen)).toHaveLength(1);
      global.window.localStorage = originalLocalStorage;
    });
  });

  describe('with collection data source', () => {
    it('should get the correct collection provider', () => {
      const context = Stubs.context(contextConfig);
      mount(
        <MediaViewer
          context={context as any}
          selectedItem={selectedItem}
          dataSource={collectionDataSource}
          collectionName={collectionName}
          MediaViewer={Stubs.mediaViewerConstructor() as any}
          basePath={basePath}
        />,
      );
      expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
      expect(context.getMediaCollectionProvider).toHaveBeenCalledWith(
        collectionName,
        10,
      );

      expect(context.getMediaItemProvider).not.toHaveBeenCalled();
    });

    it('should accept a custom page size', () => {
      const context = Stubs.context(contextConfig);
      mount(
        <MediaViewer
          context={context as any}
          selectedItem={selectedItem}
          dataSource={collectionDataSource}
          collectionName={collectionName}
          pageSize={122}
          MediaViewer={Stubs.mediaViewerConstructor() as any}
          basePath={basePath}
        />,
      );
      expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
      expect(context.getMediaCollectionProvider).toHaveBeenCalledWith(
        collectionName,
        122,
      );

      expect(context.getMediaItemProvider).not.toHaveBeenCalled();
    });
  });

  describe('with media list data source', () => {
    it('should get the correct collection provider', () => {
      const context = Stubs.context(contextConfig);
      mount(
        <MediaViewer
          context={context as any}
          selectedItem={selectedItem}
          dataSource={listDataSource}
          collectionName={collectionName}
          MediaViewer={Stubs.mediaViewerConstructor() as any}
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

      expect(context.getMediaCollectionProvider).not.toHaveBeenCalled();
    });
  });
});
