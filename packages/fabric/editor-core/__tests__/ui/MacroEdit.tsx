import { shallow, mount } from 'enzyme';
import * as React from 'react';
import MacroEdit from '../../src/ui/MacroEdit';
import ToolbarButton from '../../src/ui/ToolbarButton';

import { doc, p, makeEditor } from '@atlaskit/editor-test-helpers';

describe('@atlaskit/editor-core ui/MacroEdit', () => {
  const editor = (doc: any) => makeEditor({ doc });

  it('should return null if macroElement prop equals null', () => {
    const { editorView } = editor(doc(p('text')));
    const node = shallow(<MacroEdit editorView={editorView} macroElement={null} />);
    expect(node.html()).toEqual(null);
  });

  it('should not return null if macroElement is not null', () => {
    const { editorView } = editor(doc(p('text')));
    const macroElement = document.createElement('div');
    const node = shallow(<MacroEdit editorView={editorView} macroElement={macroElement} />);
    expect(node.html()).not.toBe(null);
  });

  it('should have 2 buttons', () => {
    const { editorView } = editor(doc(p('text')));
    const macroElement = document.createElement('div');
    const node = shallow(<MacroEdit editorView={editorView} macroElement={macroElement} />);
    expect(node.find(ToolbarButton).length).toEqual(2);
  });

  it('should trigger onInsertMacroFromMacroBrowser when Edit button is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const macroElement = document.createElement('div');
    const insertMacroFromMacroBrowser = jest.fn();
    const removeMacro = () => {};

    const node = mount(
      <MacroEdit
        macroElement={macroElement}
        onRemoveMacro={removeMacro}
        onInsertMacroFromMacroBrowser={() => insertMacroFromMacroBrowser}
        editorView={editorView}
      />
    );

    node.find('button').at(0).simulate('click');
    expect(insertMacroFromMacroBrowser).toHaveBeenCalledTimes(1);
    node.unmount();
  });

  it('should trigger onRemoveMacro when Trash icon is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const macroElement = document.createElement('div');
    const removeMacro = jest.fn();
    const insertMacroFromMacroBrowser = () => {};

    const node = mount(
      <MacroEdit
        macroElement={macroElement}
        onRemoveMacro={removeMacro}
        onInsertMacroFromMacroBrowser={insertMacroFromMacroBrowser}
        editorView={editorView}
      />
    );

    node.find('button').at(1).simulate('click');
    expect(removeMacro).toHaveBeenCalledTimes(1);
    node.unmount();
  });
});
