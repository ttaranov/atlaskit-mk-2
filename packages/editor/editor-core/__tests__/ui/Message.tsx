import * as React from 'react';

import Message from '../../src/ui/Appearance/Message';
import EditorActions from '../../src/actions';
import { createEditor, doc, p } from '@atlaskit/editor-test-helpers';
import { mount } from 'enzyme';

const editor = (doc: any) =>
  createEditor({
    doc,
  });

describe('message editor', () => {
  it('should create empty terminal empty paragraph when clicked outside editor', () => {
    const { editorView } = editor(doc(p('Hello world'), p('Hello world')));
    const message = mount(
      <Message
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    message.findWhere(elm => elm.name() === 'ClickArea').simulate('click');
    expect(editorView.state.doc).toEqualDocument(
      doc(p('Hello world'), p('Hello world'), p('')),
    );
  });

  it('should not create empty terminal empty paragraph if it is already present at end', () => {
    const { editorView } = editor(doc(p('Hello world'), p('')));
    const message = mount(
      <Message
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    message
      .findWhere(elm => elm.name() === 'ClickArea')
      .simulate('click')
      .simulate('click');
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
  });

  it('should not create empty terminal paragraph when clicked inside editor', () => {
    const { editorView } = editor(doc(p('Hello world')));
    mount(
      <Message
        editorView={editorView}
        providerFactory={{} as any}
        editorDOMElement={<div />}
      />,
    );
    (editorView.dom as HTMLElement).click();
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
  });

  describe('focus', () => {
    let editorActionsFocusSpy;
    let messageFocusEditor;

    beforeEach(() => {
      editorActionsFocusSpy = jest.fn();
      const editorActions = {
        focus: editorActionsFocusSpy,
      } as EditorActions;
      const { editorView } = editor(doc(p('Hello world')));
      const message = mount(
        <Message
          editorView={editorView}
          providerFactory={{} as any}
          editorDOMElement={<div />}
          editorActions={editorActions}
        />,
      );

      // Test private method
      messageFocusEditor = (message.instance() as any).focusEditor;
    });

    it('should focus when clicking anywhere but a popup', () => {
      const closest = jest.fn();
      // no popup
      closest.mockReturnValue(undefined);
      messageFocusEditor({
        target: {
          closest,
        },
      });
      expect(closest).toHaveBeenCalledWith('[data-editor-popup]');
      expect(editorActionsFocusSpy).toHaveBeenCalled();
    });

    it('should not focus when clicking within a popup', () => {
      const closest = jest.fn();
      // found popup
      closest.mockReturnValue({});
      messageFocusEditor({
        target: {
          closest,
        },
      });
      expect(closest).toHaveBeenCalledWith('[data-editor-popup]');
      expect(editorActionsFocusSpy).not.toHaveBeenCalled();
    });
  });
});
