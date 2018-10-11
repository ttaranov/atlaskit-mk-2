import * as React from 'react';
import { shallow, mount } from 'enzyme';

import LazilyRender from 'react-lazily-render';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { InfiniteScroll } from '@atlaskit/media-ui';
import { fakeContext } from '@atlaskit/media-test-helpers';
import {
  MediaCollectionFileItem,
  FileDetails,
  CollectionNotFoundError,
} from '@atlaskit/media-core';

import { CardList, CardListProps, CardListState } from '../..';
import { LazyContent } from '../../../utils/lazyContent';
import { TransitionGroup } from 'react-transition-group';
import { default as Card } from '../../../root/card/cardLoader';

describe('CardList', () => {
  const setup = () => {
    const subject = new Subject();
    const context = fakeContext({
      getMediaCollectionProvider: {
        observable() {
          return subject;
        },
      },
    });

    return {
      context,
      subject,
      ErrorComponent: () => <div>Error</div>,
      EmptyComponent: () => <div>Empty</div>,
    };
  };

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
  const linkItem1 = {
    type: 'link',
    details: {
      id: 'abcd',
      type: 'link',
    },
  };
  const linkItem2 = {
    type: 'link',
    details: {
      id: '1234',
      type: 'link',
    },
  };
  const fileItem = {
    type: 'file',
    details: {
      id: 'efgh',
      type: 'file',
    },
  };
  const expectedMediaItems = [linkItem1, fileItem];
  const linksOnlyItems = [linkItem1, linkItem2];
  const contextWithInclusiveStartKey = fakeContext({
    getMediaCollectionProvider: {
      observable() {
        return of({
          items: expectedMediaItems,
          nextInclusiveStartKey: 'xyz',
        });
      },
    },
    getMediaItemProvider: {
      observable() {
        return of(expectedMediaItemProvider);
      },
    },
  }) as any;
  const contextWithDefaultCollection = fakeContext({
    getMediaCollectionProvider: {
      observable() {
        return Observable.create((observer: any) => {
          observer.next(collection);
        });
      },
    },
  });
  it('should call getMediaCollectionProvider', () => {
    const context = contextWithInclusiveStartKey;
    mount(<CardList context={context} collectionName={collectionName} />);

    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(
      expectedMediaItems.length,
    );
  });

  it('should be loading=true when mounted', () => {
    const context = fakeContext();
    const cardList = shallow(
      <CardList context={context} collectionName={collectionName} />,
      { disableLifecycleMethods: true },
    );
    expect(cardList.state().loading).toBe(true);
  });

  it('should be loading=false when we start loading the next page', () => {
    const context = contextWithInclusiveStartKey;
    const cardList = shallow(
      <CardList context={context} collectionName={collectionName} />,
    );
    cardList.setState({ loading: false, loadNextPage: jest.fn() });
    (cardList.instance() as CardList).loadNextPage();
    expect(cardList.state().loading).toBe(false);
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
          return Observable.create((observer: any) => {
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
    const newItemDetails: FileDetails = {
      id: 'id',
      processingStatus: 'succeeded',
    };

    const newItem: MediaCollectionFileItem = {
      type: 'file',
      details: {
        ...oldItem.details,
        ...newItemDetails,
      },
    };

    const collection = {
      items: [oldItem, oldItem, oldItem],
      nextInclusiveStartKey: 'xyz',
    };

    const context = fakeContext({
      getMediaCollectionProvider: {
        observable() {
          return Observable.create((observer: any) => {
            observer.next(collection);
          });
        },
      },
      getMediaItemProvider: {
        observable() {
          return Observable.create((observer: any) => {
            observer.next(newItemDetails);
          });
        },
      },
    });

    const onCardClickHandler = jest.fn();

    const wrapper = shallow<CardListProps, CardListState>(
      <CardList
        context={context}
        collectionName={collectionName}
        onCardClick={onCardClickHandler}
      />,
      { disableLifecycleMethods: true },
    ) as any;
    wrapper.setState({ loading: false, error: undefined, collection });

    wrapper
      .find(Card)
      .first()
      .simulate('click', { mediaItemDetails: newItemDetails });

    expect(onCardClickHandler).toHaveBeenCalledTimes(1);
    expect(onCardClickHandler.mock.calls[0][0].mediaCollectionItem).toEqual(
      newItem,
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

    it('should render the empty view when the list is not loading and the error is a CollectionNotFoundError', () => {
      const context = fakeContext();
      const list = shallow<CardListProps, CardListState>(
        <CardList context={context} collectionName={collectionName} />,
        { disableLifecycleMethods: true },
      ) as any;
      list.setState({ loading: false, error: new CollectionNotFoundError() });
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
        collection: { items: [fileItem] },
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

    it('should render lazy Cards by default and when shouldLazyLoadCards=true', () => {
      const context = contextWithDefaultCollection;
      const defaultList = mount(
        <CardList context={context} collectionName={collectionName} />,
      );
      const listWithUseInfiniteScroll = mount(
        <CardList
          useInfiniteScroll={true}
          context={context}
          collectionName={collectionName}
        />,
      );

      expect(defaultList.find(LazyContent)).toHaveLength(1);
      expect(listWithUseInfiniteScroll.find(LazyContent)).toHaveLength(1);
    });

    it('should not render link items', () => {
      const collection = { items: linksOnlyItems };
      const context = contextWithInclusiveStartKey;
      const cardList = mount(
        <CardList
          context={context}
          collectionName={collectionName}
          shouldLazyLoadCards={false}
        />,
      );

      cardList.setState({ loading: false, error: undefined, collection });
      cardList.update();
      expect(cardList.find(Card)).toHaveLength(0);
    });

    it('should render empty component when there are no items in the collection', () => {
      const { EmptyComponent } = setup();
      const collection = { items: [] };
      const context = contextWithInclusiveStartKey;
      const cardList = mount(
        <CardList
          context={context}
          collectionName={collectionName}
          shouldLazyLoadCards={false}
          emptyComponent={<EmptyComponent />}
        />,
      );

      cardList.setState({ loading: false, error: undefined, collection });
      cardList.update();
      expect(cardList.find(EmptyComponent)).toHaveLength(1);
    });
  });

  describe('Errors', () => {
    it('should render <EmptyComponent /> given CollectionNotFoundError', () => {
      const { context, subject, ErrorComponent, EmptyComponent } = setup();
      const wrapper = shallow(
        <CardList
          context={context}
          collectionName={collectionName}
          errorComponent={<ErrorComponent />}
          emptyComponent={<EmptyComponent />}
        />,
      );

      subject.next(new CollectionNotFoundError());
      wrapper.update();

      expect(wrapper.find(EmptyComponent)).toHaveLength(1);
    });

    it('should render <ErrorComponent /> given other Error', () => {
      const { context, subject, ErrorComponent, EmptyComponent } = setup();
      const wrapper = shallow(
        <CardList
          context={context}
          collectionName={collectionName}
          errorComponent={<ErrorComponent />}
          emptyComponent={<EmptyComponent />}
        />,
      );

      subject.next(new Error());
      wrapper.update();

      expect(wrapper.find(ErrorComponent)).toHaveLength(1);
    });

    it('should recover from error given provider emits valid value after error', () => {
      const { context, subject, ErrorComponent, EmptyComponent } = setup();
      const wrapper = shallow(
        <CardList
          context={context}
          collectionName={collectionName}
          errorComponent={<ErrorComponent />}
          emptyComponent={<EmptyComponent />}
        />,
      );

      subject.next(new Error());
      wrapper.update();

      expect(wrapper.find(TransitionGroup)).toHaveLength(0);
      expect(wrapper.find(ErrorComponent)).toHaveLength(1);

      subject.next({ id: 'some-collection', items: [fileItem] });
      wrapper.update();

      // TransitionGroup is rendered when we want to show a card list
      expect(wrapper.find(TransitionGroup)).toHaveLength(1);
      expect(wrapper.find(ErrorComponent)).toHaveLength(0);
    });
  });
});
