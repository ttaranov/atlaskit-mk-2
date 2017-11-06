import { mount } from 'enzyme';
import * as React from 'react';
import ToolbarHelp from '../../../src/editor/ui/ToolbarHelp';
import EditorWidth from '../../../src/utils/editor-width';
import ToolbarButton from '../../../src/ui/ToolbarButton';

describe('@atlaskit/editor-core/src/editor/ui/ToolbarHelp', () => {
  it('should have spacing of toolbar button set to none if editorWidth is less then BreakPoint10', () => {
    const toolbarOption = mount(
      <ToolbarHelp editorWidth={EditorWidth.BreakPoint10 - 1} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual('none');
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to default if editorWidth is greater then BreakPoint10', () => {
    const toolbarOption = mount(
      <ToolbarHelp editorWidth={EditorWidth.BreakPoint10 + 1} />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual(
      'default',
    );
    toolbarOption.unmount();
  });
});
