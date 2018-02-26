import * as React from 'react';
import { shallow, mount } from 'enzyme';

import LazilyRender from 'react-lazily-render';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

import { fakeContext } from '@atlaskit/media-test-helpers';
import {
  MediaCollectionFileItem,
  FileDetails,
  Context,
} from '@atlaskit/media-core';

import { CardView } from '../../src/root/cardView';
import { CardList, CardListProps, CardListState } from '../../src/list';
import { InfiniteScroll } from '../../src/list/infiniteScroll';
import { LazyContent } from '../../src/utils/lazyContent';

function waitForCollectionToLoad(
  context: Context,
  collectionName: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const subscription = context
      .getMediaCollectionProvider(collectionName, 10)
      .observable()
      .subscribe({
        next: res => {
          if (subscription) subscription.unsubscribe();
          resolve();
        },
        error: () => {
          if (subscription) subscription.unsubscribe();
          reject();
        },
      });
  });
}

describe('CardList', () => {
  const collectionName = 'MyMedia';
  const expectedMediaItemProvider = 'the media item provider';
  const oldItem: MediaCollectionFileItem = {
    type: 'file',
    details: {
      id: 'some-file/link-id',
      occurrenceKey: 'some-occurrence-key',
      processingStatus: 'pending',
    },
  };
  const collection = { items: [oldItem] };
  const expectedMediaItems = [
    {
      type: 'link',
      details: {
        id: 'abcd',
        type: 'link',
        processingStatus: 'succeeded',
      },
    },
    {
      type: 'file',
      details: {
        id: 'efgh',
        type: 'file',
        processingStatus: 'succeeded',
      },
    },
  ];
  const contextWithInclusiveStartKey = fakeContext({
    getMediaCollectionProvider: {
      observable() {
        return Observable.of({
          items: expectedMediaItems,
          nextInclusiveStartKey: 'xyz',
        });
      },
      loadNextPage() {},
    },
    getMediaItemProvider: {
      observable() {
        return Observable.of(expectedMediaItemProvider);
      },
    },
  }) as any;
  const contextWithDefaultCollection = fakeContext({
    getMediaCollectionProvider: {
      observable() {
        return Observable.create(observer => {
          observer.next(collection);
        });
      },
    },
  });
  const contextWithSucceededCollection = fakeContext({
    getMediaCollectionProvider: {
      observable() {
        return Observable.create(observer => {
          observer.next({
            items: [
              {
                type: 'file',
                details: {
                  id: 'some-file-id',
                  occurrenceKey: 'some-file-occurrence-key',
                  processingStatus: 'succeeded',
                  artifacts: {},
                },
              },
              {
                type: 'link',
                details: {
                  id: 'some-link-id',
                  occurrenceKey: 'some-link-occurrence-key',
                  processingStatus: 'succeeded',
                },
              },
            ],
          });
        });
      },
      loadNextPage() {},
    },
  });

  it('should be loading=true when mounted', () => {
    const context = fakeContext();
    const card = shallow<CardListProps, CardListState>(
      <CardList context={context} collectionName={collectionName} />,
      { disableLifecycleMethods: true },
    );
    expect(card.state().loading).toBe(true);
  });

  it('should be loading=false when we start loading the next page', () => {
    const context = contextWithInclusiveStartKey;
    const card = shallow<CardListProps, CardListState>(
      <CardList context={context} collectionName={collectionName} />,
    ) as any;
    card.setState({ loading: false, loadNextPage: jest.fn() });
    card.instance().loadNextPage();
    expect(card.state().loading).toBe(false);
  });

  it('should not animate items the first time', () => {
    const item: MediaCollectionFileItem = {
      type: 'file',
      details: {
        id: 'some-file/link-id',
        occurrenceKey: 'some-occurrence-key',
        processingStatus: 'pending',
      },
    };
    const context = fakeContext();
    const collectionName = 'MyMedia';
    const collection = { items: [item] };
    const list = shallow<CardListProps, CardListState>(
      <CardList context={context} collectionName={collectionName} />,
      { disableLifecycleMethods: true },
    ) as any;
    list.setState({ loading: false, error: undefined, collection });
    expect(list.state('shouldAnimate')).toBe(false);
  });

  it('should animate items when they are new', () => {
    const oldItem: MediaCollectionFileItem = {
      type: 'file',
      details: {
        id: '1',
        occurrenceKey: 'a',
        processingStatus: 'pending',
      },
    };
    const newItem: MediaCollectionFileItem = {
      type: 'file',
      details: {
        id: '2',
        occurrenceKey: 'a',
        processingStatus: 'pending',
      },
    };
    const collection = { items: [oldItem] };
    const context = fakeContext();
    const collectionName = 'MyMedia';
    const list = shallow<CardListProps, CardListState>(
      <CardList context={context} collectionName={collectionName} />,
      { disableLifecycleMethods: true },
    ) as any;
    const instance = list.instance();

    list.setState({ loading: false, error: undefined, collection });
    instance.handleNextItems({ context, collectionName })(collection);
    expect(list.state('firstItemKey')).toBe(
      `${oldItem.details.id}-${oldItem.details.occurrenceKey}`,
    );

    const newCollection = { items: [newItem, ...collection.items] };
    list.setState({ collection: newCollection });
    instance.handleNextItems({ context, collectionName })(newCollection);
    expect(list.state('firstItemKey')).toBe(
      `${newItem.details.id}-${newItem.details.occurrenceKey}`,
    );
    expect(list.state('shouldAnimate')).toBe(true);
  });

  it('should reset previous state when props change', () => {
    const item: MediaCollectionFileItem = {
      type: 'file',
      details: {
        id: '1',
        occurrenceKey: 'a',
        processingStatus: 'pending',
      },
    };
    const collection = { items: [item] };
    const context = fakeContext({
      getMediaCollectionProvider: {
        observable() {
          return Observable.create(observer => {
            observer.next(collection);
          });
        },
      },
    });
    const collectionName = 'MyMedia';
    const list = shallow<CardListProps, CardListState>(
      <CardList context={context} collectionName={collectionName} />,
      { disableLifecycleMethods: true },
    ) as any;
    const spy = jest.fn();

    list.instance().setState = spy;
    list.setProps({ context, collectionName: 'otherCollection' });

    expect(spy.mock.calls[0][0].collection).toBe(undefined);
    expect(spy.mock.calls[0][0].firstItemKey).toBe(undefined);
  });

  it('should fire onCardClick handler with updated MediaItemDetails when a Card in the list is clicked', () => {
    const context = contextWithInclusiveStartKey;

    const onCardClickHandler = jest.fn();

    const wrapper = mount<CardListProps, CardListState>(
      <CardList
        shouldLazyLoadCards={false}
        context={context}
        collectionName={collectionName}
        onCardClick={onCardClickHandler}
      />,
    ) as any;
    wrapper
      .find(CardView)
      .first()
      .simulate('click', { mediaItemDetails: expectedMediaItems[0] });

    expect(onCardClickHandler).toHaveBeenCalledTimes(1);
    expect(onCardClickHandler.mock.calls[0][0].mediaCollectionItem).toEqual(
      expectedMediaItems[0],
    );
    expect(onCardClickHandler.mock.calls[0][0].collectionName).toEqual(
      collectionName,
    );
  });

  describe('.render()', () => {
    it('should render the loading view when the list is loading', () => {
      const context = fakeContext();
      const list = shallow<CardListProps, CardListState>(
        <CardList context={context} collectionName={collectionName} />,
        { disableLifecycleMethods: true },
      ) as any;
      list.setState({ loading: true });
      expect(list.children().text()).toContain('loading...');
    });

    it('should render the empty view when the list is not loading and the error is an axios response with a status of 404', () => {
      const context = fakeContext();
      const list = shallow<CardListProps, CardListState>(
        <CardList context={context} collectionName={collectionName} />,
        { disableLifecycleMethods: true },
      ) as any;
      list.setState({ loading: false, error: { response: { status: 404 } } });
      expect(list.children().text()).toContain('No items');
    });

    it('should render the error view when the the list is not loading and the error is not an axios response with a status of 404', () => {
      const context = fakeContext();
      const list = shallow<CardListProps, CardListState>(
        <CardList context={context} collectionName={collectionName} />,
        { disableLifecycleMethods: true },
      ) as any;
      list.setState({ loading: false, error: new Error() });
      expect(list.children().text()).toContain('ERROR');
    });

    // TODO: when would this even occur? loading=true is set when the collection is set! and error=xyz is set when the collection is undefined
    it('should render the loading view when the the list is not loading, there is no error and the collection has not been retrieved', () => {
      const context = fakeContext();
      const list = shallow<CardListProps, CardListState>(
        <CardList context={context} collectionName={collectionName} />,
        { disableLifecycleMethods: true },
      ) as any;
      list.setState({
        loading: false,
        error: undefined,
        collection: undefined,
      });
      expect(list.children().text()).toContain('loading...');
    });

    it('should render wrapped in an <InfiniteScroll> when useInfiniteScroll=true', () => {
      const context = fakeContext();
      const list = shallow<CardListProps, CardListState>(
        <CardList
          context={context}
          collectionName={collectionName}
          useInfiniteScroll={true}
        />,
        { disableLifecycleMethods: true },
      ) as any;
      list.setState({
        loading: false,
        error: undefined,
        collection: { items: [] },
      });
      expect(list.is(InfiniteScroll)).toBe(true);
    });

    it('should not render wrapped in an <InfiniteScroll> when useInfiniteScroll=false', () => {
      const context = fakeContext();
      const list = shallow<CardListProps, CardListState>(
        <CardList
          context={context}
          collectionName={collectionName}
          useInfiniteScroll={false}
        />,
        { disableLifecycleMethods: true },
      ) as any;
      list.setState({
        loading: false,
        error: undefined,
        collection: { items: [] },
      });
      expect(list.is(InfiniteScroll)).toBe(false);
    });

    it('should render wrapped in an <LazilyRender> by default', () => {
      const context = contextWithDefaultCollection;
      const list = mount(
        <CardList
          useInfiniteScroll={false}
          context={context}
          collectionName={collectionName}
        />,
      ) as any;

      list.setState({ loading: false, error: undefined, collection });

      expect(list.find(LazilyRender)).toHaveLength(1);
    });

    it('should not render wrapped in an <LazyLoad> when shouldLazyLoadCards=false', () => {
      const context = contextWithDefaultCollection;
      const list = mount(
        <CardList
          useInfiniteScroll={false}
          context={context}
          collectionName={collectionName}
          shouldLazyLoadCards={false}
        />,
      ) as any;

      list.setState({ loading: false, error: undefined, collection });

      expect(list.find(LazilyRender)).toHaveLength(0);
    });

    it('should not wrap existing items into LazyContent', () => {
      const context = contextWithDefaultCollection;
      const list = mount(
        <CardList
          useInfiniteScroll={false}
          context={context}
          collectionName={collectionName}
        />,
      ) as any;

      list.setState({
        loading: false,
        error: undefined,
        shouldAnimate: true,
        collection,
      });
      expect(list.find(LazyContent)).toHaveLength(0);
    });

    it('should render CardView with link details', async () => {
      const context = contextWithSucceededCollection;
      const list = mount(
        <CardList
          shouldLazyLoadCards={false}
          useInfiniteScroll={false}
          context={context}
          collectionName={collectionName}
        />,
      );

      // wait for the collection to be loaded
      await waitForCollectionToLoad(context, collectionName);
      list.update();

      expect(
        list
          .find(CardView)
          .last()
          .props(),
      ).toMatchObject({
        status: 'complete',
        metadata: {
          id: 'some-link-id',
          occurrenceKey: 'some-link-occurrence-key',
          processingStatus: 'succeeded',
        },
      });
    });

    it('should render CardView with file details', async () => {
      const context = contextWithSucceededCollection;
      const list = mount(
        <CardList
          shouldLazyLoadCards={false}
          useInfiniteScroll={false}
          context={context}
          collectionName={collectionName}
        />,
      );

      // wait for the collection to be loaded
      await waitForCollectionToLoad(context, collectionName);
      list.update();

      expect(
        list
          .find(CardView)
          .first()
          .props(),
      ).toMatchObject({
        status: 'complete',
        metadata: {
          id: 'some-file-id',
          occurrenceKey: 'some-file-occurrence-key',
          processingStatus: 'succeeded',
        },
      });
    });

    it('should render CardView with an image URI', async () => {
      const context = contextWithSucceededCollection;
      const list = mount(
        <CardList
          shouldLazyLoadCards={false}
          useInfiniteScroll={false}
          context={context}
          collectionName={collectionName}
        />,
      );

      // wait for the collection to be loaded
      await waitForCollectionToLoad(context, collectionName);
      list.update();

      expect(
        list
          .find(CardView)
          .first()
          .prop('dataURI'),
      ).toEqual('fake-image-data-uri');
    });
  });
});
