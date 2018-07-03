import { shallow, mount } from 'enzyme';
import * as React from 'react';
import ExtensionEditPanel from '../../../../../plugins/extension/ui/ExtensionEditPanel';
import ToolbarButton from '../../../../../ui/ToolbarButton';

describe('@atlaskit/editor-core ui/ExtensionEditPanel', () => {
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
      <ExtensionEditPanel element={element} onEdit={onEdit} onRemove={noop} />,
    );

    node
      .find('button')
      .at(0)
      .simulate('click');
    expect(onEdit).toHaveBeenCalledTimes(1);
    node.unmount();
  });

  it('should show layout options when breakout is allowed', async () => {
    const element = document.createElement('div');
    const node = shallow(
      <ExtensionEditPanel
        element={element}
        onEdit={noop}
        onRemove={noop}
        showLayoutOptions={true}
        onLayoutChange={noop}
      />,
    );
    expect(node.find(ToolbarButton).length).toEqual(5);
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
