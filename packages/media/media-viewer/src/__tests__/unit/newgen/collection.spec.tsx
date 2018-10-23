import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { Context, MediaItemType, MediaCollection } from '@atlaskit/media-core';
import { Stubs, createContext } from '../_stubs';
import { Collection } from '../../../newgen/collection';
import { ErrorMessage } from '../../../newgen/error';
import { Identifier } from '../../../newgen/domain';
import Spinner from '@atlaskit/spinner';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { List } from '../../../newgen/list';

const collectionName = 'my-collection';

const identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
};

const identifier2 = {
  id: 'some-id-2',
  occurrenceKey: 'some-custom-occurrence-key-2',
  type: 'file' as MediaItemType,
};

const mediaCollection: MediaCollection = {
  id: collectionName,
  items: [
    {
      type: 'file',
      details: {
        id: identifier.id,
        occurrenceKey: identifier.occurrenceKey,
      },
    },
    {
      type: 'file',
      details: {
        id: identifier2.id,
        occurrenceKey: identifier2.occurrenceKey,
      },
    },
    {
      type: 'link',
      details: {
        type: 'link',
        id: identifier2.id,
        occurrenceKey: '',
        url: 'http://mylink',
        title: 'test',
      },
    },
  ],
};

function createFixture(
  context: Context,
  identifier: Identifier,
  onClose?: () => {},
) {
  const el = mount(
    <Collection
      defaultSelectedItem={identifier}
      collectionName={collectionName}
      context={context}
      onClose={onClose}
      pageSize={999}
    />,
  );
  return el;
}

describe('<Collection />', () => {
  it('should show a spinner while requesting items', () => {
    const subject = new Subject();
    const el = createFixture(createContext({ subject }), identifier);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('should fetch collection items', () => {
    const subject = new Subject<MediaCollection>();
    const context = createContext({ subject });
    createFixture(context, identifier);
    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
    expect(context.getMediaCollectionProvider).toHaveBeenCalledWith(
      'my-collection',
      999,
    );
  });

  it('should filter links', () => {
    const subject = new Subject<MediaCollection | Error>();
    const context = createContext({ subject });
    const el = createFixture(context, identifier);
    subject.next(mediaCollection);
    expect(mediaCollection.items).toHaveLength(3);
    expect(el.state().items.data).toHaveLength(2);
  });

  it('should show an error if items failed to be fetched', () => {
    const subject = new Subject<MediaCollection | Error>();
    const el = createFixture(createContext({ subject }), identifier);
    subject.next(new Error('error'));
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      'Something went wrong.It might just be a hiccup.',
    );
  });

  it('should reset the component when the collection prop changes', () => {
    const subject = new Subject<MediaCollection | Error>();
    const context = createContext({ subject });
    const el = createFixture(context, identifier);
    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
    el.setProps({ collectionName: 'other-collection' });
    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(2);
  });

  it('should reset the component when the context prop changes', () => {
    const subject = new Subject<MediaCollection | Error>();
    const context = createContext({ subject });
    const el = createFixture(context, identifier);
    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);

    const subject2 = new Subject<MediaCollection | Error>();
    const context2 = createContext({ subject: subject2 });
    el.setProps({ context: context2 });

    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
    expect(context2.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
  });

  it('should restore PENDING state when component resets', () => {
    const subject = new Subject<MediaCollection | Error>();
    const context = createContext({ subject });
    const el = createFixture(context, identifier);
    expect(el.state().items.status).toEqual('PENDING');
    subject.next(mediaCollection);
    expect(el.state().items.status).toEqual('SUCCESSFUL');

    el.setProps({ collectionName: 'other-collection' });
    expect(el.state().items.status).toEqual('PENDING');
  });

  it('MSW-720: adds the collectionName to all identifiers passed to the List component', () => {
    const subject = new Subject<MediaCollection | Error>();
    const context = createContext({ subject });
    const el = createFixture(context, identifier);
    subject.next(mediaCollection);
    el.update();
    const listProps = el.find(List).props();
    expect(listProps.defaultSelectedItem.collectionName).toEqual(
      collectionName,
    );
    listProps.items.forEach((item: Identifier) => {
      expect(item.collectionName).toEqual(collectionName);
    });
  });

  describe('Next page', () => {
    it('should load next page if we instantiate the component with the last item of the page as selectedItem', () => {
      const subject = new Subject<MediaCollection>();
      const provider = Stubs.mediaCollectionProvider(subject);
      const context = createContext({ subject, provider });
      createFixture(context, identifier2);
      subject.next(mediaCollection);
      expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
      expect(provider.loadNextPage).toHaveBeenCalled();
    });

    it('should NOT load next page if we instantiate the component normally', () => {
      const subject = new Subject<MediaCollection>();
      const provider = Stubs.mediaCollectionProvider(subject);
      const context = createContext({ subject, provider });
      createFixture(context, identifier);
      subject.next(mediaCollection);
      expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
      expect(provider.loadNextPage).not.toHaveBeenCalled();
    });

    it('should load next page if we navigate to the last item of the list', () => {
      const subject = new Subject<MediaCollection>();
      const provider = Stubs.mediaCollectionProvider(subject);
      const context = createContext({ subject, provider });
      const el = createFixture(context, identifier);
      subject.next(mediaCollection);
      el.update();

      expect(provider.loadNextPage).not.toHaveBeenCalled();
      el.find(ArrowRightCircleIcon).simulate('click');
      expect(provider.loadNextPage).toHaveBeenCalled();
    });
  });
});
