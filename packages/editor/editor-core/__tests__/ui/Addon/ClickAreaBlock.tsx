import * as React from 'react';

import { ClickAreaBlock } from '../../../src/ui/Addon';
import { createEditor, doc, p } from '@atlaskit/editor-test-helpers';
import { mount } from 'enzyme';

const editor = (doc: any) =>
  createEditor({
    doc,
  });

describe('ClickAreaBlock', () => {
  it('should create empty terminal empty paragraph when clicked', () => {
    const { editorView } = editor(doc(p('Hello world')));
    const clickWrapper = mount(<ClickAreaBlock editorView={editorView} />);
    clickWrapper.simulate('click', { clientY: 200 });
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
  });

  it('should not create empty terminal empty paragraph when clicked at height less then editor bottom', () => {
    const { editorView } = editor(doc(p('Hello world')));
    const clickWrapper = mount(<ClickAreaBlock editorView={editorView} />);
    clickWrapper.simulate('click', {
      clientY: editorView.dom.getBoundingClientRect().bottom - 10,
    });
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world')));
  });

  it('should not create empty terminal empty paragraph if it is already present at end', () => {
    const { editorView } = editor(doc(p('Hello world'), p('')));
    const clickWrapper = mount(<ClickAreaBlock editorView={editorView} />);
    clickWrapper.simulate('click').simulate('click');
    expect(editorView.state.doc).toEqualDocument(doc(p('Hello world'), p('')));
  });
});
