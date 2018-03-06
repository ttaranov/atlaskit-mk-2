import { shallow, mount } from 'enzyme';
import * as React from 'react';
import ExtensionEditPanel, {
  ExtensionToolbar,
} from '../../src/ui/ExtensionEditPanel';
import ToolbarButton from '../../src/ui/ToolbarButton';

import { Toolbar } from '../../src/ui/ExtensionEditPanel/styles';

describe('@atlaskit/editor-core', () => {
  describe('ui/ExtensionEditPanel', () => {
    const noop: any = () => {};

    it('should return null if element prop equals null', () => {
      const node = shallow(
        <ExtensionEditPanel element={null} onEdit={noop} onRemove={noop} />,
      );
      expect(node.html()).toEqual(null);
    });

    it('should not return null if element is not null', () => {
      const element = document.createElement('div');
      const node = shallow(
        <ExtensionEditPanel element={element} onEdit={noop} onRemove={noop} />,
      );
      expect(node.html()).not.toBe(null);
    });

    it('should have 2 buttons', () => {
      const element = document.createElement('div');
      const node = shallow(
        <ExtensionEditPanel element={element} onEdit={noop} onRemove={noop} />,
      );
      expect(node.find(ToolbarButton).length).toEqual(2);
    });

    it('should trigger onEdit when Edit button is clicked', () => {
      const element = document.createElement('div');
      const onEdit = jest.fn();

      const node = mount(
        <ExtensionEditPanel
          element={element}
          onEdit={onEdit}
          onRemove={noop}
        />,
      );

      node
        .find('button')
        .at(0)
        .simulate('click');
      expect(onEdit).toHaveBeenCalledTimes(1);
      node.unmount();
    });

    it('should trigger onRemoveMacro when Trash icon is clicked', () => {
      const element = document.createElement('div');
      const onRemove = jest.fn();

      const node = mount(
        <ExtensionEditPanel
          element={element}
          onEdit={noop}
          onRemove={onRemove}
        />,
      );

      node
        .find('button')
        .at(1)
        .simulate('click');
      expect(onRemove).toHaveBeenCalledTimes(1);
      node.unmount();
    });
  });

  describe('ExtensionToolbar', () => {
    let extensionToolbar;
    const element = document.createElement('div');
    const popupContainer = document.createElement('div');

    beforeEach(() => {
      extensionToolbar = shallow(
        <ExtensionToolbar element={element} popupContainer={popupContainer}>
          <div>children goes here</div>
        </ExtensionToolbar>,
      );
    });

    it('should expose a common api (public) for the Popup component', () => {
      const { mountTo, target, offset, alignX, alignY } = extensionToolbar
        .find('Popup')
        .props();

      const popupProps = {
        mountTo,
        target,
        offset,
        alignX,
        alignY,
      };

      expect(popupProps).toEqual({
        mountTo: popupContainer,
        target: element,
        offset: [0, 8],
        alignX: 'right',
        alignY: 'bottom',
      });
    });

    it('should render the children wrapped with the Toolbar styled component to keep a consistent look and feel', () => {
      const toolbar = extensionToolbar.find('Popup').find(Toolbar);

      expect(toolbar.length).toBe(1);
      expect(toolbar.contains(<div>children goes here</div>)).toBe(true);
    });
  });
});
