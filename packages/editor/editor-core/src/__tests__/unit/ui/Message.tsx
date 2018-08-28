import * as React from 'react';
import { mount } from 'enzyme';
import { createEditor, doc, p } from '@atlaskit/editor-test-helpers';
import Message from '../../../ui/Appearance/Message';
import EditorActions from '../../../actions';
import * as utils from '../../../utils';

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
    let closestElementSpy;

    beforeEach(() => {
      closestElementSpy = jest.spyOn(utils, 'closestElement');
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

    afterEach(() => {
      closestElementSpy.mockRestore();
    });

    it('should focus when clicking anywhere but a popup', () => {
      // no popup
      (closestElementSpy as any).mockReturnValue(undefined);
      const target = {};
      messageFocusEditor({
        target,
      });
      expect(closestElementSpy).toHaveBeenCalledWith(
        target,
        '[data-editor-popup]',
      );
      expect(editorActionsFocusSpy).toHaveBeenCalled();
    });

    it('should not focus when clicking within a popup', () => {
      // found popup
      (closestElementSpy as any).mockReturnValue({});
      const target = {};
      messageFocusEditor({
        target,
      });
      expect(utils.closestElement).toHaveBeenCalledWith(
        target,
        '[data-editor-popup]',
      );
      expect(editorActionsFocusSpy).not.toHaveBeenCalled();
    });
  });
});
