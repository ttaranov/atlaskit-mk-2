import * as React from 'react';
import { mount } from 'enzyme';
import { Toolbar, ToolbarSize } from '../../../ui/Toolbar';

describe('Toolbar', () => {
  it('should render a Toolbar UI Component', () => {
    const component = jest.fn(() => null) as any;
    const toolbar = mount(
      <Toolbar
        items={[component]}
        editorView={{} as any}
        eventDispatcher={{} as any}
        providerFactory={{} as any}
        appearance="full-page"
        disabled={false}
      />,
    );

    expect(component).toBeCalled();
    toolbar.unmount();
  });

  it('should re-render with different toolbar size when toolbar width changes', () => {
    const component = jest.fn(() => null) as any;
    const props = {
      items: [component],
      editorView: {},
      eventDispatcher: {},
      providerFactory: {},
      appearance: 'full-page',
      disabled: false,
      width: 1000,
    } as any;
    const toolbar = mount(<Toolbar {...props} />);

    // First call
    expect(component.mock.calls[0][0]).toMatchObject({
      toolbarSize: ToolbarSize.XXL,
    });

    toolbar.setProps({ ...props, width: 100 });

    // Second call
    expect(component.mock.calls[1][0]).toMatchObject({
      toolbarSize: ToolbarSize.XXXS,
    });

    toolbar.unmount();
  });

  it('should set reduced spacing for toolbar buttons if size is < ToolbarSize.XXL', () => {
    const component = jest.fn(() => null) as any;
    const props = {
      items: [component],
      editorView: {},
      eventDispatcher: {},
      providerFactory: {},
      appearance: 'full-page',
      disabled: false,
      width: 580,
    } as any;
    const toolbar = mount(<Toolbar {...props} />);

    // First call
    expect(component.mock.calls[0][0]).toMatchObject({
      isToolbarReducedSpacing: true,
    });

    toolbar.unmount();
  });

  it('should set normal spacing for toolbar buttons if size is >= ToolbarSize.XXL', () => {
    const component = jest.fn(() => null) as any;
    const props = {
      items: [component],
      editorView: {},
      eventDispatcher: {},
      providerFactory: {},
      appearance: 'full-page',
      disabled: false,
      width: 1000,
    } as any;
    const toolbar = mount(<Toolbar {...props} />);

    // First call
    expect(component.mock.calls[0][0]).toMatchObject({
      isToolbarReducedSpacing: false,
    });

    toolbar.unmount();
  });
});
