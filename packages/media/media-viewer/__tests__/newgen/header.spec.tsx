import * as React from 'react';
import { mount } from 'enzyme';
import { Stubs } from '../_stubs';
import { Subject } from 'rxjs';
import { MediaItem, MediaItemType } from '@atlaskit/media-core';
import Header from '../../src/newgen/header';

function createContext(subject: Subject<MediaItem>) {
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
    undefined,
    Stubs.mediaItemProvider(subject),
  ) as any;
}

const identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
};

const identifier2 = {
  id: 'some-id-2',
  occurrenceKey: 'some-custom-occurrence-key',
  type: 'file' as MediaItemType,
};

const imageItem: MediaItem = {
  type: 'file',
  details: {
    id: 'some-id',
    processingStatus: 'succeeded',
    mediaType: 'image',
    name: 'my image',
  },
};

describe('<Header />', () => {
  it('shows an empty header while loading', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <Header context={createContext(subject)} identifier={identifier} />,
    );
    expect(el.text()).toEqual('');
  });

  it('shows the title then loaded', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <Header context={createContext(subject)} identifier={identifier} />,
    );
    subject.next(imageItem);
    expect(el.text()).toEqual('my image');
  });

  it('shows nothing with metadata failed to be retrieved', () => {
    const subject = new Subject<MediaItem>();
    const el = mount(
      <Header context={createContext(subject)} identifier={identifier} />,
    );
    subject.error(new Error('error'));
    expect(el.text()).toEqual('');
  });

  it('resubscribes to the provider when the data property value is changed', () => {
    const subject = new Subject<MediaItem>();
    const context = createContext(subject);
    const el = mount(<Header context={context} identifier={identifier} />);
    subject.next(imageItem);
    expect(el.text()).toEqual('my image');

    expect(context.getMediaItemProvider).toHaveBeenCalledTimes(1);
    el.setProps({ identifier: identifier2 });
    expect(context.getMediaItemProvider).toHaveBeenCalledTimes(2);
  });

  it('component resets initial state when new props are passed', () => {
    const subject = new Subject<MediaItem>();
    const context = createContext(subject);
    const el = mount(<Header context={context} identifier={identifier} />);
    subject.next(imageItem);
    expect(el.state()).toMatchObject({ item: { status: 'SUCCESSFUL' } });
    el.setProps({ identifier: identifier2 });
    expect(el.state()).toMatchObject({ item: { status: 'PENDING' } });
  });
});
