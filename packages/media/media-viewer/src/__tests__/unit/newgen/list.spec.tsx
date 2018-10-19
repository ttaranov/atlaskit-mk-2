import * as React from 'react';
import { mount } from 'enzyme';
import { MediaItemType } from '@atlaskit/media-core';
import { Observable } from 'rxjs';
import { List, Props } from '../../../newgen/list';
import { ErrorMessage } from '../../../newgen/error';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { ItemViewer } from '../../../newgen/item-viewer';
import { Identifier } from '../../../newgen/domain';
import Button from '@atlaskit/button';

function createFixture(props: Partial<Props>) {
  const items: Identifier[] = [];
  const selectedItem = {
    id: '',
    occurrenceKey: '',
    type: 'file' as MediaItemType,
  };
  const context = {
    file: {
      getFileState: () =>
        Observable.of({
          id: '123',
          mediaType: 'image',
          status: 'processed',
        }),
    },
  } as any;
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
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      'The selected item was not found on the list.',
    );
    expect(errorMessage.find(Button)).toHaveLength(0);
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
