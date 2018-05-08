import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { Context, MediaItemType, MediaCollection } from '@atlaskit/media-core';
import { Stubs } from '../_stubs';
import { Collection } from '../../src/newgen/collection';
import { ErrorMessage } from '../../src/newgen/styled';
import Spinner from '@atlaskit/spinner';
import CrossIcon from '@atlaskit/icon/glyph/cross';

function createContext(subject): Context {
  const token = 'some-token';
  const clientId = 'some-client-id';
  const serviceHost = 'some-service-host';
  const authProvider = jest.fn(() => Promise.resolve({ token, clientId }));
  const contextConfig = {
    serviceHost,
    authProvider,
  };
  return Stubs.context(
    contextConfig,
    Stubs.mediaCollectionProvider(subject),
  ) as any;
}

const id = 'some-id';
const occurrenceKey = 'some-custom-occurrence-key';

const identifier = {
  id,
  occurrenceKey,
  type: 'file' as MediaItemType,
};

const mediaCollection: MediaCollection = {
  id: 'my-collection',
  items: [
    {
      type: 'file',
      details: {
        id,
        occurrenceKey,
      },
    },
  ],
};

function createFixture(
  context: Context,
  subject: Subject<MediaCollection | Error>,
  onClose?: () => {},
) {
  const el = mount(
    <Collection
      selectedItem={identifier}
      collectionName="my-collection"
      context={context}
      onClose={onClose}
    />,
  );
  return el;
}

describe('<Collection />', () => {
  it('should show a spinner while requesting items', () => {
    const subject = new Subject<MediaCollection>();
    const el = createFixture(createContext(subject), subject);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('should fetch collection items', () => {
    const subject = new Subject<MediaCollection>();
    const context = createContext(subject);
    createFixture(context, subject);
    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
  });

  it('should show an error if items failed to be fetched', () => {
    const subject = new Subject<MediaCollection | Error>();
    const el = createFixture(createContext(subject), subject);
    subject.next(new Error('error'));
    el.update();
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('should wire the onClose handler', () => {
    const subject = new Subject<MediaCollection>();
    const onClose = jest.fn();
    const el = createFixture(createContext(subject), subject, onClose);
    subject.next(mediaCollection);
    el.update();
    console.log(el.debug());
    el.find(CrossIcon).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  it('should reset the component when the collection prop changes', () => {
    const subject = new Subject<MediaCollection | Error>();
    const context = createContext(subject);
    const el = createFixture(context, subject);
    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
    el.setProps({ collectionName: 'other-collection' });
    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(2);
  });

  it('should reset the component when the context prop changes', () => {
    const subject = new Subject<MediaCollection | Error>();
    const context = createContext(subject);
    const el = createFixture(context, subject);
    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);

    const subject2 = new Subject<MediaCollection | Error>();
    const context2 = createContext(subject2);
    el.setProps({ context: context2 });

    expect(context.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
    expect(context2.getMediaCollectionProvider).toHaveBeenCalledTimes(1);
  });

  it('should restore PENDING state when component resets', () => {
    const subject = new Subject<MediaCollection | Error>();
    const context = createContext(subject);
    const el = createFixture(context, subject);
    expect(el.state().items.status).toEqual('PENDING');
    subject.next(mediaCollection);
    expect(el.state().items.status).toEqual('SUCCESSFUL');

    el.setProps({ collectionName: 'other-collection' });
    expect(el.state().items.status).toEqual('PENDING');
  });
});
