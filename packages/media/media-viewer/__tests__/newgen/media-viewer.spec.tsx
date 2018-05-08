import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { MediaItem, MediaItemType } from '@atlaskit/media-core';
import { Stubs } from '../_stubs';
import { Content } from '../../src/newgen/styled';
import { MediaViewer } from '../../src/newgen/media-viewer';
import { ErrorMessage } from '../../src/newgen/styled';
import Header from '../../src/newgen/header';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';

function createContext(subject, blobService?) {
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
    subject && Stubs.mediaItemProvider(subject),
    blobService,
  ) as any;
}

function createFixture(items, identifier) {
  const subject = new Subject<MediaItem>();
  const blobService = Stubs.blobService();
  const context = createContext(subject, blobService);
  const onClose = jest.fn();
  const el = mount(
    <MediaViewer
      selectedItem={identifier}
      items={items}
      context={context}
      onClose={onClose}
    />,
  );
  return { blobService, subject, context, el, onClose };
}

describe('<MediaViewer />', () => {
  const identifier = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    type: 'file' as MediaItemType,
  };

  it('should close Media Viewer on click', () => {
    const { el, onClose } = createFixture([identifier], identifier);
    el.find(Content).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  it('should not close Media Viewer when clicking on the Header', () => {
    const { el, onClose } = createFixture([identifier], identifier);
    el.find(Header).simulate('click');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should update navigation', () => {
    const identifier2 = {
      id: 'some-id-2',
      occurrenceKey: 'some-custom-occurrence-key',
      type: 'file' as MediaItemType,
    };
    const { el } = createFixture([identifier, identifier2], identifier);
    expect(el.state().selectedItem).toMatchObject({ id: 'some-id' });
    el.find(ArrowRightCircleIcon).simulate('click');
    expect(el.state().selectedItem).toMatchObject({ id: 'some-id-2' });
  });

  it('should show an error if selected item is not found in the list', () => {
    const list = [
      {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        type: 'file' as MediaItemType,
      },
    ];
    const selectedItem = {
      id: 'some-id-2',
      occurrenceKey: 'some-custom-occurrence-key',
      type: 'file' as MediaItemType,
    };
    const { el } = createFixture(list, selectedItem);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('the error view show close on click', () => {
    const selectedItem = {
      id: 'some-id-2',
      occurrenceKey: 'some-custom-occurrence-key',
      type: 'file' as MediaItemType,
    };
    const { el, onClose } = createFixture([], selectedItem);
    expect(el.find(ErrorMessage)).toHaveLength(1);
    el.find(Content).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });
});
