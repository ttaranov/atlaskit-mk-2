import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import { MediaItem, MediaItemType } from '@atlaskit/media-core';
import { Stubs } from '../_stubs';
import { List, Props } from '../../src/newgen/list';
import { ErrorMessage } from '../../src/newgen/styled';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { ItemViewer } from '../../src/newgen/item-viewer';

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
      defaultSelectedItem={selectedItem}
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
      defaultSelectedItem: identifier,
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
    const defaultSelectedItem = {
      id: 'some-id-2',
      occurrenceKey: 'some-custom-occurrence-key',
      type: 'file' as MediaItemType,
    };
    const el = createFixture({ items: list, defaultSelectedItem });
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });

  it('should show controls when navigation occurs', () => {
    const showControls = jest.fn();
    const el = createFixture({
      items: [identifier, identifier, identifier],
      defaultSelectedItem: identifier,
      showControls,
    });

    el.find(ArrowRightCircleIcon).simulate('click');
    el.find(ArrowRightCircleIcon).simulate('click');
    expect(showControls).toHaveBeenCalledTimes(2);
  });

  describe('AutoPlay', () => {
    it('should pass ItemViewer an initial previewCount value of zero', () => {
      const showControls = jest.fn();
      const el = createFixture({
        items: [identifier, identifier, identifier],
        defaultSelectedItem: identifier,
        showControls,
      });
      const itemViewer = el.find(ItemViewer);
      expect(itemViewer.prop('previewCount')).toEqual(0);
    });

    it("should increase ItemViewer's previewCount on navigation", () => {
      const showControls = jest.fn();
      const el = createFixture({
        items: [identifier, identifier, identifier],
        defaultSelectedItem: identifier,
        showControls,
      });
      el.find(ArrowRightCircleIcon).simulate('click');
      const itemViewer = el.find(ItemViewer);
      expect(itemViewer.prop('previewCount')).toEqual(1);
    });
  });
});
