import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { MediaItem, MediaItemType } from '@atlaskit/media-core';
import { Stubs } from '../_stubs';
import { List, Props } from '../../src/newgen/list';
import { ErrorMessage } from '../../src/newgen/styled';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';

function createContext(subject) {
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
  ) as any;
}

function createFixture(props: Partial<Props>) {
  const items = [];
  const selectedItem = {
    id: '',
    occurrenceKey: '',
    type: 'file' as MediaItemType,
  };
  const subject = new Subject<MediaItem>();
  const context = createContext(subject);
  const el = mount(
    <List
      items={items}
      selectedItem={selectedItem}
      context={context}
      {...props}
    />,
  );

  return el;
}

describe('<List />', () => {
  const identifier = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    type: 'file' as MediaItemType,
  };

  it('should update navigation', () => {
    const identifier2 = {
      id: 'some-id-2',
      occurrenceKey: 'some-custom-occurrence-key',
      type: 'file' as MediaItemType,
    };
    const el = createFixture({
      items: [identifier, identifier2],
      selectedItem: identifier,
    });
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
    const el = createFixture({ items: list, selectedItem });
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('should show controls when navigation occurs', () => {
    const showControls = jest.fn();
    const el = createFixture({
      items: [identifier, identifier, identifier],
      selectedItem: identifier,
      showControls,
    });

    el.find(ArrowRightCircleIcon).simulate('click');
    el.find(ArrowRightCircleIcon).simulate('click');
    expect(showControls).toHaveBeenCalledTimes(2);
  });

  describe('AutoPlay', () => {
    it('should auto play the first preview', () => {
      const showControls = jest.fn();
      const el = createFixture({
        items: [identifier, identifier, identifier],
        selectedItem: identifier,
        showControls,
      });
      expect(el.find({ isAutoPlay: true })).toHaveLength(1);
    });

    it('should not auto play the second preview', () => {
      const showControls = jest.fn();
      const el = createFixture({
        items: [identifier, identifier, identifier],
        selectedItem: identifier,
        showControls,
      });
      el.find(ArrowRightCircleIcon).simulate('click');
      expect(el.find({ isAutoPlay: true })).toHaveLength(0);
    });
  });
});
